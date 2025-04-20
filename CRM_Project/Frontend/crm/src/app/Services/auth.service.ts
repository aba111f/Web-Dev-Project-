import { Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';
import { AuthModel, Token } from '../interfaces/auth-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly APIUrl = "http://127.0.0.1:8000/";
  readonly PhotoUrl = "http://127.0.0.1/images/";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(private http: HttpClient) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState() {
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
  }

  getProfile(id: number):Observable<Profile[]>{
    return this.http.get<Profile[]>(this.APIUrl + "api/profiles/" + id);
  }
  
  uploadProfileData(profile: FormData){
    return this.http.post(this.APIUrl+'api/profiles/', profile);
  }


  logindata(authModel: AuthModel):Observable<Token>{
    return this.http.post<Token>(this.APIUrl + 'api/login/', authModel);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string {
    return localStorage.getItem('access_token') || '';
  }
}
