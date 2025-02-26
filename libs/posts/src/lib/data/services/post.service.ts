import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CommentCreateDto, Post, PostComment, PostCreateDto } from '../interfaces/post.interface'
import { map, switchMap, tap } from 'rxjs'
import { GlobalStoreService } from '@tt/data-access/global-store'

@Injectable({
  providedIn: 'root'
})
export class PostService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  #http = inject(HttpClient)
  me = inject(GlobalStoreService).me

  createPost(payload: PostCreateDto) {
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload)
      .pipe(switchMap(() => this.getPost()))
  }

  getPost(userId?: number) {
    const params = userId ? { user_id: userId } : undefined
    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`, { params })
  }

  deletePost(id: number) {
    return this.#http.delete<Post>(`${this.baseApiUrl}post/${id}`)
      .pipe(switchMap(() => this.getPost()))
  }

  getCommentsByPostId(id: number) {
    return this.#http.get<Post>(`${this.baseApiUrl}post/${id}`)
      .pipe(map((res) => res.comments))
  }

  createComment(payload: CommentCreateDto) {
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload)
      .pipe(switchMap(() => this.getCommentsByPostId(payload.postId)))
  }
}
