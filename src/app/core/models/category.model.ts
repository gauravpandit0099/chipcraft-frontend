/* category entity interface */
export interface Category {
  id: number;
  name: string;
  slug: string;
  status: boolean;
  products_count?: number;
  created_at?: string;
}

/* paginated response */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

/* category create or update payload */
export interface CategoryPayload {
  name: string;
  status: boolean;
}