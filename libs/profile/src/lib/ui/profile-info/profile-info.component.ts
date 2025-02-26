import { Component, Input } from '@angular/core'
import { ImgUrlPipe } from '@tt/common-ui'
import { Profile } from '@tt/data-access/profile'

@Component({
  selector: 'app-profile-info',
  imports: [ImgUrlPipe],
  templateUrl: './profile-info.component.html',
  standalone: true,
  styleUrl: './profile-info.component.scss',
})
export class ProfileInfoComponent {
  @Input() profile!: Profile
}
