// @ts-nocheck
require('dotenv').config();

// base
import axios from 'axios';
const mongoose = require('mongoose');

// models
const Organisation = require('../models/Org');
const ResponsiblePerson = require('../models/responsiblePerson');

// utils
import colors from 'colors';
import get from 'lodash/get';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import { makePass } from '../utils/general';
import {
  getAccessToken,
  sendWelcomeEmail,
  addUserToGroup,
  assignRoleToUser,
} from '../utils/auth';

colors.setTheme({
  info: 'bgBlue',
  success: 'bgGreen',
  error: 'bgRed',
});

// connect to mongodb
const db = mongoose.connect(
  process.env.REACT_APP_MONGO_DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err: any, client: any) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('Successfully connected to MongoDB');
    }
  }
);

const invitedEmails = [];

function inviteGranteeNewUsers(
  authToken: string,
  manToken: string,
  org: any,
  roleId: string,
  users: any
) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_AE_API_URL}/groups/${org.id}/members`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response: any) => {
        console.log('--------------------------------');
        console.log('Organisation: ', org.name);
        const members = response.data.users;
        ResponsiblePerson.find(
          { organisation: mongoose.Types.ObjectId(org.orgMongoId) },
          (err: any, persons: any) => {
            if (err) {
              reject(err);
            }
            if (persons.length === 0) {
              resolve();
            }
            const usersToInvite = filter(
              persons,
              p =>
                !find(members, { email: p.email }) &&
                !find(invitedEmails, (ie: string) => ie === p.email)
            );
            let count = 0;
            const totalCount = usersToInvite.length;
            if (usersToInvite.length === 0) {
              console.log('no users or already invited');
              resolve();
            }
            usersToInvite.forEach((person: any) => {
              console.log(person.email);
              invitedEmails.push(person.email);
              count++;
              if (count === totalCount) {
                resolve();
              }
              axios
                .post(
                  `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users`,
                  {
                    email: person.email,
                    blocked: false,
                    email_verified: false,
                    verify_email: true,
                    password: `@${makePass(8)}`,
                    given_name: person.title,
                    family_name: person.family_name,
                    name: `${person.title} ${person.family_name}`,
                    nickname: person.title,
                    connection: 'insinger-database-connection',
                    user_metadata: {
                      firstName: person.title,
                      lastName: person.family_name,
                    },
                    app_metadata: {
                      authorization: {
                        groups: [org.name],
                        roles: ['Grantee user'],
                      },
                    },
                  },
                  {
                    headers: {
                      Authorization: manToken,
                    },
                  }
                )
                .then(response => {
                  if (response.status === 201) {
                    sendWelcomeEmail(
                      response.data.user_id,
                      person.title,
                      person.family_name,
                      person.email
                    );
                    addUserToGroup(response.data.user_id, org.id);
                    assignRoleToUser(response.data.user_id, roleId);
                  } else if (response.status === 409) {
                    const fUser = find(users, { email: person.email });
                    if (fUser) {
                      addUserToGroup(fUser.user_id, org.id);
                    }
                  }
                  count++;
                  if (count === totalCount) {
                    resolve();
                  }
                  return resolve(response.data);
                })
                .catch(error =>
                  reject({
                    error: error,
                    message: 'Error in inviteGranteeNewUsers function | 1',
                  })
                );
            });
          }
        );
      })
      .catch(error =>
        reject({
          error: error,
          message: 'Error in inviteGranteeNewUsers function | 2',
        })
      );
  });
}

function checkIfGranteeExistsAsGroup(groups: any, grantee: any) {
  return find(groups, { name: grantee });
}

function createGroup(org: any, token: string) {
  return new Promise((resolve, reject) => {
    // resolve({ group_id: org.organisation_name });
    let today = new Date();
    const dd = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    const mm =
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1; // January is 0
    const yyyy = today.getFullYear();
    const todayStr = `${dd}/${mm}/${yyyy}`;

    axios
      .post(
        `${process.env.REACT_APP_AE_API_URL}/groups`,
        {
          name: org.organisation_name,
          description: `${todayStr},-,${todayStr},Insinger`,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(response => {
        resolve({
          status: response.status,
          group_id: response.data._id,
          message: response.data.statusText,
        });
      })
      .catch(error =>
        reject({
          error: error,
          message: 'Error in createGroup function',
        })
      );
  });
}

function traverseGrantees(data: any) {
  return new Promise((resolve, reject) => {
    Organisation.get((err: any, orgs: any) => {
      if (err) {
        reject(err);
      }
      let count = 0;
      const totalCount = orgs.length;
      sortBy(orgs, 'organisation_name').forEach((org: any) => {
        const foundOrgGroup = checkIfGranteeExistsAsGroup(
          data.groups,
          org.organisation_name
        );
        // console.log(`${foundOrgGroup}`.info.white);
        if (foundOrgGroup) {
          inviteGranteeNewUsers(
            data.authToken,
            data.manToken,
            {
              id: foundOrgGroup._id,
              name: org.organisation_name,
              orgMongoId: org._id,
            },
            data.roleId,
            data.users
          )
            .then(() => {
              count++;
              if (count === totalCount) {
                resolve();
              }
            })
            .catch(error =>
              reject({
                error: error,
                message: 'Error in traverseGrantees function | 1',
              })
            );
        } else {
          createGroup(org, data.authToken)
            .then((group: any) => {
              inviteGranteeNewUsers(
                data.authToken,
                data.manToken,
                {
                  id: group.group_id,
                  name: org.organisation_name,
                  orgMongoId: org._id,
                },
                data.roleId,
                data.users
              )
                .then(() => {
                  count++;
                  if (count === totalCount) {
                    resolve();
                  }
                })
                .catch(error =>
                  reject({
                    error: error,
                    message: 'Error in traverseGrantees function | 2',
                  })
                );
            })
            .catch(error =>
              reject({
                error: error,
                message: 'Error in traverseGrantees function | 3',
              })
            );
        }
      });
    });
  });
}

function getAllAuth0Groups() {
  return new Promise((resolve, reject) => {
    getAccessToken('auth_ext')
      .then(token => {
        axios
          .get(`${process.env.REACT_APP_AE_API_URL}/groups`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response: any) => {
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
            resolve({
              authToken: token,
              data: result.map((g: any) => {
                return {
                  ...g,
                  label: g.name,
                  value: g._id,
                  date: get(g, 'description', ',').split(',')[0],
                  last_updated: get(g, 'description', ',').split(',')[2],
                  createdBy: get(g, 'description', ',').split(',')[1],
                };
              }),
            });
          })
          .catch(error =>
            reject({
              error: error,
              message: 'Error in getAllAuth0Groups function | 1',
            })
          );
      })
      .catch(error =>
        reject({
          error: error,
          message: 'Error in getAllAuth0Groups function | 2',
        })
      );
  });
}

function getAllAuth0Roles(token: string) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_AE_API_URL}/roles`, {
        headers: {
          Authorization: token,
        },
      })
      .then(response => {
        const data = filter(
          response.data.roles,
          r => r.description === 'M&E Insinger' && r.name === 'Grantee user'
        ).map(g => {
          return {
            ...g,
            label: g.name,
            value: g._id,
          };
        });
        return resolve(
          get(data, '[0].value', 'dcbc01d1-a6a1-476c-962b-5593defbc1d0')
        );
      })
      .catch(error =>
        reject({
          error: error,
          message: 'Error in getAllAuth0Roles function',
        })
      );
  });
}

