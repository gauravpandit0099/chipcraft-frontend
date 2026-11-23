import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserHomeService } from '../../../core/services/user-home';
import { ToasterService } from '../../../core/services/toaster';
import { UserHomeData } from '../../../core/models/user-home.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private homeService = inject(UserHomeService);
  private toaster = inject(ToasterService);
  data = signal<UserHomeData | null>(null);
  loading = signal(true);
  activeSlide = signal(0);
  private sliderTimer: ReturnType<typeof setInterval> | null = null;

  /* load storefront home data */
  ngOnInit(): void {
    try {
      this.homeService.getHomeData().subscribe({
        next: (res) => {
          this.data.set(res.data);
          this.loading.set(false);
          this.startAutoSlide();
        },
        error: () => this.loading.set(false)
      });
    } catch {
      this.loading.set(false);
    }
  }

  /* clear auto-slide interval */
  ngOnDestroy(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
  }

  /* move to next banner slide */
  nextSlide(): void {
    const len = this.data()?.banners.length || 1;
    this.activeSlide.update((i) => (i + 1) % len);
  }

  /* move to previous banner slide */
  prevSlide(): void {
    const len = this.data()?.banners.length || 1;
    this.activeSlide.update((i) => (i - 1 + len) % len);
  }

  /* jump to specific banner dot */
  goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  /* start 4.5s banner auto-rotation */
  private startAutoSlide(): void {
    if (this.sliderTimer) clearInterval(this.sliderTimer);
    this.sliderTimer = setInterval(() => this.nextSlide(), 4500);
  }

  /* static quick add-to-cart feedback */
  quickAddToCart(name: string): void {
    this.toaster.success(`${name} added to cart`);
  }

  /* static quick wishlist feedback */
  quickAddToWishlist(name: string): void {
    this.toaster.info(`${name} saved to wishlist`);
  }
}