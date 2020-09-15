/* models */
const Pillar = require('../../models/pillar');
const Report = require('../../models/report');

/* utils */
import get from 'lodash/get';
import find from 'lodash/find';
import sumBy from 'lodash/sumBy';
import filter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import { isArray } from '../../utils/general';
import {
  getRegularUserReportData,
  getModeratorAdminUserReportData,
  getSuperAdminUserReportData,
} from '../../utils/vizcontroller.utils';

/* other */
import consts from '../../config/consts';

const reportselectQuery =
  'budget pillar isDraft total_target_beneficiaries total_target_beneficiaries_commited';

function getFormattedPillarData(reportData: any) {
  return new Promise((resolve, reject) => {
    const result: any[] = [];
    const groupedByPillars = groupBy(reportData, 'pillar.name');
    Object.keys(groupedByPillars).forEach((pillar: string) => {
      if (pillar !== undefined && pillar !== 'undefined') {
        const pillarReports = groupedByPillars[pillar];
        const spent = sumBy(pillarReports, 'budget');
        const budget = sumBy(pillarReports, 'project.total_amount');
        const projectCount = uniqBy(pillarReports, 'project_number').length;
        const targeted = sumBy(pillarReports, 'total_target_beneficiaries');
        const reached = sumBy(
          pillarReports,
          'total_target_beneficiaries_commited'
        );
        result.push({
          name: pillar,
          spent: spent,
          budget: budget,
          reached: reached,
          targeted: targeted,
          count: projectCount,
        });
      }
    });
    Pillar.find({}).exec((err: any, pillars: any[]) => {
      pillars.forEach((pillar: any) => {
        if (!find(result, { name: pillar.name })) {
          result.push({
            name: pillar.name,
            budget: 0,
            spent: 0,
            count: 0,
            reached: 0,
            targeted: 0,
          });
        }
      });
      resolve(result);
    });
  });
}

export function getPillarDataByBudget(req: any, res: any) {
  const { projectID, reportID } = req.query;

  let query = {};

  if (projectID || reportID) {
    if (projectID) {
      if (isArray(projectID)) {
        query = { project: { $in: projectID } };
      } else {
        query = { project: projectID };
      }
    } else if (reportID) {
      if (isArray(reportID)) {
        query = { _id: { $in: reportID } };
      } else {
        query = { _id: reportID };
      }
    }

    Report.find(query)
      .select(reportselectQuery)
      .populate('project')
      .populate('pillar')
      .exec((err: any, reportData: any) => {
        getFormattedPillarData(reportData).then((result: any) => {
          res(JSON.stringify(result));
        });
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      getRegularUserReportData(
        req.query.userEmail,
        reportselectQuery,
        req.query.startDate,
        req.query.endDate,
        (reportData: any) =>
          res(JSON.stringify(getFormattedPillarData(reportData)))
      );
    } else if (
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.admin.toLowerCase() ||
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.mod.toLowerCase()
    ) {
      getModeratorAdminUserReportData(
        req.query.userEmail,
        reportselectQuery,
        req.query.startDate,
        req.query.endDate,
        (reportData: any) => {
          getFormattedPillarData(reportData).then((result: any) => {
            res(JSON.stringify(result));
          });
        }
      );
    } else {
      getSuperAdminUserReportData(
        reportselectQuery,
        req.query.startDate,
        req.query.endDate,
        (reportData: any) => {
          getFormattedPillarData(reportData).then((result: any) => {
            res(JSON.stringify(result));
          });
        }
      );
    }
  }
}

function getFormattedPillarDataForDuration(reportData: any) {
  return new Promise((resolve, reject) => {
    const result: any[] = [];
    const groupedByPillars = groupBy(reportData, 'pillar.name');
    Object.keys(groupedByPillars).forEach((pillar: string) => {
      if (pillar !== undefined && pillar !== 'undefined') {
        const pillarReports = groupedByPillars[pillar];
        const spent = sumBy(pillarReports, 'budget');
        const budget = sumBy(pillarReports, 'project.total_amount');
        const oneYearProjects = uniqBy(
          filter(pillarReports, (pr: any) => !pr.project.multi_year).map(
            pr => pr.project
          ),
          'project_number'
        );
        const multiYearProjects = uniqBy(
          filter(pillarReports, (pr: any) => pr.project.multi_year).map(
            pr => pr.project
          ),
          'project_number'
        );
        const projectCount = uniqBy(pillarReports, 'project_number').length;
        const targeted = sumBy(pillarReports, 'total_target_beneficiaries');
        const reached = sumBy(
          pillarReports,
          'total_target_beneficiaries_commited'
        );
        result.push({
          name: pillar,
          oneYear: oneYearProjects.length,
          multiYear: multiYearProjects.length,
          spent: spent,
          budget: budget,
          count: projectCount,
          reached: reached,
          targeted: targeted,
        });
      }
    });
    Pillar.find({}).exec((err: any, pillars: any[]) => {
      pillars.forEach((pillar: any) => {
        if (!find(result, { name: pillar.name })) {
          result.push({
            name: pillar.name,
            oneYear: 0,
            multiYear: 0,
            count: 0,
            reached: 0,
            targeted: 0,
            spent: 0,
            budget: 0,
          });
        }
      });
      resolve(result);
    });
  });
}

export function getPillarDataByDuration(req: any, res: any) {
  const { projectID, reportID } = req.query;

  let query = {};

  if (projectID || reportID) {
    if (projectID) {
      if (isArray(projectID)) {
        query = { project: { $in: projectID } };
      } else {
        query = { project: projectID };
      }
    } else if (reportID) {
      if (isArray(reportID)) {
        query = { _id: { $in: reportID } };
      } else {
        query = { _id: reportID };
      }
    }

    Report.find(query)
      .select(reportselectQuery)
      .populate('project')
      .populate('pillar')
      .exec((err: any, reportData: any) => {
        getFormattedPillarDataForDuration(reportData).then((result: any) => {
          res(JSON.stringify(result));
        });
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      getRegularUserReportData(
        req.query.userEmail,
        reportselectQuery,
        req.query.startDate,
        req.query.endDate,
        (reportData: any) =>
          res(JSON.stringify(getFormattedPillarDataForDuration(reportData)))
      );
    } else if (
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.admin.toLowerCase() ||
      get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.mod.toLowerCase()
    ) {
      getModeratorAdminUserReportData(
        req.query.userEmail,
        reportselectQuery,
        req.query.startDate,
        req.query.endDate,
        (reportData: any) => {
          getFormattedPillarDataForDuration(reportData).then((result: any) => {
            res(JSON.stringify(result));
          });
        }
      );
    } else {
      getSuperAdminUserReportData(
        reportselectQuery,
        req.query.startDate,
        req.query.endDate,
        (reportData: any) => {
          getFormattedPillarDataForDuration(reportData).then((result: any) => {
            res(JSON.stringify(result));
          });
        }
      );
    }
  }
}
