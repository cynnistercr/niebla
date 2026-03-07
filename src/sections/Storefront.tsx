import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Search, Star, Tag, TrendingUp, Minus, Plus, Trash2, X, Phone } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, StoreSettings, CartItem } from '@/types';

// Helper to get image URL (works for both local and production)
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return null;
  // In production, use relative URL; in dev, use localhost
  if (import.meta.env.PROD) {
    return imagePath; // Relative URL like /uploads/images/xxx.jpg
  }
  return `http://localhost:3001${imagePath}`;
};

interface StorefrontProps {
  products: Product[];
  settings: StoreSettings | null;
}

export function Storefront({ products, settings }: StorefrontProps) {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'same' | 'next'>('same');
  const [address, setAddress] = useState('');

  // Get enhanced products with settings
  const enhancedProducts = useMemo(() => {
    if (!settings) return products;
    
    return products.map(p => ({
      ...p,
      isFeatured: settings.featuredProducts.includes(p.id),
      isMostPurchased: settings.mostPurchased.includes(p.id),
      salePrice: settings.saleProducts.find(s => s.id === p.id)?.salePrice,
      isOnSale: settings.saleProducts.some(s => s.id === p.id),
    }));
  }, [products, settings]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return enhancedProducts.filter(p => {
      const matchesSearch = !searchQuery || 
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [enhancedProducts, searchQuery, selectedCategory]);

  // Group by category
  const groupedProducts = useMemo(() => {
    const groups: Record<string, typeof enhancedProducts> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProducts]);

  // Featured products
  const featuredProducts = useMemo(() => {
    return enhancedProducts.filter(p => p.isFeatured).slice(0, 6);
  }, [enhancedProducts]);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: {
        product,
        qty: (prev[product.id]?.qty || 0) + 1
      }
    }));
    toast.success('Agregado al carrito');
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId];
      if (!current) return prev;
      const newQty = Math.max(0, current.qty + delta);
      if (newQty === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: { ...current, qty: newQty } };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearCart = () => {
    if (confirm('¿Vaciar el carrito?')) {
      setCart({});
    }
  };

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + price * item.qty;
  }, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const sendWhatsApp = () => {
    if (cartItems.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    if (!address.trim()) {
      toast.error('Ingresa tu dirección');
      return;
    }

    const phone = settings?.storeInfo?.phone || '50671426489';
    const deliveryLabel = deliveryType === 'same' ? 'Delivery mismo día' : 'Correos de CR (próximo día)';
    
    let message = `🌫️ *NIEBLA — Nueva Orden*\n\n`;
    message += `📦 *Entrega:* ${deliveryLabel}\n`;
    message += `📍 *Dirección:* ${address}\n\n`;
    message += `*Productos:*\n`;
    
    cartItems.forEach(item => {
      const price = item.product.salePrice || item.product.price;
      const lineTotal = price * item.qty;
      message += `• ${item.product.code} — ${item.product.description}\n`;
      message += `  Cant: ${item.qty} × ₡${price.toLocaleString('es-CR')} = ₡${lineTotal.toLocaleString('es-CR')}\n`;
    });
    
    message += `\n💰 *Total: ₡${cartTotal.toLocaleString('es-CR')}*`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const categories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {/* Store Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0c]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              NIEBLA<span className="text-[#ff4520]">.</span>
            </div>
            <Badge variant="outline" className="border-[#ff4520]/30 text-[#ff4520] text-xs">
              Delivery mismo día
            </Badge>
          </div>
          
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-white/10 relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Mi Orden
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ff4520] rounded-full text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#111114] border-white/5 w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>TU ORDEN</span>
                  {cartItems.length > 0 && (
                    <button onClick={clearCart} className="text-xs text-red-500 hover:text-red-400">
                      Vaciar
                    </button>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* Delivery Type */}
                <div>
                  <p className="text-xs text-[#9a9490] mb-2 uppercase tracking-wider">Tipo de entrega</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDeliveryType('same')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        deliveryType === 'same' 
                          ? 'border-[#ff4520]/50 bg-[#ff4520]/10 text-[#ff4520]' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium text-sm">Mismo Día</div>
                      <div className="text-xs opacity-70">Delivery directo</div>
                    </button>
                    <button
                      onClick={() => setDeliveryType('next')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        deliveryType === 'next' 
                          ? 'border-[#ff4520]/50 bg-[#ff4520]/10 text-[#ff4520]' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="font-medium text-sm">Próximo Día</div>
                      <div className="text-xs opacity-70">Correos de CR</div>
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-xs text-[#9a9490] mb-2 uppercase tracking-wider">Dirección</p>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={deliveryType === 'same' ? 'Dirección exacta...' : 'Provincia / cantón...'}
                    className="bg-[#1c1c20] border-white/10"
                  />
                </div>

                {/* Cart Items */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-[#9a9490] py-8">Tu orden está vacía</p>
                  ) : (
                    cartItems.map(({ product, qty }) => {
                      const price = product.salePrice || product.price;
                      return (
                        <div key={product.id} className="flex gap-3 p-3 bg-[#1c1c20] rounded-lg">
                          {product.image ? (
                            <img 
                              src={getImageUrl(product.image) || ''}
                              alt={product.description}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-[#161619] flex items-center justify-center">🌿</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.description}</p>
                            <p className="text-xs text-[#9a9490]">{product.code}</p>
                            <p className="text-sm text-[#ff4520] font-bold">
                              ₡{(price * qty).toLocaleString('es-CR')}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button 
                                onClick={() => updateQty(product.id, -1)}
                                className="w-6 h-6 rounded bg-[#161619] flex items-center justify-center hover:bg-[#ff4520] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm">{qty}</span>
                              <button 
                                onClick={() => updateQty(product.id, 1)}
                                className="w-6 h-6 rounded bg-[#161619] flex items-center justify-center hover:bg-[#ff4520] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(product.id)}
                            className="text-[#5a5650] hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Total & Checkout */}
                {cartItems.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total</span>
                      <span className="text-2xl font-bold text-[#ff4520]">
                        ₡{cartTotal.toLocaleString('es-CR')}
                      </span>
                    </div>
                    <Button 
                      onClick={sendWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      ENVIAR ORDEN POR WHATSAPP
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff4520]/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <p className="text-xs text-[#ff4520] tracking-[0.3em] uppercase mb-4">Costa Rica · Delivery 🇨🇷</p>
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-wider mb-4"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            NIE<span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>BLA.</span>
          </h1>
          <p className="text-[#9a9490] max-w-md mx-auto">
            Smoke shop con delivery mismo día · Envíos por Correos de CR
          </p>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold">Destacados</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={() => addToCart(product)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="px-4 py-4 sticky top-[60px] z-30 bg-[#0a0a0c]/95 backdrop-blur-xl border-y border-white/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5650]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar producto..."
              className="pl-10 bg-[#1c1c20] border-white/10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#ff4520] text-white'
                    : 'bg-[#1c1c20] border border-white/10 hover:border-white/20'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section className="px-4 py-8 pb-24">
        {Object.entries(groupedProducts).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              {category}
              <Badge variant="outline" className="border-white/10 text-[#9a9490]">
                {items.length}
              </Badge>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={() => addToCart(product)} 
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="text-2xl font-bold tracking-wider mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
          NIEBLA<span className="text-[#ff4520]">.</span>
        </div>
        <p className="text-xs text-[#5a5650] font-mono tracking-wider">
          SMOKE SHOP · DELIVERY COSTA RICA
        </p>
        <p className="text-xs text-[#5a5650] mt-1">
          WhatsApp: +506 7142-6489 · Precios con I.V.A incluido
        </p>
      </footer>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product & { isOnSale?: boolean; salePrice?: number; isMostPurchased?: boolean };
  onAdd: () => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  const [showVideo, setShowVideo] = useState(false);
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.price > product.salePrice;

  return (
    <div className="bg-[#161619] rounded-xl border border-white/5 overflow-hidden group hover:border-[#ff4520]/30 transition-all hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square bg-[#1c1c20] overflow-hidden">
        {product.image ? (
          <img 
            src={getImageUrl(product.image) || ''}
            alt={product.description}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOnSale && (
            <Badge className="bg-green-500/90 text-white text-xs">
              <Tag className="w-3 h-3 mr-1" />
              OFERTA
            </Badge>
          )}
          {product.isMostPurchased && (
            <Badge className="bg-blue-500/90 text-white text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              TOP
            </Badge>
          )}
        </div>

        {/* Video indicator */}
        {product.video && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute bottom-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-[#ff4520] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs text-[#5a5650] font-mono">{product.code}</p>
        <p className="text-sm font-medium line-clamp-2 min-h-[40px]">{product.description}</p>
        
        {/* Tags */}
        <div className="flex gap-1 mt-2 mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            Mismo día
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Correos CR
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {hasDiscount && (
            <span className="text-sm text-[#5a5650] line-through">
              ₡{product.price.toLocaleString('es-CR')}
            </span>
          )}
          <span className={`text-lg font-bold ${hasDiscount ? 'text-green-500' : 'text-[#ff4520]'}`}>
            ₡{displayPrice.toLocaleString('es-CR')}
          </span>
        </div>

        {/* Add Button */}
        <Button 
          onClick={onAdd}
          className="w-full bg-[#ff4520] hover:bg-[#ff6b3d] text-sm"
          size="sm"
        >
          Agregar
        </Button>
      </div>

      {/* Video Modal */}
      {showVideo && product.video && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative max-w-2xl w-full">
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 text-white hover:text-[#ff4520]"
            >
              <X className="w-6 h-6" />
            </button>
            <video 
              src={getImageUrl(product.video) || ''}
              controls
              autoPlay
              className="w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
