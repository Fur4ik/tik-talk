import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  Renderer2,
  signal,
  ViewChild
} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {MessageInputComponent} from '../../../../common-ui/message-input/message-input.component';
import {firstValueFrom, of, switchMap, tap, timer} from 'rxjs';
import {MessageService} from '../../../../data/services/message.service';
import {Chat} from '../../../../data/interfaces/chat.interface';
import {ChatService} from '../../../../data/services/chat.service';
import {PopupDirective} from '../../../../common-ui/directives/popup.directive';
import {PopupMessageComponent} from './popup-message/popup-message.component';
import {Message} from '../../../../data/interfaces/message.interface';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent,
    PopupMessageComponent,
    PopupDirective,
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  standalone: true,
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent implements OnInit {
  messageService = inject(MessageService);
  chatService = inject(ChatService);
  r2 = inject(Renderer2)

  popupMessage = signal<boolean>(false)

  @ViewChild('mainWrapper') mainWrapper!: ElementRef;
  @ViewChild('inputMessage') inputMessage!: ElementRef;

  chat = input.required<Chat>()

  message = this.chatService.activeChatMessage

  async sendMessage(messageTest: string) {
    await firstValueFrom(this.messageService.postMessage(this.chat().id, messageTest));
    await firstValueFrom(this.chatService.getChat(this.chat().id));
    this.resizeMessageWrapper()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMessageWrapper()
  }

  ngOnInit() {
    timer(0, 5000)
      .pipe(
        switchMap(() => this.chatService.getChat(this.chat().id))
      )
      .subscribe()
  }

  ngAfterViewInit() {
    // console.log(this.inputMessage.nativeElement)
    this.resizeMessageWrapper()
  }

  resizeMessageWrapper() {
    const {top} = this.mainWrapper.nativeElement.getBoundingClientRect();
    const {top: topInput, bottom: bottomInput} = this.inputMessage.nativeElement.getBoundingClientRect();
    const inputHeight = bottomInput - topInput;

    const heightWrapper = window.innerHeight - top - 60 - inputHeight
    this.r2.setStyle(this.mainWrapper.nativeElement, 'height', `${heightWrapper}px`);
    // console.log(window.innerHeight, top, inputHeight, topInput, bottomInput);
  }


  @ViewChild('popupMessageId') popupMessageId!: ElementRef;
  @ViewChild('messageWrapper') messageWrapper!: ElementRef;

  onRightClick(message: Message, event: MouseEvent) {
    if (event.button === 2) {
      event.preventDefault();
      if (!message.isMine) return;

      this.popupMessage.set(true)

      const {top, left, width, height} = this.messageWrapper.nativeElement.getBoundingClientRect();
      const mainWrapperHeight = this.mainWrapper.nativeElement.getBoundingClientRect().height;

      let x = event.clientX - left;
      let y = event.clientY - top;

      if (width - x < 100) x -= 100
      if (mainWrapperHeight > height && y > 50) y -= 50

      this.r2.setStyle(this.popupMessageId.nativeElement, 'top', `${y}px`);
      this.r2.setStyle(this.popupMessageId.nativeElement, 'left', `${x}px`);

      this.currentMessageId = message.id;
    }
  }

  currentMessageId = 0;

  onPopupMessage(type: string) {
    this.popupMessage.set(false)
    if (type === 'delete')
      console.log('delete ' + this.currentMessageId)
    if (type === 'edit')
      console.log('edit ' + this.currentMessageId)
  }

}
