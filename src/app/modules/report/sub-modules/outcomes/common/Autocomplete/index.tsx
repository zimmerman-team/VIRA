/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import 'styled-components/macro';
import { ProjectPalette } from 'app/theme';
import { Box, InputBase } from '@material-ui/core';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { getInputGeneralStyle } from 'app/components/inputs/common/mock';
import { ExpandMore } from '@material-ui/icons';
import {
  Theme,
  withStyles,
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';
import { FieldDescription } from 'app/modules/report/sub-modules/indicator-verification/common/FieldDescription';

export interface AutocompleteParams {
  description?: string;
  value: { label: string; value: string };
  setValue: Function;
  text?: string;
  values: any[];
}

const Input = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
        color: ProjectPalette.text.primary,
      },
      backgroundColor: '#f0f3f7',
    },
    input: getInputGeneralStyle(theme),
    inputMultiline: {
      minHeight: '160px',
      lineHeight: '2rem',
      paddingBottom: '30px',
    },
    inputLabel: {
      root: {},
    },
  })
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '100%',
    },
    listbox: {
      width: '100%',
      margin: 0,
      padding: 0,
      zIndex: 1,
      position: 'absolute',
      listStyle: 'none',
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
      maxHeight: 300,
      borderRadius: 2,
      boxShadow:
        '0 4px 14px -2px rgba(130, 136, 148, 0.28), 0 0 2px 0 rgba(130, 136, 148, 0.22)',
      '& li[data-focus="true"]': {
        cursor: 'pointer',
        color: ProjectPalette.common.white,
        backgroundColor: ProjectPalette.primary.main,
      },
      '& li:active': {
        color: ProjectPalette.common.white,
        backgroundColor: ProjectPalette.primary.main,
      },
    },
    listitem: {
      padding: 6,
      fontSize: 14,
      fontWeight: 'normal',
    },
  })
);

export const Autocomplete = (props: AutocompleteParams) => {
  const classes = useStyles();
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    value: props.value,
    id: 'autocomplete-countries',
    options: props.values,
    getOptionLabel: option => option.label,
  });

  return (
    <div
      {...getRootProps()}
      css={`
        width: 100%;
        position: relative;
      `}
    >
      {props.description && (
        <>
          <FieldDescription text={props.description} />
          <Box width="100%" height="20px" />
        </>
      )}

      <Input
        fullWidth
        {...getInputProps()}
        placeholder="Type"
        endAdornment={
          <ExpandMore
            css={`
              margin-right: 10px;
            `}
          />
        }
      />
      {groupedOptions.length > 0 ? (
        <ul
          className={classes.listbox}
          {...getListboxProps()}
          css={`
            &::-webkit-scrollbar {
              width: 6px;
              border-radius: 50%;
            }
            &::-webkit-scrollbar-track {
              background: transparent;
            }
            &::-webkit-scrollbar-thumb {
              background: ${ProjectPalette.grey[400]};
            }
          `}
        >
          {groupedOptions.map((option, index) => {
            const optionProps: any = getOptionProps({ option, index });
            const onClick = (e: any) => {
              props.setValue(option);
              optionProps.onClick(e);
            };
            return (
              <li
                {...optionProps}
                onClick={onClick}
                className={classes.listitem}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
