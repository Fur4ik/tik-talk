import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { toObservable } from '@angular/core/rxjs-interop'
import { firstValueFrom, switchMap, tap } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { PostFeedComponent } from '@tt/posts'
import { ProfileService } from '../../data'
import { ImgUrlPipe } from '@tt/common-ui'
import { ProfileInfoComponent } from '../../ui'
import { GlobalStoreService } from '@tt/data-access/global-store'

@Component({
  selector: 'app-profile-page',
  imports: [AsyncPipe, ImgUrlPipe, PostFeedComponent, RouterLink, ProfileInfoComponent],
  templateUrl: './profile-page.component.html',
  standalone: true,
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
  profileService = inject(ProfileService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  #globalStorageService = inject(GlobalStoreService)

  // me$ = toObservable(this.profileService.me)
  me = this.#globalStorageService.me


  isMyPage = signal<boolean>(false)
  isScrollThreshold = signal<boolean>(false)

  profile$ = this.route.params
    .pipe(
      switchMap(({ id }) => {
        this.isMyPage.set(id === 'me' || id === this.me()?.id)
          // console.log(id, this.me()?.id)
        if (id === this.me()?.id) {
          return toObservable(this.me)
        }
        return this.profileService.getAccount(id)
      })
    )

  // getMyId(){
  //   return this.#globalStorageService.me()?.id
  // }

  // profile$ = this.route.params
  //   .pipe(
  //     switchMap(({ id }) => {
  //
  //       let myId: number = 0
  //
  //       let profile = this.profileService.getMe()
  //         .pipe(
  //           tap(val => {
  //               console.log(val.id)
  //             }
  //           )
  //         )
  //
  //       console.log('get', this.getMyId())
  //
  //       // let profile = firstValueFrom(this.profileService.getMe())
  //       //   .then(
  //       //     (val) => {
  //       //       myId = val.id
  //       //       // console.log(val.id)
  //       //       return myId
  //       //     }
  //       //   )
  //
  //
  //       console.log('params', id)
  //       console.log('my id', myId)
  //
  //
  //       if (id === this.me()?.id) {
  //         this.router.navigate(['/me'])
  //         // return
  //       }
  //
  //       this.isMyPage.set(id === 'me')
  //
  //       if (id === 'me') {
  //         return toObservable(this.me)
  //       }
  //
  //       return this.profileService.getAccount(id)
  //     })
  //   )
  //
  // ngOnInit() {
  //   this.route.params
  //     .pipe(
  //       switchMap(({id})=>{
  //         if(id===this.getMyId())
  //           console.log(id)
  //           return id
  //       })
  //     )
  // }


  subscribers$ = this.profileService.getSubscribersShortList(6)

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollThreshold = 160

    if (window.scrollY > scrollThreshold) {
      this.isScrollThreshold.set(true)
    } else {
      this.isScrollThreshold.set(false)
    }
  }

  openChat(profileId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId: profileId } })
  }
}
