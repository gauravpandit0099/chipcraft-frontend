import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../services/toaster';

/* attach bearer token and handle auth errors */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToasterService);
  const token = localStorage.getItem('gadget_auth_token');
  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    : req.clone({ setHeaders: { Accept: 'application/json' } });

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/login')) {
        localStorage.removeItem('gadget_auth_token');
        localStorage.removeItem('gadget_auth_user');
        toaster.error('Session expired, please login again');
        router.navigate(['/login']);
      } else if (err.status === 403) {
        toaster.error(err.error?.message || 'Unauthorized panel access');
      }
      return throwError(() => err);
    }),
  );
};
