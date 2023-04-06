import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  refreshInterval:'',
  disable: false,
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setRefreshInterval: (state, { payload }) => {
      state.refreshInterval = payload;
    },
    setDisable: (state, { payload }) => {
      state.disable = payload;
    },
  },
});

export const { setRefreshInterval, setDisable } = popupSlice.actions;

export default popupSlice.reducer;
