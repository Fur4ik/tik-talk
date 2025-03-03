import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core'
import { TimeAgoPipe } from '@tt/common-ui'
import { Message } from '@tt/data-access/chats'

@Component({
  selector: 'app-chat-workspace-message',
  imports: [TimeAgoPipe],
  templateUrl: './chat-workspace-message.component.html',
  standalone: true,
  styleUrl: './chat-workspace-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine
  }
}
