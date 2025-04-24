import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const access = localStorage.getItem('access');
  const service = inject(AuthService);

  if (req.url.includes('/api/login/') || req.url.includes('api/refresh/')) {
    return next(req);
  }

  return next(access ? addToken(req, access) : req).pipe(
    catchError(error => {
      if (error.status === 401 || error.status === 403) {
        return refreshToken(service, req, next);
      }
      return throwError(() => error);
    })
  );
};

const refreshToken = (service: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return service.refreshdata().pipe(
      switchMap(res => {
        isRefreshing = false;
        localStorage.setItem('access', res.access);
        refreshTokenSubject.next(res.access);
        return next(addToken(req, res.access));
      }),
      catchError(err => {
        isRefreshing = false;
        service.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(req, token!)))
    );
  }
};

const addToken = (req: HttpRequest<any>, access: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${access}`
    }
  });
};
