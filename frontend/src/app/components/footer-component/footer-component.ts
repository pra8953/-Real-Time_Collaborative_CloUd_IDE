import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.html',
  imports:[CommonModule,FormsModule],
  styleUrls: ['./footer-component.css']
})
export class FooterComponent {
  particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    animationDelay: Math.random() * 20,
    duration: Math.random() * 15 + 10
  }));

  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  getParticleStyle(particle: any) {
    return {
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      left: `${particle.left}%`,
      'animation-delay': `${particle.animationDelay}s`,
      'animation-duration': `${particle.duration}s`
    };
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}