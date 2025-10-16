import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
// Usamos createPinia para crear la instancia de Pinia
// Usamos router para crear la instancia de Vue Router
app.use(createPinia())
app.use(router)
// Montamos la aplicación en el elemento #app
app.mount('#app')
