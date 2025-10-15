<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import PokemonModal from './PokemonModal.vue'
import { usePokemonStore } from '@/stores/pokemon'
import SearchIcon from '@/assets/icons/SearchIcon.svg'
import StarIconGray from '@/assets/icons/StarIconGray.svg'
import StarIconGold from '@/assets/icons/StarIconGold.svg'

const isLoading = ref(false)
const showFavorites = ref(false)
const searchQuery = ref('')
const pokemons = ref<Pokemon[]>([])
const selectedPokemonId = ref<number | null>(null)
const isModalOpen = ref(false)

// Usar el store de Pinia para favoritos
const store = usePokemonStore()

interface Pokemon {
  id: number
  name: string
  isFavorite: boolean
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
        isFavorite: store.isFavorite(id)
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
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isLoading.value) {
        fetchPokemons()
      }
    })
  }, options)

  // Observar el elemento trigger después de un pequeño delay
  setTimeout(() => {
    const trigger = document.querySelector('.load-more-trigger')
    if (trigger) {
      observer.observe(trigger)
    }
  }, 100)

  // Limpiar observador al desmontar
  onUnmounted(() => {
    observer.disconnect()
  })
}

const filteredPokemons = computed(() => {
  let filtered = pokemons.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filtrar por favoritos
  if (showFavorites.value) {
    filtered = filtered.filter((pokemon) => pokemon.isFavorite)
  }

  return filtered
})

function toggleFavorite(pokemon: Pokemon) {
  store.toggleFavorite(pokemon.id)
  pokemon.isFavorite = store.isFavorite(pokemon.id)
}

function handlePokemonClick(pokemonId: number) {
  selectedPokemonId.value = pokemonId
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  selectedPokemonId.value = null

  // Actualizar el estado de favoritos en la lista desde el store
  pokemons.value.forEach((pokemon) => {
    pokemon.isFavorite = store.isFavorite(pokemon.id)
  })
}

function clearFilters() {
  searchQuery.value = ''
  showFavorites.value = false
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
        <img :src="SearchIcon" alt="Search" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Pokémon"
          class="search-input"
        />
      </div>
    </div>

    <!-- Lista de Pokémon -->
    <div class="pokemon-list">
      <!-- Mostrar lista de Pokémon si hay resultados -->
      <template v-if="filteredPokemons.length > 0">
        <div v-for="pokemon in filteredPokemons" :key="pokemon.id" class="pokemon-item">
          <span class="pokemon-name" @click="handlePokemonClick(pokemon.id)">
            {{ pokemon.name }}
          </span>
          <button
            class="favorite-btn"
            :class="{ 'is-favorite': pokemon.isFavorite }"
            @click="toggleFavorite(pokemon)"
          >
            <img
              :src="pokemon.isFavorite ? StarIconGold : StarIconGray"
              alt="Favorite"
              class="star-icon"
            />
          </button>
        </div>
      </template>

      <!-- Mensaje cuando no hay resultados -->
      <div v-else-if="!isLoading && (searchQuery || showFavorites)" class="no-results">
        <h2 class="no-results-title">Uh-oh!</h2>
        <p class="no-results-message">You look lost on your journey!</p>
        <button class="go-back-btn" @click="clearFilters">Go back home</button>
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.4375 16.9231H0.6875C0.505164 16.9231 0.330295 17.0122 0.201364 17.1709C0.0724328 17.3296 0 17.5448 0 17.7692L0 21.1538C0 21.3783 0.0724328 21.5935 0.201364 21.7522C0.330295 21.9109 0.505164 22 0.6875 22H3.4375C3.61984 22 3.7947 21.9109 3.92364 21.7522C4.05257 21.5935 4.125 21.3783 4.125 21.1538V17.7692C4.125 17.5448 4.05257 17.3296 3.92364 17.1709C3.7947 17.0122 3.61984 16.9231 3.4375 16.9231ZM3.4375 0H0.6875C0.505164 0 0.330295 0.0891481 0.201364 0.247833C0.0724328 0.406517 0 0.62174 0 0.846154L0 4.23077C0 4.45518 0.0724328 4.67041 0.201364 4.82909C0.330295 4.98777 0.505164 5.07692 0.6875 5.07692H3.4375C3.61984 5.07692 3.7947 4.98777 3.92364 4.82909C4.05257 4.67041 4.125 4.45518 4.125 4.23077V0.846154C4.125 0.62174 4.05257 0.406517 3.92364 0.247833C3.7947 0.0891481 3.61984 0 3.4375 0ZM3.4375 8.46154H0.6875C0.505164 8.46154 0.330295 8.55069 0.201364 8.70937C0.0724328 8.86806 0 9.08328 0 9.30769L0 12.6923C0 12.9167 0.0724328 13.1319 0.201364 13.2906C0.330295 13.4493 0.505164 13.5385 0.6875 13.5385H3.4375C3.61984 13.5385 3.7947 13.4493 3.92364 13.2906C4.05257 13.1319 4.125 12.9167 4.125 12.6923V9.30769C4.125 9.08328 4.05257 8.86806 3.92364 8.70937C3.7947 8.55069 3.61984 8.46154 3.4375 8.46154ZM21.3125 17.7692H7.5625C7.38016 17.7692 7.2053 17.8584 7.07636 18.0171C6.94743 18.1757 6.875 18.391 6.875 18.6154V20.3077C6.875 20.5321 6.94743 20.7473 7.07636 20.906C7.2053 21.0647 7.38016 21.1538 7.5625 21.1538H21.3125C21.4948 21.1538 21.6697 21.0647 21.7986 20.906C21.9276 20.7473 22 20.5321 22 20.3077V18.6154C22 18.391 21.9276 18.1757 21.7986 18.0171C21.6697 17.8584 21.4948 17.7692 21.3125 17.7692ZM21.3125 0.846154H7.5625C7.38016 0.846154 7.2053 0.935302 7.07636 1.09399C6.94743 1.25267 6.875 1.46789 6.875 1.69231V3.38462C6.875 3.60903 6.94743 3.82425 7.07636 3.98294C7.2053 4.14162 7.38016 4.23077 7.5625 4.23077H21.3125C21.4948 4.23077 21.6697 4.14162 21.7986 3.98294C21.9276 3.82425 22 3.60903 22 3.38462V1.69231C22 1.46789 21.9276 1.25267 21.7986 1.09399C21.6697 0.935302 21.4948 0.846154 21.3125 0.846154ZM21.3125 9.30769H7.5625C7.38016 9.30769 7.2053 9.39684 7.07636 9.55552C6.94743 9.71421 6.875 9.92943 6.875 10.1538V11.8462C6.875 12.0706 6.94743 12.2858 7.07636 12.4445C7.2053 12.6032 7.38016 12.6923 7.5625 12.6923H21.3125C21.4948 12.6923 21.6697 12.6032 21.7986 12.4445C21.9276 12.2858 22 12.0706 22 11.8462V10.1538C22 9.92943 21.9276 9.71421 21.7986 9.55552C21.6697 9.39684 21.4948 9.30769 21.3125 9.30769Z"
              fill="white"
            />
          </svg>
          <span>All</span>
        </button>
        <button class="filter-btn" :class="{ active: showFavorites }" @click="showFavorites = true">
          <img :src="StarIconGold" alt="Star" class="btn-icon" />
          <span>Favorites</span>
        </button>
      </div>
    </div>

    <!-- Modal del Pokémon -->
    <PokemonModal :pokemon-id="selectedPokemonId" :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>

<style scoped>
.pokemon-list-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f8f8;
  position: relative;
  padding-top: 120px;
  padding-bottom: 80px;
}

