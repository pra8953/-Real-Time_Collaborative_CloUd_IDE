import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Authservices {
  private api = environment.api;

  constructor(private http:HttpClient){};

  login(data:any):Observable<any>{
   return this.http.post(this.api+"/auth/login",data);
  }

  signup(data:any):Observable<any>{
    return this.http.post(this.api+"/auth/signup",data);
    
  }
  
}
