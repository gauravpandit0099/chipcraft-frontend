import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { userGuard } from './core/guards/user-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { Home } from './features/user/home/home';

/* application routes with role guards */
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: 'user/home', component: Home, canActivate: [userGuard] },
  { path: '**', redirectTo: 'login' },
];
