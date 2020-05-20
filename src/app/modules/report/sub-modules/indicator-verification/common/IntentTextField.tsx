import { Box } from '@material-ui/core';
import { TooltipButton as Tooltip } from 'app/components/datadisplay/Tooltip';
import { SingleMultiLineTextField } from 'app/components/inputs/textfields/SingleMultiLineTextField';
import React from 'react';
import 'styled-components/macro';
import { InfoCaption } from './InfoCaption';
import { FieldDescription } from './FieldDescription';

export interface IntentTextFieldParams {
  description?: string;
  placeholder?: string;
  value: string;
  setValue: Function;
  tooltip?: string;
  text?: string;
  explanation?: string;
  componentID?: string;
  testAttr?: string;
}

export const IntentTexField = (props: IntentTextFieldParams) => (
  <React.Fragment>
    {props.description && (
      <>
        <FieldDescription text={props.description} />
        {props.tooltip && <Tooltip tip={props.tooltip} />}
        <Box width="100%" height="20px" />
      </>
    )}
    <SingleMultiLineTextField
      testAttr={props.testAttr}
      fullWidth
      placeholder={props.placeholder}
      value={props.value}
      id={props.componentID}
      setValue={props.setValue}
    />
    {props.explanation && (
      <React.Fragment>
        <InfoCaption text={props.explanation} />{' '}
        <Box width="100%" height="30px" />
      </React.Fragment>
    )}
  </React.Fragment>
);
