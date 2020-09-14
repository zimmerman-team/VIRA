/* models */
const Report = require('../../models/report');
const Project = require('../../models/project');

/* utils */
import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { isArray } from '../../utils/general';
import {
  getRegularUserReportData,
  getModeratorAdminUserReportData,
  getSuperAdminUserReportData,
} from '../../utils/vizcontroller.utils';

/* other */
import consts from '../../config/consts';
import { targetGroupColors } from '../../assets/mock/targetGroupColors';
import { uniq } from 'lodash';

const selectQuery =
  'target_beneficiaries total_target_beneficiaries total_target_beneficiaries_commited budget isDraft project';

function getOneMultiYearChartDataOverBudget(reportData: any, projects: any) {
  const filteredReports = filter(reportData, { isDraft: false });
  const oneYearReports = filter(
    filteredReports,
    (freport: any) => !freport.project.multi_year
  );
  const multiYearReports = filter(
    filteredReports,
    (freport: any) => freport.project.multi_year
  );
  const result = [
    {
      name: 'One year',
      count: projects.one.length,
      budget_Spent: sumBy(oneYearReports, 'budget'),
      budget_Total: sumBy(projects.one, 'total_amount'),
    },
    {
      name: 'Multi year',
      count: projects.multi.length,
      budget_Spent: sumBy(multiYearReports, 'budget'),
      budget_Total: sumBy(projects.multi, 'total_amount'),
    },
  ];
  return result;
}

function getOneMultiYearChartDataOverTargetGroup(
  reportData: any,
  projects: any
) {
  const filteredReports = filter(reportData, { isDraft: false });
  const oneYearReports = filter(
    filteredReports,
    (freport: any) => !freport.project.multi_year
  );
  const multiYearReports = filter(
    filteredReports,
    (freport: any) => freport.project.multi_year
  );
  const oneYearTargetGroups: any[] = [];
  oneYearReports.forEach((report: any) => {
    filter(report.target_beneficiaries, (tg: any) => tg.value > 0).forEach(
      (tg: any) => {
        const weight = (tg.value / report.total_target_beneficiaries) * 100;
        const fTargetGroupIndex = findIndex(oneYearTargetGroups, {
          name: tg.name,
        });
        if (fTargetGroupIndex === -1) {
          const weight = (tg.value / report.total_target_beneficiaries) * 100;
          oneYearTargetGroups.push({
            name: tg.name,
            value: (report.budget * weight) / 100,
            projectNumbers: [report.project.project_number],
            color: get(targetGroupColors, `[${tg.name}]`, '#fff'),
          });
        } else {
          oneYearTargetGroups[fTargetGroupIndex].value +=
            (report.budget * weight) / 100;
          oneYearTargetGroups[fTargetGroupIndex].projectNumbers.push(
            report.project.project_number
          );
        }
      }
    );
  });
  const multiYearTargetGroups: any[] = [];
  multiYearReports.forEach((report: any) => {
    filter(report.target_beneficiaries, (tg: any) => tg.value > 0).forEach(
      (tg: any) => {
        const weight = (tg.value / report.total_target_beneficiaries) * 100;
        const fTargetGroupIndex = findIndex(multiYearTargetGroups, {
          name: tg.name,
        });
        if (fTargetGroupIndex === -1) {
          const weight = (tg.value / report.total_target_beneficiaries) * 100;
          multiYearTargetGroups.push({
            name: tg.name,
            value: (report.budget * weight) / 100,
            projectNumbers: [report.project.project_number],
            color: get(targetGroupColors, `[${tg.name}]`, '#fff'),
          });
        } else {
          multiYearTargetGroups[fTargetGroupIndex].value +=
            (report.budget * weight) / 100;
          multiYearTargetGroups[fTargetGroupIndex].projectNumbers.push(
            report.project.project_number
          );
        }
      }
    );
  });
  const result = [
    {
      name: 'One year',
      count: projects.one.length,
      budget_Spent: sumBy(oneYearReports, 'budget'),
      budget_Total: sumBy(projects.one, 'total_amount'),
      children: oneYearTargetGroups.map((tg: any) => ({
        ...tg,
        count: uniq(tg.projectNumbers).length,
      })),
    },
    {
      name: 'Multi year',
      count: projects.multi.length,
      budget_Spent: sumBy(multiYearReports, 'budget'),
      budget_Total: sumBy(projects.multi, 'total_amount'),
      children: multiYearTargetGroups.map((tg: any) => ({
        ...tg,
        count: uniq(tg.projectNumbers).length,
      })),
    },
  ];
  return result;
}

function getOneMultiYearChartDataOverPeopleReached(
  reportData: any,
  projects: any
) {
  const filteredReports = filter(reportData, { isDraft: false });
  const oneYearReports = filter(
    filteredReports,
    (freport: any) => !freport.project.multi_year
  );
  const multiYearReports = filter(
    filteredReports,
    (freport: any) => freport.project.multi_year
  );
  const result = [
    {
      name: 'One year',
      count: projects.one.length,
      budget_Spent: sumBy(oneYearReports, 'budget'),
      budget_Total: sumBy(projects.one, 'total_amount'),
      targeted: sumBy(oneYearReports, 'total_target_beneficiaries'),
      reached: sumBy(oneYearReports, 'total_target_beneficiaries_commited'),
    },
    {
      name: 'Multi year',
      count: projects.multi.length,
      budget_Spent: sumBy(multiYearReports, 'budget'),
      budget_Total: sumBy(projects.multi, 'total_amount'),
      targeted: sumBy(multiYearReports, 'total_target_beneficiaries'),
      reached: sumBy(multiYearReports, 'total_target_beneficiaries_commited'),
    },
  ];
  return result;
}

function returnDataBasedOnSelection(
  res: any,
  rawData: any,
  breakdownBy: string,
  projects: any
) {
  switch (breakdownBy) {
    case 'None':
      res(
        JSON.stringify(getOneMultiYearChartDataOverBudget(rawData, projects))
      );
      break;
    case 'Target Group':
      res(
        JSON.stringify(
          getOneMultiYearChartDataOverTargetGroup(rawData, projects)
        )
      );
      break;
    case 'People Reached':
      res(
        JSON.stringify(
          getOneMultiYearChartDataOverPeopleReached(rawData, projects)
        )
      );
      break;
    default:
      res(
        JSON.stringify(getOneMultiYearChartDataOverBudget(rawData, projects))
      );
  }
}

function getOneMultiYearProjects() {
  return new Promise((resolve, reject) => {
    Project.find({}).exec((err: any, projects: any) => {
      resolve({
        one: filter(projects, { multi_year: false }),
        multi: filter(projects, { multi_year: true }),
      });
    });
  });
}

export function getOneMultiYearBarChartData(req: any, res: any) {
  const { projectID, breakdownBy } = req.query;

  let query = {};

  getOneMultiYearProjects().then(projects => {
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
          returnDataBasedOnSelection(res, rawData, breakdownBy, projects)
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
          (rawData: any) =>
            returnDataBasedOnSelection(res, rawData, breakdownBy, projects)
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
            returnDataBasedOnSelection(res, rawData, breakdownBy, projects)
        );
      } else {
        getSuperAdminUserReportData(
          selectQuery,
          req.query.startDate,
          req.query.endDate,
          (rawData: any) =>
            returnDataBasedOnSelection(res, rawData, breakdownBy, projects)
        );
      }
    }
  });
}
