import {Component, inject, Input} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {ProfileService} from '../../../data/services/profile.service';
import {Profile} from '../../../data/interfaces/profile';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom, of} from 'rxjs';
import {JsonPipe} from '@angular/common';
import {PostComponent} from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  standalone: true,
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  @Input() profile!: Profile;

  profileService = inject(ProfileService);
  postService = inject(PostService);

  posts = this.postService.posts

  constructor() {
    firstValueFrom(this.postService.getPost())
  }

  // posts$ = this.postService.getPost()
    // .pipe(
    //   filter(post => post.author.id===this.profile.id),
    // )

  // ngOnInit() {
  //   console.log('alee')
  //   this.posts$.subscribe(posts => {
  //     console.log(posts)
  //   })
  //   // console.log(this.posts$);
  //   console.log('alee2')
  // }


  protected readonly of = of;
}
