import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TokenResponse } from './auth.interface'
import { catchError, tap, throwError } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient)
  cookieService = inject(CookieService)
  router = inject(Router)

  baseApiUrl = '/yt-course/auth/'
  accessToken: string | null = null
  refreshToken: string | null = null

  get isAuth() {
    if (!this.accessToken) {
      this.accessToken = this.cookieService.get('accessToken')
      this.refreshToken = this.cookieService.get('refreshToken')
    }
    return !!this.accessToken
  }

  login(payload: { username: string; password: string }) {
    const fd = new FormData()
    fd.append('username', payload.username)
    fd.append('password', payload.password)
    return this.http.post<TokenResponse>(`${this.baseApiUrl}token`, fd)
      .pipe(
        tap((val) => {
          this.saveTokens(val)
        })
      )
  }

  refreshAuthToken() {
    return this.http.post<TokenResponse>(`${this.baseApiUrl}refresh`, { refresh_token: this.refreshToken })
      .pipe(
        tap((val) => {
          this.saveTokens(val)
        }),
        catchError((err) => {
          this.logout()
          return throwError(err)
        })
      )
  }

  saveTokens(val: TokenResponse) {
    this.accessToken = val.access_token
    this.refreshToken = val.refresh_token

    this.cookieService.set('accessToken', val.access_token, { path: '/' })
    this.cookieService.set('refreshToken', val.refresh_token, { path: '/' })
  }

  logout() {
    this.accessToken = null
    this.refreshToken = null
    this.cookieService.deleteAll()
    this.router.navigate(['/login'])
  }

  // logout() {
  //   this.cookieService.deleteAll()
  //   this.router.navigate(['/login'])
  //   return this.http.post<string>(`${this.baseApiUrl}logout`, {}).pipe(
  //     catchError((err) => {
  //       return throwError(err)
  //     }),
  //   )
  // }
}
