/* storefront product card item */
export interface FeaturedProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  in_stock: boolean;
  badge?: string;
}

/* category horizontal product row */
export interface CategoryProductSection {
  title: string;
  slug: string;
  products: FeaturedProduct[];
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
  category_sections: CategoryProductSection[];
}