.search-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: #f8f8f8;
  z-index: 100;
}

.search-input-wrapper {
  position: relative;
  width: 570px;
  margin: 0 auto;
  margin-top: 20px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  outline: none;
}

.search-input:focus {
  border: 1px solid #ddd;
  outline: none;
}

.search-input::placeholder {
  color: #bfbfbf;
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
  background: #f5f5f5;
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
  background: #f0f0f0;
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
  background: #f5f5f5;
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
  font-family: 'Lato', sans-serif;
}

/* Estilos de paginación */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: transparent;
  z-index: 100;
}

.filter-footer {
  display: flex;
  gap: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  justify-content: center;
  align-items: center;
  padding-left: 0.01rem;
}

.filter-btn {
  min-width: 85px;
  max-width: 268px;
  height: 44px;
  padding: 0 0.5rem;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 0.85rem;
  color: white;
  font-family: 'Lato', sans-serif;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: #bfbfbf;
  white-space: nowrap;
}

.btn-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
  flex-shrink: 0;
}

.filter-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.filter-btn.active {
  background: #f22539 !important;
}

.filter-btn:not(.active):hover {
  background: #5e5e5e;
}

.filter-btn.active:hover {
  background: #c00e20 !important;
}

@media (max-width: 640px) {
  .footer {
    margin: 1rem 0 0 0;
  }

  .filter-footer {
    padding: 1rem 0.5rem;
  }

  .filter-btn {
    min-width: 100px;
    padding: 0.75rem 1rem;
  }
}

/* Estilos para el mensaje de "No se encontraron resultados" */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: #f8f8f8;
  min-height: 300px;
}

.no-results-title {
  font-family: 'Lato', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #353535;
  margin-bottom: 1rem;
}

.no-results-message {
  font-family: 'Lato', sans-serif;
  font-size: 1.25rem;
  color: #5e5e5e;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.go-back-btn {
  background: #f22539;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Lato', sans-serif;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.go-back-btn:hover {
  background: #c00e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 51, 51, 0.3);
}

.go-back-btn:active {
  transform: translateY(0);
}
</style>
