import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Pokemon } from '@/types/pokemon'

const FAVORITES_STORAGE_KEY = 'pokemonFavorites'

export const usePokemonStore = defineStore('pokemon', () => {
  // Estado
  const favorites = ref<number[]>(loadFavoritesFromStorage())
  const pokemonCache = ref<Map<string, Pokemon>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

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

  function addFavorite(pokemonId: number) {
    if (!favorites.value.includes(pokemonId)) {
      favorites.value.push(pokemonId)
    }
  }

  function removeFavorite(pokemonId: number) {
    const index = favorites.value.indexOf(pokemonId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  function toggleFavorite(pokemonId: number) {
    if (isFavorite(pokemonId)) {
      removeFavorite(pokemonId)
    } else {
      addFavorite(pokemonId)
    }
  }

  function isFavorite(pokemonId: number): boolean {
    return favorites.value.includes(pokemonId)
  }

  function clearFavorites() {
    favorites.value = []
  }

  // Cache para mejorar performance
  function cachePokemon(pokemon: Pokemon) {
    pokemonCache.value.set(pokemon.name, pokemon)
  }

  function getCachedPokemon(name: string): Pokemon | undefined {
    return pokemonCache.value.get(name)
  }

  function clearCache() {
    pokemonCache.value.clear()
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
    isLoading,
    error,
    // Computed
    favoritesCount,
    hasFavorites,
    // Métodos
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    cachePokemon,
    getCachedPokemon,
    clearCache
  }
})
