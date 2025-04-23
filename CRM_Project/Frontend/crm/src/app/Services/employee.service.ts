import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee, EmployeeCreate } from '../interfaces/employee';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private API = 'http://localhost:8000/api/';

  getAll(): Observable<Employee[]> {
    const userId = this.auth.getID();
    return this.http.get<Employee[]>(`${this.API}/profiles/${userId}/employee/`);
  }

  create(data: EmployeeCreate): Observable<Employee> {
    const userId = this.auth.getID();
    return this.http.post<Employee>(
      `${this.API}/profiles/${userId}/employee/`,
      data
    );
  }

  update(id: number, data: EmployeeCreate): Observable<Employee> {
    const userId = this.auth.getID();
    return this.http.put<Employee>(
      `${this.API}/profiles/${userId}/employee/${id}/`,
      data
    );
  }

  delete(id: number): Observable<void> {
    const userId = this.auth.getID();
    return this.http.delete<void>(
      `${this.API}/profiles/${userId}/employee/${id}/`
    );
  }
  
}
