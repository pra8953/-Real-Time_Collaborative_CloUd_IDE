declare var Toastify: any;
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProjectService } from '../../core/services/project';

@Component({
  selector: 'app-create-project',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css'
})
export class CreateProject {
  
  router = inject(Router)

 projectData= new FormGroup({
    name:new FormControl('',[Validators.required]),
    description:new FormControl('',[Validators.required])
 })

 constructor(private projectService:ProjectService){}


  

  onSubmit() {
    const data = this.projectData.value;
    if(this.projectData.invalid){
      return;
    }
    this.projectService.createProject(data).subscribe({
        next:(result:any)=>{
            if(!result.success){
              Toastify({
               text: 'Project creations failed! ' + (result.message || ''),
                duration: 4000,
                gravity: 'top',
                position: 'right',
                backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
            }).showToast();
            return;
          }

          Toastify({
            text: 'Project created successful!',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
          }).showToast();

          this.router.navigateByUrl('/dashboard');

        },error: (err) => {
       

        const errorMessage =  'Something went wrong! Please try again.';

        Toastify({
          text: 'Project creation failed! ' + errorMessage,
          duration: 4000,
          gravity: 'top',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();

       
      },
    });
    
  }

  

  


}