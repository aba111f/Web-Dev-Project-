import { Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { AuthModel, Token } from '../interfaces/auth-model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly APIUrl = "http://127.0.0.1:8000/";
  readonly PhotoUrl = "http://127.0.0.1/images/";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private id!:number;

  
  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialAuthState();
  }

  private checkInitialAuthState() {
    const token = localStorage.getItem('access');
    this.isAuthenticatedSubject.next(!!token);
  }

  getProfile(id: number):Observable<Profile>{
    
    return this.http.get<Profile>(this.APIUrl + "api/profiles/" + id+"/");
  }
  
  

  uploadProfileData(profile: FormData){
    return this.http.post(this.APIUrl+'api/profiles/', profile);
  }


  logindata(authModel: AuthModel): Observable<Token> {
    return this.http.post<Token>(this.APIUrl + 'api/login/', authModel).pipe(
      tap((token: Token) => {
        localStorage.setItem('access', token.access);
        localStorage.setItem('refresh', token.refresh);
        localStorage.setItem('user_id', token.user_id.toString());
      })
    );
  }

  refreshdata(): Observable<Token> {
    const refresh = localStorage.getItem('refresh');
    return this.http.post<Token>(this.APIUrl + 'refresh/',
      {
        refresh
      }
    )
    .pipe(
      tap((token: Token) => {
        localStorage.setItem('access', token.access);
        localStorage.setItem('refresh', token.refresh);
        localStorage.setItem('user_id', token.user_id.toString());
      }),
      
      catchError( err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    localStorage.removeItem('refresh');
    localStorage.removeItem('access');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  logged(){
    this.isAuthenticatedSubject.next(true);
  } 

  getToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  updateData(id:number, data: FormData){
    return this.http.put(this.APIUrl+'api/profiles/'+id+'/', data);
  }
}
