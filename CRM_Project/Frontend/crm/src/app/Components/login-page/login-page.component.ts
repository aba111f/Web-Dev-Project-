import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  mail!: string;
  pass!: string;

  constructor(private service: AuthService){

  }
  loginData(){
    var val = {
      email : this.mail,
      password: this.pass
    };
    // alert(this.mail);
    this.service.logindata(val).subscribe(res => {
      alert(res.toString());
    }
    );
    this.mail = "";
    this.pass = "";
  } 
}
