import {Component, HostListener, inject, signal} from '@angular/core';
import {ProfileService} from '../../data/services/profile.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {toObservable} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {PostFeedComponent} from './post-feed/post-feed.component';
import {ProfileInfoComponent} from '../../common-ui/profile-info/profile-info.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    AsyncPipe,
    NgIf,
    ImgUrlPipe,
    NgForOf,
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
  route = inject(ActivatedRoute);

  me$ = toObservable(this.profileService.me)

  isMyPage = signal<boolean>(false);
  isScrollThreshold = signal<boolean>(false);


  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        if(id === 'me') {
          this.isMyPage.set(true)
          return this.me$
        }
        this.isMyPage.set(false)
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


}
