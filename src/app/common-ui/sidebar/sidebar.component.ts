import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {AsyncPipe, NgForOf} from '@angular/common';
import {async, firstValueFrom} from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {AuthService} from '../../auth/auth.service';
import {PopupDirective} from '../directives/popup.directive';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    AsyncPipe,
    SubscriberCardComponent,
    NgForOf,
    ImgUrlPipe,
    RouterLinkActive,
    PopupDirective
  ],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  authService = inject(AuthService);

  me = this.profileService.me
  isOpenedPopupBtn = signal<boolean>(false)

  subscribers$ = this.profileService.getSubscribersShortList()

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }

  onLogout() {
    this.authService.logout();
  }

}
