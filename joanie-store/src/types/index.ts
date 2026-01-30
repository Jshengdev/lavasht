export type Category = 'new-arrivals' | 'trending'

export interface Product {
  id: string
  name: string
  price: number
  salePrice?: number | null
  image: string
  rating: number
  reviewCount: number
  category: Category
  isOnSale: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  userId: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
}
