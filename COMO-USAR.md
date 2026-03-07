# Cómo Usar NIEBLA Admin - Explicación Simple

## ¿Qué es esto?

Es un **sistema completo** para manejar tu tienda NIEBLA. Tiene 3 partes:

1. **Panel de Administración** - Donde tú agregas/edita productos
2. **Base de Datos** - Guarda todos tus productos, imágenes, precios
3. **Tienda Pública** - Lo que ven tus clientes

---

## ¿Cómo funciona todo junto?

```
┌─────────────────────────────────────────────────────────┐
│                    TU COMPUTADORA                       │
│                                                         │
│  ┌──────────────┐      ┌──────────────┐               │
│  │   Panel      │◄────►│   Backend    │               │
│  │   Admin      │      │   (server)   │               │
│  │  (React)     │      │              │               │
│  └──────────────┘      └──────┬───────┘               │
│         ▲                     │                        │
│         │                     ▼                        │
│         │              ┌──────────────┐               │
│         │              │   Archivos   │               │
│         │              │   JSON       │               │
│         │              │   (datos)    │               │
│         │              └──────────────┘               │
│         │                     │                        │
│         │                     ▼                        │
│         │              ┌──────────────┐               │
│         └─────────────►│   Imágenes   │               │
│                        │   y Videos   │               │
│                        └──────────────┘               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Instrucciones Paso a Paso

### Paso 1: Iniciar el Sistema

Abre una terminal y ejecuta:

```bash
cd /mnt/okcomputer/output/app
./start.sh
```

Esto hace todo automáticamente:
- ✅ Crea las carpetas necesarias
- ✅ Instala dependencias (solo primera vez)
- ✅ Construye el frontend (solo primera vez)
- ✅ Inicia el servidor

### Paso 2: Abrir en Navegador

Cuando veas el mensaje "Starting server...", abre:

```
http://localhost:3001
```

### Paso 3: Usar el Panel Admin

Verás 4 pestañas:

| Pestaña | Para qué sirve |
|---------|----------------|
| **Dashboard** | Ver estadísticas rápidas |
| **Productos** | Agregar, editar, eliminar productos |
| **Destacados** | Poner productos en oferta o destacados |
| **Tienda** | Ver cómo ven los clientes tu tienda |

---

## Tareas Comunes

### Agregar un Producto Nuevo

1. Click en pestaña **"Productos"**
2. Click en botón **"Nuevo Producto"** (arriba derecha)
3. Llena el formulario:
   - **Código**: ej. BON0159
   - **Descripción**: Nombre del producto
   - **Categoría**: Selecciona una
   - **Precio**: En colones
   - **Stock**: Cantidad disponible
4. **Click en área de imagen** para subir foto
5. Click en **"Crear"**

### Cambiar Precio de un Producto

1. En "Productos", busca el producto
2. Click en el **ícono de lápiz** (editar)
3. Cambia el precio
4. Click en **"Actualizar"**

### Poner Producto en Oferta (Sale)

1. Ve a pestaña **"Destacados"**
2. Click en **"En Oferta"**
3. Busca el producto
4. Escribe el **precio de oferta** (más barato)
5. Click en el **ícono verde de etiqueta**
6. Click en **"Guardar"** arriba a la derecha

### Destacar Producto en Homepage

1. Ve a pestaña **"Destacados"**
2. Click en **"Destacados"**
3. Click en los productos que quieras destacar (se pondrán amarillos)
4. Click en **"Guardar"**

### Cambiar Imagen de Producto

1. En "Productos", click en **lápiz** (editar)
2. Click en la **imagen actual**
3. Selecciona nueva imagen
4. Click en **"Actualizar"**

### Subir Video a Producto

1. Editar producto
2. En el formulario, hay una sección "Video del Producto"
3. Click ahí y selecciona el video
4. Guardar cambios

---

## ¿Dónde se guardan los datos?

Todo se guarda en tu computadora en archivos:

| Archivo | Qué guarda |
|---------|------------|
| `data/products.json` | Todos los productos |
| `data/settings.json` | Destacados, ofertas, config |
| `uploads/images/` | Fotos de productos |
| `uploads/videos/` | Videos de productos |

**Para hacer backup**: Solo copia estas carpetas a un USB o Drive.

---

## Estructura de Carpetas

```
/mnt/okcomputer/output/app/
│
├── 📁 data/                    ← Tu base de datos
│   ├── products.json          ← Productos
│   └── settings.json          ← Configuración
│
├── 📁 uploads/                 ← Archivos subidos
│   ├── images/                ← Fotos
│   └── videos/                ← Videos
│
├── 📁 dist/                    ← Frontend compilado
│   └── (archivos estáticos)
│
├── 📁 src/                     ← Código fuente
│   └── sections/              ← Componentes del panel
│
├── server.js                   ← Backend (API)
├── start.sh                    ← Script para iniciar
└── package.json                ← Configuración
```

---

## Solución de Problemas

### "No se ven las imágenes"
→ Asegúrate que el servidor esté corriendo (./start.sh)

### "Error: Port already in use"
→ Cierra otras aplicaciones o cambia el puerto en server.js

### "No puedo agregar productos"
→ Revisa que llenaste todos los campos requeridos

### "Los cambios no se guardan"
→ Click en el botón "Guardar" o "Actualizar"

---

## Comandos Útiles

```bash
# Iniciar todo
./start.sh

# Solo backend
npm run server

# Solo frontend (desarrollo)
npm run dev

# Construir frontend
npm run build
```

---

## ¿Y para subirlo a Internet?

### Opción 1: Servidor Propio (VPS)
Sube toda la carpeta `/mnt/okcomputer/output/app` a un servidor y corre `./start.sh`

### Opción 2: Render.com (Gratis)
1. Sube el código a GitHub
2. Conecta con Render.com
3. Comando: `npm start`

### Opción 3: Tiiny.site (Solo Frontend)
1. Corre `npm run build`
2. Sube la carpeta `dist/` a tiiny.site
3. **PERO** necesitas el backend en otro lado

---

## Resumen

1. **Un solo comando** inicia todo: `./start.sh`
2. **4 pestañas** manejan todo tu negocio
3. **Datos seguros** en archivos JSON locales
4. **Fácil backup** - solo copia las carpetas `data/` y `uploads/`

**¡Listo! Tu sistema está completo y funcionando.** 🎉
