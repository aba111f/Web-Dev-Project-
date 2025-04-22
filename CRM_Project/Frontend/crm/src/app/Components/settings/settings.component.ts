import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../Services/shared.service';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../Services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  constructor(private sharedService: SharedService, private authService: AuthService, private fb: FormBuilder){
    this.profile = {
      id: 0,
      FirstName: '',
      LastName: '',
      age: 0,
      username: '',
      BussinesName: '',
      PhotoFileName: null,
      logoName: null,
      phone_num: '',
      password: '',
      mail: ''
    };
  }

  profile : Profile;
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
        
      });
      
    console.log(this.changedProfile);
  };

  onSelectedLogo(event: any){
    const file: File = event.target.files[0];
    if(file){
      
      this.logoPreviewPath = URL.createObjectURL(file);
    }
  };
  onSelectedPhoto(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.photoPreviewPath = URL.createObjectURL(file);
    }
  };

  
  change(){
    let updatedProfile: Partial<Profile> = {};

    for(let key in this.changedProfile){
      const initialValue = this.profile[key as keyof Profile];
      const changedValue = this.changedProfile[key as keyof Profile];
      // if(changedValue !== initialValue){
      //   updatedProfile[key as keyof Profile] = changedValue as (string | number | File | null);

      // }

    }
    console.log(this.profile);

    this.authService.updateData(this.profile.id, this.profile).subscribe(
      res => {
        alert(res.toString());
      },
      err => {
        alert("some error while updating"+ err);
      }
    );
  };
}
