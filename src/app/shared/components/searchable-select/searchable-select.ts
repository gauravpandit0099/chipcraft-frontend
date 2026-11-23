import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* dropdown option interface */
export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.css'
})
export class SearchableSelectComponent {
  private el = inject(ElementRef);
  options = input<SelectOption[]>([]);
  value = input<string | number | null>(null);
  placeholder = input<string>('Select option...');
  searchPlaceholder = input<string>('Search...');
  valueChange = output<string | number>();

  isOpen = signal(false);
  query = signal('');

  /* resolve currently selected label */
  selectedLabel = computed(() => {
    const found = this.options().find((o) => String(o.value) === String(this.value()));
    return found ? found.label : this.placeholder();
  });

  /* filter options by search query */
  filteredOptions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.options();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  /* check if option is currently selected */
  isSelected(optValue: string | number): boolean {
    return String(this.value()) === String(optValue);
  }

  /* toggle dropdown panel */
  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) this.query.set('');
  }

  /* select option and emit value */
  select(opt: SelectOption): void {
    this.valueChange.emit(opt.value);
    this.isOpen.set(false);
    this.query.set('');
  }

  /* close dropdown on outside click */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}