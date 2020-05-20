import React from 'react';
import 'styled-components/macro';
import {
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { BeneficiaryCountsModel } from 'app/modules/report/model';
import { InfoCaption } from './InfoCaption';
import { useTranslation } from 'react-i18next';

export interface PriorityOptionParams {
  onChange: Function;
  description: string;
  explanation?: string;
  options: BeneficiaryCountsModel[];
}

export const PolicyPriorityOptions = (props: PriorityOptionParams) => {
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="textPrimary">
        {props.description}
      </Typography>
      <Grid container>
        {props.options.map(
          (checkbox: BeneficiaryCountsModel, index: number) => (
            <Grid item key={checkbox.name} lg={6}>
              <FormControlLabel
                label={checkbox.name}
                control={<Checkbox />}
                checked={checkbox.value as boolean}
                onChange={(e: any, checked: boolean) => {
                  const values = [...props.options];
                  values[index].value = checked;
                  props.onChange(values);
                }}
              />
            </Grid>
          )
        )}
      </Grid>
      {props.explanation && <InfoCaption text={props.explanation} />}
    </React.Fragment>
  );
};
