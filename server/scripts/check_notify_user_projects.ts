// @ts-nocheck
require('dotenv').config();

// base
import axios from 'axios';
const mongoose = require('mongoose');

// models
const Project = require('../models/project');

// utils
import colors from 'colors';
import find from 'lodash/find';
import { sendMail } from '../utils/email';
import { getAccessToken } from '../utils/auth';

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
mongoose.set('useCreateIndex', true);

function getProjects() {
  return new Promise((resolve, reject) => {
    Project.find({})
      .select('_id project_number project_name start_date end_date person')
      .populate('person', 'email')
      .exec((err: any, projects: any) => {
        if (err) {
          reject({
            error: err,
            message: 'Error in getProjects function | 1',
          });
        }
        resolve(projects);
      });
  });
}

function reverseString(str: string) {
  return str
    .split('-')
    .reverse()
    .join('-');
}

function dateDiffInDays(dt1: Date, dt2: Date) {
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
}

function checkProjectsAndNotify(projects: any, users: any) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const totalCount = projects.length;
    const nowDate = new Date();
    projects.forEach((project: any) => {
      const date = new Date(reverseString(project.end_date));
      if (dateDiffInDays(nowDate, date) === 30) {
        console.log('--------------------------------');
        console.log('Project: ', project.project_number);
        console.log('--------------------------------');
        const fUser = find(users, { email: project.person.email });
        if (fUser) {
          return new Promise((resolve2, reject2) => {
            sendMail(
              {
                email: fUser.email,
                project_name: project.project_name,
                link: `${process.env.REACT_APP_PROJECT_URL}/projects/${project.project_number}`,
              },
              18990738,
              resolve2,
              reject2
            );
          })
            .then((res: any) => {
              count++;
              if (count === totalCount) {
                resolve();
              }
            })
            .catch((err: any) => {
              console.log('Error in checkProjectsAndNotify function | 1');
              console.log(`${err}`.error.white);
              count++;
              if (count === totalCount) {
                resolve();
              }
            });
        } else {
          count++;
          if (count === totalCount) {
            resolve();
          }
        }
      } else {
        // console.log('--------------------------------');
        // console.log(date, nowDate);
        // console.log('--------------------------------');
        count++;
        if (count === totalCount) {
          resolve();
        }
      }
    });
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
  console.log('start check_notify_user_projects.ts script');
  getAllAuth0Users()
    .then(response => {
      getProjects()
        .then(projects => {
          checkProjectsAndNotify(projects, response.users)
            .then(() => {
              console.log('exit');
              process.exit(0);
            })
            .catch(err => {
              console.log('--------------------------------');
              console.log(err);
              console.log('--------------------------------');
              console.log('failure exit'.error.white);
              process.exit(0);
            });
        })
        .catch(err => {
          console.log('--------------------------------');
          console.log(err);
          console.log('--------------------------------');
          console.log('failure exit'.error.white);
          process.exit(0);
        });
    })
    .catch(err => {
      console.log('--------------------------------');
      console.log(err);
      console.log('--------------------------------');
      console.log('failure exit'.error.white);
      process.exit(0);
    });
}

start();
