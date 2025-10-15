<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { usePokemonStore } from '@/stores/pokemon'
import StarIconGold from '@/assets/icons/StarIconGold.svg'
import StarIconWhite from '@/assets/icons/StarIconWhite.svg'
import VectorIcon from '@/assets/icons/Vector.svg'
import BackGroundModals from '@/assets/icons/BackGroundModals.svg'

const props = defineProps<{
  pokemonId: number | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isLoading = ref(false)
const pokemon = ref<any>(null)
const error = ref('')

// Usar el store de Pinia para favoritos
const store = usePokemonStore()

async function fetchPokemonDetail() {
  if (!props.pokemonId) return

  isLoading.value = true
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${props.pokemonId}`)
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
  store.toggleFavorite(pokemonId)
}

function closeModal() {
  emit('close')
}

async function handleShare() {
  if (!pokemon.value) return

  const shareText = `${pokemon.value.name}, ${pokemon.value.types.map((t: any) => t.type.name).join(', ')}, ${(pokemon.value.height / 10).toFixed(1)}m, ${(pokemon.value.weight / 10).toFixed(1)}kg`

  try {
    await navigator.clipboard.writeText(shareText)
    console.log('Texto copiado al portapapeles')
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const isFavorite = computed(() => {
  return pokemon.value ? store.isFavorite(pokemon.value.id) : false
})

const pokemonImage = computed(() => {
  return (
    pokemon.value?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.value?.sprites?.front_default ||
    'https://via.placeholder.com/200'
  )
})

// Cargar datos cuando se abre el modal
watch(
  () => props.pokemonId,
  (newId) => {
    if (newId && props.isOpen) {
      fetchPokemonDetail()
    }
  }
)

// Cerrar modal con ESC
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <!-- Modal Content -->
    <div class="modal-content" @click.stop>
      <!-- Botón de cerrar -->
      <button class="close-btn" @click="closeModal">
        <img :src="VectorIcon" alt="Close" class="close-icon" />
      </button>

      <!-- Loading -->
      <div v-if="isLoading" class="loading-container">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-container">
        <h2>Error</h2>
        <p>{{ error }}</p>
        <button class="close-btn" @click="closeModal">Cerrar</button>
      </div>

      <!-- Detalle del Pokémon -->
      <div v-else-if="pokemon" class="pokemon-detail">
        <!-- Imagen del Pokémon -->
        <div class="pokemon-image-container">
          <img :src="BackGroundModals" alt="Background" class="background-image" />
          <img :src="pokemonImage" :alt="pokemon.name" class="pokemon-image" />
        </div>

        <!-- Información del Pokémon -->
        <div class="pokemon-info">
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">{{
              pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Weight:</span>
            <span class="info-value">{{ (pokemon.weight / 10).toFixed(1) }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Height:</span>
            <span class="info-value">{{ (pokemon.height / 10).toFixed(1) }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Types:</span>
            <span class="info-value">{{
              pokemon.types
                .map((t: any) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1))
                .join(', ')
            }}</span>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="modal-actions">
          <button class="share-btn" @click="handleShare">Share to my friends</button>

          <button
            class="favorite-btn"
            :class="{ 'is-favorite': isFavorite }"
            @click="toggleFavorite"
          >
            <img
              :src="isFavorite ? StarIconGold : StarIconWhite"
              alt="Favorite"
              class="star-icon"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  width: 570px;
  max-height: 90vh;
  background: white;
  border-radius: 5px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.close-btn:hover {
  transform: scale(1.1);
}

.close-icon {
  width: 24px;
  height: 24px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.pokemon-detail {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
}

.pokemon-image-container {
  flex: 0 0 auto;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  z-index: 2;
  position: relative;
}

.pokemon-info {
  padding: 0.75rem 1.5rem;
  background: white;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e8e8e8;
}

.info-label {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  color: #5e5e5e;
  font-size: 18px;
}

.info-value {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  color: #5e5e5e;
  font-size: 18px;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: white;
}

.share-btn {
  background: #f22539;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-btn:hover {
  background: #c00e20;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(242, 37, 57, 0.3);
}

.favorite-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.star-icon {
  width: 32px;
  height: 32px;
}

/* Responsive para móvil */
@media (max-width: 640px) {
  .modal-content {
    width: 315px;
    max-height: 85vh;
    margin: 1rem;
  }

  .pokemon-image-container {
    height: 200px;
  }

  .pokemon-image {
    width: 140px;
    height: 140px;
  }

  .info-label,
  .info-value {
    font-size: 0.9rem;
  }
}
</style>
