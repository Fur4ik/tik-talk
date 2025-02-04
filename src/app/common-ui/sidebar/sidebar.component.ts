import {
  Component,
  ElementRef,
  inject,
  Renderer2,
  signal,
} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProfileService} from '../../data/services/profile.service';
import {SubscriberCardComponent} from './subscriber-card/subscriber-card.component';
import {AsyncPipe} from '@angular/common';
import {async, firstValueFrom, map, Observable, take, tap} from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {AuthService} from '../../auth/auth.service';
import {PopupDirective} from '../directives/popup.directive';
import {ChatService} from '../../data/services/chat.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    AsyncPipe,
    SubscriberCardComponent,
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
  chatService = inject(ChatService);

  me = this.profileService.me
  isOpenedPopupBtn = signal<boolean>(false)
  unreadMessages = this.chatService.unreadMessage

  subscribers$ = this.profileService.getSubscribersShortList()

  subscriptions$ = this.profileService.getSubscriptionsShortList()


  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
    firstValueFrom(this.chatService.getUnreadMessages())
  }

  onLogout() {
    this.authService.logout();
  }

}
