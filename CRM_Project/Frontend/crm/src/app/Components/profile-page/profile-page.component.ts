import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPageComponent } from '../login-page/login-page.component';
import { SharedService } from '../../Services/shared.service';
import { Profile } from '../../interfaces/profile';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  profile!: Profile;
  constructor(private sharedService: SharedService){}

  form!: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.form = this.fb.group({
      username: '',
      FirstName: '',
      LastName: '',
      password: '',
      mail: '',
      phone_num: '',
      age: null,
      PhotoFile: null,
      BussinesName: '',
      logoFile: null,
    });

    this.loadProfile();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile() {

    const id = Number(localStorage.getItem('user_id'));
    
    
  
    if (isNaN(id)) this.authService.logout();
  
    this.authService.getProfile(id).pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.form.patchValue(data);
  
      this.photoPreview = data.PhotoFileName || null;
      this.logoPreview = data.logoName || null;

    });
  }
  

}
