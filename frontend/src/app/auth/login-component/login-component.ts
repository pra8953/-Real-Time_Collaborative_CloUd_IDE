import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
  animations: [
    // Card animation
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate(
          '600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),

    // Floating particles animation
    trigger('particleAnimation', [
      transition(':enter', [
        query(
          '.particle',
          [
            style({ opacity: 0, transform: 'scale(0) translateY(0)' }),
            stagger(100, [
              animate(
                '2000ms cubic-bezier(0.35, 0, 0.25, 1)',
                keyframes([
                  style({ opacity: 0, transform: 'scale(0) translateY(0)', offset: 0 }),
                  style({ opacity: 0.3, transform: 'scale(1) translateY(-20px)', offset: 0.3 }),
                  style({ opacity: 0.7, transform: 'scale(1.2) translateY(-40px)', offset: 0.6 }),
                  style({ opacity: 0, transform: 'scale(0) translateY(-100px)', offset: 1 }),
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),

    // Floating elements animation
    trigger('floatAnimation', [
      transition(':enter', [
        query('.floating-element', [
          style({ opacity: 0, transform: 'translateY(50px) scale(0.8)' }),
          stagger(300, [
            animate(
              '1500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;

  particles: any[] = [];
  floatingElements: any[] = [];
  currentParticleState = 0;

  constructor(private el: ElementRef, private router: Router) {}

  ngOnInit() {
    this.generateParticles();
    this.generateFloatingElements();
    setInterval(() => {
      this.currentParticleState++;
    }, 2000);
  }

  generateParticles() {
    this.particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2000,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3000 + 2000,
    }));
  }

  generateFloatingElements() {
    this.floatingElements = [
      { type: 'bracket', content: '{ }', top: '10%', left: '8%', delay: 0 },
      { type: 'tag', content: '<>', top: '15%', right: '10%', delay: 1 },
      { type: 'branch', content: '⎇', top: '75%', left: '5%', delay: 2 },
      { type: 'slash', content: '/>', top: '65%', right: '8%', delay: 3 },
      { type: 'curly', content: '{{ }}', top: '85%', left: '12%', delay: 4 },
      { type: 'angle', content: '< />', top: '25%', right: '12%', delay: 5 },
    ];
  }

  getParticleStyle(particle: any) {
    return {
      left: `${particle.left}%`,
      'animation-delay': `${particle.delay}ms`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      'animation-duration': `${particle.duration}ms`,
    };
  }

  getFloatingElementStyle(element: any) {
    return {
      top: element.top,
      left: element.left,
      right: element.right,
      'animation-delay': `${element.delay}s`,
    };
  }

  onLogin() {
    if (this.email && this.password) {
      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Login attempt with:', { email: this.email, rememberMe: this.rememberMe });
        this.isLoading = false;

        // Here you would typically handle the login logic
        // For demo purposes, we'll just log and navigate
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }

  onGoogleLogin() {
    this.isLoading = true;
    console.log('Google login initiated');

    // Simulate OAuth flow
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  onGithubLogin() {
    this.isLoading = true;
    console.log('GitHub login initiated');

    // Simulate OAuth flow
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  onForgotPassword() {
    console.log('Forgot password flow initiated');
    // Implement forgot password logic
    alert('Password reset feature coming soon!');
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  onBackToHome() {
    this.router.navigate(['/']);
  }
}
