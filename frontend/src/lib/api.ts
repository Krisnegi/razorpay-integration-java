const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

export const getCartId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexus_cart_id');
};

export const setCartId = (cartId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexus_cart_id', cartId);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexus_auth_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nexus_auth_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexus_auth_token');
  }
};

const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const cartId = getCartId();
  if (cartId) {
    headers['x-cart-id'] = cartId;
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  // Auto-persist cartId if returned in response
  if (data.data?.cartId) {
    setCartId(data.data.cartId);
  }

  return data;
};

// --- Products APIs ---
export const fetchProducts = async (search?: string, category?: string) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await customFetch(`/products${query}`);
  return res.data;
};

// --- Cart APIs ---
export const fetchCart = async () => {
  const res = await customFetch('/cart');
  return res.data;
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const res = await customFetch('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
  return res.data;
};

export const updateCartItemQuantity = async (productId: number, quantity: number) => {
  const res = await customFetch(`/cart/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
  return res.data;
};

export const removeCartItem = async (productId: number) => {
  const res = await customFetch(`/cart/items/${productId}`, {
    method: 'DELETE',
  });
  return res.data;
};

export const clearCart = async () => {
  const res = await customFetch('/cart', {
    method: 'DELETE',
  });
  return res.data;
};

// --- Orders & Checkout APIs ---
export const checkoutOrder = async (orderData: {
  paymentMethod: 'CARD' | 'UPI' | 'NETBANKING' | 'WALLET' | 'COD';
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
}) => {
  const res = await customFetch('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return res.data;
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await customFetch('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
  return res.data;
};

export const fetchMyOrders = async () => {
  const res = await customFetch('/orders/my-orders');
  return res.data;
};

// --- User Authentication APIs ---
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const res = await customFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await customFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.data?.token) {
    setAuthToken(res.data.token);
  }
  return res.data;
};

export const fetchProfile = async () => {
  const res = await customFetch('/auth/me');
  return res.data;
};
