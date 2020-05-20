// @ts-nocheck

import React from 'react';
import { IndicatorVerificationLayout } from 'app/modules/report/sub-modules/indicator-verification';

export default {
  title: `modules | Report / Indicator Verification`,
};

export const desktopLayout = () => <IndicatorVerificationLayout />;

export const mobileLayout = () => <IndicatorVerificationLayout />;

mobileLayout.story = {
  parameters: {
    viewport: { defaultViewport: 'mobileGeneral' },
  },
};
