import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Message} from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/message/'
  #http = inject(HttpClient)

  postMessage(chatId: number, message: string) {
    return this.#http.post<Message>(`${this.baseApiUrl}send/${chatId}`,{}, {
      params: {message}
    }
    )
  }

  getMessage(messageId: number) {
    return this.#http.get<Message>(`${this.baseApiUrl}${messageId}`)
  }
}
