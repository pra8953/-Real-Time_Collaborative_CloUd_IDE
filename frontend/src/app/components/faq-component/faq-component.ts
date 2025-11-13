import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-faq-component',
  imports: [NgIf, NgFor],
  templateUrl: './faq-component.html',
  styleUrls: ['./faq-component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
          stagger(120, [
            animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ 
          height: '0', 
          opacity: 0,
          transform: 'translateY(-10px)'
        }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            height: '*', 
            opacity: 1,
            transform: 'translateY(0)'
          }))
      ]),
      transition(':leave', [
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            height: '0', 
            opacity: 0,
            transform: 'translateY(-10px)'
          }))
      ])
    ]),
    trigger('rotateChevron', [
      transition('false => true', [
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'rotate(180deg)' }))
      ]),
      transition('true => false', [
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ transform: 'rotate(0deg)' }))
      ])
    ]),
    trigger('pulseGlow', [
      transition('false => true', [
        animate('0.8s ease-out', 
          keyframes([
            style({ 'box-shadow': '0 0 0 0 rgba(168, 85, 247, 0.4)', offset: 0 }),
            style({ 'box-shadow': '0 0 0 15px rgba(168, 85, 247, 0)', offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class FaqComponent {
  faqs = [
    {
      question: 'What is CodeCollab?',
      answer: 'CodeCollab is a real-time collaborative IDE that allows multiple users to code, edit, and debug together online. It works directly in your browser — no installation required.',
      open: false,
      icon: '🚀'
    },
    {
      question: 'How does real-time collaboration work?',
      answer: 'When multiple users open the same project, every keystroke, cursor movement, and change is instantly synchronized using WebSocket-based technology, ensuring a smooth, live editing experience for everyone.',
      open: false,
      icon: '⚡'
    },
    {
      question: 'Can I run my code directly in the IDE?',
      answer: 'Yes! CodeCollab supports running and testing code in multiple languages using secure containerized environments, so you can see results instantly without leaving the editor.',
      open: false,
      icon: '🎯'
    },
    {
      question: 'What technologies power CodeTogether?',
      answer: 'CodeTogether is built with Angular, Node.js, and Express on the frontend and backend, using Socket.io for real-time communication and Monaco Editor (the same editor used by VS Code) for the code editing interface.',
      open: false,
      icon: '💼'
    },
    {
      question: 'Can I collaborate with friends in different locations?',
      answer: 'Yes! That’s the heart of CodeTogether — invite anyone from anywhere, and start coding together instantly, just by sharing a project link.',
      open: false,
      icon: '🔗'
    },
    {
      question: 'Do I need to install anything to use CodeTogether?',
      answer: 'No installation is required! CodeCollab runs entirely in your browser. Just sign in, create or join a project, and start coding collaboratively in seconds',
      open: false,
      icon: '👥'
    },
  ];

  particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    animationDelay: Math.random() * 20,
    duration: Math.random() * 10 + 10
  }));

  toggle(index: number) {
    // Pulse animation trigger
    const wasOpen = this.faqs[index].open;
    
    if (!wasOpen) {
      this.faqs.forEach((faq, i) => {
        if (i !== index) {
          faq.open = false;
        }
      });
    }
    
    this.faqs[index].open = !this.faqs[index].open;
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

  // Optional: Method to close all FAQs
  closeAll() {
    this.faqs.forEach(faq => faq.open = false);
  }
}