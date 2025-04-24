import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Profile } from '../../interfaces/profile';

@Component({
  selector: 'app-side-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  logoPreview: string = "https://duralux-react-dashboard.vercel.app/images/logo-full.png";
  constructor(private authService: AuthService){

  }
  profile: Profile = {
    id: 0,
    username: "",
    FirstName: "",
    LastName: "",
    password: "",
    mail: "",
    phone_num: "",
    age: 0,
    PhotoFileName: null,
    BussinesName: "",
    logoName: null
  }

  ngOnInit(): void {
      const id = localStorage.getItem('user_id');
      if(!id) return;
      this.authService.getProfile(Number(id)).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.profile = res;

        },
        error: (err) => {
          console.warn(err + "Error while retrieving data");
        }
      });
  }
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }
  
}
