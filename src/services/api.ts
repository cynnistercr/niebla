import type { Product, StoreSettings, DashboardStats } from '@/types';

// Use relative URL for production (same domain), or localhost for development
const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api');

class ApiService {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.fetch<Product[]>('/products');
  }

  async getProduct(id: string): Promise<Product> {
    return this.fetch<Product>(`/products/${id}`);
  }

  async createProduct(product: FormData): Promise<Product> {
    return this.fetch<Product>('/products', {
      method: 'POST',
      body: product,
    });
  }

  async updateProduct(id: string, product: FormData): Promise<Product> {
    return this.fetch<Product>(`/products/${id}`, {
      method: 'PUT',
      body: product,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.fetch<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadVideo(productId: string, video: File): Promise<Product> {
    const formData = new FormData();
    formData.append('video', video);
    return this.fetch<Product>(`/products/${productId}/video`, {
      method: 'POST',
      body: formData,
    });
  }

  // Settings
  async getSettings(): Promise<StoreSettings> {
    return this.fetch<StoreSettings>('/settings');
  }

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return this.fetch<StoreSettings>('/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  }

  async setFeaturedProducts(productIds: string[]): Promise<StoreSettings> {
    return this.fetch<StoreSettings>('/settings/featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    });
  }

  async setSaleProducts(products: { id: string; salePrice: number }[]): Promise<StoreSettings> {
    return this.fetch<StoreSettings>('/settings/sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });
  }

  async setMostPurchased(productIds: string[]): Promise<StoreSettings> {
    return this.fetch<StoreSettings>('/settings/most-purchased', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    });
  }

  // Stats
  async getStats(): Promise<DashboardStats> {
    return this.fetch<DashboardStats>('/stats');
  }
}

export const api = new ApiService();
