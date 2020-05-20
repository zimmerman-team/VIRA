// @ts-nocheck

import React from 'react';
import { OutcomesLayout } from '.';

export default { title: 'modules | Report / Outcomes' };

export const desktopLayout = () => <OutcomesLayout />;

export const mobileLayout = () => <OutcomesLayout />;

mobileLayout.story = {
  parameters: {
    viewport: { defaultViewport: 'mobileGeneral' },
  },
};
