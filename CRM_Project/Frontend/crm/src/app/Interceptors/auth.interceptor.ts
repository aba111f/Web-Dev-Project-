import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const access = localStorage.getItem('access');
  
  if (req.url.includes('/api/login/')) {
    return next(req);
  }
  
  if (access) {
    const newRequest = req.clone({
      setHeaders:{
        Authorization:`Bearer ${access}`
      }
    });
    return next(newRequest);
  }
  return next(req);
};
