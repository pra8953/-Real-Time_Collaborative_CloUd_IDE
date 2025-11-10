import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
 import {JwtHelperService} from'@auth0/angular-jwt';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const jwt = new JwtHelperService()
  if(token && !jwt.isTokenExpired(token)){
    return true
  }else{
    router.navigateByUrl('/login');
    return false;
  }
  
};





