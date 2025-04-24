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

  getTotalProfit(): Observable<Project[]> {
    
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    
    return this.http.get<Project[]>(`${this.baseUrl}${this.userId}/activeproject/`);
  }


  addProfit(profit: Project): Observable<Project> {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    
    const profitWithUser = {
      ...profit,
      user_id: Number(this.userId)
    };
    console.log(profitWithUser)
    return this.http.post<Project>(`${this.baseUrl}${this.userId}/activeproject/`, profitWithUser);
  }

  updateProfit(project: Project): Observable<Project> {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    if (!project.id) {
      throw new Error('Profit ID is required for update.');
    }

    
    return this.http.put<Project>(`${this.baseUrl}${this.userId}/activeproject/${project.id}/`, project);
  }

  deleteProfit(projectId: number | undefined): Observable<any> {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    
    return this.http.delete(`${this.baseUrl}${this.userId}/activeproject/${projectId}/`);
  }

}
