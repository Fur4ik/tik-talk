import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, switchMap, throwError} from 'rxjs';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next)=>{
  const authService = inject(AuthService);
  const accessToken = authService.accessToken;

  if (!accessToken) return next(req)

  if (isRefreshing){
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
  if(!isRefreshing){
    isRefreshing = true;
    return authService.refreshAuthToken()
      .pipe(
        switchMap(res => {
          isRefreshing = false;
          return next(AddToken(req, res.access_token))
        })
      )
  }
  return next(AddToken(req, authService.accessToken!))
}

const AddToken=(req: HttpRequest<any>, accessToken: string)=>{
  return  req.clone({
    setHeaders: {'Authorization': `Bearer ${accessToken}`},
  })
}
