import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';

let isRefreshed = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const access = localStorage.getItem('access');
  const service = inject(AuthService);

  if (req.url.includes('/api/login/') || req.url.includes('/refresh/')) {
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
  if (!isRefreshed) {
    isRefreshed = true;
    return service.refreshdata().pipe(
      switchMap(res => {
        isRefreshed = false;
        return next(addToken(req, res.access));
      }),
      catchError(err => {
        isRefreshed = false;
        service.logout();
        return throwError(() => err);
      })
    );
  }

  const access = localStorage.getItem('access');
  return next(addToken(req, access!));
};

const addToken = (req: HttpRequest<any>, access: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${access}`
    }
  });
};
