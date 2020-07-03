// @ts-nocheck
// base
require('dotenv').config();
import mongoose from 'mongoose';

// models
const OrgType = require('../models/orgType');
const ProjectCategory = require('../models/project_categroy');
const Organisation = require('../models/Org');
const Project = require('../models/project');
const ResponsiblePerson = require('../models/responsiblePerson');
const Report = require('../models/report');
const Location = require('../models/location');

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

// clear database
function emptyDB() {
  return new Promise((resolve, reject) => {
    OrgType.deleteMany({}, (err: any) => {
      if (err) {
        console.log(err);
      }
      console.log('OrgType removed');
      ProjectCategory.deleteMany({}, (err: any) => {
        if (err) {
          console.log(err);
        }
        console.log('ProjectCategory removed');
        Organisation.deleteMany({}, (err: any) => {
          if (err) {
            console.log(err);
          }
          console.log('Organisation removed');
          Project.deleteMany({}, (err: any) => {
            if (err) {
              console.log(err);
            }
            console.log('Project removed');
            ResponsiblePerson.deleteMany({}, (err: any) => {
              if (err) {
                console.log(err);
              }
              console.log('ResponsiblePerson removed');
              Report.deleteMany({}, (err: any) => {
                if (err) {
                  console.log(err);
                }
                console.log('Report removed');
                Location.deleteMany({}, (err: any) => {
                  if (err) {
                    console.log(err);
                  }
                  process.exit(0);
                  console.log('Location removed');
                });
              });
            });
          });
        });
      });
    });
  });
}

emptyDB();
