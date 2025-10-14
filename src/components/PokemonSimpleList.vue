<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from './LoadingSpinner.vue'
import SearchIcon from '@/assets/icons/SearchIcon.svg'
import StarIconGray from '@/assets/icons/StarIconGray.svg'
import StarIconGold from '@/assets/icons/StarIconGold.svg'

const router = useRouter()
const isLoading = ref(false)
const showFavorites = ref(false)
const searchQuery = ref('')
const pokemons = ref<Pokemon[]>([])
const limit = 20

// Obtener los favoritos del localStorage
const favorites = ref<Set<number>>(new Set(
  JSON.parse(localStorage.getItem('pokemonFavorites') || '[]')
))

interface Pokemon {
  id: number;
  name: string;
  isFavorite: boolean;
}

async function fetchPokemons() {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    // Fetch data
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
    const data = await response.json()

    // Transformar los resultados
    pokemons.value = data.results.map((pokemon: any) => {
      const id = parseInt(pokemon.url.split('/')[6])
      return {
        id,
        name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        isFavorite: favorites.value.has(id)
      }
    })
  } catch (error) {
    console.error('Error fetching pokemons:', error)
  } finally {
    isLoading.value = false
  }
}

// Observador para el scroll infinito
function setupIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading.value) {
        console.log('Cargando más pokémon...')
        fetchPokemons()
      }
    })
  }, options)

  // Observar el elemento trigger después de un pequeño delay
  setTimeout(() => {
    const trigger = document.querySelector('.load-more-trigger')
    if (trigger) {
      console.log('Observador configurado')
      observer.observe(trigger)
    }
  }, 100)

  // Limpiar observador al desmontar
  onUnmounted(() => {
    observer.disconnect()
  })
}

// Guardar favoritos en localStorage
function saveFavorites() {
  localStorage.setItem('pokemonFavorites', JSON.stringify([...favorites.value]))
}

// Calcular páginas del medio
const middlePages = computed(() => {
  if (currentPage <= 4 || currentPage >= totalPages.value - 3) return []
  
  return [currentPage.value - 1, currentPage.value, currentPage.value + 1]
})

const filteredPokemons = computed(() => {
  console.log('Calculando pokémon filtrados', {
    total: pokemons.value.length,
    searchQuery: searchQuery.value,
    showFavorites: showFavorites.value
  })
  
  let filtered = pokemons.value
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Filtrar por favoritos
  if (showFavorites.value) {
    filtered = filtered.filter(pokemon => pokemon.isFavorite)
  }
  
  console.log('Pokémon filtrados:', filtered.length)
  return filtered
})

function toggleFavorite(pokemon: Pokemon) {
  pokemon.isFavorite = !pokemon.isFavorite
  if (pokemon.isFavorite) {
    favorites.value.add(pokemon.id)
  } else {
    favorites.value.delete(pokemon.id)
  }
  saveFavorites()
}

function handlePokemonClick(pokemonId: number) {
  router.push(`/pokemon/${pokemonId}`)
}

// Cargar pokémon iniciales y configurar scroll infinito
onMounted(() => {
  fetchPokemons()
  setupIntersectionObserver()
})
</script>

<template>
  <div class="pokemon-list-container">
    <!-- Header con búsqueda -->
    <div class="search-header">
      <div class="search-input-wrapper">
        <img :src="SearchIcon" alt="Search" class="search-icon">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search Pokémon"
          class="search-input"
        >
      </div>
    </div>

    <!-- Lista de Pokémon -->
    <div class="pokemon-list">
      <div 
        v-for="pokemon in filteredPokemons" 
        :key="pokemon.id"
        class="pokemon-item"
      >
        <span 
          class="pokemon-name"
          @click="handlePokemonClick(pokemon.id)"
        >
          {{ pokemon.name }}
        </span>
        <button 
          class="favorite-btn"
          :class="{ 'is-favorite': pokemon.isFavorite }"
          @click="toggleFavorite(pokemon)"
        >
          <img :src="pokemon.isFavorite ? StarIconGold : StarIconGray" alt="Favorite" class="star-icon" />
        </button>
      </div>

      <!-- Loading spinner -->
      <div v-if="isLoading" class="loading-wrapper">
        <LoadingSpinner size="sm" />
      </div>
    </div>

    <!-- Filtros -->
    <div class="footer">
      <div class="filter-footer">
        <button 
          class="filter-btn"
          :class="{ active: !showFavorites }"
          @click="showFavorites = false"
        >
          All
        </button>
        <button 
          class="filter-btn"
          :class="{ active: showFavorites }"
          @click="showFavorites = true"
        >
          Favorites
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-list-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F8F8F8;
}

.search-header {
  padding: 1rem;
}

.search-input-wrapper {
  position: relative;
  width: 570px;
  margin: 0 auto;
  margin-top: 35px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 50px;
  padding: 0 44px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  opacity: 1;
}

.search-input::placeholder {
  color: #BFBFBF;
}

@media (max-width: 640px) {
  .search-input-wrapper {
    width: 90%;
    margin-top: 20px;
  }
}

.pokemon-list {
  width: 570px;
  margin: 0 auto;
  margin-top: 40px;
  padding: 0;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .pokemon-list {
    width: 90%;
  }
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.load-more-trigger {
  height: 20px;
  width: 100%;
}

.pokemon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: white;
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 0 20px;
  opacity: 1;
}

.pokemon-name {
  cursor: pointer;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  color: #333;
}

.favorite-btn {
  background: #F5F5F5;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: #F0F0F0;
}

.star-icon {
  width: 24px;
  height: 24px;
  opacity: 1;
}

/* Ajustamos también el contenedor para mantener la proporción */
.favorite-btn {
  width: 44px;
  height: 44px;
  background: #F5F5F5;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.filter-footer {
  display: flex;
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;
}

.filter-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1rem;
  margin: 0 0.5rem;
  border-radius: 8px;
}

.filter-btn.active {
  background: #333;
  color: white;
}

/* Estilos de paginación */
.footer {
  width: 570px;
  margin: 2rem auto;
  background: transparent;
}


.filter-footer {
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 5px;
}

.filter-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  color: #333;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #333;
  color: white;
}

@media (max-width: 640px) {
  .footer {
    width: 90%;
    margin: 1rem auto;
  }
}
</style>
