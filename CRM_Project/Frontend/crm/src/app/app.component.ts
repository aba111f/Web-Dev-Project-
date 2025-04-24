import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./Components/nav-bar/nav-bar.component";
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from './Services/auth.service';
import { Profile } from './interfaces/profile';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, SideBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @Input() getBool: boolean | undefined;
  title = 'crm';
  isPresed: boolean = false;
  isLogged: boolean = false;
  private destroy$ = new Subject<void>();
  profile: Profile | null = null;

  
  constructor(private service: AuthService){}
  ngOnInit(): void {
        let id = localStorage.getItem('user_id');
        this.service.isAuthenticated$.pipe(
          takeUntil(this.destroy$)
        ).subscribe(isAuth => {
          this.isLogged = isAuth;
  
          if(this.isLogged){
            this.service.getProfile(Number(id)).pipe(
              takeUntil(this.destroy$)
            ).subscribe({
                next: (res) => {
                  this.profile = res;
                  
                },
                error: (err) => {
                  alert("error " + err);
                }
              });
          }
        });
        
        
    }
  openCloseSide(){
    if(!this.isPresed){
      this.isPresed = true;
    }
    else{
      this.isPresed = false;
    }
  }
}
