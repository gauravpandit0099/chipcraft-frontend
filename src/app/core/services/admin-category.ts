import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Category, CategoryPayload, PaginatedResponse } from '../models/category.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class AdminCategoryService {
  private http = inject(HttpClient);
  private toaster = inject(ToasterService);
  private baseUrl = `${environment.apiUrl}/admin`;

  /* fetch paginated categories with filters */
  getCategories(page = 1, search = '', status = 'all'): Observable<ApiResponse<PaginatedResponse<Category>>> {
    try {
      let params = new HttpParams().set('page', page).set('per_page', 8);
      if (search.trim()) params = params.set('search', search.trim());
      if (status !== 'all') params = params.set('status', status);
      return this.http.get<ApiResponse<PaginatedResponse<Category>>>(`${this.baseUrl}/categories-list`, { params }).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to load categories');
      return throwError(() => err);
    }
  }

  /* create new category */
  createCategory(payload: CategoryPayload): Observable<ApiResponse<Category>> {
    try {
      return this.http.post<ApiResponse<Category>>(`${this.baseUrl}/store-categories`, payload).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to create category');
      return throwError(() => err);
    }
  }

  /* update existing category */
  updateCategory(id: number, payload: CategoryPayload): Observable<ApiResponse<Category>> {
    try {
      return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/update-categories/${id}`, payload).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to update category');
      return throwError(() => err);
    }
  }

  /* delete category by id */
  deleteCategory(id: number): Observable<ApiResponse<null>> {
    try {
      return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/delete-categories/${id}`).pipe(
        catchError((err) => this.handleError(err))
      );
    } catch (err) {
      this.toaster.error('Failed to delete category');
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