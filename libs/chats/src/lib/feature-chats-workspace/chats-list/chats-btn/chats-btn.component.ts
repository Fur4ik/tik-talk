import { Component, ElementRef, input, ViewChild } from '@angular/core'
import { MyChats } from '../../../data'
import { ImgUrlPipe, TimeAgoPipe } from '@tt/common-ui'

@Component({
  selector: 'button [chats]',
  imports: [ImgUrlPipe, TimeAgoPipe],
  templateUrl: './chats-btn.component.html',
  standalone: true,
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<MyChats>()

  @ViewChild('textBlock') textBlock!: ElementRef
  protected readonly Number = Number
}
