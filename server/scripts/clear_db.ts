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
      ProjectCategory.deleteMany({}, (err1: any) => {
        if (err1) {
          console.log(err1);
        }
        console.log('ProjectCategory removed');
        Organisation.deleteMany({}, (err2: any) => {
          if (err2) {
            console.log(err2);
          }
          console.log('Organisation removed');
          Project.deleteMany({}, (err3: any) => {
            if (err3) {
              console.log(err3);
            }
            console.log('Project removed');
            ResponsiblePerson.deleteMany({}, (err4: any) => {
              if (err4) {
                console.log(err4);
              }
              console.log('ResponsiblePerson removed');
              Report.deleteMany({}, (err5: any) => {
                if (err5) {
                  console.log(err5);
                }
                console.log('Report removed');
                Location.deleteMany({}, (err6: any) => {
                  if (err6) {
                    console.log(err6);
                  }
                  console.log('Location removed');
                  process.exit(0);
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
