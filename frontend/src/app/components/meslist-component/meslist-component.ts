import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Activity {
  icon: string;
  message: string;
  time: string;
}

interface TeamMessage {
  sender: string;
  content: string;
  project: string;
  time: string;
}

interface Deadline {
  project: string;
  task: string;
  dueDate: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-meslist-component',
  imports: [CommonModule],
  templateUrl: './meslist-component.html',
  styleUrl: './meslist-component.css',
})
export class MeslistComponent {
  totalProjects = 6;
  activeProjects = 4;

  recentActivities: Activity[] = [
    {
      icon: 'fa-code',
      message: 'New commit in E-commerce',
      time: '2h ago'
    },
    {
      icon: 'fa-user-plus',
      message: 'Sarah joined project',
      time: '5h ago'
    },
    {
      icon: 'fa-branch',
      message: 'New branch created',
      time: '1d ago'
    },
    {
      icon: 'fa-check',
      message: 'Task completed',
      time: '2d ago'
    }
  ];

  teamMessages: TeamMessage[] = [
    {
      sender: 'John',
      content: 'Deployed latest changes to staging. Please review.',
      project: 'E-commerce',
      time: '1h ago'
    },
    {
      sender: 'Sarah',
      content: 'Mobile app UI ready for feedback.',
      project: 'Banking App',
      time: '3h ago'
    }
  ];

  upcomingDeadlines: Deadline[] = [
    {
      project: 'E-commerce',
      task: 'Payment integration',
      dueDate: 'Nov 15',
      daysLeft: 6,
      priority: 'high'
    },
    {
      project: 'Banking App',
      task: 'Security audit',
      dueDate: 'Nov 20',
      daysLeft: 11,
      priority: 'medium'
    }
  ];
}
