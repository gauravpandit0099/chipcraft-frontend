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
            subtitle: 'Discover flagship mobiles, audio gear, and laptops with unbeatable deals.',
            cta_text: 'Shop Now'
          },
          {
            badge: 'New Launch',
            title: 'Pulse Watch X — Track Every Beat.',
            subtitle: 'AMOLED display, 10-day battery life, and precision health sensors.',
            cta_text: 'Explore Wearables'
          },
          {
            badge: 'Flash Offer · Code CHIP15',
            title: 'Flat 15% Off on GaN Fast Chargers.',
            subtitle: 'Power laptops and phones at blazing speed with compact GaN tech.',
            cta_text: 'Grab the Deal'
          }
        ],
        featured_products: [
          { id: 1, name: 'Chipcraft Pods Pro', category: 'Sounds', price: 4999, in_stock: true, badge: 'Bestseller' },
          { id: 2, name: 'Pulse Watch X', category: 'Wearables', price: 9999, in_stock: true, badge: 'New' },
          { id: 3, name: 'GaN 65W Fast Charger', category: 'Accessories', price: 1999, in_stock: false },
          { id: 4, name: 'AeroBook Pro 14"', category: 'Laptops', price: 64999, in_stock: true, badge: 'Deal' }
        ],
        category_sections: [
          {
            title: 'Mobiles & Smartphones',
            slug: 'mobiles',
            products: [
              { id: 11, name: 'Nova 5G Pro (256GB)', category: 'Mobiles', price: 32999, in_stock: true },
              { id: 12, name: 'PixelCore Lite 5G', category: 'Mobiles', price: 21499, in_stock: true },
              { id: 13, name: 'Apex Ultra Max', category: 'Mobiles', price: 54999, in_stock: true },
              { id: 14, name: 'Neo Fold Mini', category: 'Mobiles', price: 44999, in_stock: false }
            ]
          },
          {
            title: 'Audio & Sounds',
            slug: 'sounds',
            products: [
              { id: 21, name: 'Chipcraft Pods Pro', category: 'Sounds', price: 4999, in_stock: true },
              { id: 22, name: 'Studio ANC Headphones', category: 'Sounds', price: 8499, in_stock: true },
              { id: 23, name: 'BassPulse Soundbar 120W', category: 'Sounds', price: 11999, in_stock: true },
              { id: 24, name: 'Pocket Boom Speaker', category: 'Sounds', price: 2499, in_stock: true }
            ]
          },
          {
            title: 'Laptops & Ultrabooks',
            slug: 'laptops',
            products: [
              { id: 31, name: 'AeroBook Pro 14"', category: 'Laptops', price: 64999, in_stock: true },
              { id: 32, name: 'CreatorStation 16"', category: 'Laptops', price: 92999, in_stock: true },
              { id: 33, name: 'ZenSlim Air M2', category: 'Laptops', price: 55999, in_stock: true },
              { id: 34, name: 'GamerRig RTX 4060', category: 'Laptops', price: 84999, in_stock: false }
            ]
          },
          {
            title: 'Accessories & Chargers',
            slug: 'accessories',
            products: [
              { id: 41, name: 'GaN 65W Fast Charger', category: 'Accessories', price: 1999, in_stock: false },
              { id: 42, name: 'USB-C 8-in-1 Hub', category: 'Accessories', price: 2799, in_stock: true },
              { id: 43, name: 'MagSafe 10000mAh Bank', category: 'Accessories', price: 2299, in_stock: true },
              { id: 44, name: 'MechKey Wireless 75%', category: 'Accessories', price: 4299, in_stock: true }
            ]
          }
        ]
      };
      return of({ status: true, message: 'Home data loaded', data: mockData });
    } catch (err) {
      this.toaster.error('Failed to load storefront');
      return throwError(() => err);
    }
  }
}