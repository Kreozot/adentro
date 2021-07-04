/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import { Provider } from 'react-redux';

import { store } from './src/store/store';

export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>;
};
