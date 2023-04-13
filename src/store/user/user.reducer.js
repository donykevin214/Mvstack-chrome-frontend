import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  user: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    resetUser: (state) => {
      state.user = {};
    },
    resetToken: (state) => {
      state.token = '';
    },
  },
});

export const { setToken, setUser, resetToken, resetUser } = userSlice.actions;

export default userSlice.reducer;
