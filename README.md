# Pokémon Favorites - PokeAPI 🔴⚪

## 🚀 Proyecto de Prueba Técnica - Frontend Developer (Vue.js)3

Aplicación web moderna para gestionar una lista de Pokémons favoritos utilizando la [PokeAPI](https://pokeapi.co/).

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 📋 Descripción

Esta aplicación permite a los usuarios:

- ✅ Ver una lista infinita de Pokémons con infinite scroll
- ⭐ Marcar/desmarcar Pokémons como favoritos
- 📊 Ver detalles específicos de cada Pokémon (tipos, altura, peso)
- 📋 Compartir información de Pokémons al portapapeles
- 💾 Persistir favoritos en localStorage (sin backend)
- 🎨 Diseño pixel-perfect basado en Figma
- ⚡ Performance optimizado para grandes cantidades de data

## 🛠️ Stack Tecnológico

### Core Framework
- **Vue 3** (v3.4) - Framework JavaScript progresivo
  - Composition API con `<script setup>`
  - Reactivity System moderno
  - Performance optimizado

- **TypeScript** (v5.4) - Superset de JavaScript con tipado estático
  - Type safety en todo el código
  - Mejor DX (Developer Experience)
  - Autocomplete y detección de errores

- **Vite** (v5.1) - Build tool de próxima generación
  - HMR (Hot Module Replacement) ultra-rápido
  - Build optimizado para producción
  - ESBuild para transpilación rápida

### State Management & Routing
- **Pinia** (v2.1) - Store oficial para Vue 3
  - API intuitiva y simple
  - TypeScript support nativo
  - DevTools integration
  - Persistencia en localStorage

- **Vue Router** (v4.2) - Routing oficial para Vue
  - Navegación declarativa
  - Lazy loading de rutas
  - Guards de navegación

### HTTP Client
- **Axios** (v1.6) - Cliente HTTP basado en promesas
  - Interceptors para manejo de requests/responses
  - Timeout configuration
  - Error handling centralizado

### Styling
- **Tailwind CSS** (v3.4) - Framework CSS de utilidades
  - Diseño responsive out-of-the-box
  - Customización fácil
  - Build optimizado (PurgeCSS)
  - PostCSS integration

### Testing & Quality
- **Vitest** (v1.3) - Framework de testing ultra-rápido
  - Compatible con Jest API
  - ESM first
  - Coverage reports

- **Vue Test Utils** (v2.4) - Utilidades oficiales para testing
  - Testing de componentes Vue
  - Mocking de stores y composables

- **ESLint** (v9.0) - Linter de código JavaScript/TypeScript
  - Reglas personalizadas para Vue
  - TypeScript support
  - Prettier integration

- **Prettier** (v3.2) - Formateador de código
  - Formato consistente
  - Integrado con ESLint

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular y escalable inspirada en Domain-Driven Design:

```
src/
├── assets/              # Recursos estáticos
│   └── main.css        # Estilos globales + Tailwind imports
│
├── components/          # Componentes reutilizables
│   ├── __tests__/      # Tests unitarios de componentes
│   ├── AppHeader.vue   # Header con contador de favoritos
│   ├── EmptyState.vue  # Estado vacío
│   ├── LoadingSpinner.vue  # Animación de pokébola
│   ├── PokemonCard.vue # Card individual de pokémon
│   └── PokemonList.vue # Lista con infinite scroll
│
├── composables/         # Lógica compartida (Vue Composables)
│   ├── __tests__/      # Tests de composables
│   ├── useClipboard.ts # Hook para clipboard API
│   └── usePokemon.ts   # Hook para lógica de pokémons
│
├── router/              # Configuración de Vue Router
│   └── index.ts        # Definición de rutas
│
├── services/            # Servicios de API
│   └── pokeapi.ts      # Cliente de PokeAPI con Axios
│
├── stores/              # Pinia Stores
│   ├── __tests__/      # Tests de stores
│   └── pokemon.ts      # Store de pokémons y favoritos
│
├── types/               # Tipos e interfaces TypeScript
│   └── pokemon.ts      # Tipos de la API y modelos
│
├── utils/               # Funciones helper
│   ├── __tests__/      # Tests de utilidades
│   └── pokemon.ts      # Helpers de formateo y colores
│
├── views/               # Páginas/Vistas
│   └── HomeView.vue    # Vista principal
│
├── App.vue              # Componente raíz
└── main.ts              # Punto de entrada
```

## 📦 Instalación

```bash
# Instalar dependencias
npm install
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo - Servidor con HMR en http://localhost:5173
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Ejecutar tests unitarios
npm run test:unit

# Ejecutar tests con coverage
npm run test:coverage

# Linting
npm run lint

# Formatear código
npm run format
```

## 🎯 Decisiones Técnicas y Arquitectura

### 1. **Composition API + `<script setup>`**
Elegí usar la Composition API de Vue 3 porque:
- Mejor organización de lógica reutilizable
- TypeScript support superior
- Mejor tree-shaking
- Código más conciso y legible

### 2. **TypeScript Strict Mode**
Todo el proyecto está escrito en TypeScript para:
- Detectar errores en tiempo de desarrollo
- Mejor autocomplete y DX
- Documentación implícita del código
- Refactoring más seguro

### 3. **Pinia para State Management**
Seleccioné Pinia sobre Vuex porque:
- API más simple e intuitiva
- TypeScript support de primera clase
- Mejor performance (sin mutations)
- Store modular por defecto

### 4. **Infinite Scroll con Intersection Observer**
Para manejar grandes cantidades de data:
- **Lazy loading**: Solo carga 20 pokémons a la vez
- **Intersection Observer API**: Detecta cuando el usuario llega al final
- **Cache en Pinia**: Evita llamadas duplicadas a la API
- **Performance**: Puede manejar miles de pokémons sin lag

### 5. **Persistencia en localStorage**
Los favoritos se guardan en localStorage porque:
- No se requiere backend (requisito de la prueba)
- Persistencia entre sesiones
- Implementación simple y confiable
- Watcher automático en Pinia para sincronización

### 6. **Composables Reutilizables**
Creé composables (`usePokemon`, `useClipboard`) para:
- Separar lógica de presentación
- Reutilización de código (DRY)
- Testing más fácil
- Mejor organización

### 7. **Service Layer**
La lógica de API está en `services/pokeapi.ts`:
- Separación de concerns
- Fácil de mockear en tests
- Manejo centralizado de errores
- Axios interceptors para configuración global

### 8. **Optimización de Performance**
- **Lazy loading de imágenes**: `loading="lazy"` en imgs
- **Batch requests**: `Promise.all()` para cargar múltiples pokémons
- **Cache de pokémons**: Map en Pinia store
- **CSS animations**: GPU-accelerated con `transform`
- **Tree shaking**: Solo importa lo que se usa

## 📝 Principios de Código Aplicados

### SOLID
- **S**ingle Responsibility: Cada componente/función tiene una responsabilidad única
- **O**pen/Closed: Componentes abiertos a extensión, cerrados a modificación
- **L**iskov Substitution: Interfaces consistentes
- **I**nterface Segregation: Tipos TypeScript específicos
- **D**ependency Inversion: Dependemos de abstracciones (tipos, interfaces)

### DRY (Don't Repeat Yourself)
- Composables para lógica reutilizable
- Utils para funciones helper
- Componentes reutilizables

### KISS (Keep It Simple, Stupid)
- Código claro y directo
- Sin over-engineering
- Comentarios donde es necesario

### Separation of Concerns
- Componentes de presentación vs lógica
- Services para API calls
- Stores para estado global
- Utils para funciones puras

## 🎨 Diseño y Estilos

- Diseño basado en **Figma** proporcionado
- **Tailwind CSS** para estilos utility-first
- **Responsive design**: Mobile, tablet y desktop
- **Animaciones suaves**: CSS transitions y keyframes
- **Colores por tipo**: Cada tipo de pokémon tiene su color específico
- **Loading states**: Animación de pokébola personalizada

## 🧪 Testing

El proyecto incluye tests unitarios completos:

```bash
npm run test:unit
```

**Coverage:**
- ✅ Store de Pinia (pokemon.spec.ts)
- ✅ Utilidades (pokemon.spec.ts)
- ✅ Composables (useClipboard.spec.ts)
- ✅ Componentes (PokemonCard.spec.ts)

## 📚 API Utilizada

**PokeAPI**: https://pokeapi.co/

```typescript
// Lista de pokémons con paginación
GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0

// Detalles de un pokémon específico
GET https://pokeapi.co/api/v2/pokemon/{name}
```

## 🚀 Características Destacadas

### ⚡ Performance
- Infinite scroll con Intersection Observer
- Cache de pokémons en memoria
- Lazy loading de imágenes
- Batch loading de datos

### 🎯 UX
- Loading states con animación custom
- Error handling con retry
- Feedback visual al copiar
- Animaciones suaves

### 🏗️ Arquitectura
- Clean Architecture
- Separation of Concerns
- TypeScript strict mode
- Composables reutilizables

### 🧪 Quality
- Unit tests con Vitest
- ESLint + Prettier
- TypeScript type safety
- Error boundary

## 🌐 Deployment

Para hacer deploy, ejecuta:

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`. Puedes deployar en:
- **Vercel** (recomendado para Vue/Vite)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

## 👨‍💻 Autor

Desarrollado con ❤️ y mucho ☕ para **Global66**

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de una prueba técnica para la posición de **Frontend Developer** en Global66.

**Fecha**: Octubre 2025

