import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import {Footer} from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [Navbar,CommonModule,Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  currentIndex = 0;
  cards = [1, 2, 3, 4, 5];

  goToCard(index: number) {
    this.currentIndex = index;
  }

  ngOnInit() {
    // Auto-slide every 5 seconds
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
    }, 5000);
  }
}
