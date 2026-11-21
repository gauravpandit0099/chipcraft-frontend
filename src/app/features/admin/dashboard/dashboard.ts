import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { AdminDashboardService } from '../../../core/services/admin-dashboard';
import { AdminDashboardData } from '../../../core/models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedPeriod = signal<'daily' | 'weekly' | 'monthly'>('daily');
  periods: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly'];

  private dashboardService = inject(AdminDashboardService);
  data = signal<AdminDashboardData | null>(null);
  loading = signal(true);

  salesCanvas = viewChild<ElementRef<HTMLCanvasElement>>('salesCanvas');
  statusCanvas = viewChild<ElementRef<HTMLCanvasElement>>('statusCanvas');
  categoryCanvas = viewChild<ElementRef<HTMLCanvasElement>>('categoryCanvas');
  private charts: Chart[] = [];

  constructor() {
    /* render charts when canvases mount */
    effect(() => {
      const d = this.data();
      const sEl = this.salesCanvas()?.nativeElement;
      const stEl = this.statusCanvas()?.nativeElement;
      const cEl = this.categoryCanvas()?.nativeElement;
      if (d && sEl && stEl && cEl) {
        this.renderCharts(d, sEl, stEl, cEl);
      }
    });
  }

  /* load live dashboard metrics on init */
  ngOnInit(): void {
    this.loadDashboard('daily');
  }

  /* switch sales period tab filter */
  changePeriod(period: 'daily' | 'weekly' | 'monthly'): void {
    if (this.selectedPeriod() === period) return;
    this.selectedPeriod.set(period);
    this.loadDashboard(period);
  }

  /* fetch dashboard data from api */
  private loadDashboard(period: 'daily' | 'weekly' | 'monthly'): void {
    try {
      this.dashboardService.getDashboardStats(period).subscribe({
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

  /* destroy active chart instances */
  ngOnDestroy(): void {
    this.destroyCharts();
  }

  /* initialize all three chartjs graphs */
  private renderCharts(
    d: AdminDashboardData,
    salesEl: HTMLCanvasElement,
    statusEl: HTMLCanvasElement,
    catEl: HTMLCanvasElement,
  ): void {
    try {
      this.destroyCharts();
      const accent =
        getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() ||
        '#477977';
      const ctx = salesEl.getContext('2d');
      const grad = ctx ? ctx.createLinearGradient(0, 0, 0, 220) : accent;
      if (ctx && typeof grad !== 'string') {
        grad.addColorStop(0, 'rgba(71, 121, 119, 0.32)');
        grad.addColorStop(1, 'rgba(71, 121, 119, 0.0)');
      }
      this.charts.push(
        new Chart(salesEl, {
          type: 'line',
          data: {
            labels: d.sales_overview.map((s) => s.day),
            datasets: [
              {
                label: 'Revenue (₹)',
                data: d.sales_overview.map((s) => s.revenue),
                borderColor: accent,
                backgroundColor: grad,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: accent,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => ` Revenue: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grace: '10%',
                grid: { color: '#f1f5f9' },
                ticks: {
                  maxTicksLimit: 5,
                  callback: (val) => {
                    const num = Number(val);
                    if (num >= 100000)
                      return '₹' + (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
                    if (num >= 1000) return '₹' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                    return '₹' + num;
                  },
                },
              },
              x: { grid: { display: false } },
            },
          },
        }),
      );
      this.charts.push(
        new Chart(statusEl, {
          type: 'doughnut',
          data: {
            labels: d.order_status_chart.map((o) => o.status),
            datasets: [
              {
                data: d.order_status_chart.map((o) => o.count),
                backgroundColor: ['#f59e0b', '#6366f1', '#0ea5e9', '#10b981', '#f43f5e'],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: {
                position: 'right',
                labels: { boxWidth: 10, usePointStyle: true, padding: 14 },
              },
            },
          },
        }),
      );
      this.charts.push(
        new Chart(catEl, {
          type: 'bar',
          data: {
            labels: d.category_products_chart.map((c) => c.name),
            datasets: [
              {
                label: 'Products',
                data: d.category_products_chart.map((c) => c.count),
                backgroundColor: accent,
                borderRadius: 8,
                barThickness: 28,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f1f5f9' } },
              x: { grid: { display: false } },
            },
          },
        }),
      );
    } catch {
      /* ignore chart render failure */
    }
  }

  /* clean up existing chart instances */
  private destroyCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }
}
