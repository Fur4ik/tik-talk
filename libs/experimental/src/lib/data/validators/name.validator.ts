import { inject, Injectable } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs'
import { Profile } from '@tt/data-access/profile'

@Injectable({
  providedIn: 'root',
})
export class NameValidator {
  http = inject(HttpClient)

  validate(control: AbstractControl) {
    return this.http.get<Profile[]>('/yt-course/account/test_accounts').pipe(
      map((users) => {
        return users.filter((user) => user.firstName === control.value).length > 0
          ? { nameVal: { message: `Имя должно быть не из этого списка: ${users.map((u) => u.firstName).join(', ')}` } }
          : null
      }),
    )
  }
}
