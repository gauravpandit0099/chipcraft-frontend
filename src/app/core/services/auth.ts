import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthData, LoginPayload, RegisterPayload, User } from '../models/auth.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private apiUrl = environment.apiUrl;
  private tokenKey = 'gadget_auth_token';
  private userKey = 'gadget_auth_user';
  loggingOut = signal(false);

  /* authenticate user via laravel api */
  login(payload: LoginPayload): Observable<ApiResponse<AuthData>> {
    try {
      return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/login`, payload).pipe(
        tap((res) => this.saveSession(res)),
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Unexpected login error');
      return throwError(() => err);
    }
  }

  /* register customer via laravel api */
  register(payload: RegisterPayload): Observable<ApiResponse<AuthData>> {
    try {
      return this.http.post<ApiResponse<AuthData>>(`${this.apiUrl}/register`, payload).pipe(
        tap((res) => this.saveSession(res)),
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Unexpected registration error');
      return throwError(() => err);
    }
  }

  /* revoke token and clear session */
  logout(): void {
    if (this.loggingOut()) return;
    try {
      this.loggingOut.set(true);
      this.http.post(`${this.apiUrl}/logout`, {}).pipe(
        finalize(() => this.loggingOut.set(false))
      ).subscribe({
        next: () => this.clearSession(),
        error: () => this.clearSession()
      });
    } catch {
      this.loggingOut.set(false);
      this.clearSession();
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

  /* save token and notify user */
  private saveSession(res: ApiResponse<AuthData>): void {
    if (res.status && res.data) {
      localStorage.setItem(this.tokenKey, res.data.token);
      localStorage.setItem(this.userKey, JSON.stringify(res.data.user));
      this.toaster.success(res.message);
      this.redirectByRole(res.data.user.role);
    }
  }

  /* clear local storage and redirect */
  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.toaster.info('Logged out successfully');
    this.router.navigate(['/login']);
  }

  /* extract api or validation error */
  private handleError(err: HttpErrorResponse): Observable<never> {
    const firstFieldError = err.error?.errors
      ? (Object.values(err.error.errors)[0] as string[])?.[0]
      : null;
    this.toaster.error(firstFieldError || err.error?.message || 'Request failed');
    return throwError(() => err);
  }
}