import { ChatConnectionWSParams, ChatWSService } from './chat-ws-service.interface'
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject'
import { ChatWSMessage } from './chat-ws-message.interface'
import { webSocket } from 'rxjs/webSocket'
import { finalize, Observable, tap } from 'rxjs'

export class ChatWsRxjsService implements ChatWSService {

  #socket: WebSocketSubject<ChatWSMessage> | null = null

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token],
      })
    }

    return this.#socket.asObservable()
      .pipe(
        tap(message => params.handleMessage(message)),
        finalize(()=> {
            this.#socket = null
            console.log('websocket closed')
          }
        )
      )
  }

  disconnect(): void {
    this.#socket?.complete()
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId
    })
  }

}
