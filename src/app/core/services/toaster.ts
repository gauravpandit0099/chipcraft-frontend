import { Injectable, signal } from '@angular/core';

/* toast item interface */
export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })

export class ToasterService {
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  /* success toast */
  success(text: string): void {
    this.push('success', text);
  }

  /* error toast */
  error(text: string): void {
    this.push('error', text);
  }

  /* info toast */
  info(text: string): void {
    this.push('info', text);
  }

  /* toast by id */
  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  /* add toast with auto-dismiss */
  private push(type: ToastMessage['type'], text: string): void {
    const id = ++this.counter;
    this.toasts.update((list) => [...list, { id, type, text }]);
    setTimeout(() => this.dismiss(id), 3500);
  }
}