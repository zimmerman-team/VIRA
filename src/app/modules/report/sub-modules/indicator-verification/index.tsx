import React from 'react';
import { css } from 'styled-components/macro';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  Grid,
  Box,
  Modal,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Hidden,
} from '@material-ui/core';
import { ContainedButton } from 'app/components/inputs/buttons/ContainedButton';
import { useTranslation } from 'react-i18next';
import { IntentTexArea } from './common/IntentTextArea';
import { IndicatorVerificationPropsModel } from '../../model';
import { AddMediaLayout } from './common/AddMedia';
import { MediaBlock } from './common/MediaBlock';

const styles: any = {
  card: css`
    height: 100%;
    overflow: visible;
  `,
  infoText: css`
    font-style: normal;
    font-weight: 300;
    font-size: 12px;
    bottom: 0;
  `,
};

export const IndicatorVerificationLayout = (
  props: IndicatorVerificationPropsModel
) => {
  const { t } = useTranslation();
  const isMobileWidth = useMediaQuery('(max-width: 600px)');

  return (
    <React.Fragment>
      {/* ---------------------------------------------------------------------*/}
      {/* textarea 1 */}
      <Grid item xs={12} lg={12}>
        <Card css={styles.card}>
          <CardContent>
            <IntentTexArea
              testAttr="text-area-1"
              componentID="indVer1"
              value={props.keyOutcomes}
              setValue={props.setKeyOutcomes}
              tooltip={t('reports.form.cards.key_outcomes')}
              description={t('reports.form.cards.key_outcomes')}
            />
          </CardContent>
        </Card>
      </Grid>

      <Hidden smDown>
        <Box height="84px" width="100%" />
      </Hidden>
      {/* ---------------------------------------------------------------------*/}
      {/* textarea 1 */}
      <Grid item xs={12} lg={12} css={isMobileWidth && styles.gridItem}>
        <Card css={styles.card}>
          <CardContent>
            <IntentTexArea
              testAttr="text-area-2"
              componentID="indVer2"
              value={props.monRepOutcomes}
              setValue={props.setMonRepOutcomes}
              tooltip={t('reports.form.cards.monitor')}
              description={t('reports.form.cards.monitor')}
            />
            <Typography variant="body2" color="secondary" css={styles.infoText}>
              {t('reports.form.cards.monitor_expl')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Hidden smDown>
        <Box height="72px" width="100%" />
      </Hidden>
      {/* ---------------------------------------------------------------------*/}
      {/* add media button 1 */}
      <Grid item xs={12} lg={12}>
        <ContainedButton
          text={t('reports.form.cards.media')}
          icon={<GetAppIcon />}
          onClick={() => props.setOpenMediaModal(true)}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <MediaBlock
          items={props.media}
          addedMedia={props.mediaAdded}
          removeItem={props.removeMedia}
        />
      </Grid>

      {/* ---------------------------------------------------------------------*/}
      {/* add media modal 1 */}
      <Modal open={props.openMediaModal} onClose={() => props.onDialogCancel()}>
        <div
          css={`
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <AddMediaLayout
            name={t('name')}
            items={props.media}
            onChange={props.setMedia}
            onSaveMedia={props.onSaveMedia}
            onClose={() => props.onDialogCancel()}
          />
        </div>
      </Modal>

      <Hidden smDown>
        <Box width="100%" height="40px" />
      </Hidden>
    </React.Fragment>
  );
};
