import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar-component/navbar-component";
import { FooterComponent } from "../../components/footer-component/footer-component";
import { HeroComponents } from "../../components/hero-components/hero-components";
import { MainComponent } from "../../components/main-component/main-component";
import { Main1Component } from "../../components/main1-component/main1-component";
import { MindsComponent } from "../../components/minds-component/minds-component";
import { FaqComponent } from "../../components/faq-component/faq-component";

@Component({
  selector: 'app-index-component',
  imports: [NavbarComponent, FooterComponent, HeroComponents, Main1Component, MindsComponent, FaqComponent],
  templateUrl: './index-component.html',
  styleUrl: './index-component.css',
})
export class IndexComponent {

}
