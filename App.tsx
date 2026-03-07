import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from 'sonner';
import { Store, LayoutDashboard, Package, ShoppingBag } from 'lucide-react';
import { Dashboard } from '@/sections/Dashboard';
import { ProductManager } from '@/sections/ProductManager';
import { FeaturedManager } from '@/sections/FeaturedManager';
import { Storefront } from '@/sections/Storefront';
import { api } from '@/services/api';
import type { Product, StoreSettings, DashboardStats } from '@/types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [productsData, settingsData, statsData] = await Promise.all([
        api.getProducts(),
        api.getSettings(),
        api.getStats(),
      ]);
      setProducts(productsData);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Error loading data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-[#ff4520] text-xl font-bold animate-pulse">Cargando NIEBLA...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#ede9e4]">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              NIEBLA<span className="text-[#ff4520]">.</span>
            </div>
            <span className="text-xs text-[#5a5650] font-mono tracking-widest uppercase">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="#storefront" 
              onClick={() => setActiveTab('storefront')}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff4520] hover:bg-[#ff6b3d] rounded-lg text-sm font-medium transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Ver Tienda
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#161619] border border-white/5 p-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-[#ff4520] data-[state=active]:text-white"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="data-[state=active]:bg-[#ff4520] data-[state=active]:text-white"
            >
              <Package className="w-4 h-4 mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger 
              value="featured"
              className="data-[state=active]:bg-[#ff4520] data-[state=active]:text-white"
            >
              <Store className="w-4 h-4 mr-2" />
              Destacados
            </TabsTrigger>
            <TabsTrigger 
              value="storefront"
              className="data-[state=active]:bg-[#ff4520] data-[state=active]:text-white"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Tienda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard stats={stats} products={products} onRefresh={refreshData} />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager products={products} onUpdate={refreshData} />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedManager 
              products={products} 
              settings={settings} 
              onUpdate={refreshData} 
            />
          </TabsContent>

          <TabsContent value="storefront">
            <Storefront products={products} settings={settings} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
