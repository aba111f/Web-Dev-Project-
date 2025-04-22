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
})
export class ProfilePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  profile!: Profile;
  constructor(private sharedService: SharedService){}

  form!: FormGroup;
  profileId: number=this.authService.getID();
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
    if (this.profileId) {
      this.authService.getProfile(this.profileId).subscribe((data: any) => {
        this.form.patchValue(data);
        this.photoPreview = data.PhotoFile ? URL.createObjectURL(data.PhotoFile) : null;
        this.logoPreview = data.logoFile ? URL.createObjectURL(data.logoFile) : null;
      });
    }
    else{
      const id = localStorage.getItem('user_id');
      this.authService.getProfile(Number(id)).subscribe((data: any) => {
        
        this.form.patchValue(data);
        this.photoPreview = data.PhotoFile ? URL.createObjectURL(data.PhotoFile) : null;
        this.logoPreview = data.logoFile ? URL.createObjectURL(data.logoFile) : null;
        this.profile = {
          id: this.form.value.user_id,
          username: this.form.value.username,
          FirstName: this.form.value.FirstName,
          LastName: this.form.value.LastName,
          mail: this.form.value.mail,
          phone_num: this.form.value.phone_num,
          PhotoFile: this.form.value.PhotoFile,
          logoFile: this.form.value.logoFile,
          BussinesName: this.form.value.BussinesName,
          password: this.form.value.password,
          age: this.form.value.age
        }
        this.sharedService.setProfile(this.profile);
      });
    }
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
