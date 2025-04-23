import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profit } from '../interfaces/profit';

@Injectable({
  providedIn: 'root'
})
export class ProfitService {
  private userId = localStorage.getItem('user_id');

  readonly baseUrl = "http://127.0.0.1:8000/api/Graphics/TotalProfit/";

  constructor(private http: HttpClient) {}

  getTotalProfit(): Observable<Profit[]> {
    
    if (!this.userId) {
      throw new Error('User ID not found in localStorage.');
    }
    return this.http.get<Profit[]>(`${this.baseUrl}${this.userId}/`);
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
    return this.http.post<Profit>(`${this.baseUrl}${this.userId}/`, profitWithUser);
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString().split('T')[0]; 
  }

}
