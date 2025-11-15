import { CommonModule } from '@angular/common';
import { Component, inject, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project';

declare var Toastify: any;

interface Project {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-sidenavbar-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidenavbar-component.html',
  styleUrls: ['./sidenavbar-component.css']
})
export class SidenavbarComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  userEmail = localStorage.getItem('email') || 'user@example.com';
  name = localStorage.getItem('name') || 'User';
  
  searchQuery: string = '';
  isSidebarOpen = false;
  isSidebarCollapsed = false;
  isShowingAll = false;
  isMobile = false;
 
  projects: Project[] = [];

  filteredProjects: Project[] = [...this.projects];

  get visibleProjects(): Project[] {
    const projects = this.filteredProjects;
    return this.isShowingAll ? projects : projects.slice(0, 5);
  }

  get shouldShowMoreButton(): boolean {
    return this.filteredProjects.length > 5 && !this.isShowingAll;
  }

  ngOnInit() {
    this.checkScreenSize();
    
 
  
    this.projectService.getProjects().subscribe({
      next: (result: any) => {
        const backendProjects = result.data;
        this.projects = backendProjects.map((proj: any) => ({
          name: proj.name,
          icon: 'folder'
        }));
        this.filteredProjects = [...this.projects];
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
    

    if (!this.isMobile) {
      this.isSidebarOpen = true;
    }
  }

  filterProjects() {
    if (!this.searchQuery) {
      this.filteredProjects = [...this.projects];
      this.isShowingAll = false;
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.isShowingAll = true;
    }
  }

  toggleShowMore() {
    this.isShowingAll = !this.isShowingAll;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    localStorage.clear();
    Toastify({
      text: 'Logout successful!',
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
    this.router.navigateByUrl('/');
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isSidebarCollapsed = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isSidebarOpen && this.isMobile) {
      if (!target.closest('.sidebar') && !target.closest('.mobile-toggle-btn')) {
        this.closeSidebar();
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isSidebarOpen && this.isMobile) {
      this.closeSidebar();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.checkScreenSize();
    if (this.isMobile) {
      this.isSidebarOpen = false;
      this.isSidebarCollapsed = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
}