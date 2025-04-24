import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Profile } from '../../interfaces/profile';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [CommonModule]
})
export class HomePageComponent implements OnInit {
  isLoggedIn = false;
  profile!: Profile;
  photoPreview: string | null = null;
  logoPreview: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  
    if (this.isLoggedIn) {
      const id = localStorage.getItem('user_id');
      if (id) {
        this.authService.getProfile(+id).subscribe({
          next: (data: any) => {
            this.profile = data;
          },
          error: (err) => {
            console.error('Ошибка при получении профиля:', err);
          }
        });
      }
    }
  }

  getImageUrl(filename: string): string {
    return this.authService.getPhotoUrl(filename);
  }
  
  
  


}
