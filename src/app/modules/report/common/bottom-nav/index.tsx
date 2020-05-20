/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from '@material-ui/icons';
import { ContainedButton } from 'app/components/inputs/buttons/ContainedButton';
import styled from 'styled-components';
import { css } from 'styled-components/macro';
import { useMediaQuery, Box, Grid } from '@material-ui/core';
import { useQuery } from 'app/utils/useQuery';

type BottomNavModel = {
  next: Function;
  back: Function;
  submit: Function;
  saveDraft: Function;
  nextDisabled: boolean;
  backDisabled: boolean;
  showDeleteBtn: boolean;
  deleteReport: Function;
  showSubmitBtn: boolean;
  showDraftSubmitBtn: boolean;
};

const Container = styled.div`
  bottom: 0;
  width: 100%;
  display: flex;
  margin-top: 50px;
  position: sticky;
  padding: 20px 32px;
  flex-direction: row;
  background-color: #fafafa;
  justify-content: space-between;
`;

const mobileBackStyle: any = css`
  max-width: 48px;
  min-width: 48px;
  max-height: 48px;
  min-height: 48px;
`;

const mobileButton: any = css`
  && {
    max-height: 48px;
    min-height: 48px;
    max-width: 132px;
  }
`;

const gridItem: any = css`
  && {
    display: flex;
  }
`;

export function BottomNav(props: BottomNavModel) {
  const query = useQuery();
  const { t } = useTranslation();
  const isMobileWidth = useMediaQuery('(max-width: 600px)');

  return (
    <Grid container item xs={12} lg={12} justify="space-between" wrap="nowrap">
      <Grid item xs={3}>
        <ContainedButton
          text={isMobileWidth ? '' : t('reports.form.buttons.back')}
          icon={isMobileWidth && <ChevronLeft />}
          onClick={props.back}
          disabled={props.backDisabled}
          css={isMobileWidth && mobileBackStyle}
        />
      </Grid>
      <Grid item xs={9} justify="flex-end" css={gridItem}>
        {props.showDeleteBtn && (
          <React.Fragment>
            <ContainedButton
              text={t('reports.form.buttons.delete')}
              onClick={props.deleteReport}
              css={`
                && {
                  background: #ef5350;
                  &:hover {
                    background: #e57373 !important;
                  }
                  ${isMobileWidth &&
                    `max-height: 48px;
                  min-height: 48px;
                  max-width: 132px;`}
                }
              `}
            />
            <Box width={`${isMobileWidth ? '8px' : '24px'}`} />
          </React.Fragment>
        )}
        {props.showDraftSubmitBtn && (
          <React.Fragment>
            <ContainedButton
              text={t('reports.form.buttons.draft')}
              onClick={props.saveDraft}
              css={isMobileWidth && mobileButton}
            />
            <Box width={`${isMobileWidth ? '8px' : '24px'}`} />
          </React.Fragment>
        )}
        {props.showSubmitBtn ? (
          <ContainedButton
            text={t(
              `reports.form.buttons.${query.get('rid') ? 'save' : 'submit'}`
            )}
            onClick={props.submit}
            css={isMobileWidth && mobileButton}
          />
        ) : (
          <ContainedButton
            text={t('reports.form.buttons.next')}
            onClick={props.next}
            disabled={props.nextDisabled}
            css={isMobileWidth && mobileButton}
          />
        )}
      </Grid>
    </Grid>
  );
}
