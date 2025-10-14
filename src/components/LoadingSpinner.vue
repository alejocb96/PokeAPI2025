<script setup lang="ts">
import Loader from '@/assets/icons/Loader.svg'

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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loader {
  animation: spin 1s linear infinite;
}

.loading-sm .loader {
  width: 40px;
  height: 40px;
}

.loading-md .loader {
  width: 60px;
  height: 60px;
}

.loading-lg .loader {
  width: 80px;
  height: 80px;
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

