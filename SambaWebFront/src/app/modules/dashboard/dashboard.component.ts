import { Component } from '@angular/core';
import { NavbarComponent } from '../../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent { }
