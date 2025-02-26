import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { PostService } from '../services/post.service'
import { postsActions } from './actions'
import { concatMap, firstValueFrom, map, mergeMap, switchMap, tap } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class PostsEffects {
  postService = inject(PostService)
  actions$ = inject(Actions)

  getPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.getPost),
      switchMap(({ userId }) => {
        return this.postService.getPost(userId)
      }),
      map(res => postsActions.loadPost({ post: res }))
    )
  })

  createPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(({ payloadPost }) => {
        return this.postService.createPost(payloadPost)
      }),
      map(res => postsActions.loadPost({ post: res }))
    )
  })

  deletePost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.deletePost),
      switchMap(({ postId }) => {
        return this.postService.deletePost(postId)
      }),
      map(res => postsActions.loadPost({ post: res }))
    )
  })

  getComments = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.getComment),
      mergeMap(({ postId }) => {
        return this.postService.getCommentsByPostId(postId)
      }),
      map(res => postsActions.loadComment({comment: res }))
    )
  })

  createComment = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createComment),
      switchMap(({ payload }) => {
        return this.postService.createComment(payload)
      }),
      map(res => postsActions.loadComment({comment: res }))
    )
  })
}
