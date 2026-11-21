/* admin dashboard kpi summary */
export interface AdminDashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  out_of_stock_count: number;
  total_users: number;
}

/* daily sales chart point */
export interface SalesPoint {
  day: string;
  revenue: number;
}

/* order status distribution item */
export interface OrderStatusPoint {
  status: string;
  count: number;
}

/* category product count item */
export interface CategoryProductPoint {
  name: string;
  count: number;
}

/* recent order summary row */
export interface RecentOrderItem {
  id: number;
  order_number: string;
  customer_name: string;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
}

/* complete dashboard api payload */
export interface AdminDashboardData {
  stats: AdminDashboardStats;
  sales_overview: SalesPoint[];
  order_status_chart: OrderStatusPoint[];
  category_products_chart: CategoryProductPoint[];
  recent_orders: RecentOrderItem[];
}