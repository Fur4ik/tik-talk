import { inject, Injectable, signal } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Chat, Message, MessagesByDays, MyChats } from '../interfaces/chat.interface'
import { map, Observable, tap } from 'rxjs'
import { DateTime } from 'luxon'
import { ChatWSService } from '../interfaces/chat-ws-service.interface'
// import { AuthService } from '@tt/auth'
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface'
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards'
import { ChatWsRxjsService } from '../interfaces/chat-ws-rxjs.service'
import { GlobalStoreService } from '../../global-store/'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  #http = inject(HttpClient)
  // #authService = inject(AuthService)
  #globalStoreService = inject(GlobalStoreService)
  #cookiesService = inject(CookieService)

  me = this.#globalStoreService.me
  activeChatMessage = signal<MessagesByDays[]>([])
  unreadMessage = signal<number>(0)

  wsAdapter: ChatWSService = new ChatWsRxjsService()
  // wsAdapter: ChatWSService = new ChatWsNativeService()
  baseApiUrl = 'https://icherniakov.ru/yt-course/'

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      // token: this.#authService.accessToken ?? '',
      token: this.#cookiesService.get('accessToken') ?? '',
      handleMessage: this.handleWSMessage.bind(this)
    }) as Observable<ChatWSMessage>
  }

  handleWSMessage(message: ChatWSMessage) {
    console.log(message)

    if (!('action' in message)) return

    if (isUnreadMessage(message)) {
      this.unreadMessage.set(message.data.count)
    }

    if (isNewMessage(message)) {
      const handleMessage = ({
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: message.data.author === this.me()!.id
      })

      this.activeChatMessage.set(
        this.setMessagesByGroup([
          ...this.getMessages(this.activeChatMessage()),
          handleMessage
        ])
      )
    }
  }

  getMessages(group: MessagesByDays[]) {
    return group
      .map(res => res.message)
      .flat()
  }

  postChat(userId: number) {
    return this.#http.post<Chat>(`${this.baseApiUrl}chat/${userId}`, {})
  }

  getChat(chatId: number) {
    return this.#http.get<Chat>(`${this.baseApiUrl}chat/${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id
          }
        })

        this.activeChatMessage.set(this.setMessagesByGroup(patchedMessages))

        return {
          ...chat,
          companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
          messages: patchedMessages
        }
      })
    )
  }

  setMessagesByGroup(messagesFromServer: Message[]) {
    const messagesByDays: MessagesByDays[] = []

    messagesFromServer.forEach((message) => {
      let messageCreatedAt = message.createdAt
      if (messageCreatedAt.includes(' ')) {
        messageCreatedAt = messageCreatedAt.replace(' ', 'T')
      }
      const messageDate = [
        DateTime.fromISO(messageCreatedAt).day,
        DateTime.fromISO(messageCreatedAt).month,
        DateTime.fromISO(messageCreatedAt).year
      ]

      const currentDate = messagesByDays.find((message) => {
        return (
          message.date[0] === messageDate[0] && message.date[1] === messageDate[1] && message.date[2] === messageDate[2]
        )
      })

      if (currentDate) {
        currentDate.message.push(message)
      } else {
        messagesByDays.push({ date: messageDate, message: [message] })
      }
    })
    return messagesByDays
  }

  getMyChats() {
    return this.#http.get<MyChats[]>(`${this.baseApiUrl}chat/get_my_chats/`)
  }

  postMessage(chatId: number, message: string) {
    return this.#http.post<Message>(
      `${this.baseApiUrl}message/send/${chatId}`,
      {},
      {
        params: { message }
      }
    )
  }

  getMessage(messageId: number) {
    return this.#http.get<Message>(`${this.baseApiUrl}message/${messageId}`)
  }

  deleteMessage(messageId: number) {
    return this.#http.delete<Message>(`${this.baseApiUrl}message/${messageId}`)
  }

  patchMessage(messageId: number, message: string) {
    const params = new HttpParams().set('text', message)
    return this.#http.patch<Message>(`${this.baseApiUrl}message/${messageId}`, {}, { params })
  }
}
