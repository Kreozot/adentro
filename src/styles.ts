export const COLORS = {
  adentroGrey: '#939393',
  adentroBlue: '#0094FF',
};

export const BREAKPOINTS = {
  S: '600px',
  M: '768px',
  L: '1030px',
};

export const MEDIA = {
  S: `@media only screen and (max-width: ${BREAKPOINTS.S})`,
  M: `@media only screen and (max-width: ${BREAKPOINTS.M})`,
  L: `@media only screen and (max-width: ${BREAKPOINTS.L})`,
};

export const INTERVALS = {
  SMALL: '8px',
  MEDIUM: '16px',
  BIG: '24px',
  HUGE: '32px',
};

export const INDENTS = {
  OUTER: {
    HORIZONTAL: INTERVALS.MEDIUM,
    VERTICAL: INTERVALS.SMALL,
  },
  INNER: {
    HORIZONTAL: INTERVALS.MEDIUM,
    VERTICAL: INTERVALS.SMALL,
  },
};

export const TRANSITION_TIME = '0.3s';