function getAllAuth0Users() {
  return new Promise((resolve, reject) => {
    getAccessToken('management')
      .then(token => {
        axios
          .get(
            `${process.env.REACT_APP_AUTH_DOMAIN}/api/v2/users?include_totals=true&q=identities.connection:"insinger-database-connection"`,
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then(response => {
            let result = response.data.users;
            return resolve({ users: result, manToken: token });
          })
          .catch(error =>
            reject({
              error: error,
              message: 'Error in getAllAuth0Users function | 1',
            })
          );
      })
      .catch(error =>
        reject({
          error: error,
          message: 'Error in getAllAuth0Users function | 2',
        })
      );
  });
}

// main function
function start() {
  console.log('start check_invite_new_users.ts script');
  getAllAuth0Groups()
    .then((response: any) => {
      getAllAuth0Roles(response.authToken)
        .then((response2: any) => {
          getAllAuth0Users()
            .then((response3: any) => {
              traverseGrantees({ ...response, ...response3, roleId: response2 })
                .then(() => {
                  console.log('--------------------------------');
                  console.log('successfully exit'.success.white);
                  process.exit(0);
                })
                .catch((error: any) => {
                  console.log('--------------------------------');
                  console.log(error);
                  console.log('--------------------------------');
                  console.log('failure exit'.error.white);
                  process.exit(0);
                });
            })
            .catch((error: any) => {
              console.log('--------------------------------');
              console.log(error);
              console.log('--------------------------------');
              console.log('failure exit'.error.white);
              process.exit(0);
            });
        })
        .catch((error: any) => {
          console.log('--------------------------------');
          console.log(error);
          console.log('--------------------------------');
          console.log('failure exit'.error.white);
          process.exit(0);
        });
    })
    .catch((error: any) => {
      console.log('--------------------------------');
      console.log(error);
      console.log('--------------------------------');
      console.log('failure exit'.error.white);
      process.exit(0);
    });
}

start();
