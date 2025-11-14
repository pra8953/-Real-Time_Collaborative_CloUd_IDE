import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login-component';
import { IndexComponent } from './views/index-component/index-component';
import { SignupComponent } from './auth/signup-component/signup-component';
import { DashboardComponent } from './views/dashboard-component/dashboard-component';
import { authGuard } from './guard/auth-guard-guard';
import { LoginSuccessComponent } from './auth/login-success/login-success';
import { viewRoutes } from './views/view.routes';
import { FeatureComponent } from './views/feature-component/feature-component';
import { AboutusComponent } from './views/aboutus-component/aboutus-component';
import { DemoComponent } from './views/demo-component/demo-component';
import { DocumentationComponent } from './views/documentation-component/documentation-component';
export const routes: Routes = [
   // public routes
   { path: '', component: IndexComponent },
   { path: 'login', component: LoginComponent },
   { path: 'signup', component: SignupComponent },
   { path: 'login/success', component: LoginSuccessComponent },
   { path: 'features', component: FeatureComponent },
   { path: 'about-us', component: AboutusComponent },
   { path: 'demo', component: DemoComponent },
   { path: 'documentation', component: DocumentationComponent },
   // protected Routes
   {
      path: 'dashboard', component: DashboardComponent, canActivate: [authGuard],
      canActivateChild: [authGuard], // <--- protects all child routes
      children: viewRoutes
   },
];
