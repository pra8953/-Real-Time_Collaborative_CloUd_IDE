import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
@Component({
  selector: 'app-documentation-component',
  imports: [NavbarComponent],
  templateUrl: './documentation-component.html',
  styleUrl: './documentation-component.css',
})
export class DocumentationComponent {
  constructor() { }

  ngOnInit(): void {
  }
}
