import {Component, EventEmitter, inject, input, Input, OnInit, Output, signal} from '@angular/core';
import {Post, PostComment} from '../../../data/interfaces/post.interface';
import {ImgUrlPipe} from '../../../helpers/pipes/img-url.pipe';
import {PopupDirective} from '../../../common-ui/directives/popup.directive';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {CommentComponent} from '../comment/comment.component';
import {TimeAgoPipe} from '../../../helpers/pipes/time-ago.pipe';
import {MessageInputComponent} from '../../../common-ui/message-input/message-input.component';

@Component({
  selector: 'app-post',
  imports: [
    ImgUrlPipe,
    PopupDirective,
    CommentComponent,
    TimeAgoPipe,
    MessageInputComponent
  ],
  templateUrl: './post.component.html',
  standalone: true,
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  @Input() isMyPageInp!: boolean;
  @Output() created = new EventEmitter<[string, number]>();

  postService = inject(PostService);

  post = input<Post>()
  comments = signal<PostComment[]>([])

  isOpenedComments = signal<boolean>(false);
  isPopupVisible = signal<boolean>(false);

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

   async onCreated(){
    const comments = await firstValueFrom(this.postService.getCommentsBuPostId(this.post()!.id))
    this.comments.set(comments)
  }

   onCreatedComment(data: string) {
    this.created.emit([data, this.post()!.id])
    this.onCreated()
     console.table(this.comments())
  }

  onDeletePost(id: number) {
    this.isPopupVisible.set(false)
    firstValueFrom(this.postService.deletePost(id))
  }
}
