import { inject, Injectable, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, tap } from 'rxjs'
import { GlobalStoreService, Pageble } from '@tt/shared'
import { Profile } from '@tt/interfaces/profile'

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient)
  #globalStoreService = inject(GlobalStoreService)
  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  me = signal<Profile | null>(null)
  filteredProfiles = signal<Profile[]>([])

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`).pipe(
      tap((val) => {
        this.#globalStoreService.me.set(val)
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
