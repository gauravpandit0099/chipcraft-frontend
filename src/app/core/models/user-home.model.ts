import { Product } from './product.model';

/* storefront category item */
export interface StorefrontCategory {
  id: number;
  name: string;
  slug: string;
}

/* category horizontal product row */
export interface CategoryProductSection {
  id: number;
  title: string;
  slug: string;
  products: Product[];
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
  categories: StorefrontCategory[];
  featured_products: Product[];
  category_sections: CategoryProductSection[];
}