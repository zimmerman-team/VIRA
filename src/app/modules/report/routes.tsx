import React from 'react';
import get from 'lodash/get';
import { useQuery } from 'app/utils/useQuery';
import { PreviewLayout } from 'app/modules/report/sub-modules/preview';
import { OutcomesLayout } from 'app/modules/report/sub-modules/outcomes';
import {
  OutcomesPropsModel,
  IndicatorVerificationPropsModel,
  ChallengesPlansPropsModel,
  PolicyPrioritiesPropsModel,
} from 'app/modules/report/model';
import {
  Route,
  Redirect,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { ChallengesPlansLayout } from 'app/modules/report/sub-modules/challenges-plans';
import { IndicatorVerificationLayout } from 'app/modules/report/sub-modules/indicator-verification';
import { PolicyPrioritiesLayout } from 'app/modules/report/sub-modules/policy-priorities';

interface Props extends RouteComponentProps {
  step2Enabled: boolean;
  step3Enabled: boolean;
  step4Enabled: boolean;
  step5Enabled: boolean;
  outcomesProps: OutcomesPropsModel;
  policyPrioritiesProps: PolicyPrioritiesPropsModel;
  indicatorVerificationProps: IndicatorVerificationPropsModel;
  challengesPlansProps: ChallengesPlansPropsModel;
}

const ReportModuleRoutesF = (props: Props) => {
  const query = useQuery();
  return (
    <React.Fragment>
      {/* ---------------------------------------------------------------------*/}
      {/* outcomes */}
      <Route exact path="/report/:projectID/outcomes">
        <OutcomesLayout {...props.outcomesProps} />
      </Route>

      {/* ---------------------------------------------------------------------*/}
      {/* policy priorities */}
      <Route exact path="/report/:projectID/policy-priorities">
        {props.step2Enabled ? (
          <PolicyPrioritiesLayout {...props.policyPrioritiesProps} />
        ) : (
          <Redirect
            to={`/report/${get(props.match.params, 'projectID', '')}/outcomes${
              query.get('rid') ? `?rid=${query.get('rid')}` : ''
            }`}
          />
        )}
      </Route>

      {/* ---------------------------------------------------------------------*/}
      {/* indicator & verification */}
      <Route exact path="/report/:projectID/indicator-verification">
        {props.step3Enabled ? (
          <IndicatorVerificationLayout {...props.indicatorVerificationProps} />
        ) : (
          <Redirect
            to={`/report/${get(props.match.params, 'projectID', '')}/outcomes${
              query.get('rid') ? `?rid=${query.get('rid')}` : ''
            }`}
          />
        )}
      </Route>

      {/* ---------------------------------------------------------------------*/}
      {/* challenges & plans */}
      <Route exact path="/report/:projectID/challenges-plans">
        {props.step4Enabled ? (
          <ChallengesPlansLayout {...props.challengesPlansProps} />
        ) : (
          <Redirect
            to={`/report/${get(props.match.params, 'projectID', '')}/outcomes${
              query.get('rid') ? `?rid=${query.get('rid')}` : ''
            }`}
          />
        )}
      </Route>

      {/* ---------------------------------------------------------------------*/}
      {/* preview */}
      <Route exact path="/report/:projectID/preview">
        {props.step5Enabled ? (
          <PreviewLayout {...props} />
        ) : (
          <Redirect
            to={`/report/${get(props.match.params, 'projectID', '')}/outcomes${
              query.get('rid') ? `?rid=${query.get('rid')}` : ''
            }`}
          />
        )}
      </Route>
    </React.Fragment>
  );
};

export const ReportModuleRoutes = withRouter(ReportModuleRoutesF);
