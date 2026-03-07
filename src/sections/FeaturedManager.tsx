import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, TrendingUp, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { getMediaUrl } from '@/lib/utils';
import type { Product, StoreSettings } from '@/types';

interface FeaturedManagerProps {
  products: Product[];
  settings: StoreSettings | null;
  onUpdate: () => void;
}

export function FeaturedManager({ products, settings, onUpdate }: FeaturedManagerProps) {
  const [featuredIds, setFeaturedIds] = useState<string[]>(settings?.featuredProducts || []);
  const [saleProducts, setSaleProducts] = useState<{ id: string; salePrice: number }[]>(
    settings?.saleProducts || []
  );
  const [mostPurchasedIds, setMostPurchasedIds] = useState<string[]>(settings?.mostPurchased || []);
  const [salePriceInput, setSalePriceInput] = useState<Record<string, string>>({});

  const toggleFeatured = (productId: string) => {
    setFeaturedIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleMostPurchased = (productId: string) => {
    setMostPurchasedIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToSale = (productId: string) => {
    const price = parseFloat(salePriceInput[productId]);
    if (!price || price <= 0) {
      toast.error('Ingresa un precio de oferta válido');
      return;
    }
    setSaleProducts(prev => [...prev.filter(p => p.id !== productId), { id: productId, salePrice: price }]);
    setSalePriceInput(prev => ({ ...prev, [productId]: '' }));
    toast.success('Agregado a ofertas');
  };

  const removeFromSale = (productId: string) => {
    setSaleProducts(prev => prev.filter(p => p.id !== productId));
  };

  const saveFeatured = async () => {
    try {
      await api.setFeaturedProducts(featuredIds);
      toast.success('Destacados guardados');
      onUpdate();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const saveSale = async () => {
    try {
      await api.setSaleProducts(saleProducts);
      toast.success('Ofertas guardadas');
      onUpdate();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const saveMostPurchased = async () => {
    try {
      await api.setMostPurchased(mostPurchasedIds);
      toast.success('Más vendidos guardados');
      onUpdate();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const isOnSale = (productId: string) => {
    return saleProducts.some(p => p.id === productId);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="featured" className="space-y-6">
        <TabsList className="bg-[#161619] border border-white/5 p-1">
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-500"
          >
            <Star className="w-4 h-4 mr-2" />
            Destacados
          </TabsTrigger>
          <TabsTrigger 
            value="sale"
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500"
          >
            <Tag className="w-4 h-4 mr-2" />
            En Oferta
          </TabsTrigger>
          <TabsTrigger 
            value="trending"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Más Vendidos
          </TabsTrigger>
        </TabsList>

        {/* Featured Products */}
        <TabsContent value="featured">
          <Card className="bg-[#161619] border-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Productos Destacados
                  </CardTitle>
                  <p className="text-sm text-[#9a9490] mt-1">
                    Estos productos aparecerán en la sección destacada de la homepage
                  </p>
                </div>
                <Button 
                  onClick={saveFeatured}
                  className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleFeatured(product.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      featuredIds.includes(product.id)
                        ? 'border-yellow-500/50 bg-yellow-500/10'
                        : 'border-white/5 bg-[#1c1c20] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {product.image ? (
                        <img 
                          src={getMediaUrl(product.image) || ''}
                          alt={product.description}
                          className="w-16 h-16 rounded object-cover bg-[#161619]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-[#161619] flex items-center justify-center text-2xl">🌿</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.description}</p>
                        <p className="text-xs text-[#9a9490]">{product.code}</p>
                        <p className="text-sm text-[#ff4520] font-bold mt-1">
                          ₡{product.price.toLocaleString('es-CR')}
                        </p>
                      </div>
                      {featuredIds.includes(product.id) && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sale Products */}
        <TabsContent value="sale">
          <Card className="bg-[#161619] border-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="w-5 h-5 text-green-500" />
                    Productos en Oferta
                  </CardTitle>
                  <p className="text-sm text-[#9a9490] mt-1">
                    Configura precios especiales de oferta para productos seleccionados
                  </p>
                </div>
                <Button 
                  onClick={saveSale}
                  className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Sales */}
              {saleProducts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Ofertas Activas</h4>
                  <div className="flex flex-wrap gap-2">
                    {saleProducts.map((sale) => {
                      const product = products.find(p => p.id === sale.id);
                      if (!product) return null;
                      return (
                        <Badge 
                          key={sale.id}
                          variant="secondary"
                          className="bg-green-500/20 text-green-500 border-green-500/30 px-3 py-2"
                        >
                          {product.description}
                          <span className="mx-2 text-green-400">→</span>
                          <span className="font-bold">₡{sale.salePrice.toLocaleString('es-CR')}</span>
                          <button 
                            onClick={() => removeFromSale(sale.id)}
                            className="ml-2 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Sale */}
              <div>
                <h4 className="text-sm font-medium mb-3">Agregar a Oferta</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.filter(p => !isOnSale(p.id)).map((product) => (
                    <div
                      key={product.id}
                      className="p-4 rounded-lg border border-white/5 bg-[#1c1c20]"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {product.image ? (
                          <img 
                            src={getMediaUrl(product.image) || ''}
                            alt={product.description}
                            className="w-12 h-12 rounded object-cover bg-[#161619]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-[#161619] flex items-center justify-center text-xl">🌿</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.description}</p>
                          <p className="text-xs text-[#9a9490]">Normal: ₡{product.price.toLocaleString('es-CR')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Precio oferta"
                          value={salePriceInput[product.id] || ''}
                          onChange={(e) => setSalePriceInput(prev => ({ 
                            ...prev, 
                            [product.id]: e.target.value 
                          }))}
                          className="flex-1 bg-[#161619] border-white/10 text-sm"
                        />
                        <Button 
                          size="sm"
                          onClick={() => addToSale(product.id)}
                          className="bg-green-500/20 text-green-500 hover:bg-green-500/30"
                        >
                          <Tag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Most Purchased */}
        <TabsContent value="trending">
          <Card className="bg-[#161619] border-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Más Vendidos
                  </CardTitle>
                  <p className="text-sm text-[#9a9490] mt-1">
                    Etiqueta productos como más vendidos para destacarlos en la tienda
                  </p>
                </div>
                <Button 
                  onClick={saveMostPurchased}
                  className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleMostPurchased(product.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      mostPurchasedIds.includes(product.id)
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/5 bg-[#1c1c20] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {product.image ? (
                        <img 
                          src={getMediaUrl(product.image) || ''}
                          alt={product.description}
                          className="w-16 h-16 rounded object-cover bg-[#161619]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-[#161619] flex items-center justify-center text-2xl">🌿</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.description}</p>
                        <p className="text-xs text-[#9a9490]">{product.code}</p>
                        <p className="text-sm text-[#ff4520] font-bold mt-1">
                          ₡{product.price.toLocaleString('es-CR')}
                        </p>
                      </div>
                      {mostPurchasedIds.includes(product.id) && (
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
