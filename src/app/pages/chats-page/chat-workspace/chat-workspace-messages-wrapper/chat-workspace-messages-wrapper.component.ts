import {
  Component, computed, effect,
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
import {BehaviorSubject, firstValueFrom, from, of, switchMap, tap, timer} from 'rxjs';
import {MessageService} from '../../../../data/services/message.service';
import {Chat} from '../../../../data/interfaces/chat.interface';
import {ChatService} from '../../../../data/services/chat.service';
import {PopupDirective} from '../../../../common-ui/directives/popup.directive';
import {PopupMessageComponent} from './popup-message/popup-message.component';
import {Message} from '../../../../data/interfaces/message.interface';
import {DateTime} from 'luxon';
import {toObservable} from '@angular/core/rxjs-interop';

interface MessagesByDays {
  date: number[];
  message: Message[];
}


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


  chat = input.required<Chat>()
  message = this.chatService.activeChatMessage
  messagesByDays = signal<MessagesByDays[]>([])

  mess = toObservable(this.chatService.activeChatMessage)

  createdFromDay(date: string) {
    const dateTime = DateTime.fromISO(date);
    return [dateTime.day, dateTime.month, dateTime.year];
  }

  isEqualDate(message: Message) {
    const messageDate = this.createdFromDay(message.createdAt);
    // const currentMessagesByDays = this.messagesByDays()
    const currentDay = this.messagesByDays().find((mess) => {
      return mess.date[0] === messageDate[0] && mess.date[1] === messageDate[1] && mess.date[2] === messageDate[2]
    });

    // console.log(this.messagesByDays())

    if (currentDay) {
      currentDay.message.push(message);
    } else {
      this.messagesByDays().push({date: messageDate, message: [message]});
    }

    // this.messagesByDays.set([...this.messagesByDays()]);
  }

  ngOnInit() {
    timer(0, 5000)
      .pipe(switchMap(() => {
        // this.forEachMessage()
        // console.log(this.messagesByDays());
        return this.chatService.getChat(this.chat().id)
        })
      )
      .subscribe()


    this.forEachMessage()
    // console.log(this.mess.source)
    console.log(this.messagesByDays());


  }

  forEachMessage(){
    this.message()
      .forEach(message => {
        this.isEqualDate(message)
      })
  }


  async sendMessage(messageTest: string) {
    await firstValueFrom(this.messageService.postMessage(this.chat().id, messageTest));
    await firstValueFrom(this.chatService.getChat(this.chat().id));
    this.resizeMessageWrapper()

    this.forEachMessage()
  }


  //for resize wrapper
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMessageWrapper()
  }

  ngAfterViewInit() {
    // console.log(this.inputMessage.nativeElement)
    this.resizeMessageWrapper()
  }

  @ViewChild('mainWrapper') mainWrapper!: ElementRef;
  @ViewChild('inputMessage') inputMessage!: ElementRef;

  resizeMessageWrapper() {
    const {top} = this.mainWrapper.nativeElement.getBoundingClientRect();
    const {top: topInput, bottom: bottomInput} = this.inputMessage.nativeElement.getBoundingClientRect();
    const inputHeight = bottomInput - topInput;

    const heightWrapper = window.innerHeight - top - 60 - inputHeight
    this.r2.setStyle(this.mainWrapper.nativeElement, 'height', `${heightWrapper}px`);
    // console.log(window.innerHeight, top, inputHeight, topInput, bottomInput);
  }


  //for popup
  popupMessage = signal<boolean>(false)

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
