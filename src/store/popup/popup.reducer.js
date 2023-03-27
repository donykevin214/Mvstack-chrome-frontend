import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  refreshInterval:''
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    setRefreshInterval: (state, { payload }) => {
      state.refreshInterval = payload;
    },
  },
});

export const { setRefreshInterval } = popupSlice.actions;

export default popupSlice.reducer;
