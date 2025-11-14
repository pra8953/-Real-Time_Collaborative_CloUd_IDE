import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {

   api = environment.api;
   constructor(private http:HttpClient){};

   createProject(data:any):Observable<any>{
      return this.http.post(`${this.api}/project/add-project`,data);
      
   }

   getProjects(){
      return this.http.get(`${this.api}/project/get-projects`);
   }
  
}
