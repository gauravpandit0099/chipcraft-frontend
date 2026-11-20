import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToasterService } from '../services/toaster';

/* allow admin role only */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toaster = inject(ToasterService);
  const user = auth.getCurrentUser();
  if (auth.isAuthenticated() && user?.role === 'admin') {
    return true;
  }
  toaster.error('Admin access only');
  router.navigate([user?.role === 'user' ? '/user/home' : '/login']);
  return false;
};
