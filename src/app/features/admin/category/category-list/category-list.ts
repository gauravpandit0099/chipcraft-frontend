import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCategoryService } from '../../../../core/services/admin-category';
import { ToasterService } from '../../../../core/services/toaster';
import { Category, PaginatedResponse } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(AdminCategoryService);
  private toaster = inject(ToasterService);
  pagination = signal<PaginatedResponse<Category> | null>(null);
  loading = signal(true);
  saving = signal(false);
  search = '';
  statusFilter = 'all';
  currentPage = 1;
  modalOpen = signal(false);
  deleteModalOpen = signal(false);
  editingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);
  formName = '';
  formStatus = true;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  /* debounce live search on input change */
  onSearchChange(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.applyFilters(), 350);
  }

  /* load initial categories */
  ngOnInit(): void {
    this.loadCategories();
  }

  /* fetch categories from api */
  loadCategories(page = this.currentPage): void {
    try {
      this.loading.set(true);
      this.currentPage = page;
      this.categoryService.getCategories(page, this.search, this.statusFilter).subscribe({
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

  /* reset page and apply filter */
  applyFilters(): void {
    this.loadCategories(1);
  }

  /* open modal for create */
  openCreateModal(): void {
    this.editingId.set(null);
    this.formName = '';
    this.formStatus = true;
    this.modalOpen.set(true);
  }

  /* open modal for edit */
  openEditModal(cat: Category): void {
    this.editingId.set(cat.id);
    this.formName = cat.name;
    this.formStatus = Boolean(cat.status);
    this.modalOpen.set(true);
  }

  /* save create or update form */
  saveCategory(): void {
    try {
      if (!this.formName.trim() || this.saving()) {
        if (!this.formName.trim()) this.toaster.error('Category name is required');
        return;
      }
      this.saving.set(true);
      const id = this.editingId();
      const payload = { name: this.formName.trim(), status: this.formStatus };
      const req$ = id
        ? this.categoryService.updateCategory(id, payload)
        : this.categoryService.createCategory(payload);
      req$.subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.saving.set(false);
          this.modalOpen.set(false);
          this.loadCategories();
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

  /* execute category deletion */
  deleteCategory(): void {
    try {
      const id = this.deletingId();
      if (!id || this.saving()) return;
      this.saving.set(true);
      this.categoryService.deleteCategory(id).subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.saving.set(false);
          this.deleteModalOpen.set(false);
          this.loadCategories();
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
}