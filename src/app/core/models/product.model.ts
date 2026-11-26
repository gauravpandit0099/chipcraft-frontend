/* key-value specification row */
export interface ProductSpec {
  key: string;
  value: string;
}

/* product entity interface */
export interface Product {
  id: number;
  category_id: number;
  subcategory_id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  in_stock: boolean;
  image?: string;
  gallery_images?: string[];
  category?: { id: number; name: string };
  subcategory?: { id: number; name: string };
  specifications?: ProductSpec[];
}