import { createActionGroup, props } from '@ngrx/store'
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface'

export const postsActions = createActionGroup({
  source: 'post',
  events: {
    'load post': props<{ post: Post[] }>(),
    'get post': props<{ userId: number }>(),
    'create post': props<{ payloadPost: PostCreateDto }>(),
    'delete post': props<{ postId: number }>(),

    'load comment': props<{comment: PostComment[] }>(),
    'get comment': props<{ postId: number }>(),
    'create comment': props<{ payload: CommentCreateDto }>()
  }
})
