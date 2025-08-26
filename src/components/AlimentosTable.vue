<template>
  <v-container fluid class="pa-0">
    <v-row class="justify-space-between align-center mb-2 mx-0">
      <v-col>
        <h1 class="text-h5">Alimentos</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="openDialog()">Agregar Alimento</v-btn>
      </v-col>
    </v-row>

    <v-data-table :items="filteredAlimentos" :headers="headers" class="elevation-1" dense fixed-header height="600"
      style="width: 100%;">
      <template v-slot:top>
        <v-row class="ma-2 mb-0" align="center" justify="space-between">
          <v-col cols="12" sm="6" class="pb-0">
            <v-text-field v-model="filterGrupo" label="Filtrar por Grupo" clearable></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" class="pb-0">
            <v-text-field v-model="filterNombre" label="Filtrar por Nombre" clearable></v-text-field>
          </v-col>
        </v-row>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon elevation="0" @click="openDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon elevation="0" @click="deleteAlimento(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'Agregar Alimento' : 'Editar Alimento' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="alimentoForm" v-model="formValid">
            <v-row dense>
              <v-col cols="12" sm="6" v-for="header in formHeader" :key="header.value">
                <v-text-field v-model="editedItem[header.value]" :label="header.text"
                  :rules="header.value !== 'precio' ? [v => !!v || 'Campo obligatorio'] : []"
                  :required="header.value !== 'precio'"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="closeDialog()">Cancelar</v-btn>
          <v-btn text color="blue darken-1" @click.prevent="submitForm()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { initDB, getAllAlimentos, addAlimento } from '../db/indexedDB'

export default {
  data() {
    return {
      alimentos: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      formValid: false,
      filterGrupo: '',
      filterNombre: '',
      headers: [
        { title: 'Grupo', key: 'grupo' },
        { title: 'Nombre', key: 'nombre' },
        { title: 'Forma física', key: 'forma' },
        { title: 'Momento', key: 'momento' },
        { title: '% MS', key: 'ms' },
        { title: 'EM', key: 'em' },
        { title: '% PB', key: 'pb' },
        { title: '% FDN', key: 'fdn' },
        { title: 'Calcio', key: 'calcio' },
        { title: 'Fósforo', key: 'fosforo' },
        { title: 'Precio', key: 'precio' },
        { title: 'Acciones', key: 'actions', sortable: false },
      ],
      formHeader: [
        { text: 'Grupo', value: 'grupo' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Forma física', value: 'forma' },
        { text: 'Momento', value: 'momento' },
        { text: '% MS', value: 'ms' },
        { text: 'EM', value: 'em' },
        { text: '% PB', value: 'pb' },
        { text: '% FDN', value: 'fdn' },
        { text: 'Calcio', value: 'calcio' },
        { text: 'Fósforo', value: 'fosforo' },
        { text: 'Precio', value: 'precio' },
      ]
    }
  },
  computed: {
    filteredAlimentos() {
      return this.alimentos.filter(a => {
        const grupoMatch = a.grupo.toLowerCase().includes(this.filterGrupo.toLowerCase())
        const nombreMatch = a.nombre.toLowerCase().includes(this.filterNombre.toLowerCase())
        return grupoMatch && nombreMatch
      })
    }
  },
  async mounted() {
    await initDB()
    this.fetchAlimentos()
  },
  methods: {
    async fetchAlimentos() {
      this.alimentos = await getAllAlimentos()
    },
    openDialog(item) {
      if (item) {
        this.editedIndex = this.alimentos.findIndex(a => a.id === item.id)
        this.editedItem = {
          grupo: item.grupo || '',
          nombre: item.nombre || '',
          forma: item.forma || '',
          momento: item.momento || '',
          ms: item.ms || '',
          em: item.em || '',
          pb: item.pb || '',
          fdn: item.fdn || '',
          calcio: item.calcio || '',
          fosforo: item.fosforo || '',
          precio: item.precio || '',
          id: item.id
        }
      } else {
        this.editedIndex = -1
        this.editedItem = {
          grupo: '',
          nombre: '',
          forma: '',
          momento: '',
          ms: '',
          em: '',
          pb: '',
          fdn: '',
          calcio: '',
          fosforo: '',
          precio: '',
          id: Date.now()
        }
      }
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
      this.editedItem = {}
      this.editedIndex = -1
    },
    async submitForm() {
      const form = this.$refs.alimentoForm
      if (!form) return
      const isValid = form.validate()
      if (!isValid) return

      const db = await initDB()
      const itemToSave = { ...this.editedItem }
      if (this.editedIndex === -1) {
        await addAlimento(itemToSave)
      } else {
        await db.put('alimentos', itemToSave)
      }

      await this.fetchAlimentos()
      this.closeDialog()
    },
    async deleteAlimento(id) {
      const db = await initDB()
      await db.delete('alimentos', id)
      await this.fetchAlimentos()
    }
  }
}
</script>
