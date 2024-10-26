import { Component } from '@angular/core';
import { CardComponent } from '../../@shared/components/card/card.component';
import { NavbarComponent } from '../../@shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CardComponent,SidebarComponent,NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

}
