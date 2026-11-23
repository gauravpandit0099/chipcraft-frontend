import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { ToasterService } from '../services/toaster';

/* block admin from accessing customer storefront */
export const nonAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toaster = inject(ToasterService);
  const user = auth.getCurrentUser();
  if (auth.isAuthenticated() && user?.role === 'admin') {
    toaster.error('Admins cannot access customer storefront');
    router.navigate(['/admin/dashboard']);
    return false;
  }
  return true;
};