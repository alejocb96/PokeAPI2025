import { ref, computed } from 'vue'
import { pokeApiService } from '@/services/pokeapi'
import { usePokemonStore } from '@/stores/pokemon'
import type { Pokemon, PokemonBasic } from '@/types/pokemon'

export function usePokemon() {
  const store = usePokemonStore()
  const pokemons = ref<Pokemon[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(true)
  const currentOffset = ref(0)
  const LIMIT = 20 // Cargar 20 pokémons a la vez

  /**
   * Carga la lista inicial de pokémons
   */
  async function loadPokemons(reset: boolean = false) {
    if (isLoading.value) return

    if (reset) {
      currentOffset.value = 0
      pokemons.value = []
      hasMore.value = true
    }

    if (!hasMore.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await pokeApiService.getPokemonList(LIMIT, currentOffset.value)

      // Obtener detalles de cada pokémon
      const pokemonNames = response.results.map((p: PokemonBasic) => p.name)
      const detailedPokemons = await pokeApiService.getPokemonsBatch(pokemonNames)

      // Cachear los pokémons
      detailedPokemons.forEach((pokemon) => store.cachePokemon(pokemon))

      pokemons.value = [...pokemons.value, ...detailedPokemons]
      currentOffset.value += LIMIT
      hasMore.value = response.next !== null
    } catch (e) {
      error.value = 'Error al cargar los pokémons. Por favor intenta de nuevo.'
      console.error('Error loading pokemons:', e)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carga un pokémon específico por nombre
   */
  async function loadPokemonByName(name: string): Promise<Pokemon | null> {
    // Intentar obtener del cache primero
    const cached = store.getCachedPokemon(name)
    if (cached) return cached

    isLoading.value = true
    error.value = null

    try {
      const pokemon = await pokeApiService.getPokemonByName(name)
      store.cachePokemon(pokemon)
      return pokemon
    } catch (e) {
      error.value = `Error al cargar el pokémon ${name}`
      console.error(`Error loading pokemon ${name}:`, e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtiene pokémons con información de favoritos
   */
  const pokemonsWithFavorites = computed(() => {
    return pokemons.value.map((pokemon) => ({
      ...pokemon,
      isFavorite: store.isFavorite(pokemon.name)
    }))
  })

  return {
    pokemons,
    pokemonsWithFavorites,
    isLoading,
    error,
    hasMore,
    loadPokemons,
    loadPokemonByName
  }
}

