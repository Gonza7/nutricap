import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from '@/plugins'
import { initDB, getAllAlimentos } from './db/indexedDB'
import { loadCSVToDB } from './db/loadCSV'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh () {},
  onOfflineReady () {}
})

const app = createApp(App)
registerPlugins(app)
app.mount('#app')

// Inicializar DB y cargar CSV solo si está vacía
async function initApp() {
  await initDB()
  const alimentos = await getAllAlimentos()
  if (alimentos.length === 0) {
    await loadCSVToDB()
  }
}
initApp()
