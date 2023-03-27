import { createSelector } from '@reduxjs/toolkit'

const selectPopupState = (state) => state.popup

export const selectCurPosition = createSelector(selectPopupState, (state) => state.curPosition)
export const selectRefreshInterval = createSelector(selectPopupState, (state) => state.refreshInterval)