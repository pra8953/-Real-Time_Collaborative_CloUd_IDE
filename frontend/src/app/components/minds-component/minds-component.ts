import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-minds-component',
  imports:[NgFor],

  templateUrl: './minds-component.html',
  styleUrls: ['./minds-component.css'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger('100ms', [
            animate('600ms ease-out', 
              keyframes([
                style({ opacity: 0, transform: 'translateY(50px)', offset: 0 }),
                style({ opacity: 0.5, transform: 'translateY(-10px)', offset: 0.7 }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
              ])
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class MindsComponent implements OnInit {
  particles: any[] = [];
  floatingElements: any[] = [];

  ngOnInit() {
    this.generateParticles();
    this.generateFloatingElements();
  }

  generateParticles() {
    this.particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
  }

  generateFloatingElements() {
    this.floatingElements = [
      { type: 'bracket', content: '{ }', x: 10, y: 20 },
      { type: 'tag', content: '< />', x: 85, y: 30 },
      { type: 'code', content: 'const', x: 15, y: 70 },
      { type: 'function', content: 'function()', x: 80, y: 80 }
    ];
  }

  getParticleStyle(particle: any) {
    return {
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      'animation-duration': `${particle.duration}s`,
      'animation-delay': `${particle.delay}s`,
      'background': `linear-gradient(135deg, #ec4899, #8b5cf6)`
    };
  }

  getFloatingElementStyle(element: any) {
    return {
      left: `${element.x}%`,
      top: `${element.y}%`
    };
  }
}