import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private api = environment.api;
  constructor(private http:HttpClient){};

  getfiles(id:any):Observable<any>{
      return this.http.get(`${this.api}/file/get-files/${id}`);
  }

  addfile(data:any):Observable<any>{
      return this.http.post(`${this.api}/file/add-file`,data);
  }


  updatefile(id:any,data:any):Observable<any>{
    return this.http.put(`${this.api}/file/updated-file/${id}`,data);
  }

  deleteFile(id:any):Observable<any>{
    return this.http.delete(`${this.api}/file/delete-file/${id}`)
  }

}
