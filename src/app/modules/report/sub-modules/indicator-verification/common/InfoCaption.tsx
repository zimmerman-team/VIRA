import 'styled-components/macro';
import React from 'react';
import { Typography } from '@material-ui/core';
import { TextStyle } from 'app/theme';

export interface InfoCaptionParams {
  text: string;
}

export const InfoCaption = (props: InfoCaptionParams) => (
  <Typography
    css={`
      font-size: 0.8571428571428571rem;
      font-weight: ${TextStyle.fontWeightLight};
      line-height: 1.33;
      letter-spacing: 0.42px;
      color: #185568;
    `}
  >
    {props.text}
  </Typography>
);
