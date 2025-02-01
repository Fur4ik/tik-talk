import {Component, HostListener, inject, input, Input, OnInit, signal} from '@angular/core';
import {Post, PostComment} from '../../../data/interfaces/post.interface';
import {ImgUrlPipe} from '../../../helpers/pipes/img-url.pipe';
import {PopupDirective} from '../../../common-ui/directives/popup.directive';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {PostInputComponent} from '../post-input/post-input.component';
import {CommentComponent} from '../comment/comment.component';
import {TimeAgoPipe} from '../../../helpers/pipes/time-ago.pipe';
// import {DateTime} from 'luxon';

@Component({
  selector: 'app-post',
  imports: [
    ImgUrlPipe,
    PopupDirective,
    PostInputComponent,
    CommentComponent,
    TimeAgoPipe
  ],
  templateUrl: './post.component.html',
  standalone: true,
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  postService = inject(PostService);

  post = input<Post>()
  comments = signal<PostComment[]>([])

  isOpenedComments = signal<boolean>(false);
  isPopupVisible = signal<boolean>(false);
  isLiked = signal<boolean>(false);



  onDeletePost(id: number) {
    this.isPopupVisible.set(false)
    firstValueFrom(this.postService.deletePost(id))
  }

  onChangePost(id: number) {
    this.isPopupVisible.set(false)
  }

  async ngOnInit() {
    this.comments.set(this.post()!.comments);

    // const currentTime = DateTime.now();
    // console.log(currentTime)
  }

  async onCreated(){
    const comments = await firstValueFrom(this.postService.getCommentsBuPostId(this.post()!.id))
    this.comments.set(comments)
  }

  // onLike(){
  //   if(){
  //
  //   }
  // }



}
