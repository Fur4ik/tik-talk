import { Route } from '@angular/router'
import { ChatsPageComponent } from '../../feature-chats-workspace/chats-page/chats-page.component'
import { ChatWorkspaceComponent } from '../../feature-chats-workspace/chat-workspace/chat-workspace.component'

export const chatsRouters: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
]
