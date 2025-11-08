import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar-component/navbar-component";
import { FooterComponent } from "../../components/footer-component/footer-component";
import { HeroComponents } from "../../components/hero-components/hero-components";

@Component({
  selector: 'app-index-component',
  imports: [NavbarComponent, FooterComponent, HeroComponents],
  templateUrl: './index-component.html',
  styleUrl: './index-component.css',
})
export class IndexComponent {

}
