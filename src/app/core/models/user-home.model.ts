/* storefront product card item */
export interface FeaturedProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  badge?: string;
}

/* user recent order preview */
export interface UserOrderPreview {
  id: number;
  order_number: string;
  item_name: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

/* sale banner announcement */
export interface SaleBanner {
  badge: string;
  title: string;
  subtitle: string;
  cta_text: string;
}   

/* complete user home payload */
export interface UserHomeData {
  banners: SaleBanner[];
  featured_products: FeaturedProduct[];
  recent_orders: UserOrderPreview[];
}