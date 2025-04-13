import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let access = localStorage.getItem('access');
  if(access){
    let newRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${access}`)
    });
    return next(newRequest);
  } 
  return next(req);
};
