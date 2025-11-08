import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexComponent } from "./views/index-component/index-component";
import { FooterComponent } from "./components/footer-component/footer-component";

@Component({
  selector: 'app-root',
  imports: [IndexComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
