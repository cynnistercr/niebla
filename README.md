# NIEBLA Admin - Sistema de Gestión de Tienda

Sistema completo de administración para NIEBLA Smoke Shop con backend API, panel de administración y tienda en línea.

## Características

- **Dashboard** con estadísticas en tiempo real
- **Gestión de Productos** completa (CRUD)
- **Productos Destacados** para homepage
- **Productos en Oferta** con precios especiales
- **Más Vendidos** etiquetado
- **Subida de Imágenes y Videos** para productos
- **Carrito de Compras** funcional
- **Pedidos por WhatsApp** integración

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el servidor backend
npm run server

# En otra terminal, iniciar el frontend (desarrollo)
npm run dev
```

## Estructura del Proyecto

```
├── server.js              # Backend API (Express)
├── data/                  # Base de datos JSON
│   ├── products.json      # Productos
│   └── settings.json      # Configuración
├── uploads/               # Archivos subidos
│   ├── images/           # Imágenes de productos
│   └── videos/           # Videos de productos
├── src/
│   ├── sections/         # Componentes principales
│   │   ├── Dashboard.tsx
│   │   ├── ProductManager.tsx
│   │   ├── FeaturedManager.tsx
│   │   └── Storefront.tsx
│   ├── services/
│   │   └── api.ts        # API client
│   └── types/
│       └── index.ts      # TypeScript types
```

## Uso del Panel de Administración

### 1. Dashboard
- Visualiza estadísticas de productos
- Accesos rápidos a funciones principales
- Productos recientes

### 2. Productos
- **Crear**: Click en "Nuevo Producto"
- **Editar**: Click en el ícono de editar
- **Eliminar**: Click en el ícono de eliminar
- **Subir imágenes**: Click en el área de imagen
- **Subir videos**: Click en el área de video

### 3. Destacados
- Selecciona productos para la sección destacada de la homepage
- Configura ofertas con precios especiales
- Etiqueta productos como "Más Vendidos"

### 4. Tienda
- Previsualiza cómo ven los clientes tu tienda
- Prueba el carrito de compras
- Verifica los pedidos por WhatsApp

## API Endpoints

### Productos
- `GET /api/products` - Listar todos
- `GET /api/products/:id` - Obtener uno
- `POST /api/products` - Crear (con imagen)
- `PUT /api/products/:id` - Actualizar (con imagen)
- `DELETE /api/products/:id` - Eliminar
- `POST /api/products/:id/video` - Subir video

### Configuración
- `GET /api/settings` - Obtener configuración
- `PUT /api/settings` - Actualizar configuración
- `POST /api/settings/featured` - Set destacados
- `POST /api/settings/sale` - Set ofertas
- `POST /api/settings/most-purchased` - Set más vendidos

### Estadísticas
- `GET /api/stats` - Estadísticas del dashboard

## Despliegue

### Desarrollo Local
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Producción
```bash
# Construir frontend
npm run build

# El servidor sirve los archivos estáticos desde dist/
npm start
```

## Mantenimiento

### Backup
Los datos se almacenan en archivos JSON en la carpeta `data/`:
- `products.json` - Todos los productos
- `settings.json` - Configuración de destacados, ofertas, etc.

Para hacer backup, simplemente copia estos archivos.

### Agregar Nuevas Categorías
Edita el array `CATEGORIES` en `src/sections/ProductManager.tsx`

### Cambiar Número de WhatsApp
Edita `storeInfo.phone` en `data/settings.json` o usa el panel de administración.

## Personalización

### Colores
Los colores de la marca están definidos en:
- `src/index.css` - Variables CSS
- Tema principal: `#ff4520` (naranja/ember)

### Fuentes
- **Bebas Neue** - Títulos
- **Outfit** - Texto general
- **DM Mono** - Códigos y datos técnicos

## Soporte

Para soporte o preguntas, contacta al desarrollador.

---

**NIEBLA Smoke Shop · Delivery Costa Rica**
