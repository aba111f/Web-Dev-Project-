import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SharedService } from '../../Services/shared.service';
import { Profile } from '../../interfaces/profile';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy{
  private sub!: Subscription;
  private destroy$ = new Subject<void>();
  profile: Profile | null = null;
  greeting: string = "";
  constructor(private router: Router, private service: AuthService, private sharedService: SharedService){
    
  }
  isLogged = false;
  logout(){
    this.service.logout();
    this.isLogged = this.service.isLoggedIn();
    this.profile = null;
    this.greeting = "Hello user!";
  }
  id = localStorage.getItem('user_id');
  ngOnInit(): void {
      this.service.isAuthenticated$.subscribe(isAuth => {
        this.isLogged = isAuth;
      });
      this.service.getProfile(Number(this.id)).pipe(
            takeUntil(this.destroy$)
          ).subscribe({
        next: (res) => {
          this.profile = res;
          this.greeting = this.profile?.FirstName + ' ' + this.profile?.LastName;
        },
        error: (err) => {
          alert("error " + err);
        }
      });
      
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
