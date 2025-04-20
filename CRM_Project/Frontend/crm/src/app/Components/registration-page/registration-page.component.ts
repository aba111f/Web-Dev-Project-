import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../Services/auth.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-registration-page',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {
  constructor(private service: AuthService){}
    profile: Profile = {
      id: 0,
      username: "",
      FirstName: "",
      LastName: "",
      password: "",
      mail: "",
      phone_num: "",
      age: 0,
      PhotoFile: null,
      BussinesName: "",
      logoFile: null
    }
    // logoFile: File | null = null;
    // photoFile: File | null = null;
    PhotoFilePath: string = "";
    logoPreviewPath: string = "";
    photoPreviewPath: string = "";
  
    onSelectedLogo(event: any){
      const file: File = event.target.files[0];
      if(file){
        this.profile.logoFile = file;
        console.log(this.profile.logoFile);
        this.logoPreviewPath = URL.createObjectURL(file);
      }
    }
    onSelectedPhoto(event: any){
      const file: File = event.target.files[0];
      if(file){
        this.profile.PhotoFile = file;
        console.log(this.profile.logoFile);
        this.photoPreviewPath = URL.createObjectURL(file);
      }
    }
    
    Register(): void {
  
      this.sendProfileData();
    }
    
    
    sendProfileData(): void {
      // if(this.profile){
      //   alert("profile is good");
      // }
      const formData = new FormData();
      formData.append('username', this.profile.username);
      formData.append('FirstName', this.profile.FirstName);
      formData.append('LastName', this.profile.LastName);
      formData.append('password', this.profile.password);
      formData.append('mail', this.profile.mail);
      formData.append('phone_num', this.profile.phone_num);
      formData.append('age', this.profile.age.toString());
      formData.append('BussinesName', this.profile.BussinesName);
      if(this.profile.PhotoFile){
      formData.append('PhotoFileName', this.profile.PhotoFile, this.profile.PhotoFile.name);
      }
      if(this.profile.logoFile){
        formData.append('logoName', this.profile.logoFile, this.profile.logoFile.name);
      }
  
      this.service.uploadProfileData(formData).subscribe({
        next: (res) => {
          alert("Profile created successfully!");
          console.log(res);
        },
        error: (err) => {
          alert("Failed to create profile.");
          console.log(
            "UPload error: ", err
          );
        }
      });
    }
}
