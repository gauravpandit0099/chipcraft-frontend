import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ApiResponse } from '../models/auth.model';
import { UserHomeData } from '../models/user-home.model';
import { ToasterService } from './toaster';

@Injectable({ providedIn: 'root' })
export class UserHomeService {
  private toaster = inject(ToasterService);

  /* fetch static user home data */
  getHomeData(): Observable<ApiResponse<UserHomeData>> {
    try {
      const mockData: UserHomeData = {
        banners: [
          {
            badge: 'Featured Electronics Sale',
            title: 'Upgrade Your Tech. Smarter. Faster.',
            subtitle:
              'Discover flagship earbuds, smartwatches, and accessories with unbeatable deals.',
            cta_text: 'Shop Now',
          },
          {
            badge: 'New Launch',
            title: 'Pulse Watch X — Track Every Beat.',
            subtitle: 'AMOLED display, 10-day battery life, and precision health sensors.',
            cta_text: 'Explore Wearables',
          },
          {
            badge: 'Flash Offer · Code CHIP15',
            title: 'Flat 15% Off on GaN Fast Chargers.',
            subtitle: 'Power laptops and phones at blazing speed with compact GaN tech.',
            cta_text: 'Grab the Deal',
          },
        ],
        featured_products: [
          {
            id: 1,
            name: 'Chipcraft Pods Pro',
            category: 'Audio',
            price: 4999,
            in_stock: true,
            badge: 'Bestseller',
          },
          {
            id: 2,
            name: 'Pulse Watch X',
            category: 'Wearables',
            price: 9999,
            in_stock: true,
            badge: 'New',
          },
          {
            id: 3,
            name: 'GaN 65W Fast Charger',
            category: 'Accessories',
            price: 1999,
            in_stock: false,
          },
          {
            id: 4,
            name: 'AeroBook Pro Sleeve',
            category: 'Accessories',
            price: 1499,
            in_stock: true,
            badge: 'Deal',
          },
        ],
        recent_orders: [
          {
            id: 101,
            order_number: 'CC-1007',
            item_name: 'Chipcraft Pods Pro',
            total: 4999,
            status: 'Delivered',
          },
          {
            id: 102,
            order_number: 'CC-1006',
            item_name: 'Pulse Watch X',
            total: 9999,
            status: 'Shipped',
          },
        ],
      };
      return of({ status: true, message: 'Home data loaded', data: mockData });
    } catch (err) {
      this.toaster.error('Failed to load storefront');
      return throwError(() => err);
    }
  }
}
