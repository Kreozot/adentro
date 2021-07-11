export const COLORS = {
  adentroGrey: '#939393',
  adentroBlue: '#0094FF',
  background: '#FFF',
};

export const BREAKPOINTS = {
  S: 600,
  M: 768,
  L: 1030,
};

export const MEDIA = {
  S: `@media only screen and (max-width: ${BREAKPOINTS.S}px)`,
  M: `@media only screen and (max-width: ${BREAKPOINTS.M}px)`,
  L: `@media only screen and (max-width: ${BREAKPOINTS.L}px)`,
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
