<script setup lang="ts">
import { RouterView } from 'vue-router'
import Loader from '@/assets/icons/Loader.svg'
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <div class="loading-screen">
              <img :src="Loader" alt="Loading" class="loader" />
            </div>
          </template>
        </Suspense>
      </template>
    </RouterView>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.loader {
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
