import { Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { AuthModel, Token } from '../interfaces/auth-model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl = "http://127.0.0.1:8000/";
  readonly PhotoUrl = "http://127.0.0.1/images/";

  private profileSubject = new BehaviorSubject<Profile | null>(null);
  profile$ = this.profileSubject.asObservable();
  
 setProfile(profile: Profile){
    this.profileSubject.next(profile);
 }
}
