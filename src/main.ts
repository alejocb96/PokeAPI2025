import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Limpiar localStorage viejo y mantener solo el sistema nuevo
function cleanupOldFavorites() {
  try {
    // Remover la key vieja si existe
    if (localStorage.getItem('pokemon_favorites')) {
      localStorage.removeItem('pokemon_favorites')
      console.log('🧹 Key vieja "pokemon_favorites" removida')
    }

    // Validar que los favoritos actuales sean correctos
    const current = localStorage.getItem('pokemonFavorites')
    if (current) {
      try {
        const parsed = JSON.parse(current)
        // Si no es un array válido o contiene datos corruptos, limpiar
        if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'number')) {
          localStorage.setItem('pokemonFavorites', JSON.stringify([]))
          console.log('🧹 Favoritos corruptos limpiados')
        } else {
          console.log('✅ Favoritos válidos:', parsed.length)
        }
      } catch {
        localStorage.setItem('pokemonFavorites', JSON.stringify([]))
        console.log('🧹 Favoritos corruptos limpiados (JSON inválido)')
      }
    } else {
      // Inicializar con array vacío si no existe
      localStorage.setItem('pokemonFavorites', JSON.stringify([]))
      console.log('✅ Favoritos inicializados')
    }
  } catch (e) {
    console.error('Error cleaning up old favorites:', e)
  }
}

cleanupOldFavorites()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
