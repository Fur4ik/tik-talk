import {Component, HostBinding, input} from '@angular/core';
import {Message} from '../../../../../data/interfaces/message.interface';
import {TimeAgoPipe} from '../../../../../helpers/pipes/time-ago.pipe';
import {PopupMessageComponent} from '../popup-message/popup-message.component';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [
    TimeAgoPipe
  ],
  templateUrl: './chat-workspace-message.component.html',
  standalone: true,
  styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine(){
    return this.message().isMine
  }


}
