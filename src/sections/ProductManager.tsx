import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Upload, Video } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { getMediaUrl } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductManagerProps {
  products: Product[];
  onUpdate: () => void;
}

const CATEGORIES = [
  'Bong / Dab Rig / E-Rig',
  'Vapes / Puff / E-Cig',
  'Pipas / Chillums',
  'Grinders / Accesorios',
  'Papelillos / Filtros',
  'Storage / Contenedores',
  'Limpieza / Mantenimiento',
  'Otros'
];

export function ProductManager({ products, onUpdate }: ProductManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    category: '',
    price: '',
    stock: '',
  });

  const filteredProducts = products.filter(p =>
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ code: '', description: '', category: '', price: '', stock: '' });
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    if (product.image) {
      setImagePreview(getMediaUrl(product.image) || '');
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.deleteProduct(id);
      toast.success('Producto eliminado');
      onUpdate();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      toast.success('Video seleccionado: ' + file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('code', formData.code);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (selectedImage) data.append('image', selectedImage);

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
        
        // Upload video separately if selected
        if (selectedVideo) {
          await api.uploadVideo(editingProduct.id, selectedVideo);
        }
        
        toast.success('Producto actualizado');
      } else {
        const newProduct = await api.createProduct(data);
        
        // Upload video separately if selected
        if (selectedVideo && newProduct.id) {
          await api.uploadVideo(newProduct.id, selectedVideo);
        }
        
        toast.success('Producto creado');
      }
      
      resetForm();
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      toast.error('Error al guardar');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#161619] border-white/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Gestión de Productos</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#ff4520] hover:bg-[#ff6b3d]"
                  onClick={() => { resetForm(); setIsDialogOpen(true); }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#161619] border-white/5 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Código</Label>
                      <Input
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="bg-[#1c1c20] border-white/10"
                        placeholder="ej: BON0159"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                      >
                        <SelectTrigger className="bg-[#1c1c20] border-white/10">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1c1c20] border-white/10">
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#1c1c20] border-white/10"
                      placeholder="Nombre del producto"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Precio (₡)</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-[#1c1c20] border-white/10"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="bg-[#1c1c20] border-white/10"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Imagen del Producto</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center cursor-pointer hover:border-[#ff4520]/50 transition-colors"
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-40 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-[#5a5650]" />
                          <p className="text-sm text-[#9a9490]">Click para subir imagen</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-2">
                    <Label>Video del Producto (opcional)</Label>
                    <div 
                      onClick={() => videoInputRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-[#ff4520]/50 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Video className="w-5 h-5 text-[#5a5650]" />
                        <span className="text-sm text-[#9a9490]">
                          {selectedVideo ? selectedVideo.name : 'Click para subir video'}
                        </span>
                      </div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 border-white/10"
                      onClick={() => { resetForm(); setIsDialogOpen(false); }}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-[#ff4520] hover:bg-[#ff6b3d]"
                    >
                      {editingProduct ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5650]" />
            <Input
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1c1c20] border-white/10"
            />
          </div>

          {/* Products Table */}
          <div className="border border-white/5 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[#9a9490]">Producto</TableHead>
                  <TableHead className="text-[#9a9490]">Código</TableHead>
                  <TableHead className="text-[#9a9490]">Categoría</TableHead>
                  <TableHead className="text-[#9a9490]">Precio</TableHead>
                  <TableHead className="text-[#9a9490]">Stock</TableHead>
                  <TableHead className="text-[#9a9490] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img 
                            src={getMediaUrl(product.image) || ''}
                            alt={product.description}
                            className="w-10 h-10 rounded object-cover bg-[#1c1c20]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#1c1c20] flex items-center justify-center">🌿</div>
                        )}
                        <span className="font-medium text-sm">{product.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#9a9490]">{product.code}</TableCell>
                    <TableCell className="text-sm">{product.category}</TableCell>
                    <TableCell className="font-bold text-[#ff4520]">₡{product.price.toLocaleString('es-CR')}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
