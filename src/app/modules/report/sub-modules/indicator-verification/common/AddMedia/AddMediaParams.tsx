/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import 'styled-components/macro';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { ProjectPalette } from 'app/theme';
import { MediaModel } from 'app/modules/report/model';
import { useTranslation } from 'react-i18next';

export interface AddMediaParams {
  name: string;
  items: MediaModel;
  onClose: Function;
  onChange: Function;
  onSaveMedia: Function;
}

interface AddMediaNavItemParams {
  text: string;
  onClick: Function;
  active: boolean;
}

export const AddMediaNavItem = (props: AddMediaNavItemParams) => (
  <div
    onClick={() => props.onClick(props.text.toLowerCase())}
    css={`
      cursor: pointer;
      padding: 0 15px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: 1.25px;
      color: ${ProjectPalette.common.white};
      background: ${props.active
        ? ProjectPalette.secondary.main
        : 'transparent'};
    `}
  >
    {props.text}
  </div>
);

export const AddMediaNavContainer = (props: {
  selectedTab: string;
  onClick: Function;
}) => (
  <div
    css={`
      background-color: #20293c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 300px;
      height: 35px;
      padding: 5px;
    `}
  >
    <AddMediaNavItem
      text="Document"
      active={props.selectedTab === 'document'}
      onClick={props.onClick}
    />
    <AddMediaNavItem
      text="Video"
      active={props.selectedTab === 'video'}
      onClick={props.onClick}
    />
    <AddMediaNavItem
      text="Picture"
      active={props.selectedTab === 'picture'}
      onClick={props.onClick}
    />
  </div>
);

export interface AddMediaButtonParams {
  text: string;
  onClick: Function;
}

export const AddMediaButton = (props: AddMediaButtonParams) => {
  return (
    <div
      onClick={() => props.onClick()}
      css={`
        font-size: 14px;
        font-weight: 600;
        line-height: 1.71;
        letter-spacing: 1.25px;
        color: white;
        width: 112px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #30c2b0;
        cursor: pointer;
      `}
    >
      {props.text}
    </div>
  );
};

export const AddMediaInputField = (props: { text: string }) => (
  <Grid
    item
    lg={12}
    css={`
      display: flex;
      border: solid 1px #30c2b0;
      background-color: #20293c;
      height: 35px;
      justify-content: flex-start;
      align-items: center;
      color: ${ProjectPalette.common.white};
      margin-bottom: 12px;
      font-size: 12px;
      line-height: 1.33;
      letter-spacing: 0.42px;
      padding-left: 10px;
      overflow: hidden;
    `}
  >
    {props.text}
  </Grid>
);

export const AddMediaInputFieldLabel = (props: { text: string }) => (
  <Grid
    item
    lg={12}
    css={`
      font-size: 17px;
      font-weight: 300;
      color: #ffffff;
      height: 35px;
      text-transform: capitalize;
    `}
  >
    {props.text}
  </Grid>
);

export const getAcceptString = (type: string) => {
  if (type === 'picture') {
    return 'image/*';
  }
  if (type === 'video') {
    return 'video/*';
  }
  if (type === 'document') {
    return 'application/msword,	application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain, application/pdf';
  }
  return '';
};

export const AddMediaBigButton = (props: {
  text: string;
  onChange: Function;
}) => {
  const [active, setActive] = React.useState(false);

  const onDragEnter = () => {
    setActive(true);
  };

  const onDragLeave = () => {
    setActive(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(true);
  };

  const onDrop = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();
    setActive(false);
    props.onChange(e, props.text);
  };

  return (
    <>
      <div
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        css={`
          width: 300px;
          display: flex;
          height: 250px;
          font-size: 16px;
          font-weight: 300;
          line-height: 1.5;
          border-width: 2px;
          align-self: center;
          align-items: center;
          border-radius: 10px;
          border-style: dashed;
          letter-spacing: 0.5px;
          flex-direction: column;
          justify-content: center;
          background-color: #20293c;
          opacity: ${active ? 0.5 : 1};
          color: ${ProjectPalette.common.white};
          border-color: ${ProjectPalette.secondary.main};
        `}
      >
        Drag and Drop {props.text}
        <span>or</span>
        <label
          htmlFor="file-input"
          css={`
            display: flex;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 10px;
            color: ${ProjectPalette.secondary.main};

            &:hover {
              text-decoration: underline;
            }
          `}
        >
          browse {props.text}
        </label>
      </div>
      <input
        id="file-input"
        css={`
          display: none;
        `}
        multiple
        type="file"
        name="file"
        accept={getAcceptString(props.text)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          props.onChange(e, props.text)
        }
      />
    </>
  );
};

export interface AddMediaCloseButtonParams {
  onClick: Function;
}

export const AddMediaCloseButton = (props: AddMediaCloseButtonParams) => (
  <div
    onClick={() => props.onClick()}
    css={`
      width: 20px;
      height: 20px;
      background-color: #657d95;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    `}
  >
    <CloseIcon fontSize="small" />
  </div>
);

export const AddMediaTitle = () => {
  const { t } = useTranslation();
  return (
    <Typography
      css={`
        color: white;
        font-size: 20px;
        font-weight: 300;
      `}
    >
      {t('reports.form.media_modal.title')}
    </Typography>
  );
};
