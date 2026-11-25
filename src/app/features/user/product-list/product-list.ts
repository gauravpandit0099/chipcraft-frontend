import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserHomeService } from '../../../core/services/user-home';
import { ToasterService } from '../../../core/services/toaster';
import { PaginatedResponse } from '../../../core/models/category.model';
import { Product } from '../../../core/models/product.model';
import { StorefrontCategory } from '../../../core/models/user-home.model';
import { SearchableSelectComponent, SelectOption } from '../../../shared/components/searchable-select/searchable-select';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableSelectComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class UserProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private homeService = inject(UserHomeService);
  private toaster = inject(ToasterService);
  storageUrl = environment.apiUrl.replace('/api', '');
  pagination = signal<PaginatedResponse<Product> | null>(null);
  categories = signal<StorefrontCategory[]>([]);
  loading = signal(true);
  search = '';
  categoryFilter = 'all';
  stockFilter = 'all';
  currentPage = 1;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  stockOptions: SelectOption[] = [
    { label: 'All Stock', value: 'all' },
    { label: 'In Stock Only', value: '1' }
  ];

  /* read query params and load products */
  ngOnInit(): void {
    this.homeService.getHomeData().subscribe({
      next: (res) => this.categories.set(res.data.categories),
      error: () => {}
    });
    this.route.queryParamMap.subscribe((params) => {
      this.categoryFilter = params.get('category') || 'all';
      this.search = params.get('search') || '';
      this.loadProducts(1);
    });
  }

  /* build category filter options */
  get categoryOptions(): SelectOption[] {
    return [{ label: 'All Categories', value: 'all' }, ...this.categories().map((c) => ({ label: c.name, value: c.slug }))];
  }

  /* fetch paginated products from api */
  loadProducts(page = this.currentPage): void {
    try {
      this.loading.set(true);
      this.currentPage = page;
      this.homeService.getProducts(page, this.search, this.categoryFilter, this.stockFilter).subscribe({
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
    this.searchTimer = setTimeout(() => this.loadProducts(1), 350);
  }

  /* truncate long product name */
  truncateName(name: string, limit = 26): string {
    return name.length > limit ? name.slice(0, limit) + '...' : name;
  }

  /* quick add to cart feedback */
  addToCart(name: string): void {
    this.toaster.success(`${name} added to cart`);
  }

  /* generate page numbers */
  get pages(): number[] {
    const last = this.pagination()?.last_page || 1;
    return Array.from({ length: last }, (_, i) => i + 1);
  }
}