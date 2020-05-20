import { Box } from '@material-ui/core';
import { TooltipButton as Tooltip } from 'app/components/datadisplay/Tooltip';
import { SingleMultiLineTextField } from 'app/components/inputs/textfields/SingleMultiLineTextField';
import React from 'react';
import 'styled-components/macro';
import { InfoCaption } from './InfoCaption';
import { FieldDescription } from './FieldDescription';

export interface IntentTextAreaParams {
  description: string;
  tooltip?: string;
  text?: string;
  explanation?: string;
  componentID?: string;
  value: string;
  setValue: Function;
  testAttr?: string;
}

export const IntentTexArea = (props: IntentTextAreaParams) => (
  <React.Fragment>
    <div
      css={`
        display: flex;
        align-items: center;

        @media (max-width: 768px) {
          align-items: flex-start;
        }
      `}
    >
      <FieldDescription text={props.description} />
      {props.tooltip && <Tooltip tip={props.tooltip} />}
    </div>
    <Box width="100%" height="20px" />
    <SingleMultiLineTextField
      testAttr={props.testAttr}
      fullWidth
      multiline
      // placeholder="Type"
      value={props.value}
      id={props.componentID}
      setValue={props.setValue}
    />
    {props.explanation && (
      <React.Fragment>
        <InfoCaption text={props.explanation} />{' '}
        <Box width="100%" height="30px" />{' '}
      </React.Fragment>
    )}
  </React.Fragment>
);
