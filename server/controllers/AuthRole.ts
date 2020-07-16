import axios from 'axios';
import filter from 'lodash/filter';
import { getAccessToken } from '../utils/auth';
import { genericError } from '../utils/general';

export function getUserRole(req: any, res: any) {
  const { userId } = req.query;
  getAccessToken('auth_ext').then(res1 => {
    axios
      .get(`${process.env.REACT_APP_AE_API_URL}/users/${userId}/roles`, {
        headers: {
          Authorization: res1,
        },
      })
      .then(res2 => {
        return res(JSON.stringify({ message: res2.data[0].name }));
      })
      .catch(error => genericError(error, res));
  });
}

export function getUserRoles(req: any, res: any) {
  getAccessToken('auth_ext').then(token => {
    axios
      .get(`${process.env.REACT_APP_AE_API_URL}/roles`, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        const data = filter(
          response.data.roles,
          r => r.description === 'M&E Insinger'
        ).map(g => {
          return {
            ...g,
            label: g.name,
            value: g._id,
          };
        });
        return res(JSON.stringify(data));
      })
      .catch(error => genericError(error, res));
  });
}

export function assignRoleToUser(req: any, res: any) {
  const { userId, roleId } = req.body;
  getAccessToken('auth_ext').then(token => {
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
      .then(response => {
        return res(JSON.stringify({ message: 'success' }));
      })
      .catch(error => genericError(error, res));
  });
}
