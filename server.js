const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Database files
const PRODUCTS_FILE = path.join(dataDir, 'products.json');
const SETTINGS_FILE = path.join(dataDir, 'settings.json');

// Initialize default data
function initDatabase() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      featuredProducts: [],
      saleProducts: [],
      mostPurchased: [],
      storeInfo: {
        name: 'NIEBLA',
        phone: '50671426489',
        deliverySameDay: true,
        deliveryNextDay: true
      }
    }, null, 2));
  }
}

initDatabase();

// Helper functions
function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

function readSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
}

function writeSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.fieldname === 'video' ? 'videos' : 'images';
    const dest = path.join(uploadsDir, type);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      if (file.mimetype.startsWith('video/')) cb(null, true);
      else cb(new Error('Only video files allowed'));
    } else {
      if (file.mimetype.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files allowed'));
    }
  }
});

// ============ PRODUCT API ============

// Get all products
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Create product
app.post('/api/products', upload.single('image'), (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    price: parseFloat(req.body.price) || 0,
    stock: parseInt(req.body.stock) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (req.file) {
    newProduct.image = `/uploads/images/${req.file.filename}`;
  }
  
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  const updatedProduct = {
    ...products[index],
    ...req.body,
    price: parseFloat(req.body.price) || products[index].price,
    stock: parseInt(req.body.stock) || products[index].stock,
    updatedAt: new Date().toISOString()
  };
  
  if (req.file) {
    // Delete old image if exists
    if (products[index].image) {
      const oldPath = path.join(__dirname, products[index].image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    updatedProduct.image = `/uploads/images/${req.file.filename}`;
  }
  
  products[index] = updatedProduct;
  writeProducts(products);
  res.json(updatedProduct);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  // Delete associated image
  if (products[index].image) {
    const imagePath = path.join(__dirname, products[index].image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
  
  // Delete associated video
  if (products[index].video) {
    const videoPath = path.join(__dirname, products[index].video);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
  }
  
  products.splice(index, 1);
  writeProducts(products);
  res.json({ message: 'Product deleted' });
});

// Upload video for product
app.post('/api/products/:id/video', upload.single('video'), (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });
  
  if (req.file) {
    // Delete old video if exists
    if (products[index].video) {
      const oldPath = path.join(__dirname, products[index].video);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    products[index].video = `/uploads/videos/${req.file.filename}`;
    products[index].updatedAt = new Date().toISOString();
    writeProducts(products);
    res.json(products[index]);
  } else {
    res.status(400).json({ error: 'No video uploaded' });
  }
});

// ============ SETTINGS API ============

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(readSettings());
});

// Update settings
app.put('/api/settings', (req, res) => {
  const settings = readSettings();
  const updated = { ...settings, ...req.body };
  writeSettings(updated);
  res.json(updated);
});

// Set featured products
app.post('/api/settings/featured', (req, res) => {
  const settings = readSettings();
  settings.featuredProducts = req.body.productIds || [];
  writeSettings(settings);
  res.json(settings);
});

// Set sale products
app.post('/api/settings/sale', (req, res) => {
  const settings = readSettings();
  settings.saleProducts = req.body.products || []; // { id, salePrice }
  writeSettings(settings);
  res.json(settings);
});

// Set most purchased
app.post('/api/settings/most-purchased', (req, res) => {
  const settings = readSettings();
  settings.mostPurchased = req.body.productIds || [];
  writeSettings(settings);
  res.json(settings);
});

// ============ STATS API ============

// Get dashboard stats
app.get('/api/stats', (req, res) => {
  const products = readProducts();
  const settings = readSettings();
  
  const stats = {
    totalProducts: products.length,
    totalCategories: new Set(products.map(p => p.category)).size,
    featuredCount: settings.featuredProducts.length,
    onSaleCount: settings.saleProducts.length,
    mostPurchasedCount: settings.mostPurchased.length,
    categories: [...new Set(products.map(p => p.category).filter(Boolean))]
  };
  
  res.json(stats);
});

// Serve static files from dist folder (frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve index.html for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not built. Run npm run build first.' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Admin panel: http://localhost:${PORT}`);
});
