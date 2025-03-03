import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input, OnChanges, OnDestroy,
  Renderer2,
  signal, SimpleChanges,
  ViewChild
} from '@angular/core'
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component'
import { firstValueFrom } from 'rxjs'
import { PopupMessageComponent } from './popup-message/popup-message.component'
import { MessageInputComponent, PopupDirective, TimeAgoPipe } from '@tt/common-ui'
import { Chat, ChatService, Message } from '@tt/data-access/chats'

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, PopupMessageComponent, PopupDirective, TimeAgoPipe],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  standalone: true,
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatService = inject(ChatService)
  r2 = inject(Renderer2)

  chat = input.required<Chat>()
  message = this.chatService.activeChatMessage

  @ViewChild('mainWrapper') mainWrapper!: ElementRef
  @ViewChild('inputMessage') inputMessage!: ElementRef

  // ngOnInit() {
  //   timer(0, 5000)
  //     .pipe(
  //       switchMap(() => {
  //         return this.chatService.getChat(this.chat().id)
  //       }),
  //     )
  //     .subscribe()
  // }

  async sendMessage(messageTest: string) {
    // if (this.isEditMessage) {
    //   this.isEditMessage = false
    //   await firstValueFrom(this.chatService.patchMessage(this.currentMessageId, messageTest))
    // } else {
    //   await firstValueFrom(this.chatService.postMessage(this.chat().id, messageTest))
    // }
    //
    // await firstValueFrom(this.chatService.getChat(this.chat().id))

    this.chatService.wsAdapter.sendMessage(messageTest, this.chat().id)

    this.resizeMessageWrapper()
    this.messageWrapper.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  //for resize wrapper
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeMessageWrapper()
  }

  ngAfterViewInit() {
    this.resizeMessageWrapper()
    this.messageWrapper.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  resizeMessageWrapper() {
    const { top } = this.mainWrapper.nativeElement.getBoundingClientRect()
    const { top: topInput, bottom: bottomInput } = this.inputMessage.nativeElement.getBoundingClientRect()
    const inputHeight = bottomInput - topInput

    const heightWrapper = window.innerHeight - top - 60 - inputHeight
    this.r2.setStyle(this.mainWrapper.nativeElement, 'height', `${heightWrapper}px`)
  }


  popupMessage = signal<boolean>(false)
  oldMessageText = signal<string>('')

  @ViewChild('popupMessageId') popupMessageId!: ElementRef
  @ViewChild('messageWrapper') messageWrapper!: ElementRef

  currentMessageId = 0
  isEditMessage = false

  onRightClick(message: Message, event: MouseEvent) {
    if (event.button === 2) {
      event.preventDefault()
      if (!message.isMine) return

      this.popupMessage.set(true)

      const { top, left, width, height } = this.messageWrapper.nativeElement.getBoundingClientRect()
      const mainWrapperHeight = this.mainWrapper.nativeElement.getBoundingClientRect().height

      let x = event.clientX - left
      let y = event.clientY - top

      if (width - x < 100) x -= 100
      if (mainWrapperHeight > height && y > 50) y -= 50

      this.r2.setStyle(this.popupMessageId.nativeElement, 'top', `${y}px`)
      this.r2.setStyle(this.popupMessageId.nativeElement, 'left', `${x}px`)

      this.currentMessageId = message.id
    }
  }

  async onPopupMessage(type: string) {
    this.popupMessage.set(false)
    if (type === 'delete') {
      await firstValueFrom(this.chatService.deleteMessage(this.currentMessageId))
      await firstValueFrom(this.chatService.getChat(this.chat().id))
    }
    if (type === 'edit') {
      const message = await firstValueFrom(this.chatService.getMessage(this.currentMessageId))
      this.oldMessageText.set(message.text)
      this.isEditMessage = true
    }
  }
}
