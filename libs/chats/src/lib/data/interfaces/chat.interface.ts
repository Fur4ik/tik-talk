import { Message } from './message.interface'
import { Profile } from '@tt/interfaces/profile'

export interface Chat {
  id: number
  userFirst: Profile
  userSecond: Profile
  messages: Message[]
  companion?: Profile
}

export interface MyChats {
  id: number
  userFrom: Profile
  message: string
  createdAt: string
  unreadMessages: number
}
