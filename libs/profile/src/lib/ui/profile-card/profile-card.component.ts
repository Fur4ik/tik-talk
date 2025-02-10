import { Component, Input } from '@angular/core'
import { NgForOf } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ImgUrlPipe } from '@tt/common-ui'
import { Profile } from '@tt/interfaces/profile'

@Component({
  selector: 'app-profile-card',
  imports: [NgForOf, ImgUrlPipe, RouterLink],
  templateUrl: './profile-card.component.html',
  standalone: true,
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile
}
