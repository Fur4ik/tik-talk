import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Profile } from '../interfaces/profile'
import { Pageble } from '../interfaces/pageble.interface'
import { map, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient)
  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  me = signal<Profile | null>(null)
  filteredProfiles = signal<Profile[]>([])

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      tap((val) => {
        this.me.set(val)
      }),
    )
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`)
  }

  getSubscribersShortList(setAmount = 3) {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, setAmount)))
  }

  getSubscriptionsShortList() {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscriptions/`).pipe(map((res) => res.items))
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.baseApiUrl}account/me`, profile)
  }

  uploadAvatar(file: File) {
    const fd = new FormData()
    fd.append('image', file)

    return this.http.post<Profile>(`${this.baseApiUrl}account/upload_image`, fd)
  }

  filterProfile(params: Record<string, any>) {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, { params }).pipe(
      tap((val) => {
        this.filteredProfiles.set(val.items)
      }),
    )
  }
}
