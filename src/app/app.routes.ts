import {Routes} from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {SearchPageComponent} from './pages/search-page/search-page.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {LayoutComponent} from './common-ui/layout/layout.component';
import {canActivateAuth} from './auth/access.guard';
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {ExperimentComponent} from './experiments/experiment/experiment.component';
import {chatsRouters} from './pages/chats-page/chatsRouters';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'profile/:id', component: ProfilePageComponent},
      {path: 'search', component: SearchPageComponent},
      {path: 'settings', component: SettingsPageComponent},
      {path: 'experiment', component: ExperimentComponent},
      {
        path: 'chats',
        loadChildren: () => chatsRouters
      },
    ],
    canActivate: [canActivateAuth]
  },
  {path: 'login', component: LoginPageComponent},
];
