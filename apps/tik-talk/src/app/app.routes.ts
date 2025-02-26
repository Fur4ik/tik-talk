import { Routes } from '@angular/router'
import { canActivateAuth, LoginPageComponent } from '@tt/auth'
import { ExperimentComponent } from '@tt/experimental'
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from '@tt/profile'
import { LayoutComponent } from '@tt/layout'
import { provideState } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { chatsRouters } from '@tt/chats'
import { postFeature, PostsEffects } from '@tt/posts'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostsEffects),
        ]
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'experiment', component: ExperimentComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRouters,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
]
