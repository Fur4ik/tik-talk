import {Component, inject} from '@angular/core';
import {ProfileService} from '../../data/services/profile.service';
import {Profile} from '../../data/interfaces/profile';
import {ImgUrlPipe} from '../../helpers/pipes/img-url.pipe';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-search-page',
  imports: [
    ImgUrlPipe,
    NgForOf
  ],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {

  profileService = inject(ProfileService);
  profiles: Profile[] = []

  constructor() {
    this.profileService.getTestAccounts().subscribe(
      data => this.profiles = data
    )
  }
}
