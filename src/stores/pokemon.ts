import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Pokemon } from '@/types/pokemon'

const FAVORITES_STORAGE_KEY = 'pokemon_favorites'

export const usePokemonStore = defineStore('pokemon', () => {
  // Estado
  const favorites = ref<string[]>(loadFavoritesFromStorage())
  const pokemonCache = ref<Map<string, Pokemon>>(new Map())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const favoritesCount = computed(() => favorites.value.length)
  const hasFavorites = computed(() => favorites.value.length > 0)

  // Funciones
  function loadFavoritesFromStorage(): string[] {
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

  function addFavorite(pokemonName: string) {
    if (!favorites.value.includes(pokemonName)) {
      favorites.value.push(pokemonName)
    }
  }

  function removeFavorite(pokemonName: string) {
    const index = favorites.value.indexOf(pokemonName)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  function toggleFavorite(pokemonName: string) {
    if (isFavorite(pokemonName)) {
      removeFavorite(pokemonName)
    } else {
      addFavorite(pokemonName)
    }
  }

  function isFavorite(pokemonName: string): boolean {
    return favorites.value.includes(pokemonName)
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

