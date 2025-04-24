import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private userId = localStorage.getItem('user_id');

  readonly baseUrl = "http://127.0.0.1:8000/api/profiles/";

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
      
      if (!this.userId) {
        throw new Error('User ID not found in localStorage.');
      }
      
      return this.http.get<Project[]>(`${this.baseUrl}${this.userId}/activeproject`);

    }

  addProject(client: Project): Observable<Project> {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage.');
      }
    
      return this.http.post<Project>(`${this.baseUrl}${this.userId}/activeproject/`, client);
    }

    updateProjectStatus(clientId: number, is_active: boolean): Observable<any> {
      if (!this.userId) throw new Error('User ID not found in localStorage.');
      return this.http.patch(`${this.baseUrl}${this.userId}/activeproject/${clientId}/`, {
        is_active: is_active
      });
    }

    deleteProject(projectId: number): Observable<any> {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage.');
      }
    
      return this.http.delete(`${this.baseUrl}${this.userId}/activeproject/${projectId}/`);
    }
    
    
  
  


}
