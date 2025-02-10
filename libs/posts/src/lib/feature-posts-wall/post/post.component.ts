import { Component, EventEmitter, inject, input, Input, OnInit, Output, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { Post, PostComment, PostService } from '../../data'
import { CommentComponent } from '../../ui'
import { ImgUrlPipe, MessageInputComponent, PopupDirective, TimeAgoPipe } from '@tt/common-ui'

@Component({
  selector: 'app-post',
  imports: [ImgUrlPipe, PopupDirective, CommentComponent, TimeAgoPipe, MessageInputComponent],
  templateUrl: './post.component.html',
  standalone: true,
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  @Input() isMyPageInp!: boolean
  @Output() created = new EventEmitter<[string, number]>()

  postService = inject(PostService)

  post = input<Post>()
  comments = signal<PostComment[]>([])

  isOpenedComments = signal<boolean>(false)
  isPopupVisible = signal<boolean>(false)

  ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  async onCreated() {
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
