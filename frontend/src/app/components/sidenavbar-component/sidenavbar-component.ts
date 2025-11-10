declare var Toastify: any;
import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
interface Project {
  name: string;
  icon: string;
}
@Component({
  selector: 'app-sidenavbar-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './sidenavbar-component.html',
  styleUrl: './sidenavbar-component.css',
})
export class SidenavbarComponent {
  userEmail = localStorage.getItem('email');
  name=localStorage.getItem('name');
  searchQuery: string = '';
  showMoreVisible: boolean = true;
  router = inject(Router)
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

  filterProjects() {
    if (!this.searchQuery) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  createNewProject() {
    // Implement create new project logic
    console.log('Create new project clicked');
    // You can open a modal or navigate to project creation page
  }

  logout(){
    
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
}
