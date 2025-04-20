import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { AuthModel } from '../../interfaces/auth-model';
import { HttpClient } from '@angular/common/http';
import { Token } from '../../interfaces/auth-model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  token!: Token;
  authModel: AuthModel;
  
  constructor(private service: AuthService, private router: Router){
    this.authModel = {} as AuthModel;
    
  }
  loginData(){
    this.service.logindata(this.authModel).subscribe(token => {
      localStorage.setItem('access', token.access);
      localStorage.setItem('refresh', token.refresh);
      this.token=token;
      this.router.navigate(['/profile']);

    }
    );
    
    this.authModel.username = '';
    this.authModel.password = '';

  } 
  getID():number{
    console.log(this.token.id);
    return this.token.id;
  }
}
