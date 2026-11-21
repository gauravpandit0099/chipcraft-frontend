import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../../core/services/admin-dashboard';
import { AdminDashboardData } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(AdminDashboardService);
  data = signal<AdminDashboardData | null>(null);
  loading = signal(true);

  /* load dashboard metrics on init */
  ngOnInit(): void {
    try {
      this.dashboardService.getDashboardStats().subscribe({
        next: (res) => {
          this.data.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } catch {
      this.loading.set(false);
    }
  }
}
