declare var Toastify: any;
import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  query,
  stagger,
} from '@angular/animations';
import { Authservices } from '../../core/services/authservices';

@Component({
  selector: 'app-login',
  
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
  userLogin = new FormGroup({
      email:new FormControl('',[Validators.required, Validators.email]),
      password:new FormControl('',[Validators.required,Validators.minLength(8)])
  })
  rememberMe: boolean = false;
  isLoading: boolean = false;

  particles: any[] = [];
  floatingElements: any[] = [];
  currentParticleState = 0;

  constructor(private el: ElementRef, private router: Router,private authService:Authservices) {}

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
  if (this.userLogin.invalid) {
    // Optionally, mark all fields as touched
    this.userLogin.markAllAsTouched();
    return;
  }

  const loginData = this.userLogin.value;
  const email = this.userLogin.get('email')?.value ?? 'user@gmail.com';
  this.isLoading = true;

  this.authService.login(loginData).subscribe({
    next: (result: any) => {
      this.isLoading = false;

      if (!result.success) {
        // Show backend error message
        Toastify({
          text: "Login failed! " + (result.message || ''),
          duration: 4000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
        return;
      }

      // Success
      localStorage.setItem('token', result.token);
      localStorage.setItem('name', result.name);
      localStorage.setItem('email', email);

      Toastify({
        text: "Login successful!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
      }).showToast();

      this.router.navigateByUrl('/dashboard');
    },
    error: (err) => {
      this.isLoading = false;

      const errorMessage = err.error?.message || 'Something went wrong! Please try again.';

      Toastify({
        text: "Login failed! " + errorMessage,
        duration: 4000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
      }).showToast();

      console.error('Login error:', err);
    }
  });
}


  

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  onBackToHome() {
    this.router.navigate(['/']);
  }
}
