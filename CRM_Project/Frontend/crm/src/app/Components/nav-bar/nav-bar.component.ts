import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Profile } from '../../interfaces/profile';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  profile: Profile | null = null;
  greeting: string = "Hello user";
  constructor(private router: Router, private service: AuthService){
    
  }
  isLogged = false;
  logout(){
    this.service.logout();
    this.isLogged = this.service.isLoggedIn();
    this.profile = null;
  }
  
  ngOnInit(): void {
      let id = Number(localStorage.getItem('user_id'));
      if(isNaN(id)) this.service.logout();
      this.service.isAuthenticated$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(isAuth => {
        this.isLogged = isAuth;

        if(this.isLogged){
          this.service.getProfile(id).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
              next: (res) => {
                this.profile = res;
                this.greeting = this.profile?.FirstName + ' ' + this.profile?.LastName;
              },
              error: (err) => {
                alert("error in navbar" + err);
              }
            });
        }
      });
      
      
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
