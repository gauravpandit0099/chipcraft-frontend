import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Category, PaginatedResponse } from '../models/category.model';
import { Subcategory, SubcategoryPayload } from '../models/subcategory.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AdminSubcategoryService {
  private http = inject(HttpClient);
  private toaster = inject(ToasterService);
  private baseUrl = `${environment.apiUrl}/admin`;

  /* fetch paginated subcategories with filters */
  getSubcategories(page = 1, search = '', categoryId = 'all', status = 'all'): Observable<ApiResponse<PaginatedResponse<Subcategory>>> {
    try {
      let params = new HttpParams().set('page', page).set('per_page', 8);
      if (search.trim()) params = params.set('search', search.trim());
      if (categoryId !== 'all') params = params.set('category_id', categoryId);
      if (status !== 'all') params = params.set('status', status);
      return this.http.get<ApiResponse<PaginatedResponse<Subcategory>>>(`${this.baseUrl}/subcategories-list`, { params }).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to load subcategories');
      return throwError(() => err);
    }
  }

  /* fetch active categories for dropdown */
  getCategoryDropdown(): Observable<ApiResponse<PaginatedResponse<Category>>> {
    try {
      const params = new HttpParams().set('per_page', 100).set('status', 1);
      return this.http.get<ApiResponse<PaginatedResponse<Category>>>(`${this.baseUrl}/categories-list`, { params }).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to load categories');
      return throwError(() => err);
    }
  }

  /* create new subcategory */
  createSubcategory(payload: SubcategoryPayload): Observable<ApiResponse<Subcategory>> {
    try {
      return this.http.post<ApiResponse<Subcategory>>(`${this.baseUrl}/store-subcategories`, payload).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to create subcategory');
      return throwError(() => err);
    }
  }

  /* update existing subcategory */
  updateSubcategory(id: number, payload: SubcategoryPayload): Observable<ApiResponse<Subcategory>> {
    try {
      return this.http.put<ApiResponse<Subcategory>>(`${this.baseUrl}/update-subcategories/${id}`, payload).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to update subcategory');
      return throwError(() => err);
    }
  }

  /* delete subcategory by id */
  deleteSubcategory(id: number): Observable<ApiResponse<null>> {
    try {
      return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/delete-subcategories/${id}`).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to delete subcategory');
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