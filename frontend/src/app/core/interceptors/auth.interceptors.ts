import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Agar login/signup nahi hai to token bhejo
  
  if (token && !req.url.includes('/login') && !req.url.includes('/signup')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
    return next(cloned);
  }

  // warna request normal chala jaaye
  return next(req);
};
