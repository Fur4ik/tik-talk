import {Component, ElementRef, input, ViewChild} from '@angular/core';
import {MyChats} from '../../../../data/interfaces/chat.interface';
import {ImgUrlPipe} from '../../../../helpers/pipes/img-url.pipe';
import {TimeAgoPipe} from '../../../../helpers/pipes/time-ago.pipe';
import {TruncateTextPipe} from '../../../../helpers/pipes/truncate-text.pipe';
import {TruncateTextDirective} from '../../../../common-ui/directives/truncate-text.directive';

@Component({
  selector: 'button [chats]',
  imports: [
    ImgUrlPipe,
    TimeAgoPipe,
    TruncateTextPipe,
    TruncateTextDirective
  ],
  templateUrl: './chats-btn.component.html',
  standalone: true,
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent {
  chat = input<MyChats>();

  @ViewChild('textBlock') textBlock!: ElementRef;
  protected readonly Number = Number;
}
