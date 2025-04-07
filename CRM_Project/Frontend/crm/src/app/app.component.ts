import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./Components/nav-bar/nav-bar.component";
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, SideBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @Input() getBool: boolean | undefined;
  title = 'crm';
  isPresed: boolean = false;

  openCloseSide(){
    if(!this.isPresed){
      this.isPresed = true;
    }
    else{
      this.isPresed = false;
    }
  }
}
