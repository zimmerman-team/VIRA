import get from 'lodash/get';
import consts from '../config/consts';
const Report = require('../models/report');
import { isArray } from '../utils/general';
const Project = require('../models/project');
const Organisation = require('../models/Org');
const ResponsiblePerson = require('../models/responsiblePerson');
import {
  getGeoMapFormattedData,
  getSDGBubbleChartFormattedData,
  getPolicyPriorityBarChartFormattedData,
  getRegularUserReportData,
  getModeratorAdminUserReportData,
  getSuperAdminUserReportData,
} from '../utils/vizcontroller.utils';

const selectQuery =
  'policy_priorities sdgs total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution';

const mapSelectQuery =
  'location budget place_name country isDraft insContribution total_target_beneficiaries total_target_beneficiaries_commited';

export function getPolicyPriorityBarChart(req: any, res: any) {
  const { projectID } = req.query;

  let query = {};

  if (projectID) {
    if (isArray(projectID)) {
      query = { project: { $in: projectID } };
    } else {
      query = { project: projectID };
    }
    Report.find(query)
      .select(selectQuery)
      .populate({
        path: 'policy_priorities',
        populate: {
          path: 'policy_priority',
          model: 'policyPriority',
        },
      })
      .populate({
        path: 'sdgs',
        populate: {
          path: 'sdg',
          model: 'sdg',
        },
      })
      .exec((err: any, rawData: any) => {
        res(JSON.stringify(getPolicyPriorityBarChartFormattedData(rawData)));
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      getRegularUserReportData(
        req.query.userEmail,
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) =>
          res(JSON.stringify(getPolicyPriorityBarChartFormattedData(rawData)))
      );
    } else if (
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.admin.toLowerCase() ||
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.mod.toLowerCase()
    ) {
      getModeratorAdminUserReportData(
        req.query.userEmail,
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) =>
          res(JSON.stringify(getPolicyPriorityBarChartFormattedData(rawData)))
      );
    } else {
      getSuperAdminUserReportData(
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) =>
          res(JSON.stringify(getPolicyPriorityBarChartFormattedData(rawData)))
      );
    }
  }
}

export function getSDGBubbleChart(req: any, res: any) {
  const { projectID } = req.query;

  let query = {};

  if (projectID) {
    if (isArray(projectID)) {
      query = { project: { $in: projectID } };
    } else {
      query = { project: projectID };
    }

    Report.find(query)
      .select(selectQuery)
      .populate({
        path: 'policy_priorities',
        populate: {
          path: 'policy_priority',
          model: 'policyPriority',
        },
      })
      .populate({
        path: 'sdgs',
        populate: {
          path: 'sdg',
          model: 'sdg',
        },
      })
      .exec((err: any, rawData: any) => {
        res(JSON.stringify(getSDGBubbleChartFormattedData(rawData)));
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      getRegularUserReportData(
        req.query.userEmail,
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) =>
          res(JSON.stringify(getSDGBubbleChartFormattedData(rawData)))
      );
    } else if (
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.admin.toLowerCase() ||
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.mod.toLowerCase()
    ) {
      getModeratorAdminUserReportData(
        req.query.userEmail,
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) =>
          res(JSON.stringify(getSDGBubbleChartFormattedData(rawData)))
      );
    } else {
      getSuperAdminUserReportData(
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) =>
          res(JSON.stringify(getSDGBubbleChartFormattedData(rawData)))
      );
    }
  }
}

export function getGeoMapData(req: any, res: any) {
  const { projectID } = req.query;
  let query: any;

  if (projectID) {
    if (isArray(projectID)) {
      query = { project: { $in: projectID }, location: { $ne: null } };
    } else {
      query = { project: projectID, location: { $ne: null } };
    }
    Report.find(query)
      .select(mapSelectQuery)
      .populate('location')
      .exec((err: any, rawData: any) => {
        res(JSON.stringify(getGeoMapFormattedData(rawData)));
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      ResponsiblePerson.findOne(
        { email: req.query.userEmail },
        (err: any, person: any) => {
          Project.find({ person: person }, (err1: any, projects: any) => {
            Report.find({ project: { $in: projects }, location: { $ne: null } })
              .select(mapSelectQuery)
              .populate('location')
              .exec((err2: any, rawData: any) => {
                res(JSON.stringify(getGeoMapFormattedData(rawData)));
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
            (err1: any, orgs: any) => {
              Project.find(
                { organisation: { $in: orgs.map((org: any) => org) } },
                (err2: any, projects: any) => {
                  Report.find({
                    project: { $in: projects },
                    location: { $ne: null },
                  })
                    .select(mapSelectQuery)
                    .populate('location')
                    .exec((err3: any, rawData: any) => {
                      res(JSON.stringify(getGeoMapFormattedData(rawData)));
                    });
                }
              );
            }
          );
        }
      );
    } else {
      const { startDate, endDate } = req.query;
      let query;

      if (startDate && endDate) {
        query = { date_new: { $gte: startDate, $lt: endDate } };
      }
      Report.find(query)
        .select(mapSelectQuery)
        .populate('location')
        .exec((err: any, rawData: any) => {
          res(JSON.stringify(getGeoMapFormattedData(rawData)));
        });
    }
  }
}
