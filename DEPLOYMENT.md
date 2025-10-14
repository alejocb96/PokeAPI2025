# 🚀 Guía de Deployment

## Subir a GitHub

### 1. Inicializar Git

```bash
git init
git add -A
git commit -m "initial commit: Vue 3 + TypeScript Pokemon App"
```

### 2. Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio (sin README, sin .gitignore)
3. Copia la URL del repositorio

### 3. Conectar y hacer push

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## Deploy en Vercel (Recomendado)

Vercel es ideal para proyectos Vue/Vite:

### Opción 1: Desde GitHub

1. Ve a [Vercel](https://vercel.com)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Vite
5. Haz clic en "Deploy"

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## Deploy en Netlify

### Opción 1: Desde la interfaz

1. Ve a [Netlify](https://netlify.com)
2. Arrastra la carpeta `dist/` después de hacer build
3. O conecta tu repositorio de GitHub

### Opción 2: Con Netlify CLI

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## Deploy en GitHub Pages

### 1. Configurar Vite

Actualiza `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/nombre-de-tu-repo/',
  // ... resto de la config
})
```

### 2. Build y Deploy

```bash
# Build
npm run build

# Deploy usando gh-pages
npm i -g gh-pages
gh-pages -d dist
```

### 3. Configurar GitHub Pages

1. Ve a Settings > Pages en tu repositorio
2. Selecciona branch `gh-pages`
3. Guarda

---

## Variables de Entorno (si las necesitas)

Crea un archivo `.env`:

```env
VITE_API_BASE_URL=https://pokeapi.co/api/v2
```

En producción (Vercel/Netlify), agrega las variables en la interfaz web.

---

## Scripts Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Tests
npm run test:unit

# Lint
npm run lint

# Format
npm run format
```

---

## Checklist antes de Deploy

- [ ] Todos los tests pasan (`npm run test:unit`)
- [ ] No hay errores de linting (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Preview funciona correctamente (`npm run preview`)
- [ ] README.md actualizado
- [ ] Variables de entorno configuradas (si aplica)
- [ ] .gitignore configurado correctamente

---

## Performance Tips

Para mejorar el performance en producción:

1. **Lazy Loading**: Ya implementado con Intersection Observer
2. **Image Optimization**: Ya usando `loading="lazy"`
3. **Code Splitting**: Vite lo hace automáticamente
4. **Compression**: Vercel/Netlify lo hacen automáticamente

---

## Troubleshooting

### Error: Build falla

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: TypeScript

```bash
# Verificar tipos
npm run build
# Si hay errores, revisa los archivos mencionados
```

### Error: 404 en rutas

Para Vue Router en modo history, configura redirects:

**Netlify** (`public/_redirects`):
```
/* /index.html 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

¡Listo para deployar! 🚀

