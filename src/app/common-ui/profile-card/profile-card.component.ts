import {Component, inject} from '@angular/core';
import {ProfileService} from '../../data/services/profile.service';
import {NgForOf} from '@angular/common';
import {Profile} from '../../data/interfaces/profile';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-profile-card',
  imports: [
    NgForOf,
    ImgUrlPipe
  ],
  templateUrl: './profile-card.component.html',
  standalone: true,
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {

  profileService = inject(ProfileService);
  profiles: Profile[] = []

  constructor() {
    this.profileService.getTestAccounts().subscribe(
      data => this.profiles = data
    )
  }
}
