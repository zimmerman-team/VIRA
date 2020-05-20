import { css } from 'styled-components/macro';
export const styles: any = {
  card: css`
    height: 100%;
    overflow: visible;
  `,
  input: css`
    [class*='-input'] {
      width: 90px;
    }
  `,
  infoText: css`
    bottom: 0;
    font-size: 12px;
    font-weight: 300;
  `,
  blurBlock: css`
    opacity: 0.2;
    pointer-events: none;
  `,
  gridMobile: css`
    padding-top: 0 !important;
  `,
};
