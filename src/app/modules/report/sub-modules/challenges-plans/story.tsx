// @ts-nocheck

import React from 'react';
import { ChallengesPlansLayout } from '.';

const mock = {
  keyImplChallenges: 'field 1',
  otherProjOutObs: 'field 2',
  futurePlans: 'lorem ipsum dolor plans',
  otherComms: 'lorem ipsum other',
};

export default { title: 'modules | Report / Challenges & Plans' };

export const desktopLayout = () => <ChallengesPlansLayout />;

export const mobileLayout = () => <ChallengesPlansLayout />;

mobileLayout.story = {
  parameters: {
    viewport: { defaultViewport: 'mobileGeneral' },
  },
};
