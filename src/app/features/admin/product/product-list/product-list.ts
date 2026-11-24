import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminProductService } from '../../../../core/services/admin-product';
import { AdminCategoryService } from '../../../../core/services/admin-category';
import { ToasterService } from '../../../../core/services/toaster';
import { Category, PaginatedResponse } from '../../../../core/models/category.model';
import { Product } from '../../../../core/models/product.model';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SearchableSelectComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(AdminProductService);
  private categoryService = inject(AdminCategoryService);
  private toaster = inject(ToasterService);
  storageUrl = environment.apiUrl.replace('/api', '/storage');
  pagination = signal<PaginatedResponse<Product> | null>(null);
  categories = signal<Category[]>([]);
  loading = signal(true);
  deleting = signal(false);
  deleteModalOpen = signal(false);
  deletingId = signal<number | null>(null);
  search = '';
  categoryFilter = 'all';
  stockFilter = 'all';
  currentPage = 1;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  stockOptions: SelectOption[] = [
    { label: 'All Stock', value: 'all' },
    { label: 'In Stock', value: '1' },
    { label: 'Out of Stock', value: '0' }
  ];

  /* load categories and products */
  ngOnInit(): void {
    this.categoryService.getCategories(1, '', '1').subscribe({
      next: (res) => this.categories.set(res.data.data),
      error: () => {}
    });
    this.loadProducts();
  }

  /* build category filter dropdown options */
  get categoryFilterOptions(): SelectOption[] {
    return [{ label: 'All Categories', value: 'all' }, ...this.categories().map((c) => ({ label: c.name, value: c.id }))];
  }

  /* fetch products from api */
  loadProducts(page = this.currentPage): void {
    try {
      this.loading.set(true);
      this.currentPage = page;
      this.productService.getProducts(page, this.search, this.categoryFilter, this.stockFilter).subscribe({
        next: (res) => {
          this.pagination.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } catch {
      this.loading.set(false);
    }
  }

  /* debounce live search input */
  onSearchChange(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 350);
  }

  /* reset page and apply filters */
  applyFilters(): void {
    this.loadProducts(1);
  }

  /* open delete confirmation modal */
  confirmDelete(id: number): void {
    this.deletingId.set(id);
    this.deleteModalOpen.set(true);
  }

  /* execute product deletion */
  deleteProduct(): void {
    try {
      const id = this.deletingId();
      if (!id || this.deleting()) return;
      this.deleting.set(true);
      this.productService.deleteProduct(id).subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.deleting.set(false);
          this.deleteModalOpen.set(false);
          this.loadProducts();
        },
        error: () => this.deleting.set(false)
      });
    } catch {
      this.deleting.set(false);
    }
  }

  /* generate page number array */
  get pages(): number[] {
    const last = this.pagination()?.last_page || 1;
    return Array.from({ length: last }, (_, i) => i + 1);
  }
}