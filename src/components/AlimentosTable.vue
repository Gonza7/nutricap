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

    <v-data-table
      :items="filteredAlimentos"
      :headers="headers"
      class="elevation-1"
      dense
      fixed-header
      height="600"
      style="width: 100%;"
    >
      <template #top>
        <v-row class="ma-2 mb-0" align="center" justify="space-between">
          <v-col cols="12" sm="6" class="pb-0">
            <v-text-field v-model="filterGrupo" label="Filtrar por Grupo" clearable />
          </v-col>
          <v-col cols="12" sm="6" class="pb-0">
            <v-text-field v-model="filterNombre" label="Filtrar por Nombre" clearable />
          </v-col>
        </v-row>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon elevation="0" @click="openDialog(item)">
          <img src="@/assets/icons/pencil.svg" class="icon-pencil" alt="Editar" />
        </v-btn>

        <v-btn icon elevation="0" @click="deleteAlimento(item.id)">
          <img src="@/assets/icons/delete.svg" class="icon-delete" alt="Eliminar" />
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'Agregar Alimento' : 'Editar Alimento' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="alimentoForm" v-model="formValid" @submit.prevent="submitForm">
            <v-row dense>
              <v-col cols="12" sm="6" v-for="header in formHeader" :key="header.value">
                <v-text-field
                  v-model="editedItem[header.value]"
                  :label="header.text"
                  :rules="header.value !== 'precio' ? [requiredRule] : []"
                  :required="header.value !== 'precio'"
                />
              </v-col>
            </v-row>

            <v-card-actions class="px-0">
              <v-spacer />
              <v-btn text color="blue darken-1" @click="closeDialog()">Cancelar</v-btn>
              <v-btn text color="blue darken-1" type="submit">Guardar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useTheme } from 'vuetify'
import {
  initDB,
  getAllAlimentos,
  addAlimento,
  updateAlimento,
  deleteAlimento as deleteAlimentoDB,
} from '../db/indexedDB'

const theme = useTheme()
const alimentos = ref([])
const filterGrupo = ref('')
const filterNombre = ref('')

const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({})
const formValid = ref(false)

const headers = [
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
]

const formHeader = [
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

const isDark = computed(() => theme.global.current.value.dark)

const filteredAlimentos = computed(() =>
  alimentos.value.filter(a => {
    const g = (a.grupo || '').toLowerCase()
    const n = (a.nombre || '').toLowerCase()
    return g.includes(filterGrupo.value.toLowerCase()) && n.includes(filterNombre.value.toLowerCase())
  })
)

async function fetchAlimentos() {
  await initDB()
  alimentos.value = await getAllAlimentos()
}

function requiredRule(v) {
  return (v !== null && v !== undefined && String(v).trim().length > 0) || 'Campo obligatorio'
}

function openDialog(item) {
  if (item) {
    editedIndex.value = alimentos.value.findIndex(a => a.id === item.id)
    editedItem.value = { ...item }
  } else {
    editedIndex.value = -1
    editedItem.value = {
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
      id: Date.now(),
    }
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  nextTick(() => {
    document.querySelector('form')?.reset()
  })
  editedItem.value = {}
  editedIndex.value = -1
}

async function submitForm() {
  const form = document.querySelector('form')
  if (!form) return

  if (editedIndex.value === -1) {
    await addAlimento({ ...editedItem.value })
  } else {
    await updateAlimento({ ...editedItem.value })
  }

  await fetchAlimentos()
  closeDialog()
}

async function deleteAlimento(id) {
  await deleteAlimentoDB(id)
  await fetchAlimentos()
}

// inicializar
fetchAlimentos()
</script>

<style scoped>
.icon-pencil {
  width: 20px;
  height: 20px;
  transition: filter 0.2s;
}

/* Cambia color según tema */
.icon-pencil {
  filter: invert(0); /* claro */
}
:deep(.v-theme--dark) .icon-pencil {
  filter: invert(1); /* oscuro */
}

.icon-delete {
  width: 20px;
  height: 20px;
  transition: filter 0.2s;
}

/* Cambia color según tema */
.icon-delete {
  filter: invert(0); /* claro */
}
:deep(.v-theme--dark) .icon-delete {
  filter: invert(1); /* oscuro */
}
</style>
