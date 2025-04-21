import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
  private sub!: Subscription;
  constructor(private router: Router, private service: AuthService){
    
  }
  isLogged = false;
  logout(){
    this.service.logout();
    this.isLogged = this.service.isLoggedIn();
  }
  
  ngOnInit(): void {
      this.service.isAuthenticated$.subscribe(isAuth => {
        this.isLogged = isAuth;
      });
  }
  
}
