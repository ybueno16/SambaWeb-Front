import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../app.routes.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private router: Router) { }

  public navigateToDashboard(){
    this.router.navigate([ROUTES.DASHBOARD]);
  }
}
