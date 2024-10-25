import { Component } from '@angular/core';
import { NavbarComponent } from '../../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent { }
