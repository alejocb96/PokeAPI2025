<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import StarIconGray from '@/assets/icons/StarIconGray.svg'
import StarIconGold from '@/assets/icons/StarIconGold.svg'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const pokemon = ref<any>(null)
const error = ref('')

// Obtener los favoritos del localStorage
const favorites = ref<Set<number>>(
  new Set(JSON.parse((localStorage as Storage).getItem('pokemonFavorites') || '[]'))
)

interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  types: Array<{ type: { name: string } }>
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  stats: Array<{
    base_stat: number
    stat: { name: string }
  }>
}

async function fetchPokemonDetail() {
  const pokemonId = route.params.id
  if (!pokemonId) {
    error.value = 'ID de Pokémon no válido'
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    if (!response.ok) {
      throw new Error('Pokémon no encontrado')
    }
    const data = await response.json()
    pokemon.value = data
  } catch (err) {
    error.value = 'Error al cargar el Pokémon'
    console.error('Error fetching pokemon:', err)
  } finally {
    isLoading.value = false
  }
}

function toggleFavorite() {
  if (!pokemon.value) return

  const pokemonId = pokemon.value.id
  if (favorites.value.has(pokemonId)) {
    favorites.value.delete(pokemonId)
  } else {
    favorites.value.add(pokemonId)
  }

  // Guardar en localStorage
  ;(localStorage as Storage).setItem('pokemonFavorites', JSON.stringify([...favorites.value]))
}

function goBack() {
  router.push('/pokedex')
}

async function handleShare() {
  if (!pokemon.value) return

  const shareText = `${pokemon.value.name}, ${pokemon.value.types.map((t: any) => t.type.name).join(', ')}, ${(pokemon.value.height / 10).toFixed(1)}m, ${(pokemon.value.weight / 10).toFixed(1)}kg`

  try {
    await navigator.clipboard.writeText(shareText)
    // Aquí podrías mostrar un toast de confirmación
    console.log('Texto copiado al portapapeles')
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const isFavorite = computed(() => {
  return pokemon.value ? favorites.value.has(pokemon.value.id) : false
})

const pokemonImage = computed(() => {
  return (
    pokemon.value?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.value?.sprites?.front_default ||
    'https://via.placeholder.com/200'
  )
})

onMounted(() => {
  fetchPokemonDetail()
})
</script>

<template>
  <div class="pokemon-detail-container">
    <!-- Header con botón de regreso -->
    <div class="detail-header">
      <button class="back-btn" @click="goBack">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M12 19L5 12L12 5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Volver
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-container">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-container">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button class="back-btn" @click="goBack">Volver</button>
    </div>

    <!-- Detalle del Pokémon -->
    <div v-else-if="pokemon" class="pokemon-detail">
      <!-- Card del Pokémon -->
      <div class="pokemon-card">
        <!-- Header con ID y favorito -->
        <div class="card-header">
          <span class="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
          <button
            class="favorite-btn"
            :class="{ 'is-favorite': isFavorite }"
            @click="toggleFavorite"
          >
            <img :src="isFavorite ? StarIconGold : StarIconGray" alt="Favorite" class="star-icon" />
          </button>
        </div>

        <!-- Imagen del Pokémon -->
        <div class="card-image-container">
          <img :src="pokemonImage" :alt="pokemon.name" class="pokemon-image" />
        </div>

        <!-- Información del Pokémon -->
        <div class="card-body">
          <h1 class="pokemon-name">
            {{ pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) }}
          </h1>

          <!-- Tipos -->
          <div class="pokemon-types">
            <span
              v-for="type in pokemon.types"
              :key="type.type.name"
              class="type-badge"
              :class="`type-${type.type.name}`"
            >
              {{ type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1) }}
            </span>
          </div>

          <!-- Stats básicos -->
          <div class="pokemon-stats">
            <div class="stat-row">
              <span class="stat-label">Altura:</span>
              <span class="stat-value">{{ (pokemon.height / 10).toFixed(1) }} m</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Peso:</span>
              <span class="stat-value">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
            </div>
          </div>

          <!-- Botón compartir -->
          <button class="share-btn" @click="handleShare">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Compartir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-detail-container {
  min-height: 100vh;
  background: #f8f8f8;
  padding: 1rem;
}

.detail-header {
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
}

.pokemon-detail {
  width: 570px;
  height: 506px;
  position: absolute;
  top: 97px;
  left: 291px;
  opacity: 1;
  margin: 0 auto;
}

.pokemon-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem 0.5rem;
}

.pokemon-id {
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
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
  width: 44px;
  height: 44px;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: #f0f0f0;
}

.favorite-btn.is-favorite {
  background: #fff3cd;
}

.star-icon {
  width: 24px;
  height: 24px;
}

.card-image-container {
  background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.card-body {
  padding: 1.5rem;
}

.pokemon-name {
  font-family: 'Lato', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.pokemon-types {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-transform: capitalize;
}

/* Colores por tipo */
.type-normal {
  background: #a8a878;
}
.type-fire {
  background: #f08030;
}
.type-water {
  background: #6890f0;
}
.type-electric {
  background: #f8d030;
  color: #1f2937;
}
.type-grass {
  background: #78c850;
}
.type-ice {
  background: #98d8d8;
}
.type-fighting {
  background: #c03028;
}
.type-poison {
  background: #a040a0;
}
.type-ground {
  background: #e0c068;
}
.type-flying {
  background: #a890f0;
}
.type-psychic {
  background: #f85888;
}
.type-bug {
  background: #a8b820;
}
.type-rock {
  background: #b8a038;
}
.type-ghost {
  background: #705898;
}
.type-dragon {
  background: #7038f8;
}
.type-dark {
  background: #705848;
}
.type-steel {
  background: #b8b8d0;
}
.type-fairy {
  background: #ee99ac;
}

.pokemon-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  color: #1f2937;
  font-weight: 600;
}

.share-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f22539;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.share-btn:hover {
  background: #c00e20;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(242, 37, 57, 0.3);
}

.share-btn:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .pokemon-detail-container {
    padding: 0.5rem;
  }

  .pokemon-detail {
    width: 315px;
    height: 506px;
    top: 153px;
    left: 30px;
  }

  .pokemon-name {
    font-size: 1.5rem;
  }

  .pokemon-image {
    width: 150px;
    height: 150px;
  }
}
</style>
