import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../Services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  imports: [CommonModule, FormsModule,RouterModule]
})
export class ProfilePageComponent { 

  constructor(private service: AuthService){}
  // profile: Profile = {
  //   id: 0,
  //   username: "",
  //   FirstName: "",
  //   LastName: "",
  //   password: "",
  //   mail: "",
  //   phone_num: "",
  //   age: 0,
  //   PhotoFileName: "",
  //   BussinesName: "",
  //   logoName: ""
  // }
  profile: any = {};
  PhotoFilePath: string = "";
  selectedPhotoFile: File | null = null;

  uploadPhoto(event: any) {
    this.selectedPhotoFile = event.target.files[0];

  }
  Register(): void {
   
      if (this.selectedPhotoFile) {
        const formData: FormData = new FormData();
        formData.append('uploadedFile', this.selectedPhotoFile, this.selectedPhotoFile.name);
        
        this.service.UploadPhoto(formData).subscribe((data: any) => {
          this.profile.PhotoFileName = data.toString();
          this.PhotoFilePath = this.service.PhotoUrl + this.profile.PhotoFileName;
    
        
          this.sendProfileData();
        });
      } else {
        
        this.sendProfileData();
      }
    }
  
  
  sendProfileData(): void {
    if(this.profile){
      this.service.uploadProfileData(this.profile).subscribe(res => {
        alert(res.toString());
      });
    }
    
    for(let key in this.profile){
      console.log(`${key}: ${this.profile[key]}`);
    }
    alert("empty");
    
    
    
  }
}
