import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, inject, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { toObservable } from '@angular/core/rxjs-interop'
import { switchMap } from 'rxjs'
import { AsyncPipe } from '@angular/common'
import { PostFeedComponent } from '@tt/posts'
import { ProfileService } from '../../data'
import { ImgUrlPipe } from '@tt/common-ui'
import { ProfileInfoComponent } from '../../ui'

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

  me$ = toObservable(this.profileService.me)

  isMyPage = signal<boolean>(false)
  isScrollThreshold = signal<boolean>(false)

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id)
      if (id === 'me' || id === this.profileService.me()?.id) {
        return this.me$
      }
      return this.profileService.getAccount(id)
    })
  )

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
    this.router.navigate(['/chats', 'new'], {queryParams: {userId: profileId }})
  }
}
