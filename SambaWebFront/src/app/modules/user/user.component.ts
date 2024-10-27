import { Component } from '@angular/core';
import { CardComponent } from '../../@shared/components/card/card.component';
import { NavbarComponent } from '../../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';
import { DatatableComponent } from '../../@shared/components/datatable/datatable.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, DatatableComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent { }
