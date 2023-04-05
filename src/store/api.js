import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { setRefreshInterval } from './popup/popup.reducer';
import { setToken, setUser, resetToken, resetUser } from './user/user.reducer';

const API_PREFIX = 'http://localhost:8000/api';
const getHeadersFromToken = (token, json) => {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const displayError = (
  err,
  defaultMessage = 'Error while sending the request'
) => {
  if (err?.errors?.length) {
    toast(err.errors[0].message, {
      type: 'error',
    });
  } else if (err?.message) {
    toast(err.message, {
      type: 'error',
    });
  } else if (err?.error?.message) {
    toast(err.error.message, {
      type: 'error',
    });
  } else {
    toast(defaultMessage, {
      type: 'error',
    });
  }
};

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['api'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_PREFIX,
  }),
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (creds) => ({
        body: creds,
        method: 'POST',
        url: '/auth/login',
        headers: getHeadersFromToken('', true),
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { JWT_token, refresh_Token, user },
          } = await queryFulfilled;

          dispatch(setToken({
            JWT_token,
            refresh_Token
          }));
          dispatch(setUser(user));
          toast('Logged in successfully', {
            position: 'top-center',
            closeButton: false,
          });
          return {
            success: true,
            data:{
              JWT_token,
              refresh_Token
            }
          }
        } catch (e) {
          console.log("err",e)
          if(e.meta.response.status === 429){
            displayError(e,'Too many requests, Try later')
          }else{
            displayError(e, 'Error while logging in')
          }          
          return {
            success: false
          }
        }
      },
      transformErrorResponse(err) {
        return err.data;
      },
    }),
    signout: builder.mutation({
      query: ({ token, data }) => ({
        body:data,
        method: 'POST',
        url: '/auth/logout',
        headers: getHeadersFromToken(token),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const resp = await queryFulfilled;
          if(resp?.success){
            toast('Logged out successfully', {
              position: 'top-center',
              closeButton: false,
            });
            return true
          }else{
            return false
          }
          
        } catch (e) {
          displayError(e, 'Error while logging out');
          return false
        }
      },
      transformResponse(response) {
        return response.success;
      },
    }),
    refreshToken: builder.mutation({
      query: ({ token, data }) => ({
        body:data,
        method: 'POST',
        url: '/auth/refresh',
        headers: getHeadersFromToken(token),
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data :{
            success,
            JWT_token
          } } = await queryFulfilled;
          console.log('resp in api', JWT_token)
          if(success){
            dispatch(setToken({JWT_token}))
          }else{
            displayError('Error while refreshing token');
          }          
        } catch (e) {
          displayError(e, 'Error while refreshing token');
        }
      },
      transformResponse(data) {
        return data;
      },
      transformErrorResponse(err) {
        return err.data;
      },
    }),
    signup: builder.mutation({
      query: (payload) => ({
        body: payload,
        method: 'POST',
        url: '/auth/register',
        headers: getHeadersFromToken('', true),
      }),
      transformResponse(data) {
        return data.success;
      },
      transformErrorResponse(err) {
        return err.data;
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast('Registered successfully');
        } catch (e) {
          displayError(e, 'Error while logging out');
        }
      },
    }),
    signinGoogle: builder.mutation({
      query: (creds) => ({
        body: creds,
        method: 'POST',
        url: '/auth/signGoogle',
        headers: getHeadersFromToken('', true),
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { JWT_token, refresh_Token, user },
          } = await queryFulfilled;

          dispatch(setToken({
            JWT_token,
            refresh_Token
          }));
          dispatch(setUser(user));
          toast('Logged in successfully', {
            position: 'top-center',
            closeButton: false,
          });
          return {
            success: true,
            data:{
              JWT_token,
              refresh_Token
            }
          }
        } catch (e) {
          displayError(e, 'Error while logging in');
          return {
            success: false
          }
        }
      },
      transformErrorResponse(err) {
        return err.data;
      },
    }),
    signinFaceBook: builder.mutation({
      query: (creds) => ({
        body: creds,
        method: 'POST',
        url: '/auth/login',
        headers: getHeadersFromToken('', true),
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const {
            data: { token, user },
          } = await queryFulfilled;

          dispatch(setToken(token));
          dispatch(setUser(user));
          toast('Logged in successfully', {
            position: 'top-center',
            closeButton: false,
          });
        } catch (e) {
          displayError(e, 'Error while logging in');
        }
      },
      transformErrorResponse(err) {
        return err.data;
      },
    }),
  }),
});
