/* subcategory entity interface */
export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  status: boolean;
  products_count?: number;
  category?: { id: number; name: string };
}

/* subcategory create or update payload */
export interface SubcategoryPayload {
  category_id: number;
  name: string;
  status: boolean;
}