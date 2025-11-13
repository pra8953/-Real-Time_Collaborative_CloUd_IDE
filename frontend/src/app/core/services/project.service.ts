import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: Project[] = [
    { id: 1, name: 'Website Redesign', createdAt: new Date('2023-01-15') },
    { id: 2, name: 'Mobile App Development', createdAt: new Date('2023-02-20') },
    { id: 3, name: 'Marketing Campaign', createdAt: new Date('2023-03-10') },
    { id: 4, name: 'E-commerce Platform', createdAt: new Date('2023-04-05') },
    { id: 5, name: 'Dashboard Analytics', createdAt: new Date('2023-05-12') },
    { id: 6, name: 'API Integration', createdAt: new Date('2023-06-18') },
    { id: 7, name: 'UI/UX Research', createdAt: new Date('2023-07-22') },
    { id: 8, name: 'Content Strategy', createdAt: new Date('2023-08-30') }
  ];

  getProjects(): Project[] {
    return this.projects;
  }

  filterProjects(projects: Project[], query: string): Project[] {
    if (!query) return projects;
    return projects.filter(project =>
      project.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
