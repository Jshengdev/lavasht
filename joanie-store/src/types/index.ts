export type Category = 'new-arrivals' | 'trending';

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  rating: number;
  reviewCount: number;
  category: Category;
  isOnSale: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}
