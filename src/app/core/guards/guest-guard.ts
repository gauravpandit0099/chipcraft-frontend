import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const user = auth.getCurrentUser();
  if (auth.isAuthenticated() && user) {
    auth.redirectByRole(user.role);
    return false;
  }
  return true;
};
