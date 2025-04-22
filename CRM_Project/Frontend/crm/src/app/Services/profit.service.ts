import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfitService {
  readonly baseUrl = "http://127.0.0.1:8000/api/Graphics/TotalProfit/";

  constructor(private http: HttpClient) {}

  getTotalProfit(): Observable<any> {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      throw new Error('User ID not found in localStorage.');
    }
    return this.http.get<any>(`${this.baseUrl}/`);
  }
}
