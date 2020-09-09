/* models */
const Report = require('../../models/report');

/* utils */
import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { isArray, mergeArrays } from '../../utils/general';
import {
  getPolicyPriorityBarChartFormattedData,
  getRegularUserReportData,
  getModeratorAdminUserReportData,
  getSuperAdminUserReportData,
} from '../../utils/vizcontroller.utils';

/* other */
import consts from '../../config/consts';
import { sdgColors } from '../../assets/mock/sdgColors';
import { policyPriorities } from '../../assets/mock/policyPriorities';
import { targetGroupColors } from '../../assets/mock/targetGroupColors';

const selectQuery =
  'policy_priorities sdgs target_beneficiaries total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution';

function getPriorityAreaBarChartDataOverBudget(reportData: any) {
  return getPolicyPriorityBarChartFormattedData(reportData).map(
    (item: any) => ({
      name: item.name,
      budget: item.value3,
      contribution: item.value4,
      reached: item.value5,
      target: item.value6,
    })
  );
}

function getPriorityAreaBarChartDataOverTargetGroup(reportData: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const policyPrioritiesData: any[] = [];
  filteredReports.forEach((report: any) => {
    const r_policy_priorities = report.policy_priorities;
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const totTarget = report.total_target_beneficiaries;
    const totCommited = report.total_target_beneficiaries_commited;
    const targetGroups = report.target_beneficiaries;
    r_policy_priorities.forEach((pp: any) => {
      if (pp !== undefined) {
        const sharedBudget = (totBudget * pp.weight) / 100;
        const sharedInsCommit = (totInsCommit * pp.weight) / 100;
        const sharedTarget = (totTarget * pp.weight) / 100;
        const sharedCommited = (totCommited * pp.weight) / 100;
        const sharedTargetGroups = filter(
          targetGroups,
          (tg: any) => tg.value > 0
        ).map((tg: any) => ({
          name: tg.name,
          value: (tg.value * pp.weight) / 100,
          color: get(targetGroupColors, `[${tg.name}]`, '#fff'),
        }));
        policyPrioritiesData.push({
          name: pp.policy_priority.name,
          target: sharedTarget,
          reached: sharedCommited,
          budget: sharedBudget,
          contribution: sharedInsCommit,
          children: sharedTargetGroups,
        });
      }
    });
  });
  let result: any[] = [];
  const groupedPolicyPriorities = groupBy(policyPrioritiesData, 'name');
  Object.keys(groupedPolicyPriorities).forEach((ppKey: string) => {
    const instance = groupedPolicyPriorities[ppKey];
    result.push({
      name: ppKey,
      budget: sumBy(instance, 'budget'),
      contribution: sumBy(instance, 'contribution'),
      reached: sumBy(instance, 'reached'),
      target: sumBy(instance, 'target'),
      children: mergeArrays(instance),
    });
  });
  if (result) {
    policyPriorities.forEach((priority: any) => {
      const foundPriorityIndex = findIndex(result, {
        name: priority.value,
      });
      if (foundPriorityIndex === -1) {
        result.push({
          name: priority.label,
          budget: 0,
          contribution: 0,
          reached: 0,
          target: 0,
          children: [],
        });
      } else {
        result[foundPriorityIndex].name = priority.label;
      }
    });
  }
  return sortBy(result, 'name').reverse();
}

function getPriorityAreaBarChartDataOverDuration(reportData: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const policyPrioritiesData: any[] = [];
  filteredReports.forEach((report: any) => {
    const r_policy_priorities = report.policy_priorities;
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const totTarget = report.total_target_beneficiaries;
    const totCommited = report.total_target_beneficiaries_commited;
    r_policy_priorities.forEach((pp: any) => {
      if (pp !== undefined) {
        const sharedBudget = (totBudget * pp.weight) / 100;
        const sharedInsCommit = (totInsCommit * pp.weight) / 100;
        const sharedTarget = (totTarget * pp.weight) / 100;
        const sharedCommited = (totCommited * pp.weight) / 100;
        policyPrioritiesData.push({
          name: pp.policy_priority.name,
          target: sharedTarget,
          reached: sharedCommited,
          budget: sharedBudget,
          contribution: sharedInsCommit,
          multiYear: report.project.multi_year,
        });
      }
    });
  });
  let result: any[] = [];
  const groupedPolicyPriorities = groupBy(policyPrioritiesData, 'name');
  Object.keys(groupedPolicyPriorities).forEach((ppKey: string) => {
    const instance = groupedPolicyPriorities[ppKey];
    const oneYearInstances = filter(instance, { multiYear: false });
    const multiYearInstances = filter(instance, { multiYear: true });
    result.push({
      name: ppKey,
      budget: sumBy(instance, 'budget'),
      budget_Multi: sumBy(multiYearInstances, 'budget'),
      contribution_Multi: sumBy(multiYearInstances, 'contribution'),
      reached_Multi: sumBy(multiYearInstances, 'reached'),
      target_Multi: sumBy(multiYearInstances, 'target'),
      budget_One: sumBy(oneYearInstances, 'budget'),
      contribution_One: sumBy(oneYearInstances, 'contribution'),
      reached_One: sumBy(oneYearInstances, 'reached'),
      target_One: sumBy(oneYearInstances, 'target'),
    });
  });
  if (result) {
    policyPriorities.forEach((priority: any) => {
      const foundPriorityIndex = findIndex(result, {
        name: priority.value,
      });
      if (foundPriorityIndex === -1) {
        result.push({
          name: priority.label,
          budget: 0,
          budget_Multi: 0,
          contribution_Multi: 0,
          reached_Multi: 0,
          target_Multi: 0,
          budget_One: 0,
          contribution_One: 0,
          reached_One: 0,
          target_One: 0,
        });
      } else {
        result[foundPriorityIndex].name = priority.label;
      }
    });
  }
  return sortBy(result, 'name').reverse();
}

