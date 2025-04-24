import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { AuthModel } from '../../interfaces/auth-model';
import { HttpClient } from '@angular/common/http';
import { Token } from '../../interfaces/auth-model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnDestroy {
  token!: Token;
  authModel: AuthModel;
  private destroy$ = new Subject<void>();
  constructor(private service: AuthService, private router: Router){
    this.authModel = {} as AuthModel;
    
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loginData(){
    this.service.logindata(this.authModel).pipe(takeUntil(this.destroy$))
    .subscribe(token => {
      this.service.logged();
      localStorage.setItem('user_id', token.user_id.toString());
      
      this.router.navigate(['/profile']).then(() => {
        window.location.reload();
      });

    }
    );
    
    this.authModel.username = '';
    this.authModel.password = '';

  } 

 
}
