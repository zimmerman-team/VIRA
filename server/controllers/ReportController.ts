const mongoose = require('mongoose');
const Report = require('../models/report');
const Project = require('../models/project');
const Location = require('../models/location');
const policyPriority = require('../models/policyPriority');
const targetBeneficiary = require('../models/targetBeneficiary');
import { countryFeaturesData } from '../config/countryFeatures';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import consts from '../config/consts';
import { isArray } from '../utils/general';
import { sdgMapModel, sdgmap } from '../utils/sdgmap';

const ppToSdg = consts.ppToSdg;

// get all reports or reports of a project
export function getReports(req: any, res: any) {
  const { projectID } = req.query;

  let query = {};

  if (projectID) {
    if (isArray(projectID)) {
      query = { project: { $in: projectID } };
    } else {
      query = { project: projectID };
    }
  }

  Report.find(query)
    .populate('location')
    .populate('project')
    .populate('target_beneficiaries')
    .populate('policy_priority')
    .exec((err: any, reports: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      }
      res(JSON.stringify({ status: 'success', data: reports }));
    });
}

// get report by id
export function getReport(req: any, res: any) {
  const { id } = req.query;

  Report.findById(id)
    .populate('location')
    .populate('project')
    .populate('target_beneficiaries')
    .populate('policy_priority')
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
              // console.log(pp);
              let report = new Report();
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
              report.save((err: any, report: any) => {
                if (err) {
                  res(
                    JSON.stringify({ status: 'error', message: err.message })
                  );
                }
                res(JSON.stringify({ status: 'success', data: report }));
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

// async function removePolicyPriorities(data: any) {
//   return new Promise((resolve, reject) => {
//     if (data) {
//       policyPriority.deleteMany({ _id: data }, (err1: any, result: any) => {
//         if (err1) {
//           resolve('failure');
//         }
//         resolve('success');
//       });
//     } else {
//       resolve('success');
//     }
//   });
// }

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
          // removePolicyPriorities(report.policy_priority).then(
          //   (result1: any) => {
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
              }
            );
          });
          //   }
          // );
        }
      );
    }
  });
}

// update report
export function updateReport(req: any, res: any) {
  const data = req.query;
  Report.findById(data._id, (err: any, found_report: any) => {
    if (err) {
      res.json(err);
    } else if (found_report) {
      targetBeneficiary
        .find({
          _id: {
            $in: data.target_beneficiaries
              ? data.target_beneficiaries.map((item: any) =>
                  mongoose.Types.ObjectId(item)
                )
              : [],
          },
        })
        .exec((err: any, tb: any) => {
          if (err) {
            found_report.title = data.title;
            found_report.location = location;
            found_report.date = new Date().toLocaleDateString();
            found_report.total_target_beneficiaries =
              data.total_target_beneficiaries;
            found_report.key_outcomes = data.key_outcomes;
            found_report.monitor_report_outcomes = data.monitor_report_outcomes;
            // report.media = data.media; // *** upload file and then store path here ***
            found_report.key_implementation_challenges =
              data.key_implementation_challenges;
            found_report.other_project_outcomes = data.other_project_outcomes;
            found_report.plans = data.plans;
            found_report.other_comments = data.other_comments;
          }
          policyPriority
            .find({
              _id: {
                $in: data.policy_priority
                  ? data.policy_priority.map((item: any) =>
                      mongoose.Types.ObjectId(item)
                    )
                  : [],
              },
            })
            .exec((err: any, pp: any) => {
              if (err) {
                found_report.title = data.title;
                found_report.location = location;
                found_report.date = new Date().toLocaleDateString();
                found_report.total_target_beneficiaries =
                  data.total_target_beneficiaries;
                found_report.key_outcomes = data.key_outcomes;
                found_report.monitor_report_outcomes =
                  data.monitor_report_outcomes;
                // report.media = data.media; // *** upload file and then store path here ***
                found_report.key_implementation_challenges =
                  data.key_implementation_challenges;
                found_report.other_project_outcomes =
                  data.other_project_outcomes;
                found_report.plans = data.plans;
                found_report.other_comments = data.other_comments;
              }
              Location.findOne(
                data.location
                  ? {
                      long: data.location.long,
                      lat: data.location.lat,
                    }
                  : {}
              ).exec((err: any, l: any) => {
                let location = null;
                if (err) {
                  location = new Location({
                    long: data.location.long,
                    lat: data.location.lat,
                  });
                } else {
                  location = l;
                }
                found_report.title = data.title;
                found_report.location = location;
                found_report.date = new Date().toLocaleDateString();
                found_report.target_beneficiaries = tb;
                found_report.policy_priority = pp;
                found_report.total_target_beneficiaries =
                  data.total_target_beneficiaries;
                found_report.key_outcomes = data.key_outcomes;
                found_report.monitor_report_outcomes =
                  data.monitor_report_outcomes;
                // report.media = data.media; // *** upload file and then store path here ***
                found_report.key_implementation_challenges =
                  data.key_implementation_challenges;
                found_report.other_project_outcomes =
                  data.other_project_outcomes;
                found_report.plans = data.plans;
                found_report.other_comments = data.other_comments;

                found_report.save((err: any, report: any) => {
                  if (err) {
                    res(
                      JSON.stringify({ status: 'error', message: err.message })
                    );
                  }

                  res(JSON.stringify({ status: 'success', data: report }));
                });
              });
            });
        });
    } else {
      res.json({
        status: 'fail',
        message: 'project not found.',
      });
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
