import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Profile } from '../../interfaces/profile';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [CommonModule]
})
export class HomePageComponent implements OnInit {
  isLoggedIn = false;
  profile!: Profile;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn();

    if (this.isLoggedIn) {
      const userId = Number(localStorage.getItem('user_id'));
      this.auth.getProfile(userId).subscribe(data => {
        this.profile = data;
      });
    }
  }

  getImageUrl(file: string | File | null): string {
    if (typeof file === 'string') {
      return this.auth.PhotoUrl + file;
    }
    return 'assets/default-image.png';
  }
  
  

}
