# Guía Rápida - NIEBLA Admin

## Tu Sistema está Listo 🎉

He construido un sistema completo de administración para tu smoke shop NIEBLA. Aquí está todo lo que puedes hacer:

---

## Funcionalidades

### 1. **Dashboard** - Vista General
- Estadísticas de productos totales
- Productos en oferta
- Productos destacados
- Más vendidos
- Productos recientes

### 2. **Gestión de Productos**
- ✅ Agregar nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Subir imágenes
- ✅ Subir videos
- ✅ Categorías organizadas

### 3. **Destacados y Ofertas**
- Seleccionar productos para la homepage
- Configurar precios de oferta
- Etiquetar productos más vendidos

### 4. **Tienda en Línea**
- Carrito de compras funcional
- Filtros por categoría
- Búsqueda de productos
- Pedidos directos por WhatsApp

---

## Cómo Usar el Sistema

### Para iniciar el sistema localmente:

```bash
# 1. Ir a la carpeta del proyecto
cd /mnt/okcomputer/output/app

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar el servidor backend
npm run server

# 4. En otra terminal, iniciar el frontend
npm run dev
```

### Acceder al sistema:
- **Panel Admin**: http://localhost:5173
- **API Backend**: http://localhost:3001/api

---

## Estructura de Archivos Importantes

```
/mnt/okcomputer/output/app/
├── server.js              # Backend API
├── data/
│   ├── products.json      # Todos tus productos
│   └── settings.json      # Configuración
├── uploads/
│   ├── images/           # Fotos de productos
│   └── videos/           # Videos de productos
├── src/
│   └── sections/         # Componentes del panel
└── dist/                 # Frontend compilado
```

---

## Mantenimiento

### Agregar un Producto Nuevo:
1. Ve a la pestaña "Productos"
2. Click en "Nuevo Producto"
3. Llena los datos:
   - Código (ej: BON0159)
   - Descripción
   - Categoría
   - Precio
   - Stock
4. Sube una imagen (click en el área punteada)
5. Opcional: Sube un video
6. Click en "Crear"

### Poner Producto en Oferta:
1. Ve a la pestaña "Destacados"
2. Click en "En Oferta"
3. Encuentra el producto
4. Ingresa el precio de oferta
5. Click en el ícono de etiqueta
6. Click en "Guardar"

### Destacar Producto en Homepage:
1. Ve a la pestaña "Destacados"
2. Click en "Destacados"
3. Click en los productos que quieras destacar
4. Click en "Guardar"

### Cambiar Imagen de Producto:
1. Ve a "Productos"
2. Click en el ícono de editar (lápiz)
3. Click en el área de imagen
4. Selecciona nueva imagen
5. Click en "Actualizar"

---

## Backup de Datos

Tus datos se guardan en archivos JSON. Para hacer backup:

```bash
# Copiar archivos de datos
cp /mnt/okcomputer/output/app/data/products.json ~/backup-products.json
cp /mnt/okcomputer/output/app/data/settings.json ~/backup-settings.json

# Copiar imágenes y videos
cp -r /mnt/okcomputer/output/app/uploads ~/backup-uploads
```

---

## Personalización

### Cambiar número de WhatsApp:
Edita el archivo `data/settings.json`:
```json
{
  "storeInfo": {
    "phone": "50671426489"
  }
}
```

### Agregar nuevas categorías:
Edita `src/sections/ProductManager.tsx` y busca el array `CATEGORIES`

### Cambiar colores:
Edita `src/index.css` - busca las variables de color

---

## Despliegue en Producción

### Opción 1: Servidor Propio (VPS)
```bash
# Construir frontend
npm run build

# Iniciar servidor (sirve frontend + backend)
npm start
```

### Opción 2: Tiiny.site (Static)
1. Construye: `npm run build`
2. Sube la carpeta `dist/` a tiiny.site
3. El backend necesita estar en otro servidor

### Opción 3: Render/Railway/Heroku
1. Sube el código a GitHub
2. Conecta a Render/Railway/Heroku
3. Configura el comando de inicio: `npm start`

---

## Solución de Problemas

### Error "Cannot find module"
```bash
npm install
```

### Error de puerto en uso
```bash
# Cambia el puerto en server.js
const PORT = process.env.PORT || 3002; // Cambia 3001 a 3002
```

### No se ven las imágenes
Asegúrate de que el servidor backend esté corriendo en el puerto 3001

---

## Próximas Mejoras Sugeridas

1. **Autenticación** - Login para proteger el panel admin
2. **Base de datos real** - MongoDB o PostgreSQL
3. **Análisis de ventas** - Gráficos de productos más vendidos
4. **Gestión de pedidos** - Tracking de órdenes
5. **Notificaciones** - Alertas de stock bajo
6. **Múltiples imágenes** - Galería por producto

---

## Soporte

¿Preguntas? El sistema está completo y funcional. Revisa el archivo `README.md` para más detalles técnicos.

**¡Tu tienda NIEBLA ahora es dinámica y fácil de mantener!** 🌫️
