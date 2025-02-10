import { Component, inject, OnDestroy } from '@angular/core'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs'
import { ProfileService } from '../../../data'

@Component({
  selector: 'app-profile-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  standalone: true,
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent implements OnDestroy {
  profileService = inject(ProfileService)
  fb = new FormBuilder()

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    username: [''],
    stack: [''],
  })

  formSubs!: Subscription

  constructor() {
    this.formSubs = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap((formValue) => {
          return this.profileService.filterProfile(formValue)
        }),
      )
      .subscribe()
  }

  ngOnDestroy() {
    this.formSubs.unsubscribe()
  }
}
