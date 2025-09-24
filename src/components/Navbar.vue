<template>
  <v-app-bar app flat>
    <!-- Botón menú (solo en mobile) -->
    <v-app-bar-nav-icon
      class="d-sm-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <!-- Logo -->
    <v-toolbar-title class="d-flex align-center">
      <img
        src="@/assets/logo.png"
        alt="Nutricap Logo"
        height="70"
      />
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Botones de navegación (ocultos en mobile) -->
    <div class="d-none d-sm-flex">
      <v-btn
        v-for="(item, i) in items"
        :key="i"
        variant="text"
        :to="item.to"
      >
        {{ item.title }}
      </v-btn>
    </div>

    <!-- Botón cambio de tema -->
    <v-btn icon @click="toggleTheme">
      <v-icon>
        {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
      </v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Drawer lateral (solo en mobile) -->
  <v-navigation-drawer v-model="drawer" temporary app>
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const drawer = ref(false)
const theme = useTheme()

// Función para alternar entre claro/oscuro
const toggleTheme = () => {
  theme.global.name.value =
    theme.global.current.value.dark ? 'light' : 'dark'
}

const items = [
  { title: 'Inicio', to: '/' },
  { title: 'Alimentos', to: '/alimentos' },
  { title: 'Carne', to: '/carne' },
  { title: 'Tambo', to: '/tambo' },
]
</script>
