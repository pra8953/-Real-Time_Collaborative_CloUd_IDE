import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  type: string;
  content: string;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-main1-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main1-component.html',
  styleUrls: ['./main1-component.css']
})
export class Main1Component implements OnInit, OnDestroy {
  
  floatingElements: FloatingElement[] = [];
  
  codeSnippets = [
    [
      '// Real-time collaboration setup',
      'const collaborationConfig = {',
      '  realTimeEditing: true,',
      '  versionControl: "git",',
      '  conflictResolution: "auto",',
      '  teamMembers: ["alice", "bob", "charlie"]',
      '};',
      '',
      'DeployJS.enableCollaboration(collaborationConfig)',
      '  .then(() => console.log("👥 Collaboration enabled!"));'
    ],
    [
      '// Project deployment configuration',
      'async function deployProject() {',
      '  const project = {',
      '    name: "my-awesome-app",',
      '    repository: "github.com/user/repo",',
      '    environment: "production",',
      '    autoScale: true',
      '  };',
      '',
      '  const result = await DeployJS.deploy(project);',
      '  console.log("🚀 Project deployed successfully!");',
      '  return result;',
      '}'
    ],
    [
      '// Socket.io real-time updates',
      'const socket = io("https://deployjs.com");',
      '',
      'socket.on("code-update", (data) => {',
      '  const { filePath, content, user } = data;',
      '  updateEditorContent(filePath, content);',
      '  showCollaborator(user);',
      '});',
      '',
      'function sendUpdate(update) {',
      '  socket.emit("code-change", update);',
      '}'
    ],
    [
      '// Authentication setup',
      'const auth = DeployJS.auth();',
      '',
      '// Multiple login options',
      'auth.signInWithGoogle()',
      '  .then(user => console.log("Welcome!", user));',
      '',
      'auth.signInWithGitHub()',
      '  .then(user => console.log("Welcome!", user));',
      '',
      'auth.signInWithEmail(email, password)',
      '  .then(user => console.log("Welcome!", user));'
    ]
  ];

  currentSnippetIndex = 0;
  currentLineIndex = 0;
  displayedLines: string[] = [];
  isTyping = false;
  typingInterval: any;
  snippetInterval: any;

  // Stats data
  stats = [
    { icon: '🚀', value: '50K+', label: 'Active Developers' },
    { icon: '⚡', value: '99.9%', label: 'Uptime' },
    { icon: '🔒', value: '256-bit', label: 'Security' },
    { icon: '🌍', value: '15+', label: 'Global Regions' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.generateFloatingElements();
    this.startContinuousTyping();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.snippetInterval) {
      clearInterval(this.snippetInterval);
    }
  }

  generateFloatingElements(): void {
    const elements = [
      { type: 'html-tag', content: '<div>' },
      { type: 'css-tag', content: '.class' },
      { type: 'js-tag', content: 'function()' },
      { type: 'bracket', content: '{}' },
      { type: 'html-tag', content: '</>' },
      { type: 'css-tag', content: '#id' },
      { type: 'js-tag', content: '=>' },
      { type: 'bracket', content: '[]' }
    ];

    this.floatingElements = elements.map((el, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      type: el.type,
      content: el.content,
      duration: Math.random() * 5 + 8,
      delay: Math.random() * 5
    }));
  }

  getFloatingElementStyle(element: FloatingElement): any {
    return {
      left: `${element.x}%`,
      top: `${element.y}%`,
      'animation-duration': `${element.duration}s`,
      'animation-delay': `${element.delay}s`
    };
  }

  startContinuousTyping(): void {
    this.typeCurrentSnippet();
    
    // Switch to next snippet after current one finishes
    this.snippetInterval = setInterval(() => {
      this.currentSnippetIndex = (this.currentSnippetIndex + 1) % this.codeSnippets.length;
      this.displayedLines = [];
      this.currentLineIndex = 0;
      this.typeCurrentSnippet();
    }, 10000); // Change snippet every 10 seconds
  }

  typeCurrentSnippet(): void {
    const currentSnippet = this.codeSnippets[this.currentSnippetIndex];
    this.currentLineIndex = 0;
    this.displayedLines = [];
    this.isTyping = true;

    this.typeLine(currentSnippet);
  }

  typeLine(snippet: string[]): void {
    if (this.currentLineIndex >= snippet.length) {
      this.isTyping = false;
      return;
    }

    const line = snippet[this.currentLineIndex];
    let charIndex = 0;
    this.displayedLines.push('');

    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    this.typingInterval = setInterval(() => {
      if (charIndex < line.length) {
        this.displayedLines[this.currentLineIndex] += line.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typingInterval);
        
        // Move to next line after a short delay
        setTimeout(() => {
          this.currentLineIndex++;
          this.typeLine(snippet);
        }, 150);
      }
    }, 40); // Typing speed
  }

  onGetStarted(): void {
    console.log('Getting started...');
    // Add your get started logic here
  }

  onWatchDemo(): void {
    console.log('Playing demo...');
    // Add your demo play logic here
  }

  onLaunchTerminal(): void {
    console.log('Launching terminal...');
    // Add terminal launch logic
  }

  onOpenDocs(): void {
    console.log('Opening documentation...');
    // Add docs opening logic
  }
}