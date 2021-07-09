import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DanceId } from 'schemes';
import { getLocaleId, LocaleId } from 'locale';

interface AppState {
  localeId: LocaleId;
  danceId: DanceId;
}

const initialState: AppState = {
  localeId: getLocaleId(),
  danceId: 'chacarera',
};

const stateSlice = createSlice({
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

export default stateSlice;
