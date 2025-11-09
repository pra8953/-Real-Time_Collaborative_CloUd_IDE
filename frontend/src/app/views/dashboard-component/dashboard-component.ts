import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
import { SidenavbarComponent } from '../../components/sidenavbar-component/sidenavbar-component';
import { ProjectlistComponent } from '../../components/projectlist-component/projectlist-component';
import { MeslistComponent } from '../../components/meslist-component/meslist-component';
@Component({
  selector: 'app-dashboard-component',
  imports: [NavbarComponent,SidenavbarComponent,ProjectlistComponent,MeslistComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {

}
