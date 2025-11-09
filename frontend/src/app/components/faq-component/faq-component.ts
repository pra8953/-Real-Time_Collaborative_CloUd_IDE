import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-faq-component',
  imports: [NgClass, NgIf, NgFor],
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
      question: 'What is Leeco and how does it help in career growth?',
      answer: 'Leeco is an AI-powered career assistant that helps you learn, practice, and grow through personalized resources and insights.',
      open: false,
      icon: '🚀'
    },
    {
      question: 'How is Leeco different from other AI models like ChatGPT or Gemini?',
      answer: 'Leeco focuses specifically on career advancement, interview prep, and skill-building with real-time feedback and mentorship options.',
      open: false,
      icon: '⚡'
    },
    {
      question: 'How does Leeco create a personalized learning path for me?',
      answer: 'It analyzes your skills, goals, and progress using AI to tailor a step-by-step learning journey just for you.',
      open: false,
      icon: '🎯'
    },
    {
      question: 'Can Leeco actually help me prepare for real interviews?',
      answer: 'Yes! It offers mock interviews, personalized feedback, and curated practice questions for your desired role.',
      open: false,
      icon: '💼'
    },
    {
      question: 'Does Leeco work on all coding platforms like LeetCode or HackerRank?',
      answer: 'Yes, Leeco integrates with popular platforms to track your progress and recommend challenges.',
      open: false,
      icon: '🔗'
    },
    {
      question: 'Are human mentors available on Leeco if I get stuck?',
      answer: 'Yes, you can connect with real mentors for guidance, resume reviews, or mock interviews anytime.',
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