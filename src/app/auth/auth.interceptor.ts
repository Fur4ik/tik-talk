import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {BehaviorSubject, catchError, filter, retry, switchMap, tap, throwError} from 'rxjs';

// let isRefreshing = false;
let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authTokenInterceptor: HttpInterceptorFn = (req, next)=>{
  const authService = inject(AuthService);
  const accessToken = authService.accessToken;

  if (!accessToken) return next(req)

  if (isRefreshing$.value) {
    return refreshAndProceed(req, next, authService)
  }

  return next(AddToken(req, accessToken))
    .pipe(
      catchError((error) => {
        if(error.status === 403) {
          return refreshAndProceed(req, next, authService)
        }

        return throwError(error);
      })
    )
}

const refreshAndProceed = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
)=>{
  if(!isRefreshing$.value){
    isRefreshing$.next(true);
    return authService.refreshAuthToken()
      .pipe(
        switchMap(res => {
          return next(AddToken(req, res.access_token))
            .pipe(
              tap(() => isRefreshing$.next(false))
            )
        })
      )
  }
  if(req.url.includes('refresh'))  return next(AddToken(req, authService.accessToken!))

  return isRefreshing$.pipe(
    filter(isRefreshing => !isRefreshing),
    switchMap(res=> {
      return next(AddToken(req, authService.accessToken!))
    })
  )
}

const AddToken=(req: HttpRequest<any>, accessToken: string)=>{
  return  req.clone({
    setHeaders: {'Authorization': `Bearer ${accessToken}`},
  })
}
