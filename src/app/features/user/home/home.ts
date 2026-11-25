import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserHomeService } from '../../../core/services/user-home';
import { ToasterService } from '../../../core/services/toaster';
import { SaleBanner, UserHomeData } from '../../../core/models/user-home.model';
import { environment } from '../../../../environments/environment';

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
  storageUrl = environment.apiUrl.replace('/api', '');
  data = signal<UserHomeData | null>(null);
  loading = signal(true);
  activeSlide = signal(0);
  private sliderTimer: ReturnType<typeof setInterval> | null = null;
  banners: SaleBanner[] = [
    { badge: 'Featured Electronics Sale', title: 'Upgrade Your Tech. Smarter. Faster.', subtitle: 'Discover flagship mobiles, audio gear, and laptops with unbeatable deals.', cta_text: 'Shop Now' },
    { badge: 'New Launch', title: 'Pulse Watch X — Track Every Beat.', subtitle: 'AMOLED display, 10-day battery life, and precision health sensors.', cta_text: 'Explore Wearables' },
    { badge: 'Flash Offer · Code CHIP15', title: 'Flat 15% Off on GaN Fast Chargers.', subtitle: 'Power laptops and phones at blazing speed with compact GaN tech.', cta_text: 'Grab the Deal' }
  ];

  /* load live storefront home data */
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

  /* truncate long product name */
  truncateName(name: string, limit = 26): string {
    return name.length > limit ? name.slice(0, limit) + '...' : name;
  }

  /* move to next banner slide */
  nextSlide(): void {
    this.activeSlide.update((i) => (i + 1) % this.banners.length);
  }

  /* move to previous banner slide */
  prevSlide(): void {
    this.activeSlide.update((i) => (i - 1 + this.banners.length) % this.banners.length);
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