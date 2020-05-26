// @ts-nocheck
// base
require('dotenv').config();
const mongoose = require('mongoose');

// models
const OrgType = require('../models/orgType');
const ProjectCategory = require('../models/project_categroy');
const Organisation = require('../models/Org');
const Project = require('../models/project');
const ResponsiblePerson = require('../models/responsiblePerson');

// utils
const fs = require('fs');
const csvtojson = require('csvtojson');
import groupBy from 'lodash/groupBy';
import {
  modifyOrganisation,
  modifyResponsiblePerson,
  modifyProject,
} from '../utils/script';

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

// clear database
async function emptyDB() {
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
              resolve();
            });
          });
        });
      });
    });
  });
}

async function checkAndAddOrgTypes(data: any) {
  return new Promise((resolve, reject) => {
    const groupedOrgTypes = groupBy(data, 'org_type');
    let count = 0;
    const totalCount = Object.keys(groupedOrgTypes).length;
    Object.keys(groupedOrgTypes).forEach((key: any) => {
      OrgType.findOne({ name: key }).then((orgType: any, err: any) => {
        if (!orgType) {
          new OrgType({
            name: key,
            description: key,
          }).save((err: any, doc: any) => {
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
      });
    });
  });
}

async function checkAndAddOrgs(data: any) {
  return new Promise((resolve, reject) => {
    const groupedOrgs = groupBy(data, 'organisation');
    let count = 0;
    const totalCount = Object.keys(groupedOrgs).length;
    Object.keys(groupedOrgs).forEach((key: any) => {
      const org = groupedOrgs[key][0];
      Organisation.findOne({ organisation_name: key }).then(
        (fOrg: any, err: any) => {
          OrgType.findOne({
            name: org.org_type,
          }).then((orgType: any, err3: any) => {
            err3 && console.log(err3);
            if (!fOrg) {
              new Organisation({
                organisation_name: key,
                org_type: orgType,
                street: org.street,
                house_number: org.house_number,
                additional_house_number: org.additional_house_number,
                postcode: org.postcode,
                place: org.place,
                country: org.country,
                telephone: org.telephone,
                email: org.organisation_email,
                website: org.website,
              }).save((err: any, doc: any) => {
                count++;
                if (count === totalCount) {
                  resolve();
                }
              });
            } else {
              modifyOrganisation(fOrg, { ...org, orgType: orgType }).then(
                () => {
                  count++;
                  if (count === totalCount) {
                    resolve();
                  }
                }
              );
            }
          });
        }
      );
    });
  });
}

async function checkAndAddResponsinblePersons(data: any) {
  return new Promise((resolve, reject) => {
    let groupedResponsiblePersons = groupBy(data, 'email');
    let count = 0;
    const totalCount = Object.keys(groupedResponsiblePersons).length;
    Object.keys(groupedResponsiblePersons).forEach((keyEmail: any) => {
      Object.keys(groupedResponsiblePersons[keyEmail]).forEach((key: any) => {
        const person = groupedResponsiblePersons[keyEmail][key];
        ResponsiblePerson.findOne({
          email: keyEmail,
          family_name: person.family_name,
        }).then((fPerson: any, err: any) => {
          Organisation.findOne({
            organisation_name: person.organisation,
          }).then((organisation: any) => {
            if (!fPerson) {
              new ResponsiblePerson({
                family_name: person.family_name,
                initials: person.initial,
                name_insertion: person.insertion,
                title: person.title,
                email: person.email,
                login_email: person.login_email,
                sex: person.sex,
                role: person.role,
                organisation: organisation,
              }).save((err: any, doc: any) => {
                count++;
                if (count === totalCount) {
                  resolve();
                }
              });
            } else {
              modifyResponsiblePerson(fPerson, {
                ...person,
                Organisation: organisation,
              }).then(() => {
                count++;
                if (count === totalCount) {
                  resolve();
                }
              });
            }
          });
        });
      });
    });
  });
}

async function checkAndAddProjectCategories(data: any) {
  return new Promise((resolve, reject) => {
    const groupedProjectCategories = groupBy(data, 'category');
    let count = 0;
    const totalCount = Object.keys(groupedProjectCategories).length;
    Object.keys(groupedProjectCategories).forEach((key: any) => {
      ProjectCategory.findOne({ name: key }).then(
        (err: any, fCategory: any) => {
          if (!fCategory) {
            new ProjectCategory({
              name: key,
              description: key,
            }).save((err: any, doc: any) => {
              count++;
              if (count === totalCount) {
                resolve();
              }
            });
          }
        }
      );
    });
  });
}

async function checkAndAddProjects(data: any) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const totalCount = data.length;
    data.forEach((project: any) => {
      Project.findOne({ project_number: project.project_id.toString() }).then(
        (fProject: any, err1: any) => {
          Organisation.findOne({
            organisation_name: project.organisation,
          }).then((organisation: any, err: any) => {
            ProjectCategory.findOne({ name: project.category }).then(
              (category: any, err: any) => {
                if (!fProject) {
                  new Project({
                    project_number: project.project_id,
                    project_name: project.project,
                    project_description: project.project_description,
                    duration: project.duration,
                    start_date: project.start_date,
                    end_date: project.end_date,
                    total_amount: project.total_amount,
                    decision_date: project.decision_date,
                    decision: project.decision,
                    allocated_amount: project.allocated_amount,
                    released_amount: project.released_amount,
                    paid_amount: project.paid_amount,
                    organisation: organisation,
                    category: category,
                  }).save((err: any, doc: any) => {
                    count++;
                    if (count === totalCount) {
                      resolve();
                    }
                  });
                } else {
                  modifyProject(fProject, {
                    ...project,
                    Organisation: organisation,
                    Category: category,
                  }).then(() => {
                    count++;
                    if (count === totalCount) {
                      resolve();
                    }
                  });
                }
              }
            );
          });
        }
      );
    });
  });
}

// main function
function start() {
  console.log('start');
  csvtojson()
    .fromFile(`${__dirname}/insinger_data.csv`)
    .then((csvData: any) => {
      checkAndAddOrgTypes(csvData)
        .then(() => {
          checkAndAddOrgs(csvData)
            .then(() => {
              checkAndAddResponsinblePersons(csvData)
                .then(() => {
                  checkAndAddProjectCategories(csvData)
                    .then(() => {
                      checkAndAddProjects(csvData).then(() => {
                        console.log('exit');
                        process.exit(0);
                      });
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
}

start();
