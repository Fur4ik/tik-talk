import { Component, inject } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, take } from 'rxjs'
import { Store } from '@ngrx/store'
import { profileActions, selectSavedFilters } from '@tt/profile'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-profile-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  standalone: true,
  styleUrl: './profile-filters.component.scss'
})

export class ProfileFiltersComponent {
  store = inject(Store)

  searchForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    username: new FormControl(''),
    stack: new FormControl('')
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

    this.store.dispatch(profileActions.filterEvents({ filters: this.searchForm.value }))

    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntilDestroyed()
      )
      .subscribe(formValue => {
          this.store.dispatch(profileActions.filterEvents({ filters: formValue }))
          if (Object.values(formValue).some(val => val !== '')) {
            this.store.dispatch(profileActions.savedFilters({ filters: formValue }))
          }
        }
      )
  }
}
