<script setup lang="ts">
import { computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

const store = usePokemonStore()
const favoritesCount = computed(() => store.favoritesCount)
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <h1 class="app-title">
          <span class="pokeball-emoji">⚪</span>
          Pokédex
        </h1>
        <p class="app-subtitle">Descubre y guarda tus Pokémons favoritos</p>
      </div>

      <div class="favorites-badge" v-if="favoritesCount > 0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="heart-icon"
        >
          <path
            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
          />
        </svg>
        <span class="favorites-count">{{ favoritesCount }}</span>
        <span class="favorites-text">Favoritos</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  padding: 2rem 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-section {
  flex: 1;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pokeball-emoji {
  font-size: 2rem;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.app-subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 400;
}

.favorites-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  backdrop-filter: blur(10px);
}

.heart-icon {
  width: 24px;
  height: 24px;
  color: #fecaca;
}

.favorites-count {
  font-size: 1.25rem;
  font-weight: 700;
}

.favorites-text {
  font-size: 0.875rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .app-title {
    font-size: 1.875rem;
  }

  .app-subtitle {
    font-size: 0.875rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .favorites-badge {
    align-self: flex-start;
  }
}
</style>

