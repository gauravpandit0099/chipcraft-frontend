import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { userGuard } from './core/guards/user-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { UserLayoutComponent } from './features/user/layout/user-layout/user-layout';
import { HomeComponent } from './features/user/home/home';
import { CategoryListComponent } from './features/admin/category/category-list/category-list';
import { nonAdminGuard } from './core/guards/non-admin-guard';

/* application routes with role guards */
export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [nonAdminGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'orders', component: HomeComponent, canActivate: [userGuard] },
      { path: 'wishlist', component: HomeComponent, canActivate: [userGuard] },
      { path: 'cart', component: HomeComponent, canActivate: [userGuard] },
    ],
  },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  /* admin routes */
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'category-list', component: CategoryListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
