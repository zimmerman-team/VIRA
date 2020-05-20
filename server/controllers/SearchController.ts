const mongoose = require('mongoose');
const Project = require('../models/project');
const Organisation = require('../models/Org');
const Report = require('../models/report');
const ProjectCategory = require('../models/project_categroy');

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
              { key_implementation_challenges: { $regex: q, $options: '-i' } },
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
    });
  } else {
    res.json({ message: "'q' parameter is not defined" });
    return res(JSON.stringify({ message: "'q' parameter is not defined" }));
  }
}

export function generalSearchAPI(req: any, res: any) {
  const { q } = req.query;
  let projects: any[] = [];
  let reports: any[] = [];
  let orgs: any[] = [];

  if (q) {
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
  } else {
    res.json({ message: "'q' parameter is not defined" });
  }
}
