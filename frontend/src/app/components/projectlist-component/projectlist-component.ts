import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project';
import { FormsModule } from '@angular/forms';

interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  collaborators: string[];
  progress: number;
  files: any[];
  owner: string;
}

@Component({
  selector: 'app-projectlist-component',
  imports: [CommonModule, RouterLink, NgIf, FormsModule],
  templateUrl: './projectlist-component.html',
  styleUrl: './projectlist-component.css',
})
export class ProjectlistComponent implements OnInit {
  constructor(private projectService: ProjectService) {}

  showCollaboratorModal: boolean = false;
  selectedPermission: string = 'view';
  currentProjectId: string | null = null;
  generatedLink: string | null = null;
  isGeneratingLink: boolean = false;

  projects: Project[] = [];
  isLoading: boolean = true;
  isMobile: boolean = false;
  showDropdown: string | null = null; // Track which project's dropdown is open

  @HostListener('window:resize')
  onWindowResize() {
    this.checkMobile();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close dropdown when clicking outside
    if (!(event.target as Element).closest('.dropdown-container')) {
      this.showDropdown = null;
    }
  }

  ngOnInit() {
    this.checkMobile();
    this.loadProjects();
  }

  private loadProjects() {
    this.isLoading = true;

    this.projectService.getProjects().subscribe({
      next: (result: any) => {
        if (result.success) {
          console.log('API Response:', result.data);
          this.projects = this.transformApiData(result.data);
        } else {
          this.projects = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.projects = [];
        this.isLoading = false;
      },
    });
  }

  private transformApiData(apiData: any[]): Project[] {
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    return apiData.map((project) => {
      // Map API status number to string status
      const statusMap: { [key: number]: 'active' | 'draft' | 'archived' } = {
        1: 'active',
        2: 'draft',
        3: 'archived',
      };

      let collaborators = ['You']; // Default

      if (project.collaborators && project.collaborators.length > 0) {
        // Extract usernames from collaborator objects
        collaborators = project.collaborators.map((collab: any) => {
          if (collab.userId && typeof collab.userId === 'object') {
            return collab.userId.name || collab.userId.email || 'Collaborator';
          }
          return 'Collaborator';
        });
      }

      const progress = this.calculateProgress(project);

      return {
        id: project._id || project.id,
        name: project.name || 'Untitled Project',
        type: project.description || '',
        description: project.description || 'No description available',
        status: statusMap[project.status] || 'draft',
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
        collaborators: collaborators,
        progress: progress,
        files: project.files || [],
        owner: project.owner || '',
      };
    });
  }

  private calculateProgress(project: any): number {
    let progress = 0;

    // Base progress on status
    if (project.status === 1) progress += 40; // active
    else if (project.status === 2) progress += 20; // draft

    // Progress based on description length (more detailed = more complete)
    if (project.description && project.description.length > 50) progress += 20;
    else if (project.description && project.description.length > 20) progress += 10;

    // Progress based on collaborators
    if (project.collaborators && project.collaborators.length > 1) progress += 20;

    // Progress based on files
    if (project.files && project.files.length > 0) progress += 20;

    return Math.min(progress, 100);
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  // Toggle dropdown menu
  toggleDropdown(projectId: string, event: Event) {
    event.stopPropagation();
    this.showDropdown = this.showDropdown === projectId ? null : projectId;
  }

  // Close dropdown
  closeDropdown() {
    this.showDropdown = null;
  }

  // Change project status
  changeStatus(project: Project, newStatus: 'draft' | 'archived' | 'active', event: Event) {
    event.stopPropagation();
    console.log(`Changing project ${project.name} status to:`, newStatus);

    // Update local project status
    project.status = newStatus;

    this.closeDropdown();
  }

  // Edit project
  editProject(project: Project, event: Event) {
    event.stopPropagation();
    console.log('Editing project:', project.name);
    // Implement edit logic - open edit modal or navigate to edit page
    this.closeDropdown();
  }

  // Add collaborator
  addCollaborator(project: Project, event: Event) {
    event.stopPropagation();
    this.closeDropdown();

    this.currentProjectId = project.id;
    this.selectedPermission = 'view';
    this.generatedLink = null;
    this.showCollaboratorModal = true;
  }

  closeCollaboratorModal() {
    this.showCollaboratorModal = false;
  }

  generateInvite() {
    if (!this.currentProjectId) return;

    this.isGeneratingLink = true;
    this.generatedLink = null;

    this.projectService
      .generateInviteLink(this.currentProjectId, this.selectedPermission)
      .subscribe({
        next: (res: any) => {
          this.isGeneratingLink = false;
          if (res.success) {
            this.generatedLink = res.inviteLink;
          } else {
            alert('Failed to generate link: ' + (res.message || 'Unknown error'));
          }
        },
        error: (err) => {
          this.isGeneratingLink = false;
          console.error('Generate link error:', err);
          alert('Error generating link. Please try again.');
        },
      });
  }

  copyLink() {
    if (!this.generatedLink) return;
    navigator.clipboard.writeText(this.generatedLink);
    alert('Link copied!');
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active':
        return 'fas fa-play-circle';
      case 'draft':
        return 'fas fa-edit';
      case 'archived':
        return 'fas fa-archive';
      default:
        return 'fas fa-folder';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  openProject(project: Project) {
    console.log('Opening project:', project.name);
    // Navigate to project detail page
  }

  getCollaboratorInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
