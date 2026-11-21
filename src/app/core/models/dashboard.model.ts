/* admin dashboard kpi summary */
export interface AdminDashboardStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  out_of_stock_count: number;
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

/* complete dashboard payload */
export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recent_orders: RecentOrderItem[];
}
