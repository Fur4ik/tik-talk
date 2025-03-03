import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component'
import { ProfilesContainerComponent } from './profiles-container/profiles-container.component'

@Component({
  selector: 'app-search-page',
  imports: [ProfileFiltersComponent, ProfilesContainerComponent],
  templateUrl: './search-page.component.html',
  standalone: true,
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {}
