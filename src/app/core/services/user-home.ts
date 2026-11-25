import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { PaginatedResponse } from '../models/category.model';
import { Product } from '../models/product.model';
import { UserHomeData } from '../models/user-home.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class UserHomeService {
  private http = inject(HttpClient);
  private toaster = inject(ToasterService);
  private apiUrl = `${environment.apiUrl}`;

  /* fetch live home categories and 5 sections */
  getHomeData(): Observable<ApiResponse<UserHomeData>> {
    try {
      return this.http.get<ApiResponse<UserHomeData>>(`${this.apiUrl}/user-dashboard`).pipe(
        catchError((err: HttpErrorResponse) => {
          this.toaster.error(err.error?.message || 'Failed to load storefront');
          return throwError(() => err);
        })
      );
    } catch (err) {
      this.toaster.error('Unexpected storefront error');
      return throwError(() => err);
    }
  }

  /* fetch all public products with filters */
  getProducts(page = 1, search = '', category = 'all', inStock = 'all'): Observable<ApiResponse<PaginatedResponse<Product>>> {
    try {
      let params = new HttpParams().set('page', page).set('per_page', 12);
      if (search.trim()) params = params.set('search', search.trim());
      if (category !== 'all') params = params.set('category', category);
      if (inStock !== 'all') params = params.set('in_stock', inStock);
      return this.http.get<ApiResponse<PaginatedResponse<Product>>>(`${this.apiUrl}/products-list`, { params }).pipe(
        catchError((err: HttpErrorResponse) => {
          this.toaster.error(err.error?.message || 'Failed to load products');
          return throwError(() => err);
        })
      );
    } catch (err) {
      this.toaster.error('Unexpected product load error');
      return throwError(() => err);
    }
  }
}