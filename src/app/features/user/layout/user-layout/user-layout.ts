import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
export class UserLayoutComponent {
  auth = inject(AuthService);
  dropdownOpen = signal(false);
  loggingOut = this.auth.loggingOut;
  currentYear = new Date().getFullYear();
  categories = ['All Products', 'Audio', 'Wearables', 'Laptops', 'Accessories', 'Deals'];

  /* get active customer name */
  get userName(): string {
    return this.auth.getCurrentUser()?.name || 'Guest';
  }

  /* toggle topbar profile dropdown */
  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  /* logout customer session */
  logout(): void {
    this.auth.logout();
  }
}