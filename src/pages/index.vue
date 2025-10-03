<template>
  <v-container class="mt-6">
    <h1 class="text-h4 mb-4">Nutricap</h1>

    <v-row dense>
      <v-col cols="12" sm="6">
        <v-btn color="primary" block @click="$router.push('/tambo')">
          Nuevo Formulario
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn color="secondary" block @click="$router.push('/alimentos')">
          Administrar Alimentos
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomePage",
}
</script>
