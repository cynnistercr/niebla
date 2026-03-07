# Diagrama de Despliegue en Render.com

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TU COMPUTADORA                                │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │              /mnt/okcomputer/output/app                     │      │
│   │                                                             │      │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │      │
│   │  │  Frontend   │  │   Backend   │  │      Datos          │ │      │
│   │  │   (React)   │  │  (Node.js)  │  │  • products.json    │ │      │
│   │  │             │  │             │  │  • settings.json    │ │      │
│   │  │  Dashboard  │  │    API      │  │  • Imágenes         │ │      │
│   │  │   Tienda    │  │  server.js  │  │  • Videos           │ │      │
│   │  └─────────────┘  └─────────────┘  └─────────────────────┘ │      │
│   │                                                             │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                              │                                          │
│                              ▼                                          │
│                    ┌─────────────────┐                                 │
│                    │  git push       │                                 │
│                    │  a GitHub       │                                 │
│                    └────────┬────────┘                                 │
│                             │                                          │
└─────────────────────────────┼──────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              GITHUB.COM                                 │
│                                                                         │
│                    ┌─────────────────────┐                             │
│                    │  niebla-admin       │                             │
│                    │  (repositorio)      │                             │
│                    └──────────┬──────────┘                             │
│                               │                                        │
└───────────────────────────────┼────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            RENDER.COM                                   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │                    Web Service: niebla-admin                    │  │
│   │                                                                 │  │
│   │  ┌─────────────────────────────────────────────────────────┐   │  │
│   │  │              Build: npm install && npm run build        │   │  │
│   │  │                                                         │   │  │
│   │  │  1. Instala dependencias                              │   │  │
│   │  │  2. Compila frontend → dist/                          │   │  │
│   │  └─────────────────────────────────────────────────────────┘   │  │
│   │                              │                                  │  │
│   │                              ▼                                  │  │
│   │  ┌─────────────────────────────────────────────────────────┐   │  │
│   │  │              Start: npm start                           │   │  │
│   │  │                                                         │   │  │
│   │  │  server.js sirve:                                     │   │  │
│   │  │  • / → Frontend (dist/)                               │   │  │
│   │  │  • /api/* → Backend API                               │   │  │
│   │  │  • /uploads/* → Imágenes y videos                     │   │  │
│   │  └─────────────────────────────────────────────────────────┘   │  │
│   │                              │                                  │  │
│   │                              ▼                                  │  │
│   │  ┌─────────────────────────────────────────────────────────┐   │  │
│   │  │              DISCO PERSISTENTE (1GB)                    │   │  │
│   │  │                                                         │   │  │
│   │  │  📁 /opt/render/project/src/data/                     │   │  │
│   │  │     ├── products.json  ← TUS PRODUCTOS                │   │  │
│   │  │     └── settings.json  ← CONFIGURACIÓN                │   │  │
│   │  │                                                         │   │  │
│   │  │  📁 /opt/render/project/src/uploads/                  │   │  │
│   │  │     ├── images/        ← FOTOS                        │   │  │
│   │  │     └── videos/        ← VIDEOS                       │   │  │
│   │  │                                                         │   │  │
│   │  │  ⚠️ IMPORTANTE: Sin disco, datos se borran al         │   │  │
│   │  │  reiniciar el servidor!                               │   │  │
│   │  └─────────────────────────────────────────────────────────┘   │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   URL PÚBLICA: https://niebla-admin.onrender.com                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CLIENTE   │────►│   RENDER    │────►│   DISCO     │
│  (Navegador)│     │  (Servidor) │     │ (Persistente)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │ 1. Agrega producto│                   │
       │──────────────────►│                   │
       │                   │ 2. Guarda en JSON │
       │                   │──────────────────►│
       │                   │                   │
       │ 3. Sube imagen    │                   │
       │──────────────────►│                   │
       │                   │ 4. Guarda archivo │
       │                   │──────────────────►│
       │                   │                   │
       │ 5. Ver tienda     │                   │
       │──────────────────►│                   │
       │                   │ 6. Lee datos      │
       │                   │◄──────────────────│
       │                   │                   │
       │ 7. Muestra tienda │                   │
       │◄──────────────────│                   │
```

---

## URLs Importantes en Render

| URL | Descripción |
|-----|-------------|
| `/` | Panel de administración |
| `/api/products` | API - Lista de productos |
| `/api/settings` | API - Configuración |
| `/uploads/images/` | Imágenes de productos |
| `/uploads/videos/` | Videos de productos |

---

## Estructura de Archivos en Render

```
/opt/render/project/src/
│
├── 📁 src/                    ← Código fuente (no se usa en producción)
├── 📁 dist/                   ← Frontend compilado (sirve estático)
├── 📁 data/                   ← 💾 DATOS PERSISTENTES
│   ├── products.json
│   └── settings.json
├── 📁 uploads/                ← 💾 ARCHIVOS SUBIDOS
│   ├── images/
│   └── videos/
├── server.js                  ← Backend
├── package.json
└── ...
```

---

## ¿Por qué necesito el Disco Persistente?

### Sin Disco (❌ MAL):
```
Servidor reinicia → Datos se borran → Pierdes todo
```

### Con Disco (✅ BIEN):
```
Servidor reinicia → Datos persisten → Todo se mantiene
```

---

## Comandos Útiles en Render Shell

```bash
# Ver productos
cat data/products.json | jq

# Ver configuración
cat data/settings.json | jq

# Listar imágenes
ls -la uploads/images/

# Backup manual
zip -r backup.zip data/ uploads/
```

---

## Resumen Visual del Proceso

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Escribe │───►│  GitHub  │───►│  Render  │───►│   LIVE   │
│   Código │    │   Push   │    │   Build  │    │   URL    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘

Tiempo total: ~5 minutos primer deploy
              ~2 minutos updates
```
