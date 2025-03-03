import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { ProfileCardComponent } from '../../../ui'
import { Profile } from '@tt/data-access/profile'
import { profileActions, selectFilteredProfiles } from '@tt/profile'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-profiles-container',
  imports: [CommonModule, ProfileCardComponent, InfiniteScrollDirective],
  templateUrl: './profiles-container.component.html',
  styleUrl: './profiles-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProfilesContainerComponent {

  store = inject(Store)

  profiles = this.store.selectSignal(selectFilteredProfiles)

  onScroll(){
    this.store.dispatch(profileActions.setPage({}))
  }
}
