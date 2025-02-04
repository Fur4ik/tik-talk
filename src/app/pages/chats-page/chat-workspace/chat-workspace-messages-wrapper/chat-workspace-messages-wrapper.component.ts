import {
  AfterViewInit,
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
import {firstValueFrom} from 'rxjs';
import {MessageService} from '../../../../data/services/message.service';
import {Chat} from '../../../../data/interfaces/chat.interface';
import {ChatService} from '../../../../data/services/chat.service';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  standalone: true,
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent {
  messageService = inject(MessageService);
  chatService = inject(ChatService);
  r2 = inject(Renderer2)
  targetElement = inject(ElementRef)

  @ViewChild('mainWrapper') mainWrapper!: ElementRef;
  @ViewChild('inputMessage') inputMessage!: ElementRef;

  chat = input.required<Chat>()

  message = this.chatService.activeChatMessage

  async sendMessage(messageTest: string) {
    await firstValueFrom(this.messageService.postMessage(this.chat().id, messageTest));
    await firstValueFrom(this.chatService.getChat(this.chat().id));
    this.resizeMessageWrapper()
  }

  // ngOnInit() {
  //   console.log(this.inputMessage.nativeElement)
  // this.resizeMessageWrapper()
  // }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMessageWrapper()
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


}
