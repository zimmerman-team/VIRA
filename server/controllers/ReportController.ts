import get from 'lodash/get';
import filter from 'lodash/filter';
const mongoose = require('mongoose');
import consts from '../config/consts';
const sdgModel = require('../models/sdg');
const Pillar = require('../models/pillar');
const Report = require('../models/report');
import { isArray } from '../utils/general';
const Funder = require('../models/funder');
const Project = require('../models/project');
const Organisation = require('../models/Org');
const Location = require('../models/location');
const ReportToSdg = require('../models/reportToSdg');
import { sdgMapModel, sdgmap } from '../utils/sdgmap';
const policyPriority = require('../models/policyPriority');
const ReportToPolicyPriority = require('../models/reportToPolicyPriority');
import { countryFeaturesData } from '../config/countryFeatures';
const targetBeneficiary = require('../models/targetBeneficiary');
const ResponsiblePerson = require('../models/responsiblePerson');
import { getReportsFormattedData } from '../utils/reportcontroller.utils';

// get all reports or reports of a project
export function getReports(req: any, res: any) {
  const { projectID, startDate, endDate } = req.query;

  let query;

  if (startDate && endDate) {
    query = { date_new: { $gte: startDate, $lt: endDate } };
  }

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
      .populate('policy_priorities')
      .populate('sdgs')
      .populate('funders')
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
          Project.find({ person: person }, (err2: any, projects: any) => {
            Report.find({ project: { $in: projects } })
              .populate('location')
              .populate('project')
              .populate('target_beneficiaries')
              .populate('policy_priorities')
              .populate('sdgs')
              .populate('funders')
              .exec((err3: any, reports: any) => {
                res(JSON.stringify(getReportsFormattedData(err3, reports)));
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
            (err2: any, orgs: any) => {
              Project.find(
                { organisation: { $in: orgs.map((org: any) => org) } },
                (err3: any, projects: any) => {
                  Report.find({ project: { $in: projects } })
                    .populate('location')
                    .populate('project')
                    .populate('target_beneficiaries')
                    .populate('policy_priorities')
                    .populate('sdgs')
                    .populate('funders')
                    .exec((err4: any, reports: any) => {
                      res(
                        JSON.stringify(getReportsFormattedData(err4, reports))
                      );
                    });
                }
              );
            }
          );
        }
      );
    } else {
      Report.find(query)
        .populate('location')
        .populate('project')
        .populate('target_beneficiaries')
        .populate('policy_priorities')
        .populate('funders')
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
    .populate('policy_priorities')
    .populate('sdgs')
    .populate('funders')
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

async function getPolicyPriorities(data: any) {
  return new Promise((resolve, reject) => {
    const result: any = [];
    let count = 0;
    const totalCount = data.length;
    data.forEach((item: any) => {
      policyPriority
        .findOne({ name: item.name })
        .exec((err: any, priority: any) => {
          if (err || !priority) {
            if (!item || item.name === '') {
              console.log('Empty policy priority name');
            } else {
              policyPriority.create(
                { name: item.name },
                (err2: any, priority2: any) => {
                  if (err2) {
                    console.log('err2', err2);
                  } else {
                    ReportToPolicyPriority.create(
                      { policy_priority: priority2, weight: item.weight },
                      (err3: any, reportToPP: any) => {
                        if (err3) {
                          console.log('err3', err3);
                        } else {
                          result.push(reportToPP);
                          count++;
                          if (count === totalCount) {
                            resolve(result);
                          }
                        }
                      }
                    );
                  }
                }
              );
            }
          } else {
            ReportToPolicyPriority.create(
              { policy_priority: priority, weight: item.weight },
              (err: any, reportToPP: any) => {
                if (err) {
                  console.log('err', err);
                } else {
                  result.push(reportToPP);
                  count++;
                  if (count === totalCount) {
                    resolve(result);
                  }
                }
              }
            );
          }
        });
    });
  });
}

async function getSDGs(data: any) {
  return new Promise((resolve, reject) => {
    const result: any = [];
    let count = 0;
    const totalCount = data.length;
    data.forEach((item: any) => {
      sdgModel.findOne({ code: item.code }).exec((err: any, sdg: any) => {
        if (err || !sdg) {
          if (!item) {
            console.log('Invalid sdg param');
          } else {
            sdgModel.create(
              { name: item.name, code: item.code },
              (err2: any, sdg2: any) => {
                if (err2) {
                  console.log('err2', err2);
                } else {
                  ReportToSdg.create(
                    { sdg: sdg2, weight: item.weight },
                    (err3: any, reportToSDG: any) => {
                      if (err3) {
                        console.log('err3', err3);
                      } else {
                        result.push(reportToSDG);
                        count++;
                        if (count === totalCount) {
                          resolve(result);
                        }
                      }
                    }
                  );
                }
              }
            );
          }
        } else {
          ReportToSdg.create(
            { policy_priority: sdg, weight: item.weight },
            (err: any, reportToSDG: any) => {
              if (err) {
                console.log('err', err);
              } else {
                result.push(reportToSDG);
                count++;
                if (count === totalCount) {
                  resolve(result);
                }
              }
            }
          );
        }
      });
    });
  });
}

async function getPillar(data: any) {
  return new Promise((resolve, reject) => {
    Pillar.findOne({ name: data }).exec((err: any, fpillar: any) => {
      if (err || !fpillar) {
        if (data === '') {
          resolve(null);
        } else {
          Pillar.create({ name: data }, (err2: any, fpillar2: any) => {
            if (err2) {
              console.log('err2', err2);
            } else {
              resolve(fpillar2);
            }
          });
        }
      } else {
        resolve(fpillar);
      }
    });
  });
}

async function getFunders(data: any) {
  return new Promise((resolve, reject) => {
    const result: any[] = [];
    const totalCount = data.length;
    let count = 0;
    data.forEach((item: any) => {
      Funder.findOne({ name: item }).exec((err: any, funder: any) => {
        if (err || !funder) {
          if (item !== '') {
            Funder.create({ name: item }, (err2: any, funder2: any) => {
              if (err2) {
                console.log('err2', err2);
                count++;
                if (count === totalCount) {
                  resolve(result);
                }
              } else {
                result.push(funder2);
                count++;
                if (count === totalCount) {
                  resolve(result);
                }
              }
            });
          }
        } else {
          result.push(funder);
          count++;
          if (count === totalCount) {
            resolve(result);
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
          }).save((err2: any, newLocation: any) => {
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

  getSDGs(data.sdgs).then((sdgs: any) => {
    getPillar(data.pillar).then(pillar => {
      getPolicyPriorities(data.policy_priority).then(pp => {
        Project.findOne(
          { project_number: data.project },
          (err: any, project: any) => {
            if (err) {
              res(JSON.stringify({ status: 'error', message: err.message }));
            }
            targetBeneficiary.create(
              data.target_beneficiaries,
              (err2: any, tb: any) => {
                if (err2) {
                  res(
                    JSON.stringify({ status: 'error', message: err2.message })
                  );
                }
                getLocation(data.location).then((location: any) => {
                  getFunders(data.funders).then((funders: any) => {
                    const report = new Report();
                    report.project = project;
                    report.title = data.title;
                    report.location = location;
                    report.place_name = data.place_name;
                    report.date = new Date().toLocaleDateString();
                    report.country = data.country;
                    report.target_beneficiaries = tb;
                    report.policy_priorities = pp;
                    report.pillar = pillar;
                    report.sdgs = sdgs;
                    report.budget = data.budget;
                    report.total_target_beneficiaries =
                      data.total_target_beneficiaries;
                    report.total_target_beneficiaries_commited =
                      data.total_target_beneficiaries_commited;
                    report.budget = data.budget;
                    report.insContribution = data.insContribution;
                    report.key_outcomes = data.key_outcomes;
                    report.inputs_invested = data.inputs_invested;
                    report.activities_undertaken = data.activities_undertaken;
                    report.projectgoals_socialbenefits =
                      data.projectgoals_socialbenefits;
                    report.important_factors = data.important_factors;
                    report.orgs_partners = data.orgs_partners;
                    report.monitor_report_outcomes =
                      data.monitor_report_outcomes;
                    report.media = data.media;
                    report.key_implementation_challenges =
                      data.key_implementation_challenges;
                    report.how_address_challenges = data.how_address_challenges;
                    report.other_project_outcomes = data.other_project_outcomes;
                    report.how_important_insinger_support =
                      data.how_important_insinger_support;
                    report.apply_for_more_funding = data.apply_for_more_funding;
                    report.other_comments = data.other_comments;
                    report.plans = data.plans;
                    report.isDraft = data.isDraft ? data.isDraft : false;
                    report.funders = funders;
                    report.save((err3: any, sreport: any) => {
                      if (err3) {
                        res(
                          JSON.stringify({
                            status: 'error',
                            message: err3.message,
                          })
                        );
                      }
                      res(JSON.stringify({ status: 'success', data: sreport }));
                    });
                  });
                });
              }
            );
          }
        );
      });
    });
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
          getSDGs(data.sdgs).then((sdgs: any) => {
            getPillar(data.pillar).then(pillar => {
              getPolicyPriorities(data.policy_priority).then(pp => {
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
                      getFunders(data.funders).then((funders: any) => {
                        report.title = data.title;
                        report.location = location;
                        report.place_name = data.place_name;
                        report.date = new Date().toLocaleDateString();
                        report.country = data.country;
                        report.target_beneficiaries = tb;
                        report.policy_priorities = pp;
                        report.pillar = pillar;
                        report.sdgs = sdgs;
                        report.budget = data.budget;
                        report.total_target_beneficiaries =
                          data.total_target_beneficiaries;
                        report.total_target_beneficiaries_commited =
                          data.total_target_beneficiaries_commited;
                        report.budget = data.budget;
                        report.insContribution = data.insContribution;
                        report.key_outcomes = data.key_outcomes;
                        report.inputs_invested = data.inputs_invested;
                        report.activities_undertaken =
                          data.activities_undertaken;
                        report.projectgoals_socialbenefits =
                          data.projectgoals_socialbenefits;
                        report.important_factors = data.important_factors;
                        report.orgs_partners = data.orgs_partners;
                        report.monitor_report_outcomes =
                          data.monitor_report_outcomes;
                        report.media = data.media;
                        report.key_implementation_challenges =
                          data.key_implementation_challenges;
                        report.how_address_challenges =
                          data.how_address_challenges;
                        report.other_project_outcomes =
                          data.other_project_outcomes;
                        report.how_important_insinger_support =
                          data.how_important_insinger_support;
                        report.apply_for_more_funding =
                          data.apply_for_more_funding;
                        report.other_comments = data.other_comments;
                        report.plans = data.plans;
                        report.isDraft = data.isDraft ? data.isDraft : false;
                        report.funders = funders;
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
            });
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
