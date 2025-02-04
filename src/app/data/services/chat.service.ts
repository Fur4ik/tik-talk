import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, MyChats} from '../interfaces/chat.interface';
import {map, take, tap, timer} from 'rxjs';
import {ProfileService} from './profile.service';
import {Message} from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/chat/'
  #http = inject(HttpClient)
  me = inject(ProfileService).me
  activeChatMessage = signal<Message[]>([])
  unreadMessage = signal<number>(0)

  postChat(userId: number) {
    return this.#http.post<Chat>(`${this.baseApiUrl}${userId}`, {});
  }

  getChat(chatId: number) {
    return this.#http.get<Chat>(`${this.baseApiUrl}${chatId}`)
      .pipe(
        map(chat => {
          const patchedMessages = chat.messages.map(message => {
            return {
              ...message,
              user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
              isMine: message.userFromId === this.me()!.id,
            }
          })

          this.activeChatMessage.set(patchedMessages)

          return {
            ...chat,
            companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
            messages: patchedMessages
          }
        })
      );
  }


  getMyChats() {
    return this.#http.get<MyChats[]>(`${this.baseApiUrl}get_my_chats/`);
  }

  getUnreadMessages() {
    return this.#http.get<MyChats[]>(`${this.baseApiUrl}get_my_chats/`)
      .pipe(
        tap(chat => {
          chat.map(chat => {
            this.unreadMessage.set(this.unreadMessage() + chat.unreadMessages)
          })
        })
      )
  }
}
