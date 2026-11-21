import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { AdminDashboardData } from '../models/dashboard.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private http = inject(HttpClient);
  private toaster = inject(ToasterService);
  private apiUrl = environment.apiUrl;

  /* fetch live dashboard data by period */
  getDashboardStats(
    period: 'daily' | 'weekly' | 'monthly' = 'daily',
  ): Observable<ApiResponse<AdminDashboardData>> {
    try {
      return this.http
        .get<ApiResponse<AdminDashboardData>>(
          `${this.apiUrl}/admin/dashboard-data?period=${period}`,
        )
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.toaster.error(err.error?.message || 'Failed to load dashboard');
            return throwError(() => err);
          }),
        );
    } catch (err) {
      this.toaster.error('Unexpected dashboard error');
      return throwError(() => err);
    }
  }
}
