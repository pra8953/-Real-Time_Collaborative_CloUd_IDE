import { Routes } from '@angular/router';
import { Index } from '../components/index';
import { CreateProject } from '../components/create-project/create-project';
import { IdeComponent } from '../components/ide-component/ide-component';

export const viewRoutes:Routes=[
        {path:"",component:Index},
        {path:"create-project",component:CreateProject},
        {path:"project_ide/:id",component:IdeComponent}
]