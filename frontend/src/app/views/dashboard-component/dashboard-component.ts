import { Component,HostListener } from '@angular/core';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
import { SidenavbarComponent } from '../../components/sidenavbar-component/sidenavbar-component';

import { RouterOutlet } from "@angular/router";
import { MeslistComponent } from "../../components/meslist-component/meslist-component";
@Component({
  selector: 'app-dashboard-component',
  imports: [NavbarComponent, SidenavbarComponent, RouterOutlet],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  isMobile = false;

  @HostListener('window:resize')
  onWindowResize() {
    this.checkMobile();
  }

  ngOnInit() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 1024;
  }
}
