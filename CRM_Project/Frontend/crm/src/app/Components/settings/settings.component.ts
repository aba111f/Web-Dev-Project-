import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedService } from '../../Services/shared.service';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../Services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  constructor(private sharedService: SharedService, private authService: AuthService, private fb: FormBuilder){}
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


  photoPreviewPath: string = "";
  logoPreviewPath: string = "";



  ngOnInit(): void {
      this.sharedService.profile$.subscribe(profile => {
        if(profile){
          this.profile = profile;
        }
        
      });
      
  };

  onSelectedLogo(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.profile.logoName = file;
      this.logoPreviewPath = URL.createObjectURL(file);
    }
  };
  onSelectedPhoto(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.profile.PhotoFileName = file;
      this.photoPreviewPath = URL.createObjectURL(file);
    }
  };

  
  change(){
    const formData = new FormData();
    formData.append('FirstName', this.profile.FirstName);
    formData.append('LastName', this.profile.LastName);
    formData.append('username', this.profile.username);
    formData.append('phone_num', this.profile.phone_num);
    formData.append('mail', this.profile.mail);
    formData.append('PhotoFileName', this.profile.PhotoFileName as File);
    formData.append('logoName', this.profile.logoName as File);
    formData.append('age', this.profile.age.toString());
    formData.append('BussinesName', this.profile.BussinesName);
    
    formData.forEach(element => {
      console.log(element);
    });
    this.authService.updateData(this.profile.id, formData).subscribe({
      
        error: (err) => {
          alert("some error while updating"+ err);
        }
      }
    );
  };
}
