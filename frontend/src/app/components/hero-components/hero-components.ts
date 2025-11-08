import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hero-components',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-components.html',
  styleUrls: ['./hero-components.css'],
  animations: [
    // Floating particles animation
    trigger('particleAnimation', [
      transition(':enter', [
        query('.particle', [
          style({ opacity: 0, transform: 'scale(0) translateY(0)' }),
          stagger(100, [
            animate('2000ms cubic-bezier(0.35, 0, 0.25, 1)', 
              keyframes([
                style({ opacity: 0, transform: 'scale(0) translateY(0)', offset: 0 }),
                style({ opacity: 0.3, transform: 'scale(1) translateY(-20px)', offset: 0.3 }),
                style({ opacity: 0.7, transform: 'scale(1.2) translateY(-40px)', offset: 0.6 }),
                style({ opacity: 0, transform: 'scale(0) translateY(-100px)', offset: 1 })
              ])
            )
          ])
        ], { optional: true })
      ])
    ]),

    // Main title animation
    trigger('titleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px) scale(0.9)' }),
        animate('1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
          style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),

    // Gradient text animation
    trigger('gradientFlow', [
      transition(':enter', [
        animate('3000ms ease-in-out', 
          keyframes([
            style({ backgroundPosition: '0% 50%' }),
            style({ backgroundPosition: '100% 50%' }),
            style({ backgroundPosition: '0% 50%' })
          ])
        )
      ])
    ]),

    // Stats counter animation
    trigger('counterAnimation', [
      transition(':enter', [
        query('.stat-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(200, [
            animate('800ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),

    // Button hover animation
    trigger('buttonPulse', [
      transition('* => *', [
        animate('2000ms ease-in-out', 
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.05)', offset: 0.5 }),
            style({ transform: 'scale(1)', offset: 1 })
          ])
        )
      ])
    ]),

    // Floating elements animation
    trigger('floatAnimation', [
      transition(':enter', [
        query('.floating-element', [
          style({ opacity: 0, transform: 'translateY(50px) scale(0.8)' }),
          stagger(300, [
            animate('1500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ])
      ])
    ])
  ]
})
export class HeroComponents implements OnInit {
  particles: any[] = [];
  floatingElements: any[] = [];
  
  stats = [
    { value: '5x', label: 'Faster Development', icon: '🚀' },
    { value: '99.9%', label: 'Uptime SLA', icon: '⚡' },
    { value: '24/7', label: 'Real-time Sync', icon: '🔄' },
    { value: '256-bit', label: 'Encryption', icon: '🔒' }
  ];

  currentParticleState = 0;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.generateParticles();
    this.generateFloatingElements();
    setInterval(() => {
      this.currentParticleState++;
    }, 2000);
  }

  generateParticles() {
    this.particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2000,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3000 + 2000
    }));
  }

  generateFloatingElements() {
    this.floatingElements = [
      { type: 'bracket', content: '{ }', top: '15%', left: '5%', delay: 0 },
      { type: 'tag', content: '<>', top: '25%', right: '8%', delay: 1 },
      { type: 'branch', content: '⎇', top: '70%', left: '7%', delay: 2 },
      { type: 'slash', content: '/>', top: '60%', right: '12%', delay: 3 },
      { type: 'curly', content: '{{ }}', top: '80%', left: '15%', delay: 4 },
      { type: 'angle', content: '< />', top: '20%', right: '15%', delay: 5 },
      { type: 'code', content: ';', top: '85%', right: '5%', delay: 6 },
      { type: 'array', content: '[]', top: '35%', left: '12%', delay: 7 }
    ];
  }

  getParticleStyle(particle: any) {
    return {
      left: `${particle.left}%`,
      'animation-delay': `${particle.delay}ms`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      'animation-duration': `${particle.duration}ms`
    };
  }

  getFloatingElementStyle(element: any) {
    return {
      top: element.top,
      left: element.left,
      right: element.right,
      'animation-delay': `${element.delay}s`
    };
  }

  onLaunchTerminal() {
    console.log('Launching CodeCollab Terminal...');
    // Add terminal launch logic
  }

  onOpenDocs() {
    console.log('Opening Documentation...');
    // Add docs opening logic
  }

  onWatchDemo() {
    console.log('Playing Demo Video...');
    // Add demo video logic
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const heroSection = this.el.nativeElement;
    const rect = heroSection.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    heroSection.style.setProperty('--mouse-x', `${x}%`);
    heroSection.style.setProperty('--mouse-y', `${y}%`);
  }
}