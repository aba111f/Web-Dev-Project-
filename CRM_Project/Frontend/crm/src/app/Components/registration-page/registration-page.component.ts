import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../interfaces/profile';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Errors } from '../../interfaces/registerErrors';
import { PassValidatorDirective } from '../../Validators/pass-validator.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registration-page',
  imports: [CommonModule, FormsModule,RouterModule, PassValidatorDirective],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent implements OnDestroy{
  errMessage: string = "";
  err: Errors = {
    e_mail: "",
    e_phone: "",
    e_username: "" 
  };  
  private destroy$ = new Subject<void>();
  constructor(private service: AuthService, private router: Router){}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
    PhotoFilePath: string = "";
    logoPreviewPath: string = "";
    photoPreviewPath: string = "";
  
    onSelectedLogo(event: any){
      const file: File = event.target.files[0];
      if(file){
        this.profile.logoName = file;
        
        this.logoPreviewPath = URL.createObjectURL(file);
      }
    }
    onSelectedPhoto(event: any){
      const file: File = event.target.files[0];
      if(file){
        this.profile.PhotoFileName = file;
        
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
      if(this.profile.PhotoFileName){
      formData.append('PhotoFileName', this.profile.PhotoFileName, this.profile.PhotoFileName.name);
      }
      if(this.profile.logoName){
        formData.append('logoName', this.profile.logoName, this.profile.logoName.name);
      }
  
      this.service.uploadProfileData(formData).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
          alert("Profile created successfully!");
          console.log(res);
          
        },
        error: (err) => {
          if(err.status === 400){
            let message = err.error.username?.[0] || "Произошла ошибка";
            // alert("Ошибка: " + message);
            this.err.e_username = message;
            message = err.error.mail?.[0] || "Произошла ошибка";
            this.err.e_mail = message;

            message = err.error.phone_num?.[0] || "Произошла ошибка";
            this.err.e_phone = message;
          } 
          else{
            alert("Failed to create profile.");
            console.log(
              "UPload error: ", err
            );
          }
        }
      });
    }
}
