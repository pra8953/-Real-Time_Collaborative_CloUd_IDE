declare var Toastify: any;
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectService } from '../../core/services/project';

@Component({
  selector: 'app-edit-project',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css',
})
export class EditProjectComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  projectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    visibility: new FormControl('private'),
  });

  projectId: string = '';
  createdAt: string = '';
  loading: boolean = true;
  updating: boolean = false;
  deleting: boolean = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProjectDetails();
    });
  }

  editProject(projectId: string, event: Event) {
    this.router.navigate(['/edit-project', projectId]);
  }

  loadProjectDetails() {
    this.loading = true;
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (result: any) => {
        if (result.success) {
          console.log(result.data);
          const project = result.data;
          this.projectForm.patchValue({
            name: project.name,
            description: project.description,
            visibility: project.visibility || 'private',
          });
          this.createdAt = project.createdAt;
        } else {
          Toastify({
            text: 'Failed to load project details!',
            duration: 4000,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
          }).showToast();
          this.router.navigateByUrl('/dashboard');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading project:', err);
        Toastify({
          text: 'Error loading project details!',
          duration: 4000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();
        this.router.navigateByUrl('/dashboard');
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.updating = true;
    const data = this.projectForm.value;

    this.projectService.updateProject(this.projectId, data).subscribe({
      next: (result: any) => {
        this.updating = false;

        if (!result.success) {
          Toastify({
            text: 'Project update failed! ' + (result.message || ''),
            duration: 4000,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
          }).showToast();
          return;
        }

        Toastify({
          text: 'Project updated successfully!',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
        }).showToast();

        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.updating = false;
        const errorMessage = err.error?.message || 'Something went wrong! Please try again.';

        Toastify({
          text: 'Project update failed! ' + errorMessage,
          duration: 4000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();
      },
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.projectForm.controls).forEach((key) => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }
}
