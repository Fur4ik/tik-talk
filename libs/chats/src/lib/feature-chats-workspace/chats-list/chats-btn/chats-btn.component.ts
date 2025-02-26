import { Component, ElementRef, input, ViewChild } from '@angular/core'
import { ImgUrlPipe, TimeAgoPipe } from '@tt/common-ui'
import { MyChats } from '@tt/data-access/chats'

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
