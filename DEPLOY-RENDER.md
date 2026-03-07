# 🚀 Despliegue en Render.com - Resumen Rápido

## ¿Qué necesitas?

1. Cuenta en **GitHub** (gratis)
2. Cuenta en **Render.com** (gratis)

---

## Paso 1: Subir a GitHub

```bash
# Ir a la carpeta
cd /mnt/okcomputer/output/app

# Crear repositorio git
git init

# Agregar todo
git add .

# Guardar cambios
git commit -m "NIEBLA Admin - Initial commit"

# Conectar con GitHub (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/niebla-admin.git

# Subir
git push -u origin main
```

---

## Paso 2: Crear Servicio en Render.com

1. Ve a https://render.com y regístrate
2. Click **"New +"** → **"Web Service"**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `niebla-admin`

### Configuración:

| Campo | Valor |
|-------|-------|
| **Name** | `niebla-admin` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

5. Click **"Create Web Service"**

---

## Paso 3: Configurar Disco Persistente (IMPORTANTE ⚠️)

Esto evita que se borren tus datos cuando el servidor reinicie:

1. En tu servicio, click en **"Disks"** (pestaña)
2. Click **"Add Disk"**
3. Configura:
   - **Name**: `data`
   - **Mount Path**: `/opt/render/project/src/data`
   - **Size**: `1 GB`
4. Click **"Save"**

---

## Paso 4: Esperar y Probar

1. Render construirá automáticamente
2. Cuando diga **"Your service is live"**, está listo
3. La URL será algo como: `https://niebla-admin.onrender.com`

---

## 📁 Archivos Importantes Creados

| Archivo | Propósito |
|---------|-----------|
| `render.yaml` | Configuración automática para Render |
| `.gitignore` | Archivos que no se suben a GitHub |
| `GUIA-RENDER.md` | Guía detallada completa |

---

## 🔄 Actualizar Después de Cambios

Cuando hagas cambios localmente:

```bash
cd /mnt/okcomputer/output/app
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Render se actualiza automáticamente.

---

## ⚠️ Limitaciones del Plan Gratis

| Recurso | Límite |
|---------|--------|
| **Sleep** | Se "duerme" después de 15 min sin uso |
| **Wake up** | Tarda ~30 segundos al entrar (primera vez) |
| **Disco** | 1 GB total |
| **CPU/RAM** | Compartido |

---

## 🆘 Solución de Problemas

### "Build failed"
→ Revisa logs en pestaña **"Logs"**

### "No se ven las imágenes"
→ Verifica que el **disco** esté configurado

### "Los datos se borran"
→ NO configuraste el disco persistente. Ve a **"Disks"** y agrégalo.

---

## ✅ Checklist Final

- [ ] Código subido a GitHub
- [ ] Web Service creado en Render
- [ ] Disco persistente configurado (1GB)
- [ ] Deploy exitoso
- [ ] URL funciona
- [ ] Puedes agregar productos

---

## 🎯 Tu URL Final

```
https://niebla-admin.onrender.com
```

**¡Listo! Tu tienda está en línea.** 🎉
