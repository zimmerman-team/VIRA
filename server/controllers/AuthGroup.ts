import axios from 'axios';
import get from 'lodash/get';
import filter from 'lodash/filter';
import { getAccessToken } from '../utils/auth';
import { genericError } from '../utils/general';

import consts from '../config/consts';

const roles = consts.roles;

export function getUserGroup(req: any, res: any) {
  const { userId } = req.query;
  getAccessToken('auth_ext').then(token => {
    axios
      .get(`${process.env.REACT_APP_AE_API_URL}/users/${userId}/groups`, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        return res(JSON.stringify(response.data));
      })
      .catch(error => genericError(error, res));
  });
}

export function getUserGroups(req: any, res: any) {
  const { user } = req.query;
  getAccessToken('auth_ext')
    .then(token => {
      axios
        .get(`${process.env.REACT_APP_AE_API_URL}/groups`, {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          let result = filter(response.data.groups, g => {
            const splits = g.description.split(',');
            if (splits.length > 3) {
              if (splits[3] === 'Insinger') {
                return true;
              }
              return false;
            }
            return false;
          });
          if (user.role !== roles.superAdm) {
            result = filter(response.data.groups, g => {
              let pass = false;

              for (let b = 0; b < get(user.groups, 'length', 0); b++) {
                if (user.groups[b].name === g.name) {
                  pass = true;
                  break;
                }
              }
              return pass;
            });
          }
          return res(
            JSON.stringify(
              result.map((g: any) => {
                return {
                  ...g,
                  label: g.name,
                  value: g._id,
                  date: get(g, 'description', ',').split(',')[0],
                  last_updated: get(g, 'description', ',').split(',')[2],
                  createdBy: get(g, 'description', ',').split(',')[1],
                };
              })
            )
          );
        });
    })
    .catch(error => genericError(error, res));
}

export function addUserToGroup(req: any, res: any) {
  const { userId, groupId } = req.body;
  getAccessToken('auth_ext').then(token => {
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
      .then(response => {
        return res(JSON.stringify({ message: 'success' }));
      })
      .catch(error => genericError(error, res));
  });
}

export function getGroup(req: any, res: any) {
  const { groupId } = req.query;
  getAccessToken('auth_ext').then(token => {
    axios
      .all([
        axios.get(`${process.env.REACT_APP_AE_API_URL}/groups/${groupId}`, {
          headers: {
            Authorization: token,
          },
        }),
        axios.get(
          `${process.env.REACT_APP_AE_API_URL}/groups/${groupId}/members`,
          {
            headers: {
              Authorization: token,
            },
          }
        ),
      ])
      .then(response => {
        return res(
          JSON.stringify({
            name: response[0].data.name,
            description: response[0].data.description,
            users: response[1].data.users.map((u: any) => u.user_id),
          })
        );
      })
      .catch(error => genericError(error, res));
  });
}

export function addGroup(req: any, res: any) {
  const { user, name, usersToAdd } = req.query;
  let today = new Date();
  const dd = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const mm =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1; // January is 0
  const yyyy = today.getFullYear();
  const todayStr = `${dd}/${mm}/${yyyy}`;

  getAccessToken('auth_ext').then(token => {
    axios
      .post(
        `${process.env.REACT_APP_AE_API_URL}/groups`,
        {
          name,
          description: `${todayStr},${user.authId},${todayStr},Insinger`,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(response => {
        if (response.status === 200 || response.status === 204) {
          if (usersToAdd.length > 0) {
            return axios
              .patch(
                `${process.env.REACT_APP_AE_API_URL}/groups/${response.data._id}/members`,
                usersToAdd,
                {
                  headers: {
                    Authorization: token,
                  },
                }
              )
              .then(response1 => {
                if (response1.status === 204) {
                  return res(JSON.stringify({ message: 'success' }));
                }
                return res(
                  JSON.stringify({
                    status: response1.status,
                    message: response1.data.statusText,
                  })
                );
              });
          }
          return res(JSON.stringify({ message: 'success' }));
        }
        return res(
          JSON.stringify({
            status: response.status,
            message: response.data.statusText,
          })
        );
      })
      .catch(error => genericError(error, res));
  });
}

export function editGroup(req: any, res: any) {
  const {
    groupId,
    name,
    description,
    usersToRemove,
    usersToAdd,
    user,
    team,
  } = req.query;

  let today = new Date();
  const dd = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const mm =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1; // January is 0
  const yyyy = today.getFullYear();
  const todayStr = `${dd}/${mm}/${yyyy}`;

  const newDescription = `${description
    .split(',')
    .slice(0, 2)},${todayStr},Insinger`;

  getAccessToken('auth_ext').then(token => {
    const requests = [
      axios.put(
        `${process.env.REACT_APP_AE_API_URL}/groups/${groupId}`,
        {
          name,
          description: newDescription,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      ),
    ];
    if (usersToRemove.length > 0) {
      requests.push(
        axios.delete(
          `${process.env.REACT_APP_AE_API_URL}/groups/${groupId}/members`,
          {
            data: usersToRemove,
            headers: {
              Authorization: token,
            },
          }
        )
      );
    }
    if (usersToAdd.length > 0) {
      requests.push(
        axios.patch(
          `${process.env.REACT_APP_AE_API_URL}/groups/${groupId}/members`,
          usersToAdd,
          {
            headers: {
              Authorization: token,
            },
          }
        )
      );
    }
    axios
      .all(requests)
      .then(response => {
        if (
          get(response, '[0].status', 200) === 200 &&
          get(response, '[1].status', 204) === 204 &&
          get(response, '[2].status', 204) === 204
        ) {
          return res(JSON.stringify({ message: 'success' }));
        }
        return res(
          JSON.stringify({
            status: response[0].status,
            message: response[0].data.statusText,
          })
        );
      })
      .catch(error => genericError(error, res));
  });
}

export function deleteGroup(req: any, res: any) {
  const { delId } = req.query;
  getAccessToken('auth_ext').then(token => {
    axios
      .delete(`${process.env.REACT_APP_AE_API_URL}/groups/${delId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        if (response.status === 204) {
          return res(JSON.stringify({ message: 'success' }));
        }
        return res(
          JSON.stringify({
            status: get(response, '[0].status', ''),
            message: get(response, '[0].data.statusText', ''),
          })
        );
      })
      .catch(error => genericError(error, res));
  });
}
