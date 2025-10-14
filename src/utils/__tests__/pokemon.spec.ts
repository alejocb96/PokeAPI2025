import { describe, it, expect } from 'vitest'
import {
  formatPokemonName,
  formatPokemonId,
  getPokemonTypeColor,
  generateShareText,
  TYPE_COLORS
} from '../pokemon'
import type { Pokemon } from '@/types/pokemon'

describe('Pokemon Utils', () => {
  const mockPokemon: Pokemon = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    sprites: {
      front_default: 'https://example.com/pikachu.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pikachu-artwork.png'
        },
        home: {
          front_default: 'https://example.com/pikachu-home.png'
        }
      }
    },
    types: [
      {
        slot: 1,
        type: {
          name: 'electric',
          url: 'https://pokeapi.co/api/v2/type/13/'
        }
      }
    ],
    stats: [
      {
        base_stat: 35,
        effort: 0,
        stat: {
          name: 'hp',
          url: 'https://pokeapi.co/api/v2/stat/1/'
        }
      }
    ],
    abilities: []
  }

  describe('formatPokemonName', () => {
    it('debería capitalizar la primera letra', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu')
      expect(formatPokemonName('charizard')).toBe('Charizard')
    })

    it('debería manejar strings vacíos', () => {
      expect(formatPokemonName('')).toBe('')
    })
  })

  describe('formatPokemonId', () => {
    it('debería formatear IDs con ceros a la izquierda', () => {
      expect(formatPokemonId(1)).toBe('#001')
      expect(formatPokemonId(25)).toBe('#025')
      expect(formatPokemonId(150)).toBe('#150')
      expect(formatPokemonId(1000)).toBe('#1000')
    })
  })

  describe('getPokemonTypeColor', () => {
    it('debería retornar el color correcto para el tipo', () => {
      expect(getPokemonTypeColor(mockPokemon)).toBe(TYPE_COLORS.electric)
    })

    it('debería retornar el color normal por defecto', () => {
      const unknownTypePokemon = {
        ...mockPokemon,
        types: [
          {
            slot: 1,
            type: {
              name: 'unknown',
              url: ''
            }
          }
        ]
      }
      expect(getPokemonTypeColor(unknownTypePokemon)).toBe(TYPE_COLORS.normal)
    })
  })

  describe('generateShareText', () => {
    it('debería generar el texto correcto para compartir', () => {
      const shareText = generateShareText(mockPokemon)
      
      expect(shareText).toContain('Pikachu')
      expect(shareText).toContain('#025')
      expect(shareText).toContain('Electric')
      expect(shareText).toContain('0.4m') // 4 decimetros = 0.4 metros
      expect(shareText).toContain('6.0kg') // 60 hectogramos = 6.0 kg
    })

    it('debería manejar múltiples tipos', () => {
      const multiTypePokemon = {
        ...mockPokemon,
        types: [
          {
            slot: 1,
            type: { name: 'grass', url: '' }
          },
          {
            slot: 2,
            type: { name: 'poison', url: '' }
          }
        ]
      }

      const shareText = generateShareText(multiTypePokemon)
      expect(shareText).toContain('Grass, Poison')
    })
  })
})

