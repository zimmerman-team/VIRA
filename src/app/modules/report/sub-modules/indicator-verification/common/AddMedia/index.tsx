import 'styled-components/macro';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useBeforeUnload } from 'react-use';
import { useTranslation } from 'react-i18next';

import {
  AddMediaParams,
  AddMediaNavContainer,
  AddMediaInputFieldLabel,
  AddMediaInputField,
  AddMediaButton,
  AddMediaCloseButton,
  AddMediaBigButton,
  AddMediaTitle,
} from './AddMediaParams';

export const AddMediaLayout = (props: AddMediaParams) => {
  useBeforeUnload(
    props.items.document.length > 0 ||
      props.items.picture.length > 0 ||
      props.items.video.length > 0,
    'Media files are not saved. If you click Reload they will be lost.'
  );
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab]: [
    'picture' | 'video' | 'document',
    Function
  ] = React.useState('picture');
  const filesToShow: any[] = [];
  for (let i = 0; i < props.items[selectedTab].length; i++) {
    filesToShow.push(props.items[selectedTab][i]);
  }
  return (
    <React.Fragment>
      <Grid
        item
        container
        xs={12}
        lg={6}
        css={`
          background-color: #2f3b52;
        `}
        spacing={4}
      >
        <Grid
          item
          container
          lg={12}
          justify="flex-end"
          css={`
            && {
              padding-bottom: 0;
            }
          `}
        >
          <AddMediaCloseButton onClick={props.onClose} />
        </Grid>
        <Grid
          item
          container
          xs={12}
          css={`
            && {
              margin: 0;
              padding: 40px;
            }
          `}
          spacing={4}
        >
          <Grid
            item
            lg={12}
            css={`
              && {
                padding-top: 0;
              }
            `}
          >
            <AddMediaTitle />
          </Grid>
          <Grid item container lg={12} justify="center" alignItems="center">
            <AddMediaNavContainer
              selectedTab={selectedTab}
              onClick={setSelectedTab}
            />
          </Grid>
          <Grid item container lg={12} justify="center">
            <Grid
              item
              lg={5}
              justify="center"
              alignItems="center"
              css={
                filesToShow.length === 0
                  ? `
                && {
                  flex-basis: auto;
                }
              `
                  : ''
              }
            >
              <AddMediaBigButton text={selectedTab} onChange={props.onChange} />
            </Grid>
            {filesToShow.length > 0 && (
              <Grid
                item
                container
                lg={5}
                justify="flex-start"
                alignItems="flex-start"
                direction="row"
                css={`
                  height: 70px;
                `}
              >
                <AddMediaInputFieldLabel text={selectedTab} />
                {filesToShow.map(file => (
                  <AddMediaInputField key={file.name} text={file.name} />
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item container lg={12} justify="flex-end">
          <Grid item container xs={8} md={6} lg={4} justify="space-around">
            <AddMediaButton
              text={t('reports.form.buttons.cancel')}
              onClick={props.onClose}
            />
            <AddMediaButton
              text={t('reports.form.buttons.save')}
              onClick={props.onSaveMedia}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
