import { Component, inject } from '@angular/core'
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component'
import {
  ChatWorkspaceMessagesWrapperComponent
} from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component'
import { ActivatedRoute, Router } from '@angular/router'
import { ChatService } from '../../data'
import { filter, of, switchMap } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-chat-workspace',
  imports: [ChatWorkspaceHeaderComponent, ChatWorkspaceMessagesWrapperComponent, AsyncPipe],
  templateUrl: './chat-workspace.component.html',
  standalone: true,
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute)
  router = inject(Router)
  chatService = inject(ChatService)

  activeChat$ = this.route.params
    .pipe(
      switchMap(({ id }) => {
          if(id === 'new'){
            return this.route.queryParams.pipe(
              filter(({userId})=> userId),
              switchMap(({userId})=>{
                return this.chatService.postChat(userId).pipe(
                  switchMap(chat=> {
                    this.router.navigate(['/chats', chat.id])
                    return of(null)
                  })
                )
              })
            )
          }

          return this.chatService.getChat(id)
        }
      )
    )
}
