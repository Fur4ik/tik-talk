import { Component, inject, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { AsyncPipe } from '@angular/common'
import { firstValueFrom} from 'rxjs'
import { AuthService } from '@tt/auth'
import { ProfileService } from '@tt/profile'
import { ImgUrlPipe, PopupDirective } from '@tt/common-ui'
import { ChatService } from '@tt/chats'

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, AsyncPipe, SubscriberCardComponent, ImgUrlPipe, RouterLinkActive, PopupDirective],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  profileService = inject(ProfileService)
  authService = inject(AuthService)
  chatService = inject(ChatService)

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
    this.authService.logout()
  }
}
