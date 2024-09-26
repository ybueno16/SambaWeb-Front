import { LoginComponent } from './modules/login/login.component';
import { IpConfigComponent } from './modules/ip-config/ip-config.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'ip-config',
    component: IpConfigComponent,
  },
];


