import get from 'lodash/get';
import find from 'lodash/find';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import consts from '../config/consts';
import findIndex from 'lodash/findIndex';
import { Colors } from '../assets/colors';
const Report = require('../models/report');
import { isArray } from '../utils/general';
const Project = require('../models/project');
const Organisation = require('../models/Org');
import { sdgMapModel, sdgmap } from '../utils/sdgmap';
import { countryFeaturesData } from '../config/countryFeatures';
const ResponsiblePerson = require('../models/responsiblePerson');
import { policyPriorities } from '../assets/mock/policyPriorities';

function getPolicyPriorityBarChartFormattedData(data: any) {
  const result: any[] = [];
  if (data) {
    const groupedData = groupBy(data, 'policy_priority.name');
    Object.keys(groupedData).forEach(key => {
      if (key !== 'undefined') {
        const totTarget = sumBy(groupedData[key], 'total_target_beneficiaries');
        const totCommitted = sumBy(
          groupedData[key],
          'total_target_beneficiaries_commited'
        );
        const totDiff = totTarget - totCommitted;
        const totBudget = sumBy(groupedData[key], 'budget');
        const totInsingerCommitment = sumBy(
          groupedData[key],
          'insContribution'
        );

        result.push({
          name: key,
          value1: Math.min(totTarget, totCommitted),
          value2: totDiff < 0 ? totDiff * -1 : totDiff,
          value3: totBudget,
          value4: totInsingerCommitment,
          value1Color: Colors.primary.main,
          value2Color: totDiff > 0 ? Colors.grey[500] : '#05c985',
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
                value: totBudget.toLocaleString(undefined, {
                  currency: 'EUR',
                  currencyDisplay: 'symbol',
                  style: 'currency',
                }),
              },
              {
                label: 'Insinger Contribution',
                value: totInsingerCommitment
                  ? totInsingerCommitment.toLocaleString(undefined, {
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
  return result;
}

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
      .select(
        'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution'
      )
      .populate('policy_priority')
      .exec((err: any, rawData: any) => {
        const data = filter(rawData, { isDraft: false });
        res(
          JSON.stringify(
            sortBy(
              getPolicyPriorityBarChartFormattedData(data),
              'name'
            ).reverse()
          )
        );
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      ResponsiblePerson.findOne(
        { email: req.query.userEmail },
        (err: any, person: any) => {
          Project.find({ person: person }, (err: any, projects: any) => {
            Report.find({ project: { $in: projects } })
              .select(
                'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution'
              )
              .populate('policy_priority')
              .exec((err: any, rawData: any) => {
                const data = filter(rawData, { isDraft: false });
                res(
                  JSON.stringify(
                    sortBy(
                      getPolicyPriorityBarChartFormattedData(data),
                      'name'
                    ).reverse()
                  )
                );
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
            (err: any, orgs: any) => {
              Project.find(
                { organisation: { $in: orgs.map((org: any) => org) } },
                (err: any, projects: any) => {
                  Report.find({ project: { $in: projects } })
                    .select(
                      'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution'
                    )
                    .populate('policy_priority')
                    .exec((err: any, rawData: any) => {
                      const data = filter(rawData, { isDraft: false });
                      res(
                        JSON.stringify(
                          sortBy(
                            getPolicyPriorityBarChartFormattedData(data),
                            'name'
                          ).reverse()
                        )
                      );
                    });
                }
              );
            }
          );
        }
      );
    } else {
      Report.find()
        .select(
          'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget isDraft insContribution'
        )
        .populate('policy_priority')
        .exec((err: any, rawData: any) => {
          const data = filter(rawData, { isDraft: false });
          res(
            JSON.stringify(
              sortBy(
                getPolicyPriorityBarChartFormattedData(data),
                'name'
              ).reverse()
            )
          );
        });
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
      .select(
        'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget insContribution isDraft'
      )
      .populate('policy_priority')
      .exec((err: any, rawData: any) => {
        const data = filter(rawData, { isDraft: false });
        const result: sdgMapModel[] = sdgmap(data);
        res(JSON.stringify(sortBy(result, 'number')));
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      ResponsiblePerson.findOne(
        { email: req.query.userEmail },
        (err: any, person: any) => {
          Project.find({ person: person }, (err: any, projects: any) => {
            Report.find({ project: { $in: projects } })
              .select(
                'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget insContribution isDraft'
              )
              .populate('policy_priority')
              .exec((err: any, rawData: any) => {
                const data = filter(rawData, { isDraft: false });
                const result: sdgMapModel[] = sdgmap(data);
                res(JSON.stringify(sortBy(result, 'number')));
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
            (err: any, orgs: any) => {
              Project.find(
                { organisation: { $in: orgs.map((org: any) => org) } },
                (err: any, projects: any) => {
                  Report.find({ project: { $in: projects } })
                    .select(
                      'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget insContribution isDraft'
                    )
                    .populate('policy_priority')
                    .exec((err: any, rawData: any) => {
                      const data = filter(rawData, { isDraft: false });
                      const result: sdgMapModel[] = sdgmap(data);
                      res(JSON.stringify(sortBy(result, 'number')));
                    });
                }
              );
            }
          );
        }
      );
    } else {
      Report.find()
        .select(
          'policy_priority total_target_beneficiaries total_target_beneficiaries_commited budget insContribution isDraft'
        )
        .populate('policy_priority')
        .exec((err: any, rawData: any) => {
          const data = filter(rawData, { isDraft: false });
          const result: sdgMapModel[] = sdgmap(data);
          res(JSON.stringify(sortBy(result, 'number')));
        });
    }
  }
}

export function getGeoMapData(req: any, res: any) {
  const { projectID } = req.query;
  let query: any = { location: { $ne: null } };

  if (projectID) {
    if (isArray(projectID)) {
      query = { project: { $in: projectID }, location: { $ne: null } };
    } else {
      query = { project: projectID, location: { $ne: null } };
    }
    Report.find(query)
      .select('location budget place_name country isDraft')
      .populate('location')
      .exec((err: any, rawData: any) => {
        const data = filter(rawData, { isDraft: false });
        const mapMarkers = data.map((item: any) => ({
          name: item.place_name || item.country,
          longitude: item.location.long,
          latitude: item.location.lat,
          value: item.budget,
        }));
        const countryFeatures = {
          ...countryFeaturesData,
          features: filter(countryFeaturesData.features, f =>
            find(data, { country: f.properties.name })
          ),
        };
        res(JSON.stringify({ mapMarkers, countryFeatures }));
      });
  } else {
    if (
      get(req.query, 'userRole', '').toLowerCase() ===
      consts.roles.regular.toLowerCase()
    ) {
      ResponsiblePerson.findOne(
        { email: req.query.userEmail },
        (err: any, person: any) => {
          Project.find({ person: person }, (err: any, projects: any) => {
            Report.find({ project: { $in: projects }, location: { $ne: null } })
              .select('location budget place_name country isDraft')
              .populate('location')
              .exec((err: any, rawData: any) => {
                const data = filter(rawData, { isDraft: false });
                const mapMarkers = data.map((item: any) => ({
                  name: item.place_name || item.country,
                  longitude: item.location.long,
                  latitude: item.location.lat,
                  value: item.budget,
                }));
                const countryFeatures = {
                  ...countryFeaturesData,
                  features: filter(countryFeaturesData.features, f =>
                    find(data, { country: f.properties.name })
                  ),
                };
                res(JSON.stringify({ mapMarkers, countryFeatures }));
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
            (err: any, orgs: any) => {
              Project.find(
                { organisation: { $in: orgs.map((org: any) => org) } },
                (err: any, projects: any) => {
                  Report.find({
                    project: { $in: projects },
                    location: { $ne: null },
                  })
                    .select('location budget place_name country isDraft')
                    .populate('location')
                    .exec((err: any, rawData: any) => {
                      const data = filter(rawData, { isDraft: false });
                      const mapMarkers = data.map((item: any) => ({
                        name: item.place_name || item.country,
                        longitude: item.location.long,
                        latitude: item.location.lat,
                        value: item.budget,
                      }));
                      const countryFeatures = {
                        ...countryFeaturesData,
                        features: filter(countryFeaturesData.features, f =>
                          find(data, { country: f.properties.name })
                        ),
                      };
                      res(JSON.stringify({ mapMarkers, countryFeatures }));
                    });
                }
              );
            }
          );
        }
      );
    } else {
      Report.find()
        .select('location budget place_name country isDraft')
        .populate('location')
        .exec((err: any, rawData: any) => {
          const data = filter(rawData, { isDraft: false });
          const mapMarkers = data.map((item: any) => ({
            name: item.place_name || item.country,
            longitude: get(item, 'location.long', 0),
            latitude: get(item, 'location.lat', 0),
            value: item.budget,
          }));
          const countryFeatures = {
            ...countryFeaturesData,
            features: filter(countryFeaturesData.features, f =>
              find(data, { country: f.properties.name })
            ),
          };
          res(JSON.stringify({ mapMarkers, countryFeatures }));
        });
    }
  }
}
