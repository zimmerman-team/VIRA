import React from 'react';
import get from 'lodash/get';
import Badge from '@material-ui/core/Badge';
import { css } from 'styled-components/macro';
import CloseIcon from '@material-ui/icons/Close';
import { MediaModel } from 'app/modules/report/model';
import { getMediaIcon } from './utils';

type MediaBlockProps = {
  items: MediaModel;
  removeItem: Function;
  addedMedia: any;
};

const styles: any = {
  container: css`
    display: flex;
    flex-direction: row;
  `,
  itemContainer: css`
    margin-right: 32px;
  `,
  item: css`
    display: flex;
    max-width: 82px;
    flex-direction: column;
  `,
  itemLabel: css`
    width: 100%;
    margin-top: 10px;
    text-align: center;
  `,
};

export const MediaBlock = (props: MediaBlockProps) => {
  return (
    <div css={styles.container}>
      {props.addedMedia.map((item: any) => {
        const nameSplits = item.path.split('-');
        const name = nameSplits[nameSplits.length - 1];
        return (
          <div css={styles.itemContainer}>
            <Badge
              key={`${item.path}-${Math.random()}`}
              badgeContent={
                <CloseIcon
                  fontSize="small"
                  css={`
                    cursor: pointer;
                  `}
                  onClick={() => props.removeItem(item.path)}
                />
              }
            >
              <div css={styles.item}>
                {getMediaIcon(name)}
                <div css={styles.itemLabel}>{name}</div>
              </div>
            </Badge>
          </div>
        );
      })}
    </div>
  );
};
