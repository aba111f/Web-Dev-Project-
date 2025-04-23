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
    const userId = localStorage.getItem('user_id');
    return this.http.get<Employee[]>(`${this.API}profiles/${userId}/employee/`);
  }

  create(data: EmployeeCreate): Observable<Employee> {
    const userId = localStorage.getItem('user_id');
    const requestData = {
      FirstName: data.FirstName, // Совпадает с моделью Django
      LastName: data.LastName,
      mail: data.mail,
      salary: data.salary,
      specialization: data.specialization,
      is_active: data.is_active,
      user_id: localStorage.getItem('user_id')
    };
  
    return this.http.post<Employee>(
      `${this.API}profiles/${userId}/employee/`, 
      requestData
    );
  }
  
  update(id: number, data: EmployeeCreate): Observable<Employee> {
    const userId = localStorage.getItem('user_id');
    const requestData = {
      first_name: data.FirstName,
      last_name: data.LastName,
      mail: data.mail,
      salary: data.salary,
      specialization: data.specialization,
      is_active: data.is_active
    };
  
    return this.http.put<Employee>(
      `${this.API}profiles/${userId}/employee/${id}/`,
      requestData
    );
  }

  delete(id: number): Observable<void> {
    const userId = localStorage.getItem('user_id');
    return this.http.delete<void>(
      `${this.API}profiles/${userId}/employee/${id}/`
    );
  }
  
}
