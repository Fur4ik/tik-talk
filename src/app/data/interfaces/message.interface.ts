import {Profile} from './profile';

export interface Message {
  id: number,
  userFromId: number,
  personalChatId: number,
  text: string,
  isRead: boolean,
  createdAt: string,
  updatedAt: string
  user?: Profile,
  isMine?: boolean,
}
