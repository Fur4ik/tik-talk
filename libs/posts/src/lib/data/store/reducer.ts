import { CommentCreateDto, Post, PostComment } from '../interfaces/post.interface'
import { createFeature, createReducer, on } from '@ngrx/store'
import { postsActions } from './actions'

export interface PostState {
  post: Post[];
  postComment: Record<number, PostComment[]>
}

export const initialStatePost: PostState = {
  post: [],
  postComment: []
}


export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialStatePost,
    on(postsActions.loadPost, (state, payload) => {
      // const stateComments = {...state.postComment}
      // if(payload.post.comment) {}

      return {
        ...state,
        post: payload.post,
        // postComment: payload.post.,
      }
    }),

    on(postsActions.loadComment, (state, {comment}) => {
      const stateComments = { ...state.postComment }
      if(comment.length) {
        stateComments[comment[0].postId] = comment
      }
      return {
        ...state,
        postComment: stateComments
      }

    })
  )
})
