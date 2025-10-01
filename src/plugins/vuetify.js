/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
// Composables
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'
import colors from 'vuetify/util/colors'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#F9FAFB',   // gris muy claro
          surface: '#DDDDDD',
          primary: '#2E7D32',      // verde fuerte (énfasis)
          secondary: '#455A64',    // gris azulado
          accent: '#66BB6A',       // verde suave para resaltar
          error: '#E53935',        // rojo
          info: '#1E88E5',         // azul
          success: '#43A047',      // verde éxito
          warning: '#FB8C00',      // naranja
          profile: '#2E7D32'       // verde también para mantener coherencia
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',   // fondo oscuro
          surface: '#1E1E1E',      // gris oscuro
          primary: '#66BB6A',      // verde claro (para resaltar en oscuro)
          secondary: '#90A4AE',    // gris claro azulado
          accent: '#81C784',       // verde brillante de acento
          error: '#EF5350',        // rojo más suave
          info: '#42A5F5',         // azul claro
          success: '#4CAF50',      // verde éxito
          warning: '#FFA726',      // naranja más visible en oscuro
          profile: '#66BB6A'       // verde también para mantener coherencia
        }
      }
    }
  },
  locale: {
    locale: 'es',
    messages: { es }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})