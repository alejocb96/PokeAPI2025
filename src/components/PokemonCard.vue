<script setup lang="ts">
import { computed } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import { useClipboard } from '@/composables/useClipboard'
import type { Pokemon } from '@/types/pokemon'
import {
  formatPokemonName,
  formatPokemonId,
  getPokemonImageUrl,
  generateShareText,
  getPokemonTypeColor
} from '@/utils/pokemon'

const props = defineProps<{
  pokemon: Pokemon
}>()

const store = usePokemonStore()
const { copyToClipboard, copied } = useClipboard()

const isFavorite = computed(() => store.isFavorite(props.pokemon.id))
const pokemonName = computed(() => formatPokemonName(props.pokemon.name))
const pokemonId = computed(() => formatPokemonId(props.pokemon.id))
const pokemonImage = computed(() => getPokemonImageUrl(props.pokemon))
const backgroundColor = computed(() => getPokemonTypeColor(props.pokemon))

function toggleFavorite() {
  store.toggleFavorite(props.pokemon.id)
}

async function handleShare() {
  const text = generateShareText(props.pokemon)
  await copyToClipboard(text)
}
</script>

<template>
  <div class="pokemon-card" :style="{ '--card-color': backgroundColor }">
    <!-- Header con ID y botón de favorito -->
    <div class="card-header">
      <span class="pokemon-id">{{ pokemonId }}</span>
      <button class="favorite-btn" @click="toggleFavorite" :class="{ active: isFavorite }">
        <svg
          v-if="isFavorite"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="heart-icon"
        >
          <path
            d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="heart-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </div>

    <!-- Imagen del Pokémon -->
    <div class="card-image-container">
      <img :src="pokemonImage" :alt="pokemonName" class="pokemon-image" loading="lazy" />
    </div>

    <!-- Información del Pokémon -->
    <div class="card-body">
      <h3 class="pokemon-name">{{ pokemonName }}</h3>

      <!-- Tipos -->
      <div class="pokemon-types">
        <span
          v-for="type in pokemon.types"
          :key="type.type.name"
          class="type-badge"
          :class="`type-${type.type.name}`"
        >
          {{ formatPokemonName(type.type.name) }}
        </span>
      </div>

      <!-- Stats -->
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
      <button class="share-btn" @click="handleShare" :disabled="copied">
        <svg
          v-if="!copied"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="share-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="share-icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        {{ copied ? '¡Copiado!' : 'Compartir' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0.5rem;
}

.pokemon-id {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.favorite-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s;
  color: #9ca3af;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.active {
  color: #ef4444;
}

.heart-icon {
  width: 24px;
  height: 24px;
}

.card-image-container {
  background: linear-gradient(135deg, var(--card-color, #f3f4f6) 0%, #ffffff 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.pokemon-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.pokemon-card:hover .pokemon-image {
  transform: scale(1.05);
}

.card-body {
  padding: 1rem 1.5rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pokemon-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.pokemon-types {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
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
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
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
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.share-btn:active {
  transform: translateY(0);
}

.share-btn:disabled {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  cursor: default;
}

.share-icon {
  width: 20px;
  height: 20px;
}
</style>

