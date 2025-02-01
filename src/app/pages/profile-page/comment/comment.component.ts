import {Component, Input, input} from '@angular/core';
import {PostComment} from '../../../data/interfaces/post.interface';
import {ImgUrlPipe} from '../../../helpers/pipes/img-url.pipe';
import {TimeAgoPipe} from '../../../helpers/pipes/time-ago.pipe';

@Component({
  selector: 'app-comment',
  imports: [
    ImgUrlPipe,
    TimeAgoPipe
  ],
  templateUrl: './comment.component.html',
  standalone: true,
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input() comment!: PostComment;
}
