import { IntentTextFieldParams } from 'app/modules/report/sub-modules/indicator-verification/common/IntentTextField';
import { OutcomesPropsModel } from 'app/modules/report/model';

export const TextFielMock: IntentTextFieldParams[] = [
  {
    description: 'Title',
    // tooltip: 'Please describe the key outcomes the project aims to achieve',
    componentID: 'outcome1',
    value: '',
    setValue: () => {},
  },
  {
    description: 'Project location',
    // tooltip: 'Please describe the key outcomes the project aims to achieve',
    componentID: 'outcome2',
    explanation:
      'In which of the following geographical locations will the project be implemented',
    value: '',
    setValue: () => {},
  },
];

export const fieldMock = {
  title: 'ererer',
  country: { label: 'Niger', value: 'NE', iso3: 'NER' },
  location: { longitude: 12.82463864194388, latitude: 22.284818563324954 },
  tarBenTotal: 1,
  tarBenTotal2: 1,
  policyPriority: { label: 'Drug use', value: 'Drug use' },
  beneficiaryCounts: [
    { name: 'Children/Young people', value: 1 },
    { name: 'Elderly', value: 0 },
    { name: 'Women', value: 0 },
    { name: 'Refugees', value: 0 },
    { name: 'Low income individuals', value: 0 },
  ],
  budget: 4234,
  remainBudget: 69000,
};
