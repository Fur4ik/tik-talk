import { Profile } from '@tt/data-access/profile'

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

export interface Message {
  id: number
  userFromId: number
  personalChatId: number
  text: string
  isRead: boolean
  createdAt: string
  updatedAt?: string
  user?: Profile
  isMine?: boolean
}

export interface MessagesByDays {
  date: number[]
  message: Message[]
}
