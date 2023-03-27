import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import popupReducer from './popup/popup.reducer';
import { api } from './api';

const rootReducer = combineReducers({
  user: persistReducer(
    {
      key: 'user',
      storage,
      version: 1,
    },
    userReducer
  ),
  popup: persistReducer(
    {
      key: 'popup',
      storage,
      version:1 
    },
    popupReducer
  ),
  [api.reducerPath]: api.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export * from './ssoApi'
