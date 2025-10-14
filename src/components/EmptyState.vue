<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-content">
      <div class="pokeball-empty">
        <div class="pokeball-icon">⚪</div>
      </div>
      <h3 class="empty-title">{{ title || 'No hay Pokémons' }}</h3>
      <p class="empty-message">
        {{ message || 'Comienza a explorar y marca tus favoritos' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.pokeball-empty {
  margin-bottom: 1.5rem;
}

.pokeball-icon {
  font-size: 4rem;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-message {
  color: #6b7280;
  font-size: 1rem;
}
</style>

