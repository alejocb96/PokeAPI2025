import { describe, it, expect, beforeEach, vi } from 'vitest'
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

  it('debería agregar un pokemon a favoritos', () => {
    const store = usePokemonStore()
    store.addFavorite('pikachu')

    expect(store.favorites).toContain('pikachu')
    expect(store.favoritesCount).toBe(1)
    expect(store.hasFavorites).toBe(true)
    expect(store.isFavorite('pikachu')).toBe(true)
  })

  it('no debería agregar pokémons duplicados', () => {
    const store = usePokemonStore()
    store.addFavorite('pikachu')
    store.addFavorite('pikachu')

    expect(store.favorites).toHaveLength(1)
  })

  it('debería remover un pokemon de favoritos', () => {
    const store = usePokemonStore()
    store.addFavorite('pikachu')
    store.addFavorite('charizard')

    store.removeFavorite('pikachu')

    expect(store.favorites).not.toContain('pikachu')
    expect(store.favorites).toContain('charizard')
    expect(store.favoritesCount).toBe(1)
  })

  it('debería alternar el estado de favorito', () => {
    const store = usePokemonStore()
    
    store.toggleFavorite('pikachu')
    expect(store.isFavorite('pikachu')).toBe(true)

    store.toggleFavorite('pikachu')
    expect(store.isFavorite('pikachu')).toBe(false)
  })

  it('debería limpiar todos los favoritos', () => {
    const store = usePokemonStore()
    store.addFavorite('pikachu')
    store.addFavorite('charizard')
    store.addFavorite('bulbasaur')

    store.clearFavorites()

    expect(store.favorites).toEqual([])
    expect(store.favoritesCount).toBe(0)
  })

  it('debería persistir favoritos en localStorage', async () => {
    const store = usePokemonStore()
    store.addFavorite('pikachu')

    // Esperar a que el watcher se ejecute
    await new Promise((resolve) => setTimeout(resolve, 0))

    const stored = localStorage.getItem('pokemon_favorites')
    expect(stored).toBe('["pikachu"]')
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

  it('debería limpiar el cache', () => {
    const store = usePokemonStore()
    const mockPokemon: any = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60
    }

    store.cachePokemon(mockPokemon)
    store.clearCache()

    const cached = store.getCachedPokemon('pikachu')
    expect(cached).toBeUndefined()
  })
})

