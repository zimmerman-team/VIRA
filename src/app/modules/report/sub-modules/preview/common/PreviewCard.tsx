import React from 'react';
import { css } from 'styled-components/macro';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { TooltipButton as Tooltip } from 'app/components/datadisplay/Tooltip';
import { FieldDescription } from 'app/modules/report/sub-modules/indicator-verification/common/FieldDescription';
import { useTranslation } from 'react-i18next';

export type Props = {
  title: string;
  tooltip?: string;
  explanation?: string;
  content: string | string[] | number;
};

const styles: any = {
  card: css`
    width: 100%;
    height: 100%;
    min-height: 152px;
    padding: 12px !important;
  `,
  cardMobile: css`
    width: 100%;
    height: 100%;
    box-shadow: none !important;
    padding: 0 !important;
  `,
  header: css`
    display: flex;
    align-items: center;
  `,
  cardContent: css`
    font-size: 14px;
    padding: 0px !important;
  `,
  infoText: css`
    bottom: 0;
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
  `,
  spacer: css`
    width: 100%;
    height: 28px;
  `,
  mobileSpacer: css`
    width: 100%;
    height: 16px;
  `,
  textArea: css`
    width: 100%;
    min-height: 117px;
    background-color: #f0f3f7;
    padding: 12px;
  `,
};

export const PreviewCard = (props: Props) => {
  const { t, i18n } = useTranslation();
  const isMobileWidth = useMediaQuery('(max-width: 600px)');

  return (
    <Card css={isMobileWidth ? styles.cardMobile : styles.card}>
      <div css={styles.header}>
        <FieldDescription text={t(props.title)} />
        {props.tooltip && <Tooltip tip={t(props.tooltip)} />}
      </div>

      <div css={isMobileWidth ? styles.mobileSpacer : styles.spacer} />
      <CardContent css={styles.cardContent}>
        {typeof props.content === 'string' ||
        typeof props.content === 'number' ? (
          props.content
        ) : (
          <Grid container spacing={2}>
            {props.content.map((item: string) => (
              <Grid item key={item} xs={12} lg={6}>
                {item}
              </Grid>
            ))}
          </Grid>
        )}
        {!isMobileWidth && (
          <>
            <div css={styles.spacer} />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t(props.explanation || '')}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const PreviewCardTextField = (props: Props) => {
  const { t, i18n } = useTranslation();
  const isMobileWidth = useMediaQuery('(max-width: 600px)');

  return (
    <Card css={isMobileWidth ? styles.cardMobile : styles.card}>
      <div css={styles.header}>
        <FieldDescription text={t(props.title)} />
        {props.tooltip && <Tooltip tip={t(props.tooltip)} />}
      </div>

      <div css={isMobileWidth ? styles.mobileSpacer : styles.spacer} />
      <CardContent css={styles.cardContent}>
        {typeof props.content === 'string' ||
        typeof props.content === 'number' ? (
          <div css={styles.textArea}>{props.content}</div>
        ) : (
          <Grid container spacing={2}>
            {props.content.map((item: string) => (
              <Grid item key={item} xs={12} lg={6}>
                {item}
              </Grid>
            ))}
          </Grid>
        )}
        {!isMobileWidth && (
          <>
            <div css={styles.spacer} />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t(props.explanation || '')}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};
