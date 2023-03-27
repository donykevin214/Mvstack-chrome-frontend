import { createSelector } from '@reduxjs/toolkit'

const selectUserState = (state) => state.user

export const selectUser = createSelector(selectUserState, (state) => state.user)
export const selectToken = createSelector(selectUserState, (state) => state.token)