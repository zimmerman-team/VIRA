import React from 'react';
import 'styled-components/macro';
import { Grid, Hidden, useMediaQuery } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  OutcomesPropsModel,
  PolicyPrioritiesPropsModel,
  IndicatorVerificationPropsModel,
  ChallengesPlansPropsModel,
  BeneficiaryCountsModel,
} from 'app/modules/report/model';
import { PreviewCard, PreviewCardTextField } from './common/PreviewCard';

interface PreviewParams {
  step2Enabled: boolean;
  step3Enabled: boolean;
  step4Enabled: boolean;
  step5Enabled: boolean;
  outcomesProps: OutcomesPropsModel;
  policyPrioritiesProps: PolicyPrioritiesPropsModel;
  indicatorVerificationProps: IndicatorVerificationPropsModel;
  challengesPlansProps: ChallengesPlansPropsModel;
}

export const PreviewLayout = (props: PreviewParams) => {
  const { t } = useTranslation();
  const isMobileWidth = useMediaQuery('(max-width: 600px)');

  return (
    <React.Fragment>
      {/* --------------------------------- */}
      {/* title */}
      <Grid item xs={12} lg={6}>
        <PreviewCard
          title="reports.form.textfield.preview_title"
          content={props.outcomesProps.title}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      {/* --------------------------------- */}
      {/* location */}
      <Grid item xs={12} lg={6}>
        <PreviewCard
          title="reports.form.textfield.location"
          content={props.outcomesProps.country.label}
          explanation={t('reports.form.textfield.location_expl')}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      {/* --------------------------------- */}
      {/* insinger policy priorities */}
      <Grid item xs={12} lg={6}>
        <PreviewCard
          title="reports.form.textfield.insinger_f_policy_priorities"
          tooltip="reports.form.textfield.insinger_f_policy_priorities"
          content={props.policyPrioritiesProps.policyPriority.label}
          explanation="reports.form.textfield.sdg_mapping_expl"
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      {/* --------------------------------- */}
      {/* budget */}
      <Grid item xs={12} lg={6}>
        <PreviewCard
          title="reports.form.textfield.budget"
          tooltip="reports.form.textfield.budget"
          content={props.policyPrioritiesProps.budget}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      {/* --------------------------------- */}
      {/* target beneficiaries */}
      <Grid item xs={12} lg={6}>
        <PreviewCard
          title="reports.form.textfield.target_beneficiaries"
          tooltip="reports.form.textfield.target_beneficiaries"
          content={props.policyPrioritiesProps.tarBenTotal}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      {/* --------------------------------- */}
      {/* Of which the beneficiaries will likely include approximately (Optional) */}
      <Grid item xs={12} lg={6}>
        <PreviewCard
          title="reports.form.textfield.of_which_ben"
          tooltip="reports.form.textfield.of_which_ben"
          content={props.policyPrioritiesProps.beneficiaryCounts.map(
            (b: BeneficiaryCountsModel) => `${b.name}: ${b.value}`
          )}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      {/* --------------------------------- */}
      {/* budget */}
      <Grid item xs={12} lg={12}>
        {/*{isMobileWidth ? (
          <PreviewCardTextField
            title="reports.form.cards.key_outcomes"
            tooltip="reports.form.cards.key_outcomes"
            content={props.indicatorVerificationProps.keyOutcomes}
          />
        ) : (
          <PreviewCard
            title="reports.form.cards.key_outcomes"
            tooltip="reports.form.cards.key_outcomes"
            content={props.indicatorVerificationProps.keyOutcomes}
          />
        )}*/}

        <PreviewCard
          title="reports.form.cards.key_outcomes"
          tooltip="reports.form.cards.key_outcomes"
          content={props.indicatorVerificationProps.keyOutcomes}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      <Grid item xs={12} lg={12}>
        {/*{isMobileWidth ? (
          <PreviewCardTextField
            title="reports.form.cards.monitor"
            tooltip="reports.form.cards.monitor_expl"
            content={props.indicatorVerificationProps.monRepOutcomes}
          />
        ) : (
          <PreviewCard
            title="reports.form.cards.monitor"
            tooltip="reports.form.cards.monitor_expl"
            content={props.indicatorVerificationProps.monRepOutcomes}
          />
        )}*/}

        <PreviewCard
          title="reports.form.cards.monitor"
          tooltip="reports.form.cards.monitor_expl"
          content={props.indicatorVerificationProps.monRepOutcomes}
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      <Grid item xs={12} lg={12}>
        {/*{isMobileWidth ? (
          <PreviewCardTextField
            title="reports.form.cards.key_implementation_challenges"
            tooltip="reports.form.cards.key_implementation_challenges"
            content={props.challengesPlansProps.keyImplChallenges}
            explanation="reports.form.cards.key_implementation_challenges_expl"
          />
        ) : (
          <PreviewCard
            title="reports.form.cards.key_implementation_challenges"
            tooltip="reports.form.cards.key_implementation_challenges"
            content={props.challengesPlansProps.keyImplChallenges}
            explanation="reports.form.cards.key_implementation_challenges_expl"
          />
        )}*/}

        <PreviewCard
          title="reports.form.cards.key_implementation_challenges"
          tooltip="reports.form.cards.key_implementation_challenges"
          content={props.challengesPlansProps.keyImplChallenges}
          explanation="reports.form.cards.key_implementation_challenges_expl"
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      <Grid item xs={12} lg={12}>
        {/*{isMobileWidth ? (
          <PreviewCardTextField
            title="reports.form.cards.other_project"
            tooltip="reports.form.cards.other_project"
            content={props.challengesPlansProps.otherProjOutObs}
            explanation="reports.form.cards.other_project_expl"
          />
        ) : (
          <PreviewCard
            title="reports.form.cards.other_project"
            tooltip="reports.form.cards.other_project"
            content={props.challengesPlansProps.otherProjOutObs}
            explanation="reports.form.cards.other_project_expl"
          />
        )}*/}

        <PreviewCard
          title="reports.form.cards.other_project"
          tooltip="reports.form.cards.other_project"
          content={props.challengesPlansProps.otherProjOutObs}
          explanation="reports.form.cards.other_project_expl"
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      <Grid item xs={12} lg={12}>
        {/*{isMobileWidth ? (
          <PreviewCardTextField
            title="reports.form.cards.future_plans"
            tooltip="reports.form.cards.future_plans"
            content={props.challengesPlansProps.futurePlans}
            explanation="reports.form.cards.future_plans_expl"
          />
        ) : (
          <PreviewCard
            title="reports.form.cards.future_plans"
            tooltip="reports.form.cards.future_plans"
            content={props.challengesPlansProps.futurePlans}
            explanation="reports.form.cards.future_plans_expl"
          />
        )}*/}

        <PreviewCard
          title="reports.form.cards.future_plans"
          tooltip="reports.form.cards.future_plans"
          content={props.challengesPlansProps.futurePlans}
          explanation="reports.form.cards.future_plans_expl"
        />
      </Grid>

      <Hidden smUp>
        <div
          css={`
            width: 100%;
            height: 25px;
          `}
        />
      </Hidden>

      <Grid item xs={12} lg={12}>
        {/* {isMobileWidth ? (
          <PreviewCardTextField
            title="reports.form.cards.other_comments"
            tooltip="reports.form.cards.other_comments"
            content={props.challengesPlansProps.otherComms}
            explanation="reports.form.cards.other_comments_expl"
          />
        ) : (
          <PreviewCard
            title="reports.form.cards.other_comments"
            tooltip="reports.form.cards.other_comments"
            content={props.challengesPlansProps.otherComms}
            explanation="reports.form.cards.other_comments_expl"
          />
        )}*/}

        <PreviewCard
          title="reports.form.cards.other_comments"
          tooltip="reports.form.cards.other_comments"
          content={props.challengesPlansProps.otherComms}
          explanation="reports.form.cards.other_comments_expl"
        />
      </Grid>
      <div
        css={`
          width: 100%;
          height: 54px;
        `}
      />
    </React.Fragment>
  );
};
