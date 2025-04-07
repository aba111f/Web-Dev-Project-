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
  profile!: Profile;

  FirstName: string = "";
  LastName: string= "";
  password: string= "";
  mail: string= "";
  phone_num: string= "";
  age!: number;
  PhotoFileName: string= "";
  BussinesName: string= "";
  logoName: string= "";
  PhotoFilePath: string = "";
  Register():void{
    var value = {

      FirstName: this.FirstName,
      LastName: this.LastName,
      password: this.password,
      mail: this.mail,
      phone_num: this.phone_num,
      age: this.age,
      PhotoFileName: this.PhotoFileName,
      BussinesName: this.BussinesName,
      logoName: this.logoName

    }

    this.service.uploadProfileData(value).subscribe(res => {
      alert(res.toString());
    }

    
    );
  }


  uploadPhoto(event: any){
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);
    this.service.UploadPhoto(formData).subscribe((data: any) => {
      this.PhotoFileName = data.toString();
      this.PhotoFilePath = this.service.PhotoUrl + this.PhotoFileName;
    });
  }
}
