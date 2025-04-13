import { Injectable } from '@angular/core';
import { Profile } from '../interfaces/profile';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthModel, Token } from '../interfaces/auth-model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly APIUrl = "http://127.0.0.1:8000/";
  readonly PhotoUrl = "http://127.0.0.1/images/";
  
  constructor(private http: HttpClient) { }

  getProfile(id: number):Observable<Profile[]>{
    return this.http.get<Profile[]>(this.APIUrl + "api/profiles/" + id);
  }
  
  uploadProfileData(profile: Profile){
    return this.http.post(this.APIUrl, profile);
  }

  UploadPhoto(val: any){
    return this.http.post(this.APIUrl+'SaveFile/',val);
  }

  logindata(authModel: AuthModel):Observable<Token>{
    return this.http.post<Token>(this.APIUrl + 'login/', authModel);
  }



}
