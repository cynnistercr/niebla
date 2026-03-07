# Guía de Despliegue en Render.com

## Paso a Paso para Subir NIEBLA a Render.com

### Paso 1: Crear Cuenta en Render.com

1. Ve a https://render.com
2. Click en "Get Started for Free"
3. Regístrate con GitHub (recomendado) o email

---

### Paso 2: Subir Código a GitHub

1. Crea un nuevo repositorio en GitHub
2. En tu computadora, ejecuta estos comandos:

```bash
cd /mnt/okcomputer/output/app

# Inicializar git
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - NIEBLA Admin"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU-USUARIO/niebla-admin.git

# Subir código
git push -u origin main
```

---

### Paso 3: Crear Servicio en Render.com

1. En Render.com, click en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu cuenta de GitHub
4. Busca y selecciona el repositorio `niebla-admin`
5. Configura así:

| Campo | Valor |
|-------|-------|
| **Name** | niebla-admin |
| **Region** | Oregon (US West) |
| **Branch** | main |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

6. Click en **"Create Web Service"**

---

### Paso 4: Configurar Disco Persistente (IMPORTANTE)

Para que tus datos no se borren cuando el servidor reinicie:

1. En tu servicio, ve a la pestaña **"Disks"**
2. Click en **"Add Disk"**
3. Configura:
   - **Name**: `data`
   - **Mount Path**: `/opt/render/project/src/data`
   - **Size**: 1 GB (Free plan)
4. Click **"Save"**

---

### Paso 5: Esperar el Despliegue

1. Render construirá automáticamente tu aplicación
2. Verás los logs en tiempo real
3. Cuando diga "Your service is live", está listo

---

### Paso 6: Acceder a tu Aplicación

1. Render te dará una URL como:
   ```
   https://niebla-admin.onrender.com
   ```

2. Abre esa URL en tu navegador

3. ¡Listo! Tu panel admin está en línea

---

## Configuración Adicional

### Cambiar el Número de WhatsApp

1. Ve a tu app en Render
2. Pestaña **"Shell"**
3. Ejecuta:
```bash
cat data/settings.json
```
4. Para editar, usa:
```bash
nano data/settings.json
```
5. Cambia el número y guarda (Ctrl+X, Y, Enter)

### Variables de Entorno (Opcional)

Si quieres configurar cosas sin editar archivos:

1. En Render, ve a **"Environment"**
2. Agrega variables:
   - `WHATSAPP_NUMBER` = 50671426489
   - `STORE_NAME` = NIEBLA

---

## Estructura en Render.com

```
niebla-admin (Web Service)
├── 📁 src/              ← Código fuente
├── 📁 dist/             ← Frontend compilado
├── 📁 data/             ← 💾 DATOS PERSISTENTES
│   ├── products.json
│   └── settings.json
├── 📁 uploads/          ← 💾 IMÁGENES/Videos
│   ├── images/
│   └── videos/
├── server.js            ← Backend
└── package.json
```

---

## Comandos Útiles en Render Shell

```bash
# Ver productos
cat data/products.json

# Ver configuración
cat data/settings.json

# Ver imágenes subidas
ls -la uploads/images/

# Ver videos subidos
ls -la uploads/videos/

# Reiniciar servidor (si hay problemas)
# Click en "Manual Deploy" → "Deploy latest commit"
```

---

## Solución de Problemas

### "Build failed"
→ Revisa los logs en la pestaña "Logs"

### "Cannot find module"
→ El package.json debe tener todas las dependencias

### "No se ven las imágenes"
→ Asegúrate que el disco esté montado correctamente

### "Los datos se borran al reiniciar"
→ NO configuraste el disco persistente. Ve a "Disks" y agrégalo.

---

## Plan Free - Limitaciones

| Recurso | Límite |
|---------|--------|
| CPU/RAM | Compartido |
| Disco | 1 GB |
| Sleep | Se "duerme" después de 15 min sin uso |
| Wake up | Toma ~30 segundos al entrar |
| Bandwidth | 100 GB/mes |

**Nota**: Cuando el servicio "duerme", la primera visita tardará ~30 segundos en cargar. Después funciona normal.

---

## Actualizar tu App

Cuando hagas cambios locales:

```bash
cd /mnt/okcomputer/output/app
git add .
git commit -m "Actualización: ..."
git push origin main
```

Render detectará automáticamente y re-desplegará.

---

## Backup de Datos en Render

Para descargar tus productos:

1. Ve a **Shell** en Render
2. Ejecuta:
```bash
cat data/products.json
```
3. Copia el contenido y guárdalo localmente

O usa:
```bash
# Crear backup
zip -r backup.zip data/ uploads/
```

---

## URLs Importantes

| URL | Descripción |
|-----|-------------|
| `https://niebla-admin.onrender.com` | Tu panel admin |
| `https://niebla-admin.onrender.com/api/products` | API de productos |
| `https://niebla-admin.onrender.com/api/settings` | API de configuración |

---

## Checklist de Despliegue

- [ ] Cuenta en Render.com creada
- [ ] Código en GitHub
- [ ] Web Service creado en Render
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Disco persistente configurado (1GB)
- [ ] Deploy exitoso
- [ ] URL funciona
- [ ] Puedes agregar productos
- [ ] Las imágenes se guardan

---

## ¿Necesitas Ayuda?

Si algo falla, revisa:
1. Los **logs** en Render (pestaña Logs)
2. Que el **disco** esté configurado
3. Que **package.json** tenga los scripts correctos

¡Buena suerte con tu despliegue! 🚀
