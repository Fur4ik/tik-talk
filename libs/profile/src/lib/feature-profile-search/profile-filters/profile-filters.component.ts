import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Input } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, startWith, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { profileActions, selectSavedFilters } from '@tt/profile'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-profile-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  standalone: true,
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileFiltersComponent {
  store = inject(Store)

  searchForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    stack: new FormControl(''),
    city: new FormControl('')
  })

  filters$ = this.store.select(selectSavedFilters)

  constructor() {
    this.filters$
      .pipe(
        takeUntilDestroyed(),
        take(1)
      )
      .subscribe(filters => {
          this.searchForm.patchValue(filters)
        }
      )

    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        takeUntilDestroyed()
      )
      .subscribe(formValue => {
          this.store.dispatch(profileActions.filterEvents({ filters: formValue }))
        }
      )
  }
}
