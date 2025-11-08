import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login-component';
import { IndexComponent } from './views/index-component/index-component';
import { SignupComponent } from './auth/signup-component/signup-component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];
