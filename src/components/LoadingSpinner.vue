<script setup lang="ts">
import Loader from '../assets/icons/Loader.svg'

defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div class="loading-container" :class="`loading-${size || 'md'}`">
    <img :src="Loader" alt="Loading" class="loader" />
  </div>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loader {
  animation: spin 1s linear infinite;
}

.loading-sm .loader {
  width: 106px;
  height: 106px;
}

.loading-md .loader {
  width: 120px;
  height: 120px;
}

.loading-lg .loader {
  width: 160px;
  height: 160px;
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
