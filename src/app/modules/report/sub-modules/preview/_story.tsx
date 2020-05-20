// @ts-nocheck

import React from 'react';
import { PreviewLayout } from '.';

export default { title: 'modules | Report / Preview ' };

export const desktopLayout = () => <PreviewLayout />;

export const mobileLayout = () => <PreviewLayout />;

mobileLayout.story = {
  parameters: {
    viewport: { defaultViewport: 'mobileGeneral' },
  },
};
