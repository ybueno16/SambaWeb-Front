import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { Routes } from '@angular/router';
import { UserComponent } from './modules/user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'dashboard/user',
    component: UserComponent,
  },
];
