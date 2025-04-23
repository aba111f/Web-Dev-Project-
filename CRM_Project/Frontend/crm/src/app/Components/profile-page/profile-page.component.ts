import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPageComponent } from '../login-page/login-page.component';
import { SharedService } from '../../Services/shared.service';
import { Profile } from '../../interfaces/profile';

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
  private http = inject(HttpClient);
  profile!: Profile;
  constructor(private sharedService: SharedService){}

  form!: FormGroup;
  profileId: number=localStorage.getItem('user_id') ? Number(localStorage.getItem('user_id')) : 0;
  photoPreview: string | ArrayBuffer | null = null;
  logoPreview: string | ArrayBuffer | null = null;

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

  loadProfile() {
    let id = this.profileId;
    if (!id) {
      const stored = localStorage.getItem('user_id');
      if (stored) id = Number(stored);
    }
  
    if (!id) return;
  
    this.authService.getProfile(id).subscribe((data: any) => {
      this.form.patchValue(data);
  
      this.photoPreview = data.PhotoFileName || null;
      this.logoPreview = data.logoName || null;

      const profile: Profile = {
        id: data.id,
        FirstName: data.FirstName,
        LastName: data.LastName,
        username: data.username,
        password: data.password,
        mail: data.mail,
        PhotoFileName: data.PhotoFileName,
        logoName: data.logoName,
        BussinesName: data.BussinesName,
        phone_num: data.phone_num,
        age: data.age
      };
  
      this.sharedService.setProfile(profile);
    });
  }
  

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ PhotoFile: file });

    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = reader.result);
    reader.readAsDataURL(file);
  }

  onLogoChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ logoFile: file });

    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result);
    reader.readAsDataURL(file);
  }

  submit() {
    const formData = new FormData();
    const formValue = this.form.value;
  
    if (formValue.username) formData.append('username', formValue.username);
    if (formValue.FirstName) formData.append('FirstName', formValue.FirstName);
    if (formValue.LastName) formData.append('LastName', formValue.LastName);
    if (formValue.password) formData.append('password', formValue.password);
    if (formValue.mail) formData.append('mail', formValue.mail);
    if (formValue.phone_num) formData.append('phone_num', formValue.phone_num);
    if (formValue.age !== null && formValue.age !== undefined) {
      formData.append('age', formValue.age.toString());
    }
    if (formValue.BussinesName) formData.append('BussinesName', formValue.BussinesName);
  

    if (formValue.PhotoFile instanceof File) {
      formData.append('PhotoFile', formValue.PhotoFile);
    }
    if (formValue.logoFile instanceof File) {
      formData.append('logoFile', formValue.logoFile);
    }
  
    
  }
}
