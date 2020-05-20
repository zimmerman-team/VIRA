import React from 'react';
import { css } from 'styled-components/macro';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ChallengesPlansPropsModel } from 'app/modules/report/model';
import { IntentTexArea } from 'app/modules/report/sub-modules/indicator-verification/common/IntentTextArea';
import { ChallengeAreaMock } from './mock';

const styles: any = {
  card: css`
    width: 100%;
    height: 100%;
    overflow: visible;
  `,
  infoText: css`
    bottom: 0;
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
  `,
  gridMobile: css`
    padding-top: 0 !important;
  `,
};

export const ChallengesPlansLayout = (props: ChallengesPlansPropsModel) => {
  const { t } = useTranslation();
  const isMobileWidth = useMediaQuery('(max-width: 600px)');

  return (
    <React.Fragment>
      {/* ---------------------------------------------------------------------*/}
      {/* textareas */}
      <Grid item container lg={12} alignItems="center">
        <Card css={styles.card}>
          <CardContent>
            <IntentTexArea
              testAttr="text-area-1"
              {...ChallengeAreaMock[0]}
              explanation=""
              description={t(ChallengeAreaMock[0].description)}
              tooltip={t(ChallengeAreaMock[0].description)}
              value={props.keyImplChallenges}
              setValue={props.setKetImplChallenges}
            />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t(ChallengeAreaMock[0].explanation || '')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        container
        lg={12}
        alignItems="center"
        css={isMobileWidth && styles.gridMobile}
      >
        <Card css={styles.card}>
          <CardContent>
            <IntentTexArea
              testAttr="text-area-2"
              {...ChallengeAreaMock[1]}
              explanation=""
              description={t(ChallengeAreaMock[1].description)}
              tooltip={t(ChallengeAreaMock[1].description)}
              value={props.otherProjOutObs}
              setValue={props.setOtherProjOutObs}
            />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t(ChallengeAreaMock[1].explanation || '')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        container
        lg={12}
        alignItems="center"
        css={isMobileWidth && styles.gridMobile}
      >
        <Card css={styles.card}>
          <CardContent>
            <IntentTexArea
              testAttr="text-area-3"
              {...ChallengeAreaMock[2]}
              explanation=""
              description={t(ChallengeAreaMock[2].description)}
              tooltip={t(ChallengeAreaMock[2].description)}
              value={props.futurePlans}
              setValue={props.setFuturePlans}
            />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t(ChallengeAreaMock[2].explanation || '')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid
        item
        container
        lg={12}
        alignItems="center"
        css={isMobileWidth && styles.gridMobile}
      >
        <Card css={styles.card}>
          <CardContent>
            <IntentTexArea
              testAttr="text-area-4"
              {...ChallengeAreaMock[3]}
              explanation=""
              description={t(ChallengeAreaMock[3].description)}
              tooltip={t(ChallengeAreaMock[3].description)}
              value={props.otherComms}
              setValue={props.setOtherComms}
            />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t(ChallengeAreaMock[3].explanation || '')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  );
};
