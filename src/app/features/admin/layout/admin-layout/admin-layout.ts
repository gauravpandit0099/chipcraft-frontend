import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  sidebarOpen = signal(false);
  adminName = this.auth.getCurrentUser()?.name || 'Admin';
  navItems = [
    { label: 'Dashboard', route: '/admin/dashboard' },
    { label: 'Categories', route: '/admin/categories' },
    { label: 'Subcategories', route: '/admin/subcategories' },
    { label: 'Products', route: '/admin/products' },
    { label: 'Orders', route: '/admin/orders' },
    { label: 'Coupons', route: '/admin/coupons' },
    { label: 'Sales', route: '/admin/sales' },
  ];

  /* toggle mobile sidebar drawer */
  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  /* logout admin session */
  logout(): void {
    this.auth.logout();
  }
}
