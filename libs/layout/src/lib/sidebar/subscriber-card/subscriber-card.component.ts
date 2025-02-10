import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ImgUrlPipe } from '@tt/common-ui'
import { Profile } from '@tt/interfaces/profile'

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe, RouterLink],
  templateUrl: './subscriber-card.component.html',
  standalone: true,
  styleUrl: './subscriber-card.component.scss',
})
export class SubscriberCardComponent {
  @Input() profile!: Profile
}
