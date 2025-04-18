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


  onSelectedLogo(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.profile.logoFile = file;
      console.log(this.profile.logoFile);
    }
  }
  onSelectedPhoto(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.profile.PhotoFile = file;
      console.log(this.profile.logoFile);
    }
  }
  
  Register(): void {

    this.sendProfileData();
  }
  
  
  sendProfileData(): void {

    if(this.profile){
      this.service.uploadProfileData(this.profile).subscribe(res => {
        alert(res.toString());
      });
    }
    else{
      alert("it's empty!!!!")
    }
    
    
  }
}
