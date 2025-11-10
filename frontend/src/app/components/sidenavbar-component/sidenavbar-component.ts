import { CommonModule } from '@angular/common';
import { Component, inject, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var Toastify: any;

interface Project {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-sidenavbar-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidenavbar-component.html',
  styleUrl: './sidenavbar-component.css',
})
export class SidenavbarComponent {
  userEmail = localStorage.getItem('email');
  name = localStorage.getItem('name');
  searchQuery: string = '';
  showMoreVisible: boolean = true;
  isSidebarOpen = false;
  isShowingAll = false;
  router = inject(Router);

  projects: Project[] = [
    { name: 'GeeksForGeeks160dayChallenge', icon: 'folder' },
    { name: 'my_video_tracker_xblock', icon: 'folder' },
    { name: 'DSA_With_lava', icon: 'folder' },
    { name: 'BookYourRide', icon: 'folder' },
    { name: 'Uphaar', icon: 'folder' },
    { name: 'MAANG-Most-askDSA-Question', icon: 'folder' },
    { name: 'Raj85446696', icon: 'folder' },
    { name: 'React-Dashboard', icon: 'folder' },
    { name: 'E-commerce-API', icon: 'folder' },
    { name: 'Portfolio-2024', icon: 'folder' }
  ];

  filteredProjects: Project[] = [...this.projects];

  get visibleProjects(): Project[] {
    const projects = this.filteredProjects;
    return this.isShowingAll ? projects : projects.slice(0, 5);
  }

  get shouldShowMoreButton(): boolean {
    return this.filteredProjects.length > 5 && !this.isShowingAll;
  }

  ngOnInit() {
    this.filteredProjects = [...this.projects];
    // Open sidebar on desktop by default
    if (window.innerWidth >= 768) {
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

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  createNewProject() {
    console.log('Create new project clicked');
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isSidebarOpen && window.innerWidth < 768) {
      if (!target.closest('.sidebar') && !target.closest('.mobile-toggle-btn')) {
        this.closeSidebar();
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isSidebarOpen && window.innerWidth < 768) {
      this.closeSidebar();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (window.innerWidth >= 768) {
      this.isSidebarOpen = true;
    } else {
      this.isSidebarOpen = false;
    }
  }
}