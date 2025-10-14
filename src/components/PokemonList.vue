<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePokemon } from '@/composables/usePokemon'
import PokemonCard from './PokemonCard.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const { pokemons, isLoading, error, hasMore, loadPokemons } = usePokemon()

const loadMoreTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

// Cargar pokémons iniciales
onMounted(async () => {
  await loadPokemons(true)
  setupInfiniteScroll()
})

// Configurar Intersection Observer para infinite scroll
function setupInfiniteScroll() {
  if (!loadMoreTrigger.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !isLoading.value && hasMore.value) {
        loadPokemons()
      }
    },
    {
      rootMargin: '100px' // Cargar cuando esté a 100px del final
    }
  )

  observer.value.observe(loadMoreTrigger.value)
}

// Limpiar observer
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})

async function retry() {
  await loadPokemons(true)
}
</script>

<template>
  <div class="pokemon-list-container">
    <!-- Error state -->
    <div v-if="error && pokemons.length === 0" class="error-container">
      <div class="error-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="error-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <p class="error-message">{{ error }}</p>
        <button @click="retry" class="retry-btn">Reintentar</button>
      </div>
    </div>

    <!-- Loading inicial -->
    <div v-else-if="isLoading && pokemons.length === 0" class="loading-container">
      <LoadingSpinner size="lg" />
      <p class="loading-text">Cargando Pokémons...</p>
    </div>

    <!-- Lista de pokémons -->
    <div v-else class="pokemon-grid">
      <PokemonCard v-for="pokemon in pokemons" :key="pokemon.id" :pokemon="pokemon" />
    </div>

    <!-- Loading más pokémons -->
    <div v-if="isLoading && pokemons.length > 0" class="loading-more">
      <LoadingSpinner size="md" />
    </div>

    <!-- Trigger para infinite scroll -->
    <div ref="loadMoreTrigger" class="load-more-trigger"></div>

    <!-- Mensaje final -->
    <div v-if="!hasMore && pokemons.length > 0" class="end-message">
      <p>¡Has visto todos los Pokémons disponibles! 🎉</p>
    </div>
  </div>
</template>

<style scoped>
.pokemon-list-container {
  width: 100%;
  padding: 2rem 1rem;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .pokemon-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.error-message {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.loading-text {
  color: #6b7280;
  font-size: 1.125rem;
  font-weight: 500;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.load-more-trigger {
  height: 20px;
  visibility: hidden;
}

.end-message {
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}
</style>

