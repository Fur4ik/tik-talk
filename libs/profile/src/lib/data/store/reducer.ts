import { createFeature, createReducer, on } from '@ngrx/store'
import { profileActions } from './actions'
import { Profile } from '@tt/data-access/profile'

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {}
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profileLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
      }
    }),

    on(profileActions.savedFilters , (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters,
      }
    })
  )
})
