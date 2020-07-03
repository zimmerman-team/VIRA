import get from 'lodash/get';
const mongoose = require('mongoose');
import consts from '../config/consts';
const Report = require('../models/report');
const Project = require('../models/project');
const Organisation = require('../models/Org');
const ProjectCategory = require('../models/project_categroy');
const ResponsiblePerson = require('../models/responsiblePerson');

export function generalSearchSocketAPI(req: any, res: any) {
  const { q } = req.query;
  let projects: any[] = [];
  let reports: any[] = [];
  let orgs: any[] = [];

  if (q) {
    ProjectCategory.find({ name: q }).exec((err: any, categoryRes: any) => {
      const catFilter = categoryRes.map((cr: any) => ({
        category: new mongoose.Types.ObjectId(cr._id),
      }));
      if (
        get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.regular.toLowerCase()
      ) {
        ResponsiblePerson.find(
          { email: req.query.userEmail },
          (err: any, persons: any) => {
            Project.find({
              person: { $in: persons },
              $or: [
                { project_name: { $regex: q, $options: '-i' } },
                { project_description: { $regex: q, $options: '-i' } },
                ...catFilter,
              ],
            }).exec((err: any, projectsResults: any) => {
              if (!err) {
                projects = projectsResults;
              }
              Organisation.find({
                _id: { $in: persons.map((p: any) => p.organisation) },
                $or: [
                  { organisation_name: { $regex: q, $options: '-i' } },
                  { street: { $regex: q, $options: '-i' } },
                  { postcode: { $regex: q, $options: '-i' } },
                  { place: { $regex: q, $options: '-i' } },
                  { country: { $regex: q, $options: '-i' } },
                ],
              }).exec((err: any, orgsResults: any) => {
                if (!err) {
                  orgs = orgsResults;
                }
                Report.find({
                  project: { $in: projectsResults },
                  $or: [
                    { title: { $regex: q, $options: '-i' } },
                    { country: { $regex: q, $options: '-i' } },
                    { key_outcomes: { $regex: q, $options: '-i' } },
                    { monitor_report_outcomes: { $regex: q, $options: '-i' } },
                    {
                      key_implementation_challenges: {
                        $regex: q,
                        $options: '-i',
                      },
                    },
                    { other_project_outcomes: { $regex: q, $options: '-i' } },
                    { plans: { $regex: q, $options: '-i' } },
                    { other_comments: { $regex: q, $options: '-i' } },
                    { place_name: { $regex: q, $options: '-i' } },
                  ],
                }).exec((err: any, reportResults: any) => {
                  if (!err) {
                    reports = reportResults;
                  }
                  return res(
                    JSON.stringify({
                      data: {
                        projects: projects,
                        reports: reports,
                        organisations: orgs,
                      },
                    })
                  );
                });
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
            Organisation.find({
              _id: { $in: persons.map((p: any) => p.organisation) },
              $or: [
                { organisation_name: { $regex: q, $options: '-i' } },
                { street: { $regex: q, $options: '-i' } },
                { postcode: { $regex: q, $options: '-i' } },
                { place: { $regex: q, $options: '-i' } },
                { country: { $regex: q, $options: '-i' } },
              ],
            }).exec((err: any, orgsResults: any) => {
              if (!err) {
                orgs = orgsResults;
              }
              Project.find({
                organisation: { $in: orgsResults.map((org: any) => org) },
                $or: [
                  { project_name: { $regex: q, $options: '-i' } },
                  { project_description: { $regex: q, $options: '-i' } },
                  ...catFilter,
                ],
              }).exec((err: any, projectsResults: any) => {
                if (!err) {
                  projects = projectsResults;
                }
                Report.find({
                  project: { $in: projectsResults },
                  $or: [
                    { title: { $regex: q, $options: '-i' } },
                    { country: { $regex: q, $options: '-i' } },
                    { key_outcomes: { $regex: q, $options: '-i' } },
                    { monitor_report_outcomes: { $regex: q, $options: '-i' } },
                    {
                      key_implementation_challenges: {
                        $regex: q,
                        $options: '-i',
                      },
                    },
                    { other_project_outcomes: { $regex: q, $options: '-i' } },
                    { plans: { $regex: q, $options: '-i' } },
                    { other_comments: { $regex: q, $options: '-i' } },
                    { place_name: { $regex: q, $options: '-i' } },
                  ],
                }).exec((err: any, reportResults: any) => {
                  if (!err) {
                    reports = reportResults;
                  }
                  return res(
                    JSON.stringify({
                      data: {
                        projects: projects,
                        reports: reports,
                        organisations: orgs,
                      },
                    })
                  );
                });
              });
            });
          }
        );
      } else {
        Project.find({
          $or: [
            { project_name: { $regex: q, $options: '-i' } },
            { project_description: { $regex: q, $options: '-i' } },
            ...catFilter,
          ],
        }).exec((err: any, projectsResults: any) => {
          if (!err) {
            projects = projectsResults;
          }
          Organisation.find({
            $or: [
              { organisation_name: { $regex: q, $options: '-i' } },
              { street: { $regex: q, $options: '-i' } },
              { postcode: { $regex: q, $options: '-i' } },
              { place: { $regex: q, $options: '-i' } },
              { country: { $regex: q, $options: '-i' } },
            ],
          }).exec((err: any, orgsResults: any) => {
            if (!err) {
              orgs = orgsResults;
            }
            Report.find({
              $or: [
                { title: { $regex: q, $options: '-i' } },
                { country: { $regex: q, $options: '-i' } },
                { key_outcomes: { $regex: q, $options: '-i' } },
                { monitor_report_outcomes: { $regex: q, $options: '-i' } },
                {
                  key_implementation_challenges: { $regex: q, $options: '-i' },
                },
                { other_project_outcomes: { $regex: q, $options: '-i' } },
                { plans: { $regex: q, $options: '-i' } },
                { other_comments: { $regex: q, $options: '-i' } },
                { place_name: { $regex: q, $options: '-i' } },
              ],
            }).exec((err: any, reportResults: any) => {
              if (!err) {
                reports = reportResults;
              }
              return res(
                JSON.stringify({
                  data: {
                    projects: projects,
                    reports: reports,
                    organisations: orgs,
                  },
                })
              );
            });
          });
        });
      }
    });
  } else {
    return res(JSON.stringify({ message: "'q' parameter is not defined" }));
  }
}

// only for testing purposes
export function generalSearchAPI(req: any, res: any) {
  const { q } = req.query;
  let projects: any[] = [];
  let reports: any[] = [];
  let orgs: any[] = [];

  if (q) {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      ResponsiblePerson.find(
        { email: req.query.userEmail },
        (err: any, persons: any) => {
          Project.find({
            person: { $in: persons },
            project_name: { $regex: q, $options: '-i' },
          }).exec((err: any, projectsResults: any) => {
            if (!err) {
              projects = projectsResults;
            }
            Organisation.find({
              _id: { $in: persons.map((p: any) => p.organisation) },
            }).exec((err: any, orgsResults: any) => {
              if (!err) {
                orgs = orgsResults;
              }
              Report.find({
                project: { $in: projectsResults },
                title: { $regex: q, $options: '-i' },
              }).exec((err: any, reportResults: any) => {
                if (!err) {
                  reports = reportResults;
                }
                res.json({
                  data: {
                    projects: projects,
                    reports: reports,
                    organisations: orgs,
                  },
                });
              });
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
          Organisation.find({
            _id: { $in: persons.map((p: any) => p.organisation) },
          }).exec((err: any, orgsResults: any) => {
            if (!err) {
              orgs = orgsResults;
            }
            Project.find({
              project_name: { $regex: q, $options: '-i' },
              organisation: { $in: orgsResults.map((org: any) => org) },
            }).exec((err: any, projectsResults: any) => {
              if (!err) {
                projects = projectsResults;
              }
              Report.find({
                project: { $in: projectsResults },
                title: { $regex: q, $options: '-i' },
              }).exec((err: any, reportResults: any) => {
                if (!err) {
                  reports = reportResults;
                }
                res.json({
                  data: {
                    projects: projects,
                    reports: reports,
                    organisations: orgs,
                  },
                });
              });
            });
          });
        }
      );
    } else {
      Project.find({
        project_name: { $regex: q, $options: '-i' },
      }).exec((err: any, projectsResults: any) => {
        if (!err) {
          projects = projectsResults;
        }
        Organisation.find({
          organisation_name: { $regex: q, $options: '-i' },
        }).exec((err: any, orgsResults: any) => {
          if (!err) {
            orgs = orgsResults;
          }
          Report.find({
            title: { $regex: q, $options: '-i' },
          }).exec((err: any, reportResults: any) => {
            if (!err) {
              reports = reportResults;
            }
            res.json({
              data: {
                projects: projects,
                reports: reports,
                organisations: orgs,
              },
            });
          });
        });
      });
    }
  } else {
    res.json({ message: "'q' parameter is not defined" });
  }
}
