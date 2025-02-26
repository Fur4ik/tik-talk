import { createSelector } from '@ngrx/store'
import { profileFeature } from './reducer'

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)

export const selectSavedFilters = createSelector(
  profileFeature.selectProfileFilters,
  (profileFilters) => profileFilters
)
