<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  import { resetDB } from './db/indexedDB.js'

if (!localStorage.getItem("dbReseteada")) {
  resetDB().then(() => {
    console.log("BD reseteada por única vez")
    localStorage.setItem("dbReseteada", "true")
  })
}
</script>
