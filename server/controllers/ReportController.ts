import get from 'lodash/get';
import filter from 'lodash/filter';
const mongoose = require('mongoose');
import consts from '../config/consts';
const Report = require('../models/report');
import { isArray } from '../utils/general';
const Funder = require('../models/funder');
const Project = require('../models/project');
const Organisation = require('../models/Org');
const Location = require('../models/location');
import { sdgMapModel, sdgmap } from '../utils/sdgmap';
const policyPriority = require('../models/policyPriority');
import { countryFeaturesData } from '../config/countryFeatures';
const targetBeneficiary = require('../models/targetBeneficiary');
const ResponsiblePerson = require('../models/responsiblePerson');
import { getReportsFormattedData } from '../utils/reportcontroller.utils';

// get all reports or reports of a project
export function getReports(req: any, res: any) {
  const { projectID } = req.query;

  if (projectID) {
    let query = {};

    if (isArray(projectID)) {
      query = { project: { $in: projectID } };
    } else {
      query = { project: projectID };
    }

    Report.find(query)
      .populate('location')
      .populate('project')
      .populate('target_beneficiaries')
      .populate('policy_priority')
      .populate('funder')
      .exec((err: any, reports: any) => {
        res(JSON.stringify(getReportsFormattedData(err, reports)));
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      ResponsiblePerson.findOne(
        { email: req.query.userEmail },
        (err: any, person: any) => {
          Project.find({ person: person }, (err: any, projects: any) => {
            Report.find({ project: { $in: projects } })
              .populate('location')
              .populate('project')
              .populate('target_beneficiaries')
              .populate('policy_priority')
              .populate('funder')
              .exec((err: any, reports: any) => {
                res(JSON.stringify(getReportsFormattedData(err, reports)));
              });
          });
        }
      );
    } else if (
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.admin.toLowerCase() ||
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.mod.toLowerCase()
    ) {
      ResponsiblePerson.find(
        { email: req.query.userEmail },
        (err: any, persons: any) => {
          Organisation.find(
            { _id: { $in: persons.map((p: any) => p.organisation) } },
            (err: any, orgs: any) => {
              Project.find(
                { organisation: { $in: orgs.map((org: any) => org) } },
                (err: any, projects: any) => {
                  Report.find({ project: { $in: projects } })
                    .populate('location')
                    .populate('project')
                    .populate('target_beneficiaries')
                    .populate('policy_priority')
                    .populate('funder')
                    .exec((err: any, reports: any) => {
                      res(
                        JSON.stringify(getReportsFormattedData(err, reports))
                      );
                    });
                }
              );
            }
          );
        }
      );
    } else {
      Report.find({})
        .populate('location')
        .populate('project')
        .populate('target_beneficiaries')
        .populate('policy_priority')
        .populate('funder')
        .exec((err: any, reports: any) => {
          res(JSON.stringify(getReportsFormattedData(err, reports)));
        });
    }
  }
}

// get report by id
export function getReport(req: any, res: any) {
  const { id } = req.query;

  Report.findById(id)
    .populate('location')
    .populate({
      path: 'project',
      populate: {
        path: 'person',
        model: ResponsiblePerson,
      },
    })
    .populate('target_beneficiaries')
    .populate('policy_priority')
    .populate('funder')
    .exec((err: any, report: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      }
      if (report) {
        const mapData = {
          mapMarkers: report.location
            ? [
                {
                  name: report.place_name || report.country,
                  longitude: report.location.long,
                  latitude: report.location.lat,
                  value: report.budget,
                },
              ]
            : [],
          countryFeatures: {
            ...countryFeaturesData,
            features: filter(
              countryFeaturesData.features,
              f => report.country === f.properties.name
            ),
          },
        };
        const sdgVizData: sdgMapModel[] = sdgmap([report]);
        const reportData = {
          ...report._doc,
        };
        res(
          JSON.stringify({
            report: reportData,
            mapData: mapData,
            sdgVizData: sdgVizData,
          })
        );
      }
    });
}

async function getPolicyPriority(data: any) {
  return new Promise((resolve, reject) => {
    const result: any = [];
    let count = 0;
    const totalCount = [data].length;
    [data].forEach((item: any) => {
      policyPriority.findOne({ name: item }).exec((err: any, priority: any) => {
        if (err || !priority) {
          if (item === '') {
            resolve(null);
          } else {
            policyPriority.create(
              { name: item },
              (err2: any, priority2: any) => {
                if (err2) {
                  console.log('err2', err2);
                } else {
                  result.push(priority2);
                  count++;
                  if (count === totalCount) {
                    resolve(result[0]);
                  }
                }
              }
            );
          }
        } else {
          result.push(priority);
          count++;
          if (count === totalCount) {
            resolve(result[0]);
          }
        }
      });
    });
  });
}

async function getFunder(data: any) {
  return new Promise((resolve, reject) => {
    Funder.findOne({ name: data }).exec((err: any, funder: any) => {
      if (err || !funder) {
        if (data === '') {
          resolve(null);
        } else {
          Funder.create({ name: data }, (err2: any, funder2: any) => {
            if (err2) {
              console.log('err2', err2);
              resolve(null);
            } else {
              resolve(funder2);
            }
          });
        }
      } else {
        resolve(funder);
      }
    });
  });
}

