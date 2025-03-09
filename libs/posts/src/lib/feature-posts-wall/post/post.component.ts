import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
  signal
} from '@angular/core'
import { Post, postsActions, PostService, selectComment } from '../../data'
import { CommentComponent } from '../../ui'
import { ImgUrlPipe, MessageInputComponent, PopupDirective, TimeAgoPipe } from '@tt/common-ui'
import { Store } from '@ngrx/store'
import { map } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-post',
  imports: [ImgUrlPipe, PopupDirective, TimeAgoPipe, MessageInputComponent, AsyncPipe, CommentComponent],
  templateUrl: './post.component.html',
  standalone: true,
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  @Input() isMyPageInp!: boolean
  @Output() created = new EventEmitter<[string, number]>()
  @Output() deletedPost = new EventEmitter<number>()
  post = input<Post>()

  store = inject(Store)

  comments = this.store.select(selectComment)
    .pipe(
      map(res => res[this.post()!.id] || [])
    )

  commentsCounters = this.store.select(selectComment)
    .pipe(
      map(res => {
        return res[this.post()!.id]
        ? res[this.post()!.id].length
          : 0
      })
    )


  isOpenedComments = signal<boolean>(false)
  isPopupVisible = signal<boolean>(false)

  ngOnInit() {
    this.store.dispatch(postsActions.getComment({ postId: this.post()!.id }))
  }

  onCreatedComment(data: string) {
    this.created.emit([data, this.post()!.id])
  }

  onDeletePost(id: number) {
    this.isPopupVisible.set(false)
    this.deletedPost.emit(id)
  }
}
