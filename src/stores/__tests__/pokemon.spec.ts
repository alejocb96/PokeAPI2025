import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePokemonStore } from '../pokemon'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

global.localStorage = localStorageMock as any

describe('Pokemon Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('debería inicializar con un array vacío de favoritos', () => {
    const store = usePokemonStore()
    expect(store.favorites).toEqual([])
    expect(store.favoritesCount).toBe(0)
    expect(store.hasFavorites).toBe(false)
  })

  it('debería agregar un pokemon a favoritos con toggleFavorite', () => {
    const store = usePokemonStore()
    store.toggleFavorite(25)

    expect(store.favorites).toContain(25)
    expect(store.favoritesCount).toBe(1)
    expect(store.hasFavorites).toBe(true)
    expect(store.isFavorite(25)).toBe(true)
  })

  it('no debería agregar pokémons duplicados', () => {
    const store = usePokemonStore()
    store.toggleFavorite(25)
    store.toggleFavorite(25)

    expect(store.favorites).toHaveLength(0) // Se agrega y luego se quita
  })

  it('debería remover un pokemon de favoritos con toggleFavorite', () => {
    const store = usePokemonStore()
    store.toggleFavorite(25) // Agregar
    store.toggleFavorite(6)  // Agregar otro
    store.toggleFavorite(25) // Remover el primero

    expect(store.favorites).not.toContain(25)
    expect(store.favorites).toContain(6)
    expect(store.favoritesCount).toBe(1)
  })

  it('debería alternar el estado de favorito correctamente', () => {
    const store = usePokemonStore()

    // Agregar a favoritos
    store.toggleFavorite(25)
    expect(store.isFavorite(25)).toBe(true)
    expect(store.favoritesCount).toBe(1)

    // Remover de favoritos
    store.toggleFavorite(25)
    expect(store.isFavorite(25)).toBe(false)
    expect(store.favoritesCount).toBe(0)
  })

  it('debería persistir favoritos en localStorage', async () => {
    const store = usePokemonStore()
    store.toggleFavorite(25)

    // Esperar a que el watcher se ejecute
    await new Promise((resolve) => setTimeout(resolve, 0))

    const stored = localStorage.getItem('pokemonFavorites')
    expect(stored).toBe('[25]')
  })

  it('debería cachear un pokemon', () => {
    const store = usePokemonStore()
    const mockPokemon: any = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {},
      types: [],
      stats: [],
      abilities: []
    }

    store.cachePokemon(mockPokemon)

    const cached = store.getCachedPokemon('pikachu')
    expect(cached).toEqual(mockPokemon)
  })

  it('debería retornar undefined para pokemon no cacheado', () => {
    const store = usePokemonStore()
    
    const cached = store.getCachedPokemon('pikachu')
    expect(cached).toBeUndefined()
  })
})
