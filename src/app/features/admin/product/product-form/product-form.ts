import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminProductService } from '../../../../core/services/admin-product';
import { AdminCategoryService } from '../../../../core/services/admin-category';
import { AdminSubcategoryService } from '../../../../core/services/admin-subcategory';
import { ToasterService } from '../../../../core/services/toaster';
import { Category } from '../../../../core/models/category.model';
import { Subcategory } from '../../../../core/models/subcategory.model';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select';
import { environment } from '../../../../../environments/environment';
import { ProductSpec } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SearchableSelectComponent],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(AdminProductService);
  private categoryService = inject(AdminCategoryService);
  private subService = inject(AdminSubcategoryService);
  private toaster = inject(ToasterService);
  specifications: ProductSpec[] = [{ key: '', value: '' }];

  storageUrl = environment.apiUrl.replace('/api', '');
  editingId = signal<number | null>(null);
  saving = signal(false);
  categories = signal<Category[]>([]);
  subcategories = signal<Subcategory[]>([]);

  categoryId: number | null = null;
  subcategoryId: number | null = null;
  name = '';
  description = '';
  price: number | null = null;
  inStock = true;
  coverFile: File | null = null;
  coverPreview = signal<string | null>(null);
  galleryFiles: File[] = [];
  galleryPreviews = signal<string[]>([]);
  existingGallery = signal<{ path: string; url: string }[]>([]);
  removedGalleryPaths: string[] = [];

  /* initialize dropdowns and edit product */
  ngOnInit(): void {
    this.categoryService.getCategories(1, '', '1').subscribe({
      next: (res) => this.categories.set(res.data.data),
      error: () => {}
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(+id);
      this.loadProduct(+id);
    }
  }

  /* build category dropdown options */
  get categoryOptions(): SelectOption[] {
    return this.categories().map((c) => ({ label: c.name, value: c.id }));
  }

  /* build subcategory dropdown options */
  get subcategoryOptions(): SelectOption[] {
    return this.subcategories().map((s) => ({ label: s.name, value: s.id }));
  }

  /* load subcategories when category changes */
  onCategoryChange(catId: string | number): void {
    this.categoryId = +catId;
    this.subcategoryId = null;
    this.subService.getSubcategories(1, '', String(this.categoryId), '1').subscribe({
      next: (res) => this.subcategories.set(res.data.data),
      error: () => {}
    });
  }

  /* preview selected cover image */
  onCoverSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverFile = file;
    this.coverPreview.set(URL.createObjectURL(file));
  }

  /* preview selected gallery images */
  onGallerySelect(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    if (!files.length) return;
    this.galleryFiles.push(...files);
    this.galleryPreviews.update((list) => [...list, ...files.map((f) => URL.createObjectURL(f))]);
  }

  /* mark existing gallery image for removal */
  removeExistingGallery(index: number): void {
    const item = this.existingGallery()[index];
    if (!item) return;
    this.removedGalleryPaths.push(item.path);
    this.existingGallery.update((list) => list.filter((_, i) => i !== index));
  }

  /* remove newly selected gallery image */
  removeNewGallery(index: number): void {
    this.galleryFiles.splice(index, 1);
    this.galleryPreviews.update((list) => list.filter((_, i) => i !== index));
  }

  /* submit product form data */
  saveProduct(): void {
    try {
      if (!this.categoryId || !this.subcategoryId || !this.name.trim() || this.price === null || this.saving()) {
        this.toaster.error('Fill category, subcategory, name, and price');
        return;
      }
      if (!this.editingId() && !this.coverFile) {
        this.toaster.error('Cover image is required');
        return;
      }
      const cleanSpecs = this.specifications
        .filter((s) => s.key.trim() && s.value.trim())
        .map((s) => ({ key: s.key.trim(), value: s.value.trim() }));

      const fd = new FormData();
      fd.append('category_id', String(this.categoryId));
      fd.append('subcategory_id', String(this.subcategoryId));
      fd.append('name', this.name.trim());
      fd.append('description', this.description.trim());
      fd.append('price', String(this.price));
      fd.append('in_stock', this.inStock ? '1' : '0');
      fd.append('specifications', JSON.stringify(cleanSpecs));
      if (this.coverFile) fd.append('cover_image', this.coverFile);
      this.galleryFiles.forEach((file) => fd.append('gallery_images[]', file));
      this.removedGalleryPaths.forEach((path) => fd.append('removed_gallery_images[]', path));

      this.saving.set(true);
      const id = this.editingId();
      const req$ = id ? this.productService.updateProduct(id, fd) : this.productService.createProduct(fd);
      req$.subscribe({
        next: (res) => {
          this.toaster.success(res.message);
          this.saving.set(false);
          this.router.navigate(['/admin/products']);
        },
        error: () => this.saving.set(false)
      });
    } catch {
      this.saving.set(false);
    }
  }

  /* load existing product for edit */
  private loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        const p = res.data;
        this.name = p.name;
        this.description = p.description || '';
        this.price = p.price;
        this.inStock = Boolean(p.in_stock);
        this.categoryId = p.category_id;
        this.onCategoryChange(p.category_id);
        this.subcategoryId = p.subcategory_id;
        this.specifications = p.specifications?.length
          ? p.specifications.map((s) => ({ key: s.key, value: s.value }))
          : [{ key: '', value: '' }];
        if (p.image) this.coverPreview.set(`${this.storageUrl}/${p.image}`);
        this.existingGallery.set(
          (p.gallery_images || []).map((g) => ({ path: g, url: `${this.storageUrl}/${g}` }))
        );
      },
      error: () => this.router.navigate(['/admin/products'])
    });
  }

  /* add empty specification row */
  addSpecRow(): void {
    this.specifications.push({ key: '', value: '' });
  }

  /* remove specification row */
  removeSpecRow(index: number): void {
    if (this.specifications.length === 1) {
      this.specifications[0] = { key: '', value: '' };
      return;
    }
    this.specifications.splice(index, 1);
  }
}