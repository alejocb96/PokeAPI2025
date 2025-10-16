import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Pokemon } from '@/types/pokemon'

const FAVORITES_STORAGE_KEY = 'pokemonFavorites'

export const usePokemonStore = defineStore('pokemon', () => {
  // Estado
  const favorites = ref<number[]>(loadFavoritesFromStorage())
  const pokemonCache = ref<Map<string, Pokemon>>(new Map())

  // Computed
  const favoritesCount = computed(() => favorites.value.length)
  const hasFavorites = computed(() => favorites.value.length > 0)

  // Funciones
  function loadFavoritesFromStorage(): number[] {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      console.error('Error loading favorites from storage:', e)
      return []
    }
  }

  function saveFavoritesToStorage() {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.value))
    } catch (e) {
      console.error('Error saving favorites to storage:', e)
    }
  }

  function toggleFavorite(pokemonId: number) {
    const index = favorites.value.indexOf(pokemonId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(pokemonId)
    }
  }

  function isFavorite(pokemonId: number): boolean {
    return favorites.value.includes(pokemonId)
  }

  // Cache para mejorar performance
  function cachePokemon(pokemon: Pokemon) {
    pokemonCache.value.set(pokemon.name, pokemon)
  }

  function getCachedPokemon(name: string): Pokemon | undefined {
    return pokemonCache.value.get(name)
  }

  // Watchers para persistencia automática
  watch(
    favorites,
    () => {
      saveFavoritesToStorage()
    },
    { deep: true }
  )

  return {
    // Estado
    favorites,
    pokemonCache,
    // Computed
    favoritesCount,
    hasFavorites,
    // Métodos
    toggleFavorite,
    isFavorite,
    cachePokemon,
    getCachedPokemon
  }
})
