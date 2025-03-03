import { ChangeDetectionStrategy, Component, inject, input, Input } from '@angular/core'
import { firstValueFrom, switchMap } from 'rxjs'
import { PostComponent } from '../post/post.component'
import { ActivatedRoute } from '@angular/router'
import { CommentCreateDto, Post, PostCreateDto } from '../../data/interfaces/post.interface'
import { MessageInputComponent } from '@tt/common-ui'
import { AsyncPipe } from '@angular/common'
import { postsActions, PostService, selectPosts } from '../../data'
import { Store } from '@ngrx/store'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Profile } from '@tt/data-access/profile'
import { GlobalStoreService } from '@tt/data-access/global-store'

@Component({
  selector: 'app-post-feed',
  imports: [PostComponent, MessageInputComponent, AsyncPipe],
  templateUrl: './post-feed.component.html',
  standalone: true,
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent {
  @Input() isMyPageInp!: boolean
  profile = input<Profile>()

  route = inject(ActivatedRoute)
  postService = inject(PostService)
  globalStoreService = inject(GlobalStoreService)
  store = inject(Store)

  me$ = this.globalStoreService.me()
  activeProfilePosts$ = this.store.select(selectPosts)

  constructor() {
    this.route.params.pipe(
      takeUntilDestroyed(),
      switchMap(({ id }) => {
        if (id === 'me')
          id = this.globalStoreService.me()!.id
        this.store.dispatch(postsActions.getPost({ userId: Number(id) }))
        return this.store.select(selectPosts)
      })
    ).subscribe()
  }

  onCreatePost(data: string) {
    const postDTO: PostCreateDto = {
      title: 'Это мой пост',
      content: data,
      authorId: this.me$!.id,
      communityId: 0
    }
    this.store.dispatch(postsActions.createPost({payloadPost: postDTO}))
  }

  onDeletePost(id: number) {
    this.store.dispatch(postsActions.deletePost({postId: id}))
  }

  onCreateComment([data, postId]: [string, number]) {
    const commentDTO: CommentCreateDto = {
      text: data,
      authorId: this.me$!.id,
      postId: postId
    }
    firstValueFrom(this.postService.createComment(commentDTO))
  }
}
