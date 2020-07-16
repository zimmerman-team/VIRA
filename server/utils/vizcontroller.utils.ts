import get from 'lodash/get';
import find from 'lodash/find';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import findIndex from 'lodash/findIndex';
import { Colors } from '../assets/colors';
import { sdgMapModel, sdgmap } from './sdgmap';
import { countryFeaturesData } from '../config/countryFeatures';
import { policyPriorities } from '../assets/mock/policyPriorities';

function getPolicyPriorityData(rawData: any) {
  const result: any[] = [];
  const groupedData = groupBy(rawData, 'policy_priority.name');
  Object.keys(groupedData).forEach(key => {
    if (key !== 'undefined') {
      const totTarget = sumBy(groupedData[key], 'total_target_beneficiaries');
      const totCommitted = sumBy(
        groupedData[key],
        'total_target_beneficiaries_commited'
      );
      const totDiff = totTarget - totCommitted;
      const totBudget = sumBy(groupedData[key], 'budget');
      const totInsingerCommitment = sumBy(groupedData[key], 'insContribution');

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
  return result;
}

export function getPolicyPriorityBarChartFormattedData(rawData: any) {
  const data = filter(rawData, { isDraft: false });
  let result: any[] = [];
  if (data) {
    result = getPolicyPriorityData(data);
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
  return { mapMarkers, countryFeatures };
}
