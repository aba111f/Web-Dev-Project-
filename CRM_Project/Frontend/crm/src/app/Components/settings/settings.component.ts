import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../Services/shared.service';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../Services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy{
  constructor(private sharedService: SharedService, private authService: AuthService, private router: Router){}
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
  private destroy$ = new Subject<void>();
  changedProfile!: Profile;
  photoPreviewPath: string = "";
  logoPreviewPath: string = "";


  
  ngOnInit(): void {
      let id = Number(localStorage.getItem('user_id'));
      if(isNaN(id)) this.authService.logout();
      this.authService.getProfile(id).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.profile = res;
          this.changedProfile = { ...res };
        },
        error: (err) => {
          alert("error in Settings Component " + err);
        }
      });
      
  };
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
    for(let key in this.profile){
      const initVal = this.profile[key as keyof Profile];
      const changedVal = this.changedProfile[key as keyof Profile];

      if(changedVal !== initVal){
        if (changedVal instanceof File) {
          console.log("Appending file:", key, changedVal);
          formData.append(key, changedVal as File);
          
        } else {
          if(changedVal){
            console.log("Appending file:", key, changedVal);
            formData.append(key, changedVal.toString());
            
          }
        }
      }
      
    }
    
    
    this.authService.updateData(this.profile.id, formData).pipe(takeUntil(this.destroy$))
    .subscribe({
        next: (res) => {
          alert("successfullly updated!!!" + res);
        },
        error: (err) => {
          alert("some error while updating"+ err);
        }
      }
    );
  };



  deleteProfile(){
    const id = Number(localStorage.getItem('user_id'));
    if(isNaN(id)) this.authService.logout();
    this.authService.deleteData(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.router.navigate(['/registration']).then(() => {
          window.location.reload();
        });
        alert("User deleted: " +  res);
        localStorage.removeItem('user_id');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      },
      error: (err) => {
        console.error("Failed to delete user: ", err);
        alert("Error deleting user");
      }

    });
    
  }
  cancel(){
    this.router.navigate(['/']);
  }
  
}
