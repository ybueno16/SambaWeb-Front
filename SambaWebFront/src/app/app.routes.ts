import { LoginComponent } from './modules/login/login.component';
import { Routes } from '@angular/router';
import { ServerConfigComponent } from './modules/server-config/server-config.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'server-config',
    component: ServerConfigComponent,
  }
];
