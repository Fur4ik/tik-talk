import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component'
import { AsyncPipe } from '@angular/common'
import { firstValueFrom, Subscription, timer } from 'rxjs'
import { AuthService } from '@tt/auth'
import { ProfileService } from '@tt/profile'
import { ImgUrlPipe, PopupDirective } from '@tt/common-ui'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ChatService } from '@tt/data-access/chats'
import { GlobalStoreService } from '@tt/data-access/global-store'
import { isErrorMessage } from '@tt/data-access/chats/interfaces/type-guards'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, AsyncPipe, SubscriberCardComponent, ImgUrlPipe, RouterLinkActive, PopupDirective],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit{
  #globalStoreService = inject(GlobalStoreService)
  #chatService = inject(ChatService)
  profileService = inject(ProfileService)
  authService = inject(AuthService)
  destroyRef = inject(DestroyRef)

  isOpenedPopupBtn = signal<boolean>(false)
  me = this.#globalStoreService.me
  unreadMessages = this.#chatService.unreadMessage

  subscribers$ = this.profileService.getSubscribersShortList()
  subscriptions$ = this.profileService.getSubscriptionsShortList()
  wsSubscribe!: Subscription


  async reconnect(){
    await firstValueFrom(this.profileService.getMe())
    await firstValueFrom(timer(2000))
    this.connectWebSocket()
    console.log('reconnecting is done')
  }

  connectWebSocket(){
    this.wsSubscribe?.unsubscribe()
    this.wsSubscribe = this.#chatService.connectWs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message)=>{
          if(isErrorMessage(message)){
            console.log('reconnecting...')
            this.reconnect()
          }
        }
      )
  }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
    this.connectWebSocket()
  }

  onLogout() {
    this.authService.logout()
  }
}
