import {Component, inject, input, Input, OnInit} from '@angular/core';
import {Profile} from '../../../data/interfaces/profile';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom, switchMap} from 'rxjs';
import {PostComponent} from '../post/post.component';
import {ActivatedRoute} from '@angular/router';
import {CommentCreateDto, PostCreateDto} from '../../../data/interfaces/post.interface';
import {ProfileService} from '../../../data/services/profile.service';
import {MessageInputComponent} from '../../../common-ui/message-input/message-input.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostComponent,
    MessageInputComponent,
    AsyncPipe
  ],
  templateUrl: './post-feed.component.html',
  standalone: true,
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  @Input() isMyPageInp!: boolean;
  profile = input<Profile>()

  profileService = inject(ProfileService);

  me$ = this.profileService.me()

  route = inject(ActivatedRoute)
  postService = inject(PostService);

  activeProfilePosts$ = this.route.params
    .pipe(
      switchMap(({id}) => {
          if (id === 'me' || id === this.profileService.me()?.id) {
           return this.postService.getPost()
          }
           return this.postService.getPost(id)
        }
      )
    )

  onCreateComment([data, postId]: [string, number]) {
    const commentDTO: CommentCreateDto = {
      text: data,
      authorId: this.me$!.id,
      postId: postId
    }
    firstValueFrom(this.postService.createComment(commentDTO))
    console.log('comm: ' + commentDTO.text)
  }

  onCreatePost(data: string) {
      const postDTO: PostCreateDto = {
        title: 'Это мой пост',
        content: data,
        authorId: this.me$!.id,
        communityId: 0
      }
    firstValueFrom(this.postService.createPost(postDTO))
  }
}
