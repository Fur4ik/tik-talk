import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Chat, MyChats } from '../interfaces/chat.interface'
import { map, tap } from 'rxjs'
import { ProfileService } from './profile.service'
import { Message, MessagesByDays } from '../interfaces/message.interface'
import { DateTime } from 'luxon'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/chat/'
  #http = inject(HttpClient)
  me = inject(ProfileService).me
  activeChatMessage = signal<MessagesByDays[]>([])
  unreadMessage = signal<number>(0)

  postChat(userId: number) {
    return this.#http.post<Chat>(`${this.baseApiUrl}${userId}`, {})
  }

  getChat(chatId: number) {
    return this.#http.get<Chat>(`${this.baseApiUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          }
        })

        this.activeChatMessage.set(this.setMessagesByGroup(patchedMessages))

        return {
          ...chat,
          companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
          messages: patchedMessages,
        }
      }),
    )
  }

  setMessagesByGroup(messagesFromServer: Message[]) {
    const messagesByDays: MessagesByDays[] = []

    messagesFromServer.forEach((message) => {
      const messageDate = [
        DateTime.fromISO(message.createdAt).day,
        DateTime.fromISO(message.createdAt).month,
        DateTime.fromISO(message.createdAt).year,
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
    return this.#http.get<MyChats[]>(`${this.baseApiUrl}get_my_chats/`)
  }

  getUnreadMessages() {
    return this.#http.get<MyChats[]>(`${this.baseApiUrl}get_my_chats/`).pipe(
      tap((chat) => {
        chat.map((chat) => {
          this.unreadMessage.set(this.unreadMessage() + chat.unreadMessages)
        })
      }),
    )
  }
}
