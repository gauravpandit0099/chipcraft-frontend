import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { userGuard } from './core/guards/user-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { Home } from './features/user/home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'admin/dashboard', component: Dashboard, canActivate: [adminGuard] },
  { path: 'user/home', component: Home, canActivate: [userGuard] },
  { path: '**', redirectTo: 'login' },
];
