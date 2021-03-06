// @ts-nocheck
// base
require('dotenv').config();
const mongoose = require('mongoose');

// models
const SDG = require('../models/sdg');
const Pillar = require('../models/pillar');
const Project = require('../models/project');
const OrgType = require('../models/orgType');
const Organisation = require('../models/Org');
const PolicyPriority = require('../models/policyPriority');
const ProjectCategory = require('../models/project_categroy');
const ResponsiblePerson = require('../models/responsiblePerson');

// utils
const fs = require('fs');
const path = require('path');
import groupBy from 'lodash/groupBy';
const csvtojson = require('csvtojson');
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
mongoose.set('useCreateIndex', true);

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
      let groupedResponsiblePersonsOrgs = groupBy(
        groupedResponsiblePersons[keyEmail],
        'organisation'
      );
      const personOrgsKeys = Object.keys(groupedResponsiblePersonsOrgs);
      let count2 = 0;
      const totalCount2 = personOrgsKeys.length;
      personOrgsKeys.forEach((personOrgsKey: string) => {
        const instance = groupedResponsiblePersonsOrgs[personOrgsKey][0];
        Organisation.findOne({
          organisation_name: instance.organisation,
        }).then((organisation: any) => {
          ResponsiblePerson.findOne({
            email: instance.email,
            organisation: organisation,
            family_name: instance.family_name,
          }).then((fPerson: any, err: any) => {
            if (!fPerson) {
              new ResponsiblePerson({
                family_name: instance.family_name,
                initials: instance.initial,
                name_insertion: instance.insertion,
                title: instance.title,
                email: instance.email,
                login_email: instance.login_email,
                sex: instance.sex,
                role: instance.role,
                organisation: organisation,
              }).save((err: any, doc: any) => {
                count2++;
                if (count2 === totalCount2) {
                  count++;
                  if (count === totalCount) {
                    resolve();
                  }
                }
              });
            } else {
              modifyResponsiblePerson(fPerson, instance).then(() => {
                count2++;
                if (count2 === totalCount2) {
                  count++;
                  if (count === totalCount) {
                    resolve();
                  }
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
            ResponsiblePerson.findOne({
              email: project.email,
            }).then((person: any, err: any) => {
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
                      decision_date_unix: getDate(project.decision_date),
                      decision: project.decision,
                      allocated_amount: project.allocated_amount,
                      released_amount: project.released_amount,
                      paid_amount: project.paid_amount,
                      organisation: organisation,
                      category: category,
                      person: person,
                      multi_year: project.duration === 'Meerjarig',
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
                      Person: person,
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
          });
        }
      );
    });
  });
}

export function getDate(date: string) {
  // https://stackoverflow.com/questions/33299687/how-to-convert-dd-mm-yyyy-string-into-javascript-date-object/33299764
  const dateParts = date.split('-');
  // month is 0-based, that's why we need dataParts[1] - 1
  // 19-3-2018 => DD-MM-YYYY
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], 12);
}

function parseStaticData() {
  const sdgsJson = fs.readFileSync(
    path.resolve(__dirname, '../assets/static/sdgs.json')
  );
  const pillarsJson = fs.readFileSync(
    path.resolve(__dirname, '../assets/static/pillars.json')
  );
  const policyPrioritiesJson = fs.readFileSync(
    path.resolve(__dirname, '../assets/static/policyPriorities.json')
  );
  const sdgs = JSON.parse(sdgsJson);
  const pillars = JSON.parse(pillarsJson);
  const policyPriorities = JSON.parse(policyPrioritiesJson);
  sdgs.forEach((sdg: { code: number; name: string; description: string }) => {
    SDG.findOne({ code: sdg.code }).then((fSdg: any, err1: any) => {
      if (!fSdg) {
        new SDG({
          code: sdg.code,
          name: sdg.name,
          description: sdg.description,
        }).save((err2: any, doc: any) => {
          if (err2) {
            console.log('Error: ', err2);
          }
          if (doc) {
            console.log('SDG created: ', sdg.code);
          }
        });
      }
    });
  });
  pillars.forEach((pillar: string) => {
    Pillar.findOne({ name: pillar }).then((fPillar: any, err1: any) => {
      if (!fPillar) {
        new Pillar({ name: pillar }).save((err2: any, doc: any) => {
          if (err2) {
            console.log('Error: ', err2);
          }
          if (doc) {
            console.log('Pillar created: ', pillar);
          }
        });
      }
    });
  });
  policyPriorities.forEach((policyPriority: string) => {
    PolicyPriority.findOne({ name: policyPriority }).then(
      (fPolicyPriority: any, err1: any) => {
        if (!fPolicyPriority) {
          new PolicyPriority({ name: policyPriority }).save(
            (err2: any, doc: any) => {
              if (err2) {
                console.log('Error: ', err2);
              }
              if (doc) {
                console.log('Policy Priority created: ', policyPriority);
              }
            }
          );
        }
      }
    );
  });
}

// main function
function start() {
  if (!process.env.REACT_APP_DATA_FILE) {
    console.log('REACT_APP_DATA_FILE env variable not found');
    process.exit(0);
  }
  console.log(
    'start load_initial_data.ts script with',
    process.env.REACT_APP_DATA_FILE,
    'file'
  );
  parseStaticData();
  csvtojson()
    .fromFile(`${__dirname}/${process.env.REACT_APP_DATA_FILE}`)
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
