import { Component,OnInit} from '@angular/core';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
@Component({
  selector: 'app-feature-component',
  imports: [NavbarComponent],
  templateUrl: './feature-component.html',
  styleUrl: './feature-component.css',
})
export class FeatureComponent {
  constructor() { }

  ngOnInit(): void {
  }
}
