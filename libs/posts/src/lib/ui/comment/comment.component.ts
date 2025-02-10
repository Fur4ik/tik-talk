import { Component, Input, input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { PostComment } from '../../data'
import { ImgUrlPipe, TimeAgoPipe } from '@tt/common-ui'

@Component({
  selector: 'app-comment',
  imports: [ImgUrlPipe, TimeAgoPipe, RouterLink],
  templateUrl: './comment.component.html',
  standalone: true,
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  @Input() comment!: PostComment
}
