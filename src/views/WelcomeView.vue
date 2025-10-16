<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Loader from '@/assets/icons/Loader.svg'
import CircleRed from '@/assets/icons/CircleRed.svg'

const router = useRouter()
const isLoading = ref(false)

async function handleGetStarted() {
  isLoading.value = true
  // Mostramos el loader global
  document.body.classList.add('loading')
  const loaderDiv = document.createElement('div')
  loaderDiv.className = 'global-loader'
  loaderDiv.innerHTML = `<img src="${Loader}" alt="Loading" />`
  document.body.appendChild(loaderDiv)

  try {
    await router.push('/pokedex')
  } finally {
    // Limpiamos el loader
    document.body.classList.remove('loading')
    loaderDiv.remove()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <!-- Icono de Pikachu con fondo circular rojo -->
      <div class="welcome-icon">
        <div class="pikachu-wrapper">
          <img :src="CircleRed" alt="Circle" class="red-circle" />
          <img
            src="@/assets/icons/IconGetStarted.svg"
            alt="Pikachu Welcome"
            class="pikachu-image"
          />
        </div>
      </div>

      <!-- Título -->
      <h1 class="welcome-title">Welcome to Pokédex</h1>

      <!-- Descripción -->
      <p class="welcome-description">
        The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the
        Pokémon world.
      </p>

      <!-- Botón Get Started -->
      <button class="get-started-btn" @click="handleGetStarted">
        <template v-if="isLoading">
          <img :src="Loader" alt="Loading" class="loader" />
        </template>
        <template v-else> Get started </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 1rem;
  overflow: hidden;
}

.welcome-content {
  border-radius: 8px;
  padding: 3rem 2rem;
  max-width: 700px;
  width: 100%;
  text-align: center;
}

.welcome-icon {
  margin-bottom: 4rem;
}

.pikachu-wrapper {
  position: relative;
  display: inline-block;
}

.red-circle {
  position: absolute;
  width: 225px;
  height: 225px;
  top: 57%;
  left: 51%;
  transform: translate(-50%, -50%);
}

.pikachu-image {
  width: 350px;
  height: auto;
  position: relative;
  z-index: 1;
  display: block;
  transform: translate(15px, -8px);
}

.welcome-title {
  font-family: 'lato', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #353535;
  margin-bottom: 1rem;
}

.welcome-description {
  font-family: 'lato', sans-serif;
  font-size: 1rem;
  color: #5e5e5e;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.get-started-btn {
  background: #f22539;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 150px;
}

.get-started-btn:hover {
  background: #c00e20;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 51, 51, 0.3);
}

.get-started-btn:active {
  transform: translateY(0);
}

.loader {
  width: 24px;
  height: 24px;
  animation: spin 2s linear infinite;
  vertical-align: middle;
  border-radius: 50%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Estilos para el loader global */
:global(.global-loader) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

:global(.global-loader img) {
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

:global(body.loading) {
  overflow: hidden;
}

@media (max-width: 640px) {
  .welcome-content {
    padding: 2.5rem 1.5rem;
  }

  .red-circle {
    width: 180px;
    height: 180px;
  }

  .pikachu-image {
    width: 280px;
    transform: translate(11px, -7px);
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-description {
    font-size: 0.9375rem;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
}
</style>
