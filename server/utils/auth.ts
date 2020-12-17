// @ts-nocheck
import axios from 'axios';
import get from 'lodash/get';
import some from 'lodash/some';
import filter from 'lodash/filter';
import { authGenericError } from './general';
import { sendMail, sendForgotPassMail } from './email';

import consts from '../config/consts';

const roles = consts.roles;

export async function getAccessToken(apiType: string) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_AUTH_DOMAIN}/oauth/token`,
      {
        client_id: process.env.REACT_APP_AE_API_CLIENT_ID,
        client_secret: process.env.REACT_APP_AE_API_CLIENT_SECRET,
        audience:
          apiType === 'management'
            ? `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/`
            : 'urn:auth0-authz-api',
        grant_type: 'client_credentials',
      }
    );
    return `${response.data.token_type} ${response.data.access_token}`;
  } catch (error) {
    return console.log(error);
  }
}

export function addUserToGroup(userId: string, groupId: string, resolve?: any) {
  getAccessToken('auth_ext').then((token: string) => {
    axios
      .patch(
        `${process.env.REACT_APP_AE_API_URL}/users/${userId}/groups`,
        new Array(groupId),
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response: any) => {
        if (resolve) {
          resolve();
        }
        return 'success';
      })
      .catch((error: Error) => {
        console.log('addUserToGroup error', error);
        return 'failure';
      });
  });
}

export function assignRoleToUser(
  userId: string,
  roleId: string,
  resolve?: any
) {
  getAccessToken('auth_ext').then((token: string) => {
    axios
      .patch(
        `${process.env.REACT_APP_AE_API_URL}/users/${userId}/roles`,
        new Array(roleId),
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response: any) => {
        if (resolve) {
          resolve();
        }
        return 'success';
      })
      .catch((error: Error) => {
        console.log('assignRoleToUser error', error);
        return 'failure';
      });
  });
}

export function removeRoleFromUser(userId: string, roleId: string) {
  getAccessToken('auth_ext').then((token: string) => {
    axios
      .delete(`${process.env.REACT_APP_AE_API_URL}/users/${userId}/roles`, {
        headers: {
          Authorization: token,
        },
        data: new Array(roleId),
      })
      .then((response: any) => {
        return 'success';
      })
      .catch((error: any) => {
        console.log('error', error.response.data);

        return 'failure';
      });
  });
}

export function sendWelcomeEmail(
  userId: string,
  name: string,
  surname: string,
  email: string,
  resolve?: any
) {
  getAccessToken('management')
    .then((token: string) => {
      const redirectUrl = `${
        process.env.REACT_APP_PROJECT_URL &&
        process.env.REACT_APP_PROJECT_URL.includes('localhost')
          ? process.env.REACT_APP_BACKEND_URL
          : process.env.REACT_APP_PROJECT_URL
      }/api/redirectToHome`;
      axios
        .post(
          `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/tickets/password-change`,
          {
            user_id: userId,
            result_url: redirectUrl,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then(response => {
          if (resolve) {
            resolve();
          }
          return sendMail(
            { name, surname, email, link: response.data.ticket },
            parseInt(
              process.env.REACT_APP_POSTMARK_TEMPLATE_WELCOME as string,
              10
            )
          );
        })
        .catch(error => {
          console.log('sendWelcomeEmail fail', error.response.data.message);
          return error.response.data.message;
        });
    })
    .catch((error: any) => {
      return error.response.data.message;
    });
}

export function sendForgetPasswordEmail(req: any, res: any) {
  const { email, connectionID } = req.query;
  getAccessToken('management')
    .then((token: string) => {
      const redirectUrl = `${
        process.env.REACT_APP_PROJECT_URL &&
        process.env.REACT_APP_PROJECT_URL.includes('localhost')
          ? process.env.REACT_APP_BACKEND_URL
          : process.env.REACT_APP_PROJECT_URL
      }/api/redirectToHome`;
      axios
        .post(
          `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/tickets/password-change`,
          {
            email: email,
            result_url: redirectUrl,
            connection_id: connectionID,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then(response => {
          sendForgotPassMail(email, response.data.ticket)
            .then(result => {
              return res(
                JSON.stringify({
                  message: 'Reset password email has been sent to the address.',
                })
              );
            })
            .catch(error => {
              return authGenericError(res);
            });
        })
        .catch(error => {
          return authGenericError(res);
        });
    })
    .catch((error: any) => {
      return authGenericError(res);
    });
}

export function getUsersForAdmin(users: any, groups: any, user: any) {
  return filter(users, d => {
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
}
