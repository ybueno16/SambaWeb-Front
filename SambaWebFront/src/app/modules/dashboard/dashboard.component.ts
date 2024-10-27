import { Component } from '@angular/core';
import { NavbarComponent } from '../../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';
import { CardComponent } from '../../@shared/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent { }
