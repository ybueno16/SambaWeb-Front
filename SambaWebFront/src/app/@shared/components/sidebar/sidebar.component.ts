import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router) { }

  public navigateToUserPage() {
    this.router.navigate(['dashboard/user']);
  }
}
