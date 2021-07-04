import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DanceId } from '../schemes';
import { LocaleId } from '../locale';

interface AppState {
  localeId: LocaleId;
  danceId: DanceId;
}

const initialState: AppState = {
  localeId: 'ru',
  danceId: 'chacarera',
};

export const counterSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setLocaleId: (state, action: PayloadAction<LocaleId>) => {
      return {
        ...state,
        localeId: action.payload,
      };
    },
    setDanceId: (state, action: PayloadAction<DanceId>) => {
      return {
        ...state,
        danceId: action.payload,
      };
    },
  },
});

export default counterSlice;
