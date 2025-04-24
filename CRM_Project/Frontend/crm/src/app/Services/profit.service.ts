import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profit } from '../interfaces/profit';

@Injectable({
  providedIn: 'root'
})
export class ProfitService {
  private userId = localStorage.getItem('user_id');

  readonly baseUrl = "http://127.0.0.1:8000/api/profiles/";

  constructor(private http: HttpClient) {}

  getTotalProfit(): Observable<Profit[]> {
    
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    
    return this.http.get<Profit[]>(`${this.baseUrl}${this.userId}/totalprofit/`);
  }


  addProfit(profit: Profit): Observable<Profit> {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    
    const profitWithUser = {
      ...profit,
      date: this.formatDateForBackend(profit.date),
      user_id: Number(this.userId)
    };
    console.log(profitWithUser)
    return this.http.post<Profit>(`${this.baseUrl}${this.userId}/totalprofit/`, profitWithUser);
  }

  updateProfit(profit: Profit): Observable<Profit> {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    if (!profit.id) {
      throw new Error('Profit ID is required for update.');
    }

    const updatedData = {
      ...profit,
      date: this.formatDateForBackend(profit.date)
    };
    
    return this.http.put<Profit>(`${this.baseUrl}${this.userId}/totalprofit/${profit.id}/`, updatedData);
  }

  deleteProfit(profitId: number | undefined): Observable<any> {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    
    return this.http.delete(`${this.baseUrl}${this.userId}/totalprofit/${profitId}/`);
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString().split('T')[0]; 
  }

}
