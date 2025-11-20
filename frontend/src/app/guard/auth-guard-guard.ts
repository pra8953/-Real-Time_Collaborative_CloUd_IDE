import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const jwt = new JwtHelperService();
  if (token && !jwt.isTokenExpired(token)) {
    return true;
  } else {
    const redirectUrl = state.url;
    localStorage.setItem('redirectUrl', redirectUrl);

    router.navigateByUrl('/login');
    return false;
  }
};
