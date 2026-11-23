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
  dropdownOpen = signal(false);
  loggingOut = this.auth.loggingOut;
  adminName = this.auth.getCurrentUser()?.name || 'Admin';
  currentYear = new Date().getFullYear();
  navItems = [
    { label: 'Dashboard', route: '/admin/dashboard' },
    { label: 'Categories', route: '/admin/category-list' },
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

  /* toggle topbar profile dropdown */
  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  /* logout admin session */
  logout(): void {
    this.auth.logout();
  }
}
