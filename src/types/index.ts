export interface Product {
  id: string;
  code: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  stock: number;
  image?: string;
  video?: string;
  isOnSale?: boolean;
  isFeatured?: boolean;
  isMostPurchased?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface StoreSettings {
  featuredProducts: string[];
  saleProducts: { id: string; salePrice: number }[];
  mostPurchased: string[];
  storeInfo: {
    name: string;
    phone: string;
    deliverySameDay: boolean;
    deliveryNextDay: boolean;
  };
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  featuredCount: number;
  onSaleCount: number;
  mostPurchasedCount: number;
  categories: string[];
}