function getPriorityAreaBarChartDataOverPeopleReached(reportData: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const policyPrioritiesData: any[] = [];
  filteredReports.forEach((report: any) => {
    const r_policy_priorities = report.policy_priorities;
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const totTarget = report.total_target_beneficiaries;
    const totCommited = report.total_target_beneficiaries_commited;
    r_policy_priorities.forEach((pp: any) => {
      if (pp !== undefined) {
        const sharedBudget = (totBudget * pp.weight) / 100;
        const sharedInsCommit = (totInsCommit * pp.weight) / 100;
        const sharedTarget = (totTarget * pp.weight) / 100;
        const sharedCommited = (totCommited * pp.weight) / 100;
        policyPrioritiesData.push({
          name: pp.policy_priority.name,
          target: sharedTarget,
          reached: sharedCommited,
          budget: sharedBudget,
          contribution: sharedInsCommit,
          multiYear: report.project.multi_year,
        });
      }
    });
  });
  let result: any[] = [];
  const groupedPolicyPriorities = groupBy(policyPrioritiesData, 'name');
  Object.keys(groupedPolicyPriorities).forEach((ppKey: string) => {
    const instance = groupedPolicyPriorities[ppKey];

    result.push({
      name: ppKey,
      reached_Value: sumBy(instance, 'reached'),
      target_Value: sumBy(instance, 'target'),
      budget: sumBy(instance, 'budget'),
      contribution: sumBy(instance, 'contribution'),
    });
  });
  if (result) {
    policyPriorities.forEach((priority: any) => {
      const foundPriorityIndex = findIndex(result, {
        name: priority.value,
      });
      if (foundPriorityIndex === -1) {
        result.push({
          name: priority.label,
          reached_Value: 0,
          target_Value: 0,
          budget: 0,
          contribution: 0,
        });
      } else {
        result[foundPriorityIndex].name = priority.label;
      }
    });
  }
  return sortBy(result, 'name').reverse();
}

function getPriorityAreaBarChartDataOverSDG(reportData: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const policyPrioritiesData: any[] = [];
  filteredReports.forEach((report: any) => {
    const r_policy_priorities = report.policy_priorities;
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const totTarget = report.total_target_beneficiaries;
    const totCommited = report.total_target_beneficiaries_commited;
    const reportSDGs = report.sdgs;
    r_policy_priorities.forEach((pp: any) => {
      if (pp !== undefined) {
        const sharedBudget = (totBudget * pp.weight) / 100;
        const sharedInsCommit = (totInsCommit * pp.weight) / 100;
        const sharedTarget = (totTarget * pp.weight) / 100;
        const sharedCommited = (totCommited * pp.weight) / 100;
        const sharedSDGs = reportSDGs.map((sdg: any) => ({
          name: sdg.sdg.name,
          budget: (sharedBudget * sdg.weight) / 100,
          contribution: (sharedInsCommit * sdg.weight) / 100,
          target: (sharedTarget * sdg.weight) / 100,
          reached: (sharedCommited * sdg.weight) / 100,
          color: get(sdgColors, `[${sdg.sdg.code}]`, '#fff'),
        }));
        policyPrioritiesData.push({
          name: pp.policy_priority.name,
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
  const groupedPolicyPriorities = groupBy(policyPrioritiesData, 'name');
  Object.keys(groupedPolicyPriorities).forEach((ppKey: string) => {
    const instance = groupedPolicyPriorities[ppKey];
    result.push({
      name: ppKey,
      budget: sumBy(instance, 'budget'),
      contribution: sumBy(instance, 'contribution'),
      reached: sumBy(instance, 'reached'),
      target: sumBy(instance, 'target'),
      children: mergeArrays(instance),
    });
  });
  if (result) {
    policyPriorities.forEach((priority: any) => {
      const foundPriorityIndex = findIndex(result, {
        name: priority.value,
      });
      if (foundPriorityIndex === -1) {
        result.push({
          name: priority.label,
          budget: 0,
          contribution: 0,
          reached: 0,
          target: 0,
          children: [],
        });
      } else {
        result[foundPriorityIndex].name = priority.label;
      }
    });
  }
  return sortBy(result, 'name').reverse();
}

function returnDataBasedOnSelection(
  res: any,
  rawData: any,
  breakdownBy: string
) {
  switch (breakdownBy) {
    case 'none':
      res(JSON.stringify(getPriorityAreaBarChartDataOverBudget(rawData)));
      break;
    case 'target-group':
      res(JSON.stringify(getPriorityAreaBarChartDataOverTargetGroup(rawData)));
      break;
    case 'one-multi-year':
      res(JSON.stringify(getPriorityAreaBarChartDataOverDuration(rawData)));
      break;
    case 'people-reached':
      res(
        JSON.stringify(getPriorityAreaBarChartDataOverPeopleReached(rawData))
      );
      break;
    case 'sdg':
      res(JSON.stringify(getPriorityAreaBarChartDataOverSDG(rawData)));
      break;
    default:
      res(JSON.stringify(getPriorityAreaBarChartDataOverBudget(rawData)));
  }
}

export function getPriorityAreaBarChartData(req: any, res: any) {
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