async function getLocation(data: any) {
  return new Promise((resolve, reject) => {
    if (data) {
      Location.findOne({
        long: data.long,
        lat: data.lat,
      }).exec((err: any, l: any) => {
        if (!l) {
          new Location({
            long: data.long,
            lat: data.lat,
          }).save((err: any, newLocation: any) => {
            resolve(newLocation);
          });
        } else {
          resolve(l);
        }
      });
    } else {
      resolve(null);
    }
  });
}

// add report
export function addReport(req: any, res: any) {
  const { data } = req.query;

  getPolicyPriority(data.policy_priority).then(pp => {
    Project.findOne(
      { project_number: data.project },
      (err: any, project: any) => {
        if (err) {
          res(JSON.stringify({ status: 'error', message: err.message }));
        }
        targetBeneficiary.create(
          data.target_beneficiaries,
          (err: any, tb: any) => {
            if (err) {
              res(JSON.stringify({ status: 'error', message: err.message }));
            }
            getLocation(data.location).then((location: any) => {
              getFunder(data.funder).then((funder: any) => {
                const report = new Report();
                report.project = project;
                report.title = data.title;
                report.location = location;
                report.place_name = data.place_name;
                report.date = new Date().toLocaleDateString();
                report.country = data.country;
                report.target_beneficiaries = tb;
                report.policy_priority = pp;
                report.budget = data.budget;
                report.total_target_beneficiaries =
                  data.total_target_beneficiaries;
                report.total_target_beneficiaries_commited =
                  data.total_target_beneficiaries_commited;
                report.budget = data.budget;
                report.insContribution = data.insContribution;
                report.key_outcomes = data.key_outcomes;
                report.monitor_report_outcomes = data.monitor_report_outcomes;
                report.media = data.media;
                report.key_implementation_challenges =
                  data.key_implementation_challenges;
                report.other_project_outcomes = data.other_project_outcomes;
                report.plans = data.plans;
                report.other_comments = data.other_comments;
                report.isDraft = data.isDraft ? data.isDraft : false;
                report.funder = funder;
                report.save((err: any, report: any) => {
                  if (err) {
                    res(
                      JSON.stringify({ status: 'error', message: err.message })
                    );
                  }
                  res(JSON.stringify({ status: 'success', data: report }));
                });
              });
            });
          }
        );
      }
    );
  });
}

async function removeTargetBeneficiaries(data: any) {
  return new Promise((resolve, reject) => {
    if (data) {
      targetBeneficiary.deleteMany({ _id: data }, (err1: any, result: any) => {
        if (err1) {
          resolve('failure');
        }
        resolve('success');
      });
    } else {
      resolve('success');
    }
  });
}

// edit report
export function editReport(req: any, res: any) {
  const { data } = req.query;

  Report.findById(data.rid, (err: any, report: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }
    if (report) {
      removeTargetBeneficiaries(report.targetBeneficiaries).then(
        (result: any) => {
          getPolicyPriority(data.policy_priority).then(pp => {
            targetBeneficiary.create(
              data.target_beneficiaries,
              (err3: any, tb: any) => {
                if (err3) {
                  res(
                    JSON.stringify({
                      status: 'error',
                      message: err3.message,
                    })
                  );
                }
                getLocation(data.location).then((location: any) => {
                  getFunder(data.funder).then((funder: any) => {
                    report.title = data.title;
                    report.location = location;
                    report.place_name = data.place_name;
                    report.date = new Date().toLocaleDateString();
                    report.country = data.country;
                    report.target_beneficiaries = tb;
                    report.policy_priority = pp;
                    report.budget = data.budget;
                    report.total_target_beneficiaries =
                      data.total_target_beneficiaries;
                    report.total_target_beneficiaries_commited =
                      data.total_target_beneficiaries_commited;
                    report.budget = data.budget;
                    report.insContribution = data.insContribution;
                    report.key_outcomes = data.key_outcomes;
                    report.monitor_report_outcomes =
                      data.monitor_report_outcomes;
                    report.media = data.media;
                    report.key_implementation_challenges =
                      data.key_implementation_challenges;
                    report.other_project_outcomes = data.other_project_outcomes;
                    report.plans = data.plans;
                    report.other_comments = data.other_comments;
                    report.isDraft = data.isDraft ? data.isDraft : false;
                    report.funder = funder;
                    report.save((err5: any, updatedRep: any) => {
                      if (err5) {
                        res(
                          JSON.stringify({
                            status: 'error',
                            message: err5.message,
                          })
                        );
                      }
                      res(
                        JSON.stringify({
                          status: 'success',
                          data: updatedRep,
                        })
                      );
                    });
                  });
                });
              }
            );
          });
        }
      );
    }
  });
}

// delete report
export function deleteReport(req: any, res: any) {
  Report.deleteOne(
    {
      _id: req.query._id,
    },
    (err: any, report: any) => {
      if (err) {
        res.json(err);
      } else {
        res(
          JSON.stringify({
            status: 'success',
            message: 'Report successfully deleted',
          })
        );
      }
    }
  );
}
