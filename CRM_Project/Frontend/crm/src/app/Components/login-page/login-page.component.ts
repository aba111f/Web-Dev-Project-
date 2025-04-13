import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { AuthModel } from '../../interfaces/auth-model';
@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  authModel: AuthModel;

  constructor(private service: AuthService){
    this.authModel = {} as AuthModel;
  }
  loginData(){
    this.service.logindata(this.authModel).subscribe(token => {
      localStorage.setItem('access', token.access);
      localStorage.setItem('refresh', token.refresh);
    }
    );
    this.authModel.username = '';
    this.authModel.password = '';
  } 
}
