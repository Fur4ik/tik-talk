import { Route } from '@angular/router'
import { ChatsPageComponent, ChatWorkspaceComponent } from '@tt/chats'

export const chatsRouters: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
]
