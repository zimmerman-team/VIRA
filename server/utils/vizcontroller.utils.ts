import get from 'lodash/get';
import find from 'lodash/find';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { Colors } from '../assets/colors';
const Report = require('../models/report');
const Project = require('../models/project');
const Organisation = require('../models/Org');
import { sdgMapModel, sdgmap } from './sdgmap';
import { countryFeaturesData } from '../config/countryFeatures';
const ResponsiblePerson = require('../models/responsiblePerson');
import { policyPriorities } from '../assets/mock/policyPriorities';

function getPolicyPriorityData(
  rawData: any,
  totTarget: number,
  totCommitted: number
) {
  const result: any[] = [];
  const groupedData = groupBy(rawData, 'name');
  Object.keys(groupedData).forEach(key => {
    if (key !== 'undefined') {
      const value1 = sumBy(groupedData[key], 'value1');
      const value2 = sumBy(groupedData[key], 'value2');
      const value3 = sumBy(groupedData[key], 'value3');
      const value4 = sumBy(groupedData[key], 'value4');
      const value5 = sumBy(groupedData[key], 'value5');
      const value6 = sumBy(groupedData[key], 'value6');
      result.push({
        name: key,
        value1: value1,
        value2: value2 < 0 ? value2 * -1 : value2,
        value3: sumBy(groupedData[key], 'value3'),
        value4: sumBy(groupedData[key], 'value4'),
        value5: value5,
        value6: value6,
        value1Color: Colors.primary.main,
        value2Color: value2 > 0 ? Colors.grey[500] : '#05c985',
        value4Color: Colors.chart.darkSkyBlue,
        tooltip: {
          title: key,
          items: [
            {
              label: `Target (${((totCommitted / totTarget) * 100).toFixed(
                2
              )}%)`,
              value: totTarget,
              percentage: ((totCommitted / totTarget) * 100).toFixed(2),
            },
            {
              label: 'Budget',
              value: value3.toLocaleString(undefined, {
                currency: 'EUR',
                currencyDisplay: 'symbol',
                style: 'currency',
              }),
            },
            {
              label: 'Insinger Contribution',
              value: value4
                ? value4.toLocaleString(undefined, {
                    currency: 'EUR',
                    currencyDisplay: 'symbol',
                    style: 'currency',
                  })
                : '0',
            },
          ],
        },
      });
    }
  });
  return result;
}

function getReportPolicyPriorities(reports: any) {
  const result: any[] = [];
  reports.forEach((report: any) => {
    const r_policy_priorities = report.policy_priorities;
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const sharedTarget = report.total_target_beneficiaries;
    const sharedCommited = report.total_target_beneficiaries_commited;
    r_policy_priorities.forEach((pp: any) => {
      if (pp !== undefined) {
        const sharedBudget = (totBudget * pp.weight) / 100;
        const sharedInsCommit = (totInsCommit * pp.weight) / 100;
        const diff = sharedTarget - sharedCommited;
        result.push({
          name: pp.policy_priority.name,
          value1: Math.min(sharedTarget, sharedCommited),
          value2: diff > 0 ? diff * -1 : diff,
          value3: sharedBudget,
          value4: sharedInsCommit,
          value5: sharedCommited,
          value6: sharedTarget,
        });
      }
    });
  });
  return result;
}

export function getPolicyPriorityBarChartFormattedData(rawData: any) {
  const filteredReports = filter(rawData, { isDraft: false });
  const data = getReportPolicyPriorities(filteredReports);
  const totTarget = sumBy(filteredReports, 'total_target_beneficiaries');
  const totCommitted = sumBy(
    filteredReports,
    'total_target_beneficiaries_commited'
  );
  let result: any[] = [];
  if (data) {
    result = getPolicyPriorityData(data, totTarget, totCommitted);
    policyPriorities.forEach((priority: any) => {
      const foundPriorityIndex = findIndex(result, {
        name: priority.value,
      });
      if (foundPriorityIndex === -1) {
        result.push({
          name: priority.label,
          value1: 0,
          value2: 0,
          value3: 0,
          value4: 0,
          value5: 0,
          value6: 0,
          value1Color: Colors.primary.main,
          value2Color: Colors.grey[500],
          value4Color: Colors.chart.darkSkyBlue,
          tooltip: {},
        });
      } else {
        result[foundPriorityIndex].name = priority.label;
        result[foundPriorityIndex].tooltip.title = priority.label;
      }
    });
  }
  return sortBy(result, 'name').reverse();
}

export function getSDGBubbleChartFormattedData(rawData: any) {
  const data = filter(rawData, { isDraft: false });
  const result: sdgMapModel[] = sdgmap(data);
  return sortBy(result, 'number');
}

export function getGeoMapFormattedData(rawData: any) {
  const data = filter(rawData, { isDraft: false });
  const mapMarkers = data.map((item: any) => ({
    name: item.place_name || item.country,
    country: item.country,
    longitude: get(item, 'location.long', null),
    latitude: get(item, 'location.lat', null),
    value: item.budget,
    contribution: item.insContribution,
    reached: item.total_target_beneficiaries_commited,
    target: item.total_target_beneficiaries,
  }));
  const countryFeatures = {
    ...countryFeaturesData,
    features: filter(countryFeaturesData.features, f =>
      find(data, { country: f.properties.name })
    ),
  };
  return { mapMarkers, countryFeatures };
}

export function getRegularUserReportData(
  userEmail: string,
  selectQuery: string,
  startDate: any,
  endDate: any,
  cb: Function
) {
  ResponsiblePerson.findOne({ email: userEmail }, (err: any, person: any) => {
    Project.find({ person: person }, (err1: any, projects: any) => {
      let query = {};
      if (startDate && endDate) {
        query = {
          project: { $in: projects },
          date_new: { $gte: startDate, $lt: endDate },
        };
      } else {
        query = { project: { $in: projects } };
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
        .populate('project')
        .populate('pillar')
        .populate('target_beneficiaries')
        .exec((err2: any, rawData: any) => {
          cb(rawData);
        });
    });
  });
}

export function getModeratorAdminUserReportData(
  userEmail: string,
  selectQuery: string,
  startDate: any,
  endDate: any,
  cb: Function
) {
  ResponsiblePerson.find({ email: userEmail }, (err: any, persons: any) => {
    Organisation.find(
      { _id: { $in: persons.map((p: any) => p.organisation) } },
      (err1: any, orgs: any) => {
        Project.find(
          { organisation: { $in: orgs.map((org: any) => org) } },
          (err2: any, projects: any) => {
            let query = {};
            if (startDate && endDate) {
              query = {
                project: { $in: projects },
                date_new: { $gte: startDate, $lt: endDate },
              };
            } else {
              query = { project: { $in: projects } };
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
              .populate('project')
              .populate('pillar')
              .populate('target_beneficiaries')
              .exec((err3: any, rawData: any) => {
                cb(rawData);
              });
          }
        );
      }
    );
  });
}

export function getSuperAdminUserReportData(
  selectQuery: string,
  startDate: any,
  endDate: any,
  cb: Function
) {
  let query = {};
  if (startDate && endDate) {
    query = { date_new: { $gte: startDate, $lt: endDate } };
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
    .populate('project')
    .populate('pillar')
    .populate('target_beneficiaries')
    .exec((err: any, rawData: any) => {
      cb(rawData);
    });
}
