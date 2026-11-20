/* User entity interface */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
}

/* Standard API response wrapper */
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

/* Auth response data */
export interface AuthData {
  user: User;
  token: string;
}

/* Login form payload */
export interface LoginPayload {
  email: string;
  password: string;
}

/* Register form payload */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}