/* models */
const Report = require('../../models/report');
const Project = require('../../models/project');
const Organisation = require('../../models/Org');
const ResponsiblePerson = require('../../models/responsiblePerson');

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
  'target_beneficiaries total_target_beneficiaries total_target_beneficiaries_commited budget isDraft project insContribution';

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
      contribution: sumBy(oneYearReports, 'insContribution'),
    },
    {
      name: 'Multi year',
      count: projects.multi.length,
      budget_Spent: sumBy(multiYearReports, 'budget'),
      budget_Total: sumBy(projects.multi, 'total_amount'),
      contribution: sumBy(multiYearReports, 'insContribution'),
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
            value: (report.insContribution * weight) / 100,
            projectNumbers: [report.project.project_number],
            color: get(targetGroupColors, `[${tg.name}]`, '#fff'),
          });
        } else {
          oneYearTargetGroups[fTargetGroupIndex].value +=
            (report.insContribution * weight) / 100;
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
            value: (report.insContribution * weight) / 100,
            projectNumbers: [report.project.project_number],
            color: get(targetGroupColors, `[${tg.name}]`, '#fff'),
          });
        } else {
          multiYearTargetGroups[fTargetGroupIndex].value +=
            (report.insContribution * weight) / 100;
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
      contribution: sumBy(oneYearReports, 'insContribution'),
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
      contribution: sumBy(multiYearReports, 'insContribution'),
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
      contribution: sumBy(oneYearReports, 'insContribution'),
      targeted: sumBy(oneYearReports, 'total_target_beneficiaries'),
      reached: sumBy(oneYearReports, 'total_target_beneficiaries_commited'),
    },
    {
      name: 'Multi year',
      count: projects.multi.length,
      budget_Spent: sumBy(multiYearReports, 'budget'),
      budget_Total: sumBy(projects.multi, 'total_amount'),
      contribution: sumBy(multiYearReports, 'insContribution'),
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

function getOneMultiYearProjects(
  projectID: string,
  reportID: string,
  req: any
) {
  return new Promise((resolve, reject) => {
    const { startDate, endDate } = req.query;
    let query = {};
    if (projectID) {
      if (isArray(projectID)) {
        query = { _id: { $in: projectID } };
      } else {
        query = { _id: projectID };
      }
      Project.find(query).exec((err: any, projects: any) => {
        resolve({
          one: filter(projects, { multi_year: false }),
          multi: filter(projects, { multi_year: true }),
        });
      });
    } else if (reportID) {
      if (isArray(reportID)) {
        query = { _id: { $in: reportID } };
      } else {
        query = { _id: reportID };
      }
      Report.find(query)
        .populate('project')
        .exec((err: any, reports: any) => {
          if (reports) {
            const projects = reports.map((report: any) => report.project);
            resolve({
              one: filter(projects, { multi_year: false }),
              multi: filter(projects, { multi_year: true }),
            });
          }
        });
    } else {
      if (
        get(req.query, 'userRole', '').toLowerCase() ===
        consts.roles.regular.toLowerCase()
      ) {
        ResponsiblePerson.findOne(
          { email: req.query.userEmail },
          (err: any, person: any) => {
            if (startDate && endDate) {
              query = {
                decision_date_unix: { $gte: startDate, $lt: endDate },
                person: person,
              };
            } else {
              query = { person: person };
            }
            Project.find(query, (err2: any, projects: any) => {
              resolve({
                one: filter(projects, { multi_year: false }),
                multi: filter(projects, { multi_year: true }),
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
                if (startDate && endDate) {
                  query = {
                    decision_date_unix: { $gte: startDate, $lt: endDate },
                    organisation: { $in: orgs.map((org: any) => org) },
                  };
                } else {
                  query = {
                    organisation: { $in: orgs.map((org: any) => org) },
                  };
                }
                Project.find(query, (err3: any, projects: any) => {
                  resolve({
                    one: filter(projects, { multi_year: false }),
                    multi: filter(projects, { multi_year: true }),
                  });
                });
              }
            );
          }
        );
      } else {
        if (startDate && endDate) {
          query = { decision_date_unix: { $gte: startDate, $lt: endDate } };
        }
        Project.find(query, (err: any, projects: any) => {
          resolve({
            one: filter(projects, { multi_year: false }),
            multi: filter(projects, { multi_year: true }),
          });
        });
      }
      Project.find({}).exec((err: any, projects: any) => {
        resolve({
          one: filter(projects, { multi_year: false }),
          multi: filter(projects, { multi_year: true }),
        });
      });
    }
  });
}

export function getOneMultiYearBarChartData(req: any, res: any) {
  const {
    projectID,
    reportID,
    breakdownBy,
    userEmail,
    startDate,
    endDate,
  } = req.query;

  let query = {};

  getOneMultiYearProjects(projectID, reportID, req).then(projects => {
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
