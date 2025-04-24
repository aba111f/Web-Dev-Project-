import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActiveClients } from '../interfaces/active-clients';

@Injectable({
  providedIn: 'root'
})
export class ActiveClientsService {
  private userId = localStorage.getItem('user_id');

  readonly baseUrl = "http://127.0.0.1:8000/api/profiles/";

  constructor(private http: HttpClient) {}

  getActiveClients(): Observable<ActiveClients[]> {
      
      if (!this.userId) {
        throw new Error('User ID not found in localStorage.');
      }
      
      return this.http.get<ActiveClients[]>(`${this.baseUrl}${this.userId}/activeclient`);

    }

  addClient(client: ActiveClients): Observable<ActiveClients> {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage.');
      }

      console.log(client);
    
      return this.http.post<ActiveClients>(`${this.baseUrl}${this.userId}/activeclient/`, client);
    }

    updateClientStatus(clientId: number, is_active: boolean): Observable<any> {
      if (!this.userId) throw new Error('User ID not found in localStorage.');
      return this.http.patch(`${this.baseUrl}${this.userId}/activeclient/${clientId}/`, {
        is_active: is_active
      });
    }

    deleteClient(clientId: number): Observable<any> {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage.');
      }
    
      return this.http.delete(`${this.baseUrl}${this.userId}/activeclient/${clientId}/`);
    }
    
    
  
  


}
