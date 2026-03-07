import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tag, TrendingUp, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMediaUrl } from '@/lib/utils';
import type { DashboardStats, Product } from '@/types';

interface DashboardProps {
  stats: DashboardStats | null;
  products: Product[];
  onRefresh: () => void;
}

export function Dashboard({ stats, products, onRefresh }: DashboardProps) {
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#161619] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#9a9490]">Total Productos</CardTitle>
            <Package className="w-4 h-4 text-[#ff4520]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-[#5a5650] mt-1">{stats?.totalCategories || 0} categorías</p>
          </CardContent>
        </Card>

        <Card className="bg-[#161619] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#9a9490]">En Oferta</CardTitle>
            <Tag className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.onSaleCount || 0}</div>
            <p className="text-xs text-[#5a5650] mt-1">Productos con descuento</p>
          </CardContent>
        </Card>

        <Card className="bg-[#161619] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#9a9490]">Destacados</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.featuredCount || 0}</div>
            <p className="text-xs text-[#5a5650] mt-1">En página principal</p>
          </CardContent>
        </Card>

        <Card className="bg-[#161619] border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#9a9490]">Más Vendidos</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.mostPurchasedCount || 0}</div>
            <p className="text-xs text-[#5a5650] mt-1">Etiquetados como top</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#161619] border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            <Button variant="outline" size="sm" onClick={onRefresh} className="border-white/10">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="#products"
              className="p-4 bg-[#1c1c20] rounded-lg hover:bg-[#252529] transition-colors border border-white/5"
            >
              <Package className="w-8 h-8 text-[#ff4520] mb-3" />
              <h3 className="font-medium mb-1">Gestionar Productos</h3>
              <p className="text-sm text-[#9a9490]">Agregar, editar o eliminar productos</p>
            </a>
            <a 
              href="#featured"
              className="p-4 bg-[#1c1c20] rounded-lg hover:bg-[#252529] transition-colors border border-white/5"
            >
              <Star className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-medium mb-1">Destacados y Ofertas</h3>
              <p className="text-sm text-[#9a9490]">Configurar productos en homepage</p>
            </a>
            <a 
              href="#storefront"
              className="p-4 bg-[#1c1c20] rounded-lg hover:bg-[#252529] transition-colors border border-white/5"
            >
              <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-medium mb-1">Ver Tienda</h3>
              <p className="text-sm text-[#9a9490]">Previsualizar como ven los clientes</p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card className="bg-[#161619] border-white/5">
        <CardHeader>
          <CardTitle className="text-lg">Productos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <p className="text-[#9a9490] text-center py-8">No hay productos aún</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-4 p-3 bg-[#1c1c20] rounded-lg"
                >
                  {product.image ? (
                    <img 
                      src={getMediaUrl(product.image) || ''} 
                      alt={product.description}
                      className="w-12 h-12 rounded object-cover bg-[#161619]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-[#161619] flex items-center justify-center text-2xl">
                      🌿
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.description}</p>
                    <p className="text-xs text-[#9a9490]">{product.code} · {product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#ff4520]">₡{product.price.toLocaleString('es-CR')}</p>
                    <p className="text-xs text-[#5a5650]">
                      {new Date(product.createdAt).toLocaleDateString('es-CR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
