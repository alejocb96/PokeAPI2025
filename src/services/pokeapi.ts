import axios, { type AxiosInstance } from 'axios'
import type { PokemonListResponse, Pokemon } from '@/types/pokemon'

class PokeApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'https://pokeapi.co/api/v2',
      timeout: 10000
    })
  }

  /**
   * Obtiene la lista de pokémons con paginación
   * @param limit - Cantidad de pokémons a obtener (default: 20)
   * @param offset - Offset para paginación (default: 0)
   */
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
    try {
      const response = await this.api.get<PokemonListResponse>('/pokemon', {
        params: { limit, offset }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching pokemon list:', error)
      throw new Error('Failed to fetch pokemon list')
    }
  }

  /**
   * Obtiene la información detallada de un pokémon específico
   * @param nameOrId - Nombre o ID del pokémon
   */
  async getPokemonByName(nameOrId: string | number): Promise<Pokemon> {
    try {
      const response = await this.api.get<Pokemon>(`/pokemon/${nameOrId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching pokemon ${nameOrId}:`, error)
      throw new Error(`Failed to fetch pokemon ${nameOrId}`)
    }
  }

  /**
   * Obtiene múltiples pokémons en paralelo para mejor performance
   * @param names - Array de nombres de pokémons
   */
  async getPokemonsBatch(names: string[]): Promise<Pokemon[]> {
    try {
      const promises = names.map((name) => this.getPokemonByName(name))
      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching pokemon batch:', error)
      throw new Error('Failed to fetch pokemon batch')
    }
  }
}

// Exportar una instancia singleton
export const pokeApiService = new PokeApiService()

