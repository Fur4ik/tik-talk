import { createSelector } from '@ngrx/store'
import { postFeature } from './reducer'

export const selectPosts = createSelector(
  postFeature.selectPost,
  (post) => post
)

export const selectComment = createSelector(
  postFeature.selectPostComment,
  (postComment) => postComment
)
