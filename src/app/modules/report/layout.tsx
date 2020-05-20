// @ts-nocheck
import React from 'react';
import { css } from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Box, Hidden } from '@material-ui/core';
import { ReportModuleRoutes } from 'app/modules/report/routes';
import { BottomNav } from 'app/modules/report/common/bottom-nav';
import { CreateReportLayoutModel } from 'app/modules/report/model';
import { BreadCrumbs } from 'app/components/navigation/Breadcrumbs';
import { HorizontalStepper } from 'app/components/navigation/HorizontalStepper';
import { PageLoader } from 'app/modules/common/page-loader';
import { Dialog } from 'app/components/surfaces/Dialog';

const ReportTitleStyle = css`
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
`;

export function CreateReportLayout(props: CreateReportLayoutModel) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {props.loading && <PageLoader />}
      <Dialog {...props.dialogProps} />
      <Dialog {...props.delDialogProps} />
      {/* ---------------------------------------------------------------------*/}
      {/* breadcrumbs */}
      <Grid item lg={12}>
        <BreadCrumbs {...props.breadcrumbs} />
      </Grid>

      {/* ---------------------------------------------------------------------*/}
      {/* title fragment */}
      <Grid item container lg={12} direction="column">
        <Typography data-cy="report-title" css={ReportTitleStyle}>
          {t('reports.form.title')}
        </Typography>
      </Grid>

      {/* ---------------------------------------------------------------------*/}
      {/* title fragment */}
      <Grid
        data-cy="report-stepper"
        item
        xs={12}
        lg={12}
        css={`
          overflow-x: scroll;
        `}
      >
        <HorizontalStepper
          steps={props.tabs}
          onStepChange={props.changeRoute}
          initialTabIndex={props.initialTabIndex}
        />
      </Grid>
      <Hidden smDown>
        <Box width="100%" height="20px" />
      </Hidden>

      <ReportModuleRoutes
        step2Enabled={props.step2Enabled}
        step3Enabled={props.step3Enabled}
        step4Enabled={props.step4Enabled}
        step5Enabled={props.step5Enabled}
        outcomesProps={props.outcomesProps}
        policyPrioritiesProps={props.policyPrioritiesProps}
        indicatorVerificationProps={props.indicatorVerificationProps}
        challengesPlansProps={props.challengesPlansProps}
      />

      <BottomNav
        submit={props.submit}
        saveDraft={props.saveDraft}
        next={props.onNextBtnClick}
        back={props.onBackBtnClick}
        showSubmitBtn={props.showSubmitBtn}
        nextDisabled={props.nextBtnDisabled}
        backDisabled={props.backBtnDisabled}
        showDraftSubmitBtn={props.showDraftSubmitBtn}
        showDeleteBtn={props.showDeleteBtn}
        deleteReport={props.deleteReport}
      />
    </React.Fragment>
  );
}
