import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { PaginatedResponse } from '../models/category.model';
import { Product } from '../models/product.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private http = inject(HttpClient);
  private toaster = inject(ToasterService);
  private baseUrl = `${environment.apiUrl}/admin`;

  /* fetch paginated products with filters */
  getProducts(page = 1, search = '', categoryId = 'all', inStock = 'all'): Observable<ApiResponse<PaginatedResponse<Product>>> {
    try {
      let params = new HttpParams().set('page', page).set('per_page', 8);
      if (search.trim()) params = params.set('search', search.trim());
      if (categoryId !== 'all') params = params.set('category_id', categoryId);
      if (inStock !== 'all') params = params.set('in_stock', inStock);
      return this.http.get<ApiResponse<PaginatedResponse<Product>>>(`${this.baseUrl}/products-list`, { params }).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to load products');
      return throwError(() => err);
    }
  }

  /* fetch single product detail */
  getProduct(id: number): Observable<ApiResponse<Product>> {
    try {
      return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to load product');
      return throwError(() => err);
    }
  }

  /* create product with form data */
  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    try {
      return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/store-products`, formData).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to create product');
      return throwError(() => err);
    }
  }

  /* update product with form data */
  updateProduct(id: number, formData: FormData): Observable<ApiResponse<Product>> {
    try {
      return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/update-products/${id}`, formData).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to update product');
      return throwError(() => err);
    }
  }

  /* delete product by id */
  deleteProduct(id: number): Observable<ApiResponse<null>> {
    try {
      return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/delete-products/${id}`).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to delete product');
      return throwError(() => err);
    }
  }

  /* extract api or validation error */
  private handleError(err: HttpErrorResponse): Observable<never> {
    const firstErr = err.error?.errors ? (Object.values(err.error.errors)[0] as string[])?.[0] : null;
    this.toaster.error(firstErr || err.error?.message || 'Operation failed');
    return throwError(() => err);
  }
}