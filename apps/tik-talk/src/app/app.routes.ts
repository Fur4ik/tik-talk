import { Routes } from '@angular/router'
import { canActivateAuth, LoginPageComponent } from '@tt/auth'
import { ExperimentComponent } from '@tt/experimental'
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile'
import { chatsRouters } from '@tt/chats'
import { LayoutComponent } from '@tt/layout'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'search', component: SearchPageComponent },
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
