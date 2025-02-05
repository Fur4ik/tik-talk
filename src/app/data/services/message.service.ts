import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Message } from '../interfaces/message.interface'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseApiUrl = 'https://icherniakov.ru/yt-course/message/'
  #http = inject(HttpClient)

  postMessage(chatId: number, message: string) {
    return this.#http.post<Message>(
      `${this.baseApiUrl}send/${chatId}`,
      {},
      {
        params: { message },
      },
    )
  }

  getMessage(messageId: number) {
    return this.#http.get<Message>(`${this.baseApiUrl}${messageId}`)
  }

  deleteMessage(messageId: number) {
    return this.#http.delete<Message>(`${this.baseApiUrl}${messageId}`)
  }

  patchMessage(messageId: number, message: string) {
    const params = new HttpParams().set('text', message)
    return this.#http.patch<Message>(`${this.baseApiUrl}${messageId}`, {}, { params })
  }
}
