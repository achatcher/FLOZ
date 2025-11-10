// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import FLOZ CSS Framework
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Load data before mounting
import { useBusinessStore } from './stores/businessStore'
import { useEventsStore } from './stores/eventsStore'

const businessStore = useBusinessStore()
const eventsStore = useEventsStore()

Promise.all([
  businessStore.loadData(),
  eventsStore.loadEventsData()
]).then(() => {
  app.mount('#app')
})
