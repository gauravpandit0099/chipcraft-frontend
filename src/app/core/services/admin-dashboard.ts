import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ApiResponse } from '../models/auth.model';
import { AdminDashboardData } from '../models/dashboard.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private toaster = inject(ToasterService);

  /* fetch static dashboard mock data */
  getDashboardStats(): Observable<ApiResponse<AdminDashboardData>> {
    try {
      const mockData: AdminDashboardData = {
        stats: {
          total_revenue: 148950,
          total_orders: 42,
          total_products: 28,
          out_of_stock_count: 3,
        },
        recent_orders: [
          {
            id: 101,
            order_number: 'CC-1042',
            customer_name: 'Aarav Sharma',
            total: 24999,
            status: 'Pending',
            created_at: '2026-11-21',
          },
          {
            id: 102,
            order_number: 'CC-1041',
            customer_name: 'Priya Patel',
            total: 4299,
            status: 'Shipped',
            created_at: '2026-11-20',
          },
          {
            id: 103,
            order_number: 'CC-1040',
            customer_name: 'Rohan Verma',
            total: 18499,
            status: 'Delivered',
            created_at: '2026-11-20',
          },
          {
            id: 104,
            order_number: 'CC-1039',
            customer_name: 'Neha Gupta',
            total: 7999,
            status: 'Confirmed',
            created_at: '2026-11-19',
          },
        ],
      };
      return of({ status: true, message: 'Dashboard loaded', data: mockData });
    } catch (err) {
      this.toaster.error('Failed to load dashboard');
      return throwError(() => err);
    }
  }
}
