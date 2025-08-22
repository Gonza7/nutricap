<template>
  <v-app-bar
    app
    dark
    color="primary"
    flat
  >
    <!-- Botón menú (solo en mobile) -->
    <v-app-bar-nav-icon
      class="d-sm-none"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <!-- Título -->
    <v-toolbar-title >Nutricap</v-toolbar-title>

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

    <!-- Ícono de perfil -->
    <v-btn icon>
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Drawer lateral (solo en mobile) -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    app
  >
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
import { ref } from "vue"

const drawer = ref(false)

const items = [
  { title: "Inicio", to: "/" },
  { title: "Alimentos", to: "/alimentos" },
  { title: "Carne", to: "/carne" },
  { title: "Tambo", to: "/tambo" },
]
</script>
