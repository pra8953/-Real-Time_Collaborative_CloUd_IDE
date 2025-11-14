import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MeslistComponent } from "../meslist-component/meslist-component";
import { RouterLink } from "@angular/router";

interface Project {
  id: number;
  name: string;
  type: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  branches: number;
  commits: number;
  collaborators: string[];
}

@Component({
  selector: 'app-projectlist-component',
  imports: [CommonModule,  RouterLink],
  templateUrl: './projectlist-component.html',
  styleUrl: './projectlist-component.css',
})
export class ProjectlistComponent {
  projects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform',
      type: 'Web Application',
      description: 'A full-stack e-commerce solution with React frontend and Node.js backend',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-11-08'),
      branches: 3,
      commits: 142,
      collaborators: ['John', 'Sarah', 'Mike', 'Emma']
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      type: 'Mobile Application',
      description: 'Cross-platform mobile banking application built with Flutter',
      status: 'active',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-11-09'),
      branches: 2,
      commits: 89,
      collaborators: ['Alex', 'Lisa']
    },
    {
      id: 3,
      name: 'AI Chatbot',
      type: 'Machine Learning',
      description: 'Intelligent chatbot using natural language processing and machine learning',
      status: 'draft',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-11-05'),
      branches: 1,
      commits: 56,
      collaborators: ['David']
    },
    {
      id: 4,
      name: 'Portfolio Website',
      type: 'Static Website',
      description: 'Personal portfolio website showcasing projects and skills',
      status: 'active',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-11-07'),
      branches: 1,
      commits: 34,
      collaborators: ['You']
    },
    {
      id: 5,
      name: 'Task Management Tool',
      type: 'Web Application',
      description: 'Collaborative task management tool with real-time updates',
      status: 'archived',
      createdAt: new Date('2023-12-01'),
      updatedAt: new Date('2024-10-15'),
      branches: 4,
      commits: 210,
      collaborators: ['Tom', 'Jerry', 'Alice', 'Bob', 'Charlie']
    },
    {
      id: 6,
      name: 'Data Analytics Dashboard',
      type: 'Dashboard',
      description: 'Real-time data visualization and analytics dashboard',
      status: 'active',
      createdAt: new Date('2024-04-18'),
      updatedAt: new Date('2024-11-09'),
      branches: 2,
      commits: 78,
      collaborators: ['Eva', 'Frank', 'Grace']
    }
  ];

  // Mobile state management
  isMobile = false;

  @HostListener('window:resize')
  onWindowResize() {
    this.checkMobile();
  }

  ngOnInit() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  // Format date for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Get relative time for updated date
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return this.formatDate(date);
    }
  }

  createNewProject() {
    console.log('Create new project clicked');
    // Implement project creation logic
  }

  openProject(project: Project) {
    console.log('Opening project:', project.name);
    // Implement project opening logic
  }
}