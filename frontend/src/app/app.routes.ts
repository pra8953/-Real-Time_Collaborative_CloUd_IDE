import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login-component';
import { IndexComponent } from './views/index-component/index-component';
import { SignupComponent } from './auth/signup-component/signup-component';
import { DashboardComponent } from './views/dashboard-component/dashboard-component'; 
import { authGuard } from './guard/auth-guard-guard';
export const routes: Routes = [
  // public routes
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },


  // protected Routes
  {path:'dashboard',
    component:DashboardComponent,
    // canActivate:[authGuard]
  }
];