import { createActionGroup, props } from '@ngrx/store'
import { Profile } from '@tt/data-access/profile'

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'filter events': props<{filters: Record<string, any>}>(),
    'profile loaded': props<{profiles: Profile[]}>(),
    'saved filters': props<{filters: Record<string, any>}>(),
  }
})
