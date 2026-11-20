import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { ApiResponse, AuthData, LoginPayload, RegisterPayload, User } from '../models/auth.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private tokenKey = 'gadget_auth_token';
  private userKey = 'gadget_auth_user';

  /* static login for UI testing */
  login(payload: LoginPayload): Observable<ApiResponse<AuthData>> {
    try {
      const isAdmin = payload.email === 'admin@gadgetstore.com' && payload.password === 'admin123';
      const isUser = payload.email === 'user@gadgetstore.com' && payload.password === 'user123';
      if (!isAdmin && !isUser) {
        this.toaster.error('Invalid demo credentials');
        return throwError(() => new Error('Invalid credentials'));
      }
      const user: User = isAdmin
        ? { id: 1, name: 'Store Admin', email: payload.email, role: 'admin' }
        : { id: 2, name: 'Demo Customer', email: payload.email, role: 'user' };
      const res: ApiResponse<AuthData> = {
        status: true,
        message: 'Login successful',
        data: { user, token: 'mock-token' },
      };
      this.saveSession(res);
      return of(res);
    } catch (err) {
      this.toaster.error('Unexpected login error');
      return throwError(() => err);
    }
  }

  /* static register for UI testing */
  register(payload: RegisterPayload): Observable<ApiResponse<AuthData>> {
    try {
      const user: User = {
        id: Date.now(),
        name: payload.name,
        email: payload.email,
        role: 'user',
        phone: payload.phone,
        address: payload.address,
      };
      const res: ApiResponse<AuthData> = {
        status: true,
        message: 'Registration successful',
        data: { user, token: 'mock-token' },
      };
      this.saveSession(res);
      return of(res);
    } catch (err) {
      this.toaster.error('Unexpected registration error');
      return throwError(() => err);
    }
  }

  /* clear session and redirect */
  logout(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      this.toaster.info('Logged out successfully');
      this.router.navigate(['/login']);
    } catch {
      this.toaster.error('Logout failed');
    }
  }

  /* get stored user object */
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  /* check active auth session */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey) && !!this.getCurrentUser();
  }

  /* redirect user by role */
  redirectByRole(role: 'admin' | 'user'): void {
    this.router.navigate([role === 'admin' ? '/admin/dashboard' : '/user/home']);
  }

  /* save token and notify */
  private saveSession(res: ApiResponse<AuthData>): void {
    localStorage.setItem(this.tokenKey, res.data.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.data.user));
    this.toaster.success(res.message);
    this.redirectByRole(res.data.user.role);
  }
}
