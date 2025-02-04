import {Component, HostListener, inject, signal} from '@angular/core';
import {ProfileService} from '../../data/services/profile.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {toObservable} from '@angular/core/rxjs-interop';
import {firstValueFrom, map, switchMap, tap} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {PostFeedComponent} from './post-feed/post-feed.component';
import {ProfileInfoComponent} from '../../common-ui/profile-info/profile-info.component';
import {ChatService} from '../../data/services/chat.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    AsyncPipe,
    ImgUrlPipe,
    PostFeedComponent,
    RouterLink,
    ProfileInfoComponent
  ],
  templateUrl: './profile-page.component.html',
  standalone: true,
  styleUrl: './profile-page.component.scss'
})

export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatService = inject(ChatService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me)

  isMyPage = signal<boolean>(false);
  isScrollThreshold = signal<boolean>(false);


  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id)
        if(id === 'me' || id === this.profileService.me()?.id) {
          return this.me$
        }
        return this.profileService.getAccount(id)
      })
    )

  subscribers$ = this.profileService.getSubscribersShortList(6)
  protected readonly toString = toString;


  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollThreshold = 160

    if(window.scrollY > scrollThreshold) {
      this.isScrollThreshold.set(true);
    } else {
      this.isScrollThreshold.set(false);
    }
  }

  async openChat(profileId: number){
    await firstValueFrom(this.chatService.postChat(profileId))
      .then( (res) =>
        this.router.navigate([`/chats/${res.id}`])
      )
  }
}
