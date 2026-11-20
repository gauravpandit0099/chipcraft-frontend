import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToasterService } from '../services/toaster';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toaster = inject(ToasterService);
  const user = auth.getCurrentUser();
  if (auth.isAuthenticated() && user?.role === 'user') {
    return true;
  }
  toaster.error('Customer access only');
  router.navigate([user?.role === 'admin' ? '/admin/dashboard' : '/login']);
  return false;
};
