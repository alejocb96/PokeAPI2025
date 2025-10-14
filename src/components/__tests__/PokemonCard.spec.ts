import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PokemonCard from '../PokemonCard.vue'
import type { Pokemon } from '@/types/pokemon'

const mockPokemon: Pokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'pikachu.png',
    other: {
      'official-artwork': {
        front_default: 'pikachu-artwork.png'
      },
      home: {
        front_default: 'pikachu-home.png'
      }
    }
  },
  types: [
    {
      slot: 1,
      type: { name: 'electric', url: '' }
    }
  ],
  stats: [],
  abilities: []
}

describe('PokemonCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debería renderizar el nombre del pokemon', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    expect(wrapper.text()).toContain('Pikachu')
  })

  it('debería renderizar el ID formateado', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    expect(wrapper.text()).toContain('#025')
  })

  it('debería mostrar la imagen del pokemon', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Pikachu')
  })

  it('debería mostrar los tipos del pokemon', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    expect(wrapper.text()).toContain('Electric')
  })

  it('debería mostrar altura y peso', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    expect(wrapper.text()).toContain('0.4 m') // 4 dm = 0.4 m
    expect(wrapper.text()).toContain('6.0 kg') // 60 hg = 6.0 kg
  })

  it('debería tener un botón de favorito', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    const favBtn = wrapper.find('.favorite-btn')
    expect(favBtn.exists()).toBe(true)
  })

  it('debería tener un botón de compartir', () => {
    const wrapper = mount(PokemonCard, {
      props: { pokemon: mockPokemon }
    })

    const shareBtn = wrapper.find('.share-btn')
    expect(shareBtn.exists()).toBe(true)
    expect(shareBtn.text()).toContain('Compartir')
  })
})

