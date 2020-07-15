import get from 'lodash/get';
const mongoose = require('mongoose');
import consts from '../config/consts';
import { getSearchResults } from '../utils/searchcontroller.utils';
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
      const responsiblePersonFilter = { email: req.query.userEmail };
      const projectsFilter = [
        { project_name: { $regex: q, $options: '-i' } },
        { project_description: { $regex: q, $options: '-i' } },
        ...catFilter,
      ];
      const orgsFilter = [
        { organisation_name: { $regex: q, $options: '-i' } },
        { street: { $regex: q, $options: '-i' } },
        { postcode: { $regex: q, $options: '-i' } },
        { place: { $regex: q, $options: '-i' } },
        { country: { $regex: q, $options: '-i' } },
      ];
      const reportsFilter = [
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
      ];
      if (
        get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.regular.toLowerCase()
      ) {
        ResponsiblePerson.find(
          { ...responsiblePersonFilter },
          (err: any, persons: any) => {
            Project.find({
              person: { $in: persons },
              $or: projectsFilter,
            }).exec((err: any, projectsResults: any) => {
              if (!err) {
                projects = projectsResults;
              }
              Organisation.find({
                _id: { $in: persons.map((p: any) => p.organisation) },
                $or: orgsFilter,
              }).exec((err: any, orgsResults: any) => {
                if (!err) {
                  orgs = orgsResults;
                }
                Report.find({
                  project: { $in: projectsResults },
                  $or: reportsFilter,
                }).exec((err: any, reportResults: any) => {
                  getSearchResults(
                    { projects, orgs, reports, reportResults },
                    res,
                    err
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
          { ...responsiblePersonFilter },
          (err: any, persons: any) => {
            Organisation.find({
              _id: { $in: persons.map((p: any) => p.organisation) },
              $or: orgsFilter,
            }).exec((err: any, orgsResults: any) => {
              if (!err) {
                orgs = orgsResults;
              }
              Project.find({
                organisation: { $in: orgsResults.map((org: any) => org) },
                $or: projectsFilter,
              }).exec((err: any, projectsResults: any) => {
                if (!err) {
                  projects = projectsResults;
                }
                Report.find({
                  project: { $in: projectsResults },
                  $or: reportsFilter,
                }).exec((err: any, reportResults: any) => {
                  getSearchResults(
                    { projects, orgs, reports, reportResults },
                    res,
                    err
                  );
                });
              });
            });
          }
        );
      } else {
        Project.find({
          $or: projectsFilter,
        }).exec((err: any, projectsResults: any) => {
          if (!err) {
            projects = projectsResults;
          }
          Organisation.find({
            $or: orgsFilter,
          }).exec((err: any, orgsResults: any) => {
            if (!err) {
              orgs = orgsResults;
            }
            Report.find({
              $or: reportsFilter,
            }).exec((err: any, reportResults: any) => {
              getSearchResults(
                { projects, orgs, reports, reportResults },
                res,
                err
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
