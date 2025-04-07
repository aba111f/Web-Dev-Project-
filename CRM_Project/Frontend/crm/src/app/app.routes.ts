import { Routes } from '@angular/router';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { RegistrationPageComponent } from './Components/registration-page/registration-page.component';
import { ProfilePageComponent } from './Components/profile-page/profile-page.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path:"",
        component: HomePageComponent
    },
    {
        path:"login",
        component:LoginPageComponent
    },
    {
        path:"registration",
        component:ProfilePageComponent
    },
    {
        path: 'profile',
        component:ProfilePageComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
];
