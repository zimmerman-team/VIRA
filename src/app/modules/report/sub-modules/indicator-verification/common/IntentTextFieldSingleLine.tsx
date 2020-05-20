import React from 'react';
import 'styled-components/macro';
import { Typography } from '@material-ui/core';
import { SingleMultiLineTextField } from 'app/components/inputs/textfields/SingleMultiLineTextField';

export interface IntentTexFieldSingleLineParams {
  description: string;
  tooltip?: string;
  text?: string;
  explanation?: string;
  componentID?: string;
  value: number;
  setValue: Function;
  type?: string;
  min?: number;
  disabled?: boolean;
  smallWidth?: boolean;
  fullWidth?: boolean;
  testAttr?: string;
}

export const IntentTexFieldSingleLine = (
  props: IntentTexFieldSingleLineParams
) => (
  <React.Fragment>
    <div
      css={`
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      `}
    >
      <Typography
        css={`
          width: ${props.description.length > 0 ? '60%' : 0};
          font-size: 14px;
          line-height: 1.71;
          letter-spacing: 0.25px;
        `}
        variant="subtitle2"
        color="textPrimary"
      >
        {props.description}
      </Typography>

      <SingleMultiLineTextField
        value={props.value}
        id={props.componentID}
        setValue={props.setValue}
        fullWidth={props.fullWidth}
        type={props.type || 'text'}
        min={props.min}
        testAttr={props.testAttr}
        css={`
          width: ${props.smallWidth ? '88px' : ''};
          height: ${props.smallWidth ? '32px' : ''};
        `}
        disabled={props.disabled}
      />
    </div>
  </React.Fragment>
);
