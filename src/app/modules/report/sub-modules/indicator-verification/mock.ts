/* eslint-disable @typescript-eslint/no-empty-function */
import { IntentTextAreaParams } from './common/IntentTextArea';
import { PriorityOptionParams } from './common/PriorityOption';

export const PriorityOptionMock: PriorityOptionParams = {
  description:
    'Finally, please select which ones of these Insinger Foundation policy priorities the project aims to support.',
  explanation:
    ' For each priority selected, the relevant SDGs appear and can be selected based on our mapping',
  options: [],
  onChange: () => {},
};

export const TextAreaMock: IntentTextAreaParams[] = [
  {
    description: 'Please describe the key outcomes the project aims to achieve',
    tooltip: 'Please describe the key outcomes the project aims to achieve',
    componentID: 'outcome1',
    value: '',
    setValue: () => {},
  },
  {
    description:
      'Please tell us how you intend to monitor and report on the outcomes listed above',
    tooltip: 'Please describe the key outcomes the project aims to achieve',
    componentID: 'outcome2',
    explanation:
      'If you have baseline data (the data you track progress against) and a means of verification (how you intend to obtain the data and from which sources) please also provide that information.',
    value: '',
    setValue: () => {},
  },
];
