import { Routes } from '@angular/router';
import { Index } from '../components/index';
import { CreateProject } from '../components/create-project/create-project';

export const viewRoutes:Routes=[
        {path:"",component:Index},
        {path:"create-project",component:CreateProject}
]