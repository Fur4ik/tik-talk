import { Component, HostBinding, input } from '@angular/core'
import { Message } from '../../../../data'
import { TimeAgoPipe } from '@tt/common-ui'

@Component({
  selector: 'app-chat-workspace-message',
  imports: [TimeAgoPipe],
  templateUrl: './chat-workspace-message.component.html',
  standalone: true,
  styleUrl: './chat-workspace-message.component.scss',
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine
  }
}
