import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { profileActions } from './actions'
import { map, switchMap, tap, withLatestFrom } from 'rxjs'
import { ProfileService } from '../services/profile.service'
import { GlobalStoreService } from '@tt/data-access/global-store'
import { Store } from '@ngrx/store'
import { selectFilteredProfiles, selectProfilePageable, selectSavedFilters } from './selectors'
import { state } from '@angular/animations'

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService)
  actions$ = inject(Actions)
  store = inject(Store)

  filterProfiles = createEffect(()=>{
    return this.actions$.pipe(
      ofType(
          profileActions.filterEvents,
          profileActions.setPage
      ),
      withLatestFrom(
        this.store.select(selectSavedFilters),
        this.store.select(selectProfilePageable)
      ),
      switchMap(([_, filters, state])=>{
        return this.profileService.filterProfile({ ...filters, ...state })
      }),
      map(res => profileActions.profileLoaded({profiles: res.items, page: res.page, size: res.size}))
    )
  })
}
