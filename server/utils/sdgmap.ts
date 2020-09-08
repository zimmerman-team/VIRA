// @ts-nocheck
import get from 'lodash/get';
import minBy from 'lodash/minBy';
import findIndex from 'lodash/findIndex';

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
  const resultSDGs: sdgMapModel[] = [
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
      name: 'sdgs.6',
      color: '#28BFE6',
      opacity: 0.2,
      number: 6,
    },
    {
      name: 'sdgs.7',
      color: '#FBC412',
      opacity: 0.2,
      number: 7,
    },
    {
      name: 'sdgs.8',
      color: '#A31C44',
      number: 8,
      opacity: 0.2,
    },
    {
      name: 'sdgs.9',
      color: '#F26A2E',
      opacity: 0.2,
      number: 9,
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
    {
      name: 'sdgs.12',
      color: '#F89D2A',
      number: 12,
      opacity: 0.2,
    },
    {
      name: 'sdgs.13',
      color: '#407F46',
      number: 13,
      opacity: 0.2,
    },
    {
      name: 'sdgs.14',
      color: '#1F96D4',
      number: 14,
      opacity: 0.2,
    },
    {
      name: 'sdgs.15',
      color: '#59BA47',
      number: 15,
      opacity: 0.2,
    },
    {
      name: 'sdgs.16',
      color: '#136A9F',
      number: 16,
      opacity: 0.2,
    },
    {
      name: 'sdgs.17',
      color: '#14496B',
      number: 17,
      opacity: 0.2,
    },
  ];
  reports.forEach((report: any) => {
    const totBudget = report.budget;
    const totInsCommit = report.insContribution;
    const sharedTarget = report.total_target_beneficiaries;
    const sharedCommited = report.total_target_beneficiaries_commited;
    report.sdgs.forEach((sdg: any) => {
      const sharedBudget = (totBudget * sdg.weight) / 100;
      const sharedInsCommit = (totInsCommit * sdg.weight) / 100;
      const index = findIndex(resultSDGs, { number: sdg.sdg.code });
      if (index > -1) {
        if (resultSDGs[index].opacity < 1) {
          resultSDGs[index].targetValue = sharedTarget;
          resultSDGs[index].insContribution = sharedInsCommit;
          resultSDGs[index].loc = sharedBudget;
          resultSDGs[index].commited = sharedCommited;
          resultSDGs[index].opacity = 1;
        } else {
          if (resultSDGs[index].targetValue) {
            resultSDGs[index].targetValue += sharedTarget;
          }
          if (resultSDGs[index].insContribution) {
            resultSDGs[index].insContribution += sharedInsCommit;
          }
          if (resultSDGs[index].loc) {
            resultSDGs[index].loc += sharedBudget;
          }
          if (resultSDGs[index].commited) {
            resultSDGs[index].commited += sharedCommited;
          }
        }
      }
    });
  });
  const minValue = get(minBy(resultSDGs, 'loc'), 'loc', 0);
  const result: any[] = resultSDGs.map((resultSDG: any) => ({
    ...resultSDG,
    loc: !resultSDG.loc ? minValue : resultSDG.loc,
    targetPercentage: (resultSDG.commited / resultSDG.targetValue) * 100,
  }));
  return result;
}
