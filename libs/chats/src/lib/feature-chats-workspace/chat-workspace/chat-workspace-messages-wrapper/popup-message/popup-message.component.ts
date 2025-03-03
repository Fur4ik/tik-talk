import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-popup-message',
  imports: [],
  templateUrl: './popup-message.component.html',
  styleUrl: './popup-message.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupMessageComponent {
  @Output() messageChange = new EventEmitter<string>()

  onDeleteMessage() {
    this.messageChange.emit('delete')
  }

  onEditMessage() {
    this.messageChange.emit('edit')
  }
}
