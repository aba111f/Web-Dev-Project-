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

  changedProfile!: Profile;

  photoPreviewPath: string = "";
  logoPreviewPath: string = "";



  ngOnInit(): void {
      this.sharedService.profile$.subscribe(profile => {
        if(profile){
          this.profile = profile;
        }
        this.changedProfile = { ...this.profile };

        // this.logoPreviewPath = this.profile?.logoName;
        console.log(this.profile);
      });
      
  };

  onSelectedLogo(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.changedProfile.logoName = file;
      this.logoPreviewPath = URL.createObjectURL(file);
    }
  };
  onSelectedPhoto(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.changedProfile.PhotoFileName = file;
      this.photoPreviewPath = URL.createObjectURL(file);
    }
  };

  
  change(){
    const formData = new FormData();
    formData.append('FirstName', this.changedProfile.FirstName);
    formData.append('LastName', this.changedProfile.LastName);
    formData.append('username', this.changedProfile.username);
    formData.append('phone_num', this.changedProfile.phone_num);
    formData.append('mail', this.changedProfile.mail);
    formData.append('PhotoFileName', this.changedProfile.PhotoFileName as File);
    formData.append('logoName', this.changedProfile.logoName as File);
    formData.append('age', this.changedProfile.age.toString());
    formData.append('BussinesName', this.changedProfile.BussinesName);
    
    
    this.authService.updateData(this.profile.id, formData).subscribe(
      res => {
        alert(res + "Successfully updated");
        
      },
      err => {
        alert("some error while updating"+ err);
      }
    );
  };
}
