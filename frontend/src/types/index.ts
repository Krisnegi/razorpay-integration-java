export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
  itemTotal: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
}
