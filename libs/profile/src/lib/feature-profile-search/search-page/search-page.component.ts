import { Component, inject } from '@angular/core'
import { ProfileService } from '../../data'
import { NgForOf } from '@angular/common'
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component'
import { ProfileCardComponent } from '../../ui'

@Component({
  selector: 'app-search-page',
  imports: [NgForOf, ProfileFiltersComponent, ProfileCardComponent],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService = inject(ProfileService)
  profiles = this.profileService.filteredProfiles
}
