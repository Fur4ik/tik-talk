import { ChatWSMessage } from './chat-ws-message.interface'
import { Observable } from 'rxjs'

export interface ChatConnectionWSParams {
  url: string,
  token: string,
  handleMessage:(message: ChatWSMessage)=> void,
}

export interface ChatWSService {
  connect: (params: ChatConnectionWSParams) => void | Observable<ChatWSMessage>;
  disconnect: () => void;
  sendMessage: (text: string, chatId: number) => void;
}
