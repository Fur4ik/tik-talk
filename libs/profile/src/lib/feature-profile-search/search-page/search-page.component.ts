import { Component, inject } from '@angular/core'
import { selectFilteredProfiles } from '../../data'
import { ProfileCardComponent } from '../../ui'
import { Store } from '@ngrx/store'
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component'

@Component({
  selector: 'app-search-page',
  imports: [ProfileFiltersComponent, ProfileCardComponent],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  store = inject(Store)
  profiles = this.store.selectSignal(selectFilteredProfiles)
}
