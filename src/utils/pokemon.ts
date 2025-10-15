import type { Pokemon } from '@/types/pokemon'

/**
 * Mapeo de colores por tipo de pokémon
 */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
}

/**
 * Obtiene el color del tipo principal del pokémon
 */
export function getPokemonTypeColor(pokemon: Pokemon): string {
  const primaryType = pokemon.types[0]?.type.name
  return TYPE_COLORS[primaryType] || TYPE_COLORS.normal
}

/**
 * Formatea el nombre del pokémon (primera letra mayúscula)
 */
export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Formatea el ID del pokémon con ceros a la izquierda
 */
export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, '0')}`
}

/**
 * Obtiene la URL de la imagen de alta calidad del pokémon
 */
export function getPokemonImageUrl(pokemon: Pokemon): string {
  return (
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default ||
    ''
  )
}

/**
 * Genera el texto para compartir un pokémon
 */
export function generateShareText(pokemon: Pokemon): string {
  const name = formatPokemonName(pokemon.name)
  const id = formatPokemonId(pokemon.id)
  const types = pokemon.types.map((t) => formatPokemonName(t.type.name)).join(', ')
  const height = (pokemon.height / 10).toFixed(1) // Convertir a metros
  const weight = (pokemon.weight / 10).toFixed(1) // Convertir a kg

  // Formato: Nombre, ID, Tipos, Altura, Peso
  return `${name}, ${id}, Tipos: ${types}, Altura: ${height}m, Peso: ${weight}kg`
}

/**
 * Obtiene los stats del pokémon formateados
 */
export function getPokemonStats(pokemon: Pokemon) {
  return pokemon.stats.map((stat) => ({
    name: stat.stat.name,
    value: stat.base_stat
  }))
}
