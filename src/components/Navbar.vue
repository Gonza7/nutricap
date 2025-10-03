<template>
  <v-app-bar app flat>
    <!-- Botón menú (solo en mobile) -->
    <v-app-bar-nav-icon class="d-sm-none" @click="drawer = !drawer" />

    <!-- Logo -->
    <v-toolbar-title class="d-flex align-center">
      <img src="@/assets/logo.png" alt="Nutricap Logo" height="70" />
    </v-toolbar-title>

    <v-spacer />

    <!-- Botones de navegación (ocultos en mobile) -->
    <div class="d-none d-sm-flex">
      <v-btn v-for="(item, i) in items" :key="i" variant="text" :to="item.to">
        {{ item.title }}
      </v-btn>
    </div>

    <!-- Botón cambio de tema -->
    <v-btn icon @click="toggleTheme">
      <img
        v-if="theme.global.current.value.dark"
        :src="sunIcon"
        class="icon icon-dark"
        alt="Modo claro"
      />
      <img
        v-else
        :src="moonIcon"
        class="icon icon-light"
        alt="Modo oscuro"
      />
    </v-btn>
  </v-app-bar>

  <!-- Drawer lateral (solo en mobile) -->
  <v-navigation-drawer v-model="drawer" temporary app>
    <v-list>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

// Importamos íconos locales
import sunIcon from '@/assets/icons/weather-sunny.svg'
import moonIcon from '@/assets/icons/weather-night.svg'

const drawer = ref(false)
const theme = useTheme()

// Alternar entre claro/oscuro
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const items = [
  { title: 'Inicio', to: '/' },
  { title: 'Alimentos', to: '/alimentos' },
  /*{ title: 'Carne', to: '/carne' },*/
  { title: 'Tambo', to: '/tambo' },
]
</script>

<style scoped>
.icon {
  width: 24px;
  height: 24px;
}

/* Tema claro */
.icon-light {
  filter: invert(0);
}

/* Tema oscuro */
.icon-dark {
  filter: invert(1);
}
</style>
