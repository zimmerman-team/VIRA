// @ts-nocheck
import get from 'lodash/get';
import find from 'lodash/find';
import minBy from 'lodash/minBy';
import findIndex from 'lodash/findIndex';

const policyPriorities = [
  {
    key: 'poverty',
    name: 'Poverty reduction with a focus on youth and children',
    sdgs: [1, 3, 4, 8, 10],
  },
  {
    key: 'Refugees',
    name: 'refugees',
    sdgs: [1, 2, 3, 4, 5, 8, 10],
  },
  {
    key: 'The Elderly',
    name: 'elderly',
    sdgs: [1, 3, 8, 10],
  },
  {
    key: 'prisoner',
    name: 'Prisoner rehabilitation / reintegration',
    sdgs: [1, 3, 4, 5, 8, 10],
  },
  {
    key: 'drug_use',
    name: 'Drug use',
    sdgs: [1, 3, 8, 10],
  },
  {
    key: 'Prostitution',
    name: 'prostitution',
    sdgs: [1, 3, 5, 8, 10],
  },
  {
    key: 'Homelessness',
    name: 'homelessness',
    sdgs: [1, 2, 3, 4, 5, 8, 10, 11],
  },
];

export interface sdgMapModel {
  name: string;
  color: string;
  number: number;
  opacity: number;
  targetValue?: number;
  insContribution?: number;
  targetPercentage?: number;
  loc?: number;
  commited?: number;
}

export function sdgmap(reports: any): sdgMapModel[] {
  const sdgs: sdgMapModel[] = [
    {
      name: 'sdgs.1',
      color: '#E5243D',
      number: 1,
      opacity: 0.2,
    },
    {
      name: 'sdgs.2',
      color: '#DDA73B',
      number: 2,
      opacity: 0.2,
    },
    {
      name: 'sdgs.3',
      color: '#4CA146',
      number: 3,
      opacity: 0.2,
    },
    {
      name: 'sdgs.4',
      color: '#C7212F',
      number: 4,
      opacity: 0.2,
    },
    {
      name: 'sdgs.5',
      color: '#EF402E',
      number: 5,
      opacity: 0.2,
    },
    {
      name: 'sdgs.8',
      color: '#A31C44',
      number: 8,
      opacity: 0.2,
    },
    {
      name: 'sdgs.10',
      color: '#E01383',
      number: 10,
      opacity: 0.2,
    },
    {
      name: 'sdgs.11',
      color: '#F89D2A',
      number: 11,
      opacity: 0.2,
    },
  ];
  let result: any[] = [];
  reports.forEach((report: any) => {
    const pp = find(policyPriorities, { key: report.policy_priority.name });
    if (pp) {
      const nOfSdgs = pp.sdgs.length;
      const sharedTarget = report.total_target_beneficiaries;
      // Math.round(
      //   report.total_target_beneficiaries / nOfSdgs
      // );
      const sharedCommited = report.total_target_beneficiaries_commited; // / nOfSdgs;
      const sharedBudget = report.budget / nOfSdgs;
      const sharedInsCommit = report.insContribution / nOfSdgs;
      pp.sdgs.forEach((sdgNum: number) => {
        const index = findIndex(sdgs, { number: sdgNum });
        if (index > -1) {
          if (sdgs[index].opacity < 1) {
            sdgs[index].targetValue = sharedTarget;
            sdgs[index].insContribution = sharedInsCommit;
            sdgs[index].loc = sharedBudget;
            sdgs[index].commited = sharedCommited;
            sdgs[index].opacity = 1;
          } else {
            if (sdgs[index].targetValue)
              sdgs[index].targetValue += sharedTarget;
            if (sdgs[index].insContribution)
              sdgs[index].insContribution += sharedInsCommit;
            if (sdgs[index].loc) sdgs[index].loc += sharedBudget;
            if (sdgs[index].commited) sdgs[index].commited += sharedCommited;
          }
        }
      });
    }
  });
  const minValue = get(minBy(sdgs, 'loc'), 'loc', 0);
  result = sdgs.map((r: any) => ({
    ...r,
    loc: !r.loc ? minValue : r.loc,
    targetPercentage: (r.commited / r.targetValue) * 100,
  }));
  return result;
}
