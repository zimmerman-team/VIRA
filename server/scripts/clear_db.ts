// @ts-nocheck
// base
require('dotenv').config();
import mongoose from 'mongoose';

// models
const SDG = require('../models/sdg');
const Pillar = require('../models/pillar');
const Report = require('../models/report');
const Project = require('../models/project');
const OrgType = require('../models/orgType');
const Organisation = require('../models/Org');
const Location = require('../models/location');
const ReportToSdg = require('../models/reportToSdg');
const PolicyPriority = require('../models/policyPriority');
const ProjectCategory = require('../models/project_categroy');
const ResponsiblePerson = require('../models/responsiblePerson');
const TargetBeneficiary = require('../models/targetBeneficiary');
const ReportToPolicyPriority = require('../models/reportToPolicyPriority');

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
                  TargetBeneficiary.deleteMany({}, (err7: any) => {
                    if (err7) {
                      console.log(err7);
                    }
                    console.log('TargetBeneficiary removed');
                    ReportToPolicyPriority.deleteMany({}, (err8: any) => {
                      if (err8) {
                        console.log(err8);
                      }
                      console.log('ReportToPolicyPriority removed');
                      ReportToSdg.deleteMany({}, (err9: any) => {
                        if (err9) {
                          console.log(err9);
                        }
                        console.log('ReportToSdg removed');
                        Pillar.deleteMany({}, (err10: any) => {
                          if (err10) {
                            console.log(err10);
                          }
                          console.log('Pillar removed');
                          SDG.deleteMany({}, (err11: any) => {
                            if (err11) {
                              console.log(err11);
                            }
                            console.log('SDG removed');
                            PolicyPriority.deleteMany({}, (err12: any) => {
                              if (err12) {
                                console.log(err12);
                              }
                              console.log('PolicyPriority removed');
                              process.exit(0);
                            });
                          });
                        });
                      });
                    });
                  });
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
