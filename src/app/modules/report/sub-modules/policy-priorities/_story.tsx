// @ts-nocheck

import React from 'react';
import { PolicyPrioritiesLayout } from '.';

export default { title: 'modules | Report / Policy Priorities' };

export const desktopLayout = () => <PolicyPrioritiesLayout />;

export const mobileLayout = () => <PolicyPrioritiesLayout />;

mobileLayout.story = {
  parameters: {
    viewport: { defaultViewport: 'mobileGeneral' },
  },
};
