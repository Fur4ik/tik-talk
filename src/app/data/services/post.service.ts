import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommentCreateDto, Post, PostComment, PostCreateDto} from '../interfaces/post.interface';
import {map, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/'

  #http = inject(HttpClient)

  posts = signal<Post[]>([])

  createPost(payload: PostCreateDto){
    return this.#http.post<Post>(`${this.baseApiUrl}post/`, payload)
      .pipe(
        switchMap(() => this.getPost())
      )
  }

  getPost(){
    return this.#http.get<Post[]>(`${this.baseApiUrl}post/`)
      .pipe(
        tap(res => this.posts.set(res))
      )
  }

  deletePost(id: number){
    return this.#http.delete<Post>(`${this.baseApiUrl}post/${id}`)
      .pipe(
        switchMap(() => this.getPost())
      )
  }

  createComment(payload: CommentCreateDto){
    return this.#http.post<PostComment>(`${this.baseApiUrl}comment/`, payload)
  }

  getCommentsBuPostId(id: number){
    return this.#http.get<Post>(`${this.baseApiUrl}post/${id}`)
      .pipe(
        map(res =>  res.comments)
      )
  }

  // postLike(id: number){
  //   return this.#http.post<string>(`${this.baseApiUrl}post/like/${id}`, {id})
  // }
  //
  // deleteLike(id: number){
  //   return this.#http.delete<string>(`${this.baseApiUrl}post/like/${id}`)
  // }
}
