/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import axios from 'axios';
import {
  getAccessToken,
  sendWelcomeEmail,
  addUserToGroup,
  assignRoleToUser,
  removeRoleFromUser,
} from '../utils/auth';
import { makePass, genericError, authGenericError } from '../utils/general';

import get from 'lodash/get';
import some from 'lodash/some';
import find from 'lodash/find';
import filter from 'lodash/filter';

import consts from '../config/consts';

const roles = consts.roles;

function filterAllUsersBasedOnPermissions(user: any, users: any, groups: any) {
  let result = users;
  if (user.role === roles.admin) {
    result = filter(result, d => {
      let pass = false;
      const dUserGroups = filter(groups, gr =>
        some(gr.members, member => member === user.authId)
      );
      for (const dUserGroup of dUserGroups) {
        for (const dUserGroupMember of dUserGroup.members) {
          if (
            dUserGroupMember === d.user_id &&
            get(d, 'app_metadata.authorization.roles[0]', '') !== roles.superAdm
          ) {
            pass = true;
            break;
          }
          if (pass) {
            break;
          }
        }
      }

      return pass;
    });
    if (result.length === 0) {
      const currentUserEmail = user.email;
      const currentUserAuth0 = find(result, {
        email: currentUserEmail,
      });
      result = [currentUserAuth0];
    }
  }
  if (user.role === roles.regular || user.role === roles.mod) {
    const currentUserEmail = user.email;
    const currentUserAuth0 = find(result, {
      email: currentUserEmail,
    });
    result = [currentUserAuth0];
  }
  return result;
}

export function getAllUsers(req: any, res: any) {
  const { user } = req.query;
  getAccessToken('management').then(token1 => {
    getAccessToken('auth_ext').then(token2 => {
      axios
        .all([
          axios.get(
            `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users?include_totals=true&q=identities.connection:"${consts.auth0DBConnection}"`,
            {
              headers: {
                Authorization: token1,
              },
            }
          ),
          axios.get(`${process.env.REACT_APP_AE_API_URL}/groups`, {
            headers: {
              Authorization: token2,
            },
          }),
        ])
        .then(response => {
          const result = filterAllUsersBasedOnPermissions(
            user,
            response[0].data.users,
            response[1].data.groups
          );
          return res(JSON.stringify(result));
        })
        .catch(error => genericError(error, res));
    });
  });
}

export function getUser(req: any, res: any) {
  const { user } = req.query;
  getAccessToken('management').then(token1 => {
    getAccessToken('auth_ext').then(token2 => {
      axios
        .all([
          axios.get(
            `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users/${user}`,
            {
              headers: {
                Authorization: token1,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_AE_API_URL}/users/${user}/groups`,
            {
              headers: {
                Authorization: token2,
              },
            }
          ),
          axios.get(`${process.env.REACT_APP_AE_API_URL}/users/${user}/roles`, {
            headers: {
              Authorization: token2,
            },
          }),
        ])
        .then(response => {
          const data = {
            authId: get(response, '[0].data.user_id', ''),
            email: get(response, '[0].data.email', ''),
            firstName: get(response, '[0].data.user_metadata.firstName', ''),
            lastName: get(response, '[0].data.user_metadata.lastName', ''),
            groups: get(response, '[1].data', []),
            role: get(response, '[2].data[0].name', ''),
            username: get(response, '[0].data.nickname', ''),
            lastLogin: get(response, '[0].data.last_login', ''),
          };
          return res(JSON.stringify(data));
        })
        .catch(error => genericError(error, res));
    });
  });
}

export function addUser(req: any, res: any) {
  const {
    email,
    name,
    surname,
    groupId,
    roleId,
    groupName,
    roleName,
  } = req.query;

  getAccessToken('management').then(token => {
    axios
      .post(
        `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users`,
        {
          email,
          blocked: false,
          email_verified: false,
          verify_email: true,
          password: `@${makePass(8)}`,
          given_name: name,
          family_name: surname,
          name: `${name} ${surname}`,
          nickname: name,
          connection: consts.auth0DBConnection,
          user_metadata: {
            firstName: name,
            lastName: surname,
          },
          app_metadata: {
            authorization: {
              groups: [groupName],
              roles: [roleName],
            },
          },
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(response => {
        if (response.status === 201) {
          sendWelcomeEmail(response.data.user_id, name, surname, email);
          addUserToGroup(response.data.user_id, groupId);
          assignRoleToUser(response.data.user_id, roleId);
          return res(JSON.stringify({ message: 'User created successfully' }));
        }
        return res(JSON.stringify(response.data));
      })
      .catch(error => genericError(error, res));
  });
}

export function deleteUser(req: any, res: any) {
  const { delId } = req.query;
  getAccessToken('management').then(token => {
    axios
      .delete(`${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users/${delId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        return res(JSON.stringify({ message: 'User deleted successfully' }));
      })
      .catch(error => genericError(error, res));
  });
}

export function editUser(req: any, res: any) {
  const {
    userId,
    email,
    name,
    surname,
    role,
    roleId,
    prevRoleId,
    groups,
  } = req.query;
  getAccessToken('management').then(token => {
    axios
      .patch(
        `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users/${userId}`,
        {
          email,
          user_metadata: {
            firstName: name,
            lastName: surname,
          },
          app_metadata: {
            authorization: {
              roles: [role],
              groups: [groups],
            },
          },
          connection: consts.auth0DBConnection,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          if (roleId !== prevRoleId) {
            roleId !== '' && assignRoleToUser(userId, roleId);
            prevRoleId !== '' &&
              roleId !== '' &&
              removeRoleFromUser(userId, prevRoleId);
          }
          return res(JSON.stringify({ message: 'success' }));
        } else {
          return authGenericError(res);
        }
      })
      .catch(error => genericError(error, res));
  });
}

export function getAuth0DBConnection(req: any, res: any) {
  getAccessToken('management')
    .then(token => {
      axios
        .get(`${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/connections`, {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          const connectionID = find(response.data, {
            name: consts.auth0DBConnection,
          });
          return res(JSON.stringify(connectionID.id));
        })
        .catch(error => {
          return authGenericError(res);
        });
    })
    .catch((error: any) => {
      return authGenericError(res);
    });
}
