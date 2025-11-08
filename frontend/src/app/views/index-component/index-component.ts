import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar-component/navbar-component";
import { FooterComponent } from "../../components/footer-component/footer-component";
import { HeroComponents } from "../../components/hero-components/hero-components";
import { MainComponent } from "../../components/main-component/main-component";
import { Main1Component } from "../../components/main1-component/main1-component";

@Component({
  selector: 'app-index-component',
  imports: [NavbarComponent, FooterComponent, HeroComponents, MainComponent, Main1Component],
  templateUrl: './index-component.html',
  styleUrl: './index-component.css',
})
export class IndexComponent {

}
