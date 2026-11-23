import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSubcategoryService } from '../../../../core/services/admin-subcategory';
import { ToasterService } from '../../../../core/services/toaster';
import { Category, PaginatedResponse } from '../../../../core/models/category.model';
import { Subcategory } from '../../../../core/models/subcategory.model';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select';

@Component({
  selector: 'app-subcategory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableSelectComponent],
  templateUrl: './subcategory-list.html',
  styleUrl: './subcategory-list.css'
})
export class SubcategoryListComponent implements OnInit {
  private subService = inject(AdminSubcategoryService);
  private toaster = inject(ToasterService);
  pagination = signal<PaginatedResponse<Subcategory> | null>(null);
  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);
  search = '';
  categoryFilter = 'all';
  statusFilter = 'all';
  currentPage = 1;
  modalOpen = signal(false);
  deleteModalOpen = signal(false);
  editingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);
  formCategoryId: number | null = null;
  formName = '';
  formStatus = true;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  /* load categories and subcategories */
  ngOnInit(): void {
    this.loadCategoryDropdown();
    this.loadSubcategories();
  }

  /* fetch parent categories for dropdown */
  loadCategoryDropdown(): void {
    try {
      this.subService.getCategoryDropdown().subscribe({
        next: (res) => this.categories.set(res.data.data),
        error: () => {}
      });
    } catch {}
  }

  /* fetch subcategories from api */
  loadSubcategories(page = this.currentPage): void {
    try {
      this.loading.set(true);
      this.currentPage = page;
      this.subService.getSubcategories(page, this.search, this.categoryFilter, this.statusFilter).subscribe({
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

  /* debounce live search on input change */
  onSearchChange(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 350);
  }

  /* reset page and apply filters */
  applyFilters(): void {
    this.loadSubcategories(1);
  }

  /* open modal for create */
  openCreateModal(): void {
    this.editingId.set(null);
    this.formCategoryId = this.categories()[0]?.id ?? null;
    this.formName = '';
    this.formStatus = true;
    this.modalOpen.set(true);
  }

  /* open modal for edit */
  openEditModal(sub: Subcategory): void {
    this.editingId.set(sub.id);
    this.formCategoryId = sub.category_id;
    this.formName = sub.name;
    this.formStatus = Boolean(sub.status);
    this.modalOpen.set(true);
  }

  /* save create or update form */
  saveSubcategory(): void {
    try {
      if (!this.formCategoryId || !this.formName.trim() || this.saving()) {
        if (!this.formCategoryId || !this.formName.trim()) {
          this.toaster.error('Category and subcategory name are required');
        }
        return;
      }
      this.saving.set(true);
      const id = this.editingId();
      const payload = { category_id: Number(this.formCategoryId), name: this.formName.trim(), status: this.formStatus };
      const req$ = id
        ? this.subService.updateSubcategory(id, payload)
        : this.subService.createSubcategory(payload);
      req$.subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.saving.set(false);
          this.modalOpen.set(false);
          this.loadSubcategories();
        },
        error: () => this.saving.set(false)
      });
    } catch {
      this.saving.set(false);
    }
  }

  /* open delete confirmation modal */
  confirmDelete(id: number): void {
    this.deletingId.set(id);
    this.deleteModalOpen.set(true);
  }

  /* execute subcategory deletion */
  deleteSubcategory(): void {
    try {
      const id = this.deletingId();
      if (!id || this.saving()) return;
      this.saving.set(true);
      this.subService.deleteSubcategory(id).subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.saving.set(false);
          this.deleteModalOpen.set(false);
          this.loadSubcategories();
        },
        error: () => this.saving.set(false)
      });
    } catch {
      this.saving.set(false);
    }
  }

  /* generate page number array */
  get pages(): number[] {
    const last = this.pagination()?.last_page || 1;
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' }
  ];

  /* category options for filter bar */
  get categoryFilterOptions(): SelectOption[] {
    return [{ label: 'All Categories', value: 'all' }, ...this.categories().map((c) => ({ label: c.name, value: c.id }))];
  }

  /* category options for modal */
  get categoryModalOptions(): SelectOption[] {
    return this.categories().map((c) => ({ label: c.name, value: c.id }));
  }
}