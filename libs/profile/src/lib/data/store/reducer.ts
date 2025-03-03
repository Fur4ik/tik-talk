import { createFeature, createReducer, on } from '@ngrx/store'
import { profileActions } from './actions'
import { Profile } from '@tt/data-access/profile'

export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  page: number,
  size: number
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  page: 1,
  size: 10
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,


    on(profileActions.filterEvents , (state, payload) => {
      return {
        ...state,
        page: 1,
        profiles: [],
        profileFilters: payload.filters,
      }
    }),

    on(profileActions.profileLoaded, (state, payload) => {

      return {
        ...state,
        profiles: state.profiles.concat(payload.profiles),
      }
    }),

    on(profileActions.setPage, (state, payload) => {

      let page = payload.page

      if(!page) page = state.page + 1

      return{
        ...state,
        page,
      }
    }),

  )
})
