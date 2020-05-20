import React, { ReactChild } from 'react';
import { OutcomesLayout } from 'app/modules/report/sub-modules/outcomes';
import { IndicatorVerificationLayout } from 'app/modules/report/sub-modules/indicator-verification';
import { ChallengesPlansLayout } from 'app/modules/report/sub-modules/challenges-plans';
import { PreviewLayout } from 'app/modules/report/sub-modules/preview';

export interface RouteItemParams {
  label: string;
  path: string;
  module?: ReactChild;
  button?: ReactChild;
}

// const ReportRouteConfig: RouteItemParams[] = [
//   {
//     label: 'Outcomes',
//     path: '/report/create/outcomes',
//     module: <OutcomesLayout />,
//   },
//   {
//     label: 'Indicator and Verification',
//     path: '/report/create/indicator-verification',
//     module: <IndicatorVerificationLayout />,
//   },
//   {
//     label: 'Challenges and Plans',
//     path: '/report/create/challenges-plans',
//     module: <ChallengesPlansLayout />,
//   },
//   {
//     label: 'Preview',
//     path: '/reports/create/preview',
//     module: <PreviewLayout />,
//   },
// ];
