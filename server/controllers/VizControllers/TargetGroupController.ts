/* models */
const Report = require('../../models/report');

/* utils */
import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import { isArray, mergeArrays } from '../../utils/general';
import {
  getRegularUserReportData,
  getModeratorAdminUserReportData,
  getSuperAdminUserReportData,
} from '../../utils/vizcontroller.utils';

/* other */
import consts from '../../config/consts';
import { sdgColors } from '../../assets/mock/sdgColors';

const selectQuery =
  'policy_priorities sdgs target_beneficiaries total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution';

function getTargetGroupBarChartDataOverBudget(reportData: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const targetGroupsData: any[] = [];
  filteredReports.forEach((report: any) => {
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const totTarget = report.total_target_beneficiaries;
    const totCommited = report.total_target_beneficiaries_commited;
    const targetGroups = report.target_beneficiaries;
    targetGroups.forEach((tg: any) => {
      if (tg !== undefined) {
        const weight = (tg.value / totTarget) * 100;
        const sharedBudget = (totBudget * weight) / 100;
        const sharedInsCommit = (totInsCommit * weight) / 100;
        const sharedTarget = (totTarget * weight) / 100;
        const sharedCommited = (totCommited * weight) / 100;
        targetGroupsData.push({
          name: tg.name,
          target: sharedTarget,
          reached: sharedCommited,
          budget: sharedBudget,
          contribution: sharedInsCommit,
        });
      }
    });
  });
  let result: any[] = [];
  const groupedTargetGroups = groupBy(targetGroupsData, 'name');
  Object.keys(groupedTargetGroups).forEach((tgKey: string) => {
    const instance = groupedTargetGroups[tgKey];
    result.push({
      name: tgKey,
      budget: sumBy(instance, 'budget'),
      contribution: sumBy(instance, 'contribution'),
      reached: sumBy(instance, 'reached'),
      target: sumBy(instance, 'target'),
    });
  });
  return sortBy(result, 'name').reverse();
}

function getTargetGroupBarChartDataOverSDG(reportData: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const targetGroupsData: any[] = [];
  filteredReports.forEach((report: any) => {
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const totTarget = report.total_target_beneficiaries;
    const totCommited = report.total_target_beneficiaries_commited;
    const targetGroups = report.target_beneficiaries;
    const reportSDGs = report.sdgs;
    targetGroups.forEach((tg: any) => {
      if (tg !== undefined) {
        const weight = (tg.value / totTarget) * 100;
        const sharedBudget = (totBudget * weight) / 100;
        const sharedInsCommit = (totInsCommit * weight) / 100;
        const sharedTarget = (totTarget * weight) / 100;
        const sharedCommited = (totCommited * weight) / 100;
        const sharedSDGs = reportSDGs.map((sdg: any) => ({
          name: sdg.sdg.name,
          budget: (sharedBudget * sdg.weight) / 100,
          contribution: (sharedInsCommit * sdg.weight) / 100,
          target: (sharedTarget * sdg.weight) / 100,
          reached: (sharedCommited * sdg.weight) / 100,
          color: get(sdgColors, `[${sdg.sdg.code}]`, '#fff'),
        }));
        targetGroupsData.push({
          name: tg.name,
          target: sharedTarget,
          reached: sharedCommited,
          budget: sharedBudget,
          contribution: sharedInsCommit,
          children: sharedSDGs,
        });
      }
    });
  });
  let result: any[] = [];
  const groupedTargetGroups = groupBy(targetGroupsData, 'name');
  Object.keys(groupedTargetGroups).forEach((tgKey: string) => {
    const instance = groupedTargetGroups[tgKey];
    result.push({
      name: tgKey,
      budget: sumBy(instance, 'budget'),
      contribution: sumBy(instance, 'contribution'),
      reached: sumBy(instance, 'reached'),
      target: sumBy(instance, 'target'),
      children: mergeArrays(instance),
    });
  });
  return sortBy(result, 'name').reverse();
}

function returnDataBasedOnSelection(
  res: any,
  rawData: any,
  breakdownBy: string
) {
  switch (breakdownBy) {
    case 'none':
      res(JSON.stringify(getTargetGroupBarChartDataOverBudget(rawData)));
      break;
    case 'people-reached':
      res(JSON.stringify(getTargetGroupBarChartDataOverBudget(rawData)));
      break;
    case 'sdg':
      res(JSON.stringify(getTargetGroupBarChartDataOverSDG(rawData)));
      break;
    default:
      res(JSON.stringify(getTargetGroupBarChartDataOverBudget(rawData)));
  }
}

export function getTargetGroupBarChartData(req: any, res: any) {
  const { projectID, breakdownBy } = req.query;

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
      .populate('target_beneficiaries')
      .exec((err: any, rawData: any) =>
        returnDataBasedOnSelection(res, rawData, breakdownBy)
      );
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
        (rawData: any) => returnDataBasedOnSelection(res, rawData, breakdownBy)
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
        (rawData: any) => returnDataBasedOnSelection(res, rawData, breakdownBy)
      );
    } else {
      getSuperAdminUserReportData(
        selectQuery,
        req.query.startDate,
        req.query.endDate,
        (rawData: any) => returnDataBasedOnSelection(res, rawData, breakdownBy)
      );
    }
  }
}
