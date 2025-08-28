<template>
  <v-container fluid>
    <h1 class="text-h5 mb-4">Formulario Cabrito</h1>

    <v-form ref="cabritoForm" v-model="formValid" @submit.prevent="submitForm">
      <v-row dense>

        <!-- Datos generales -->
        <v-col cols="12" sm="4">
          <v-text-field
            v-model.number="datos.peso"
            label="Peso Cabrito (kg)"
            :rules="[requiredRule]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model.number="datos.gdpv"
            label="GDPV (Ganancia diaria de PV kg)"
            :rules="[requiredRule]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-select
            v-model="datos.sexo"
            :items="['Macho', 'Hembra']"
            label="Sexo"
            :rules="[requiredRule]"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model.number="datos.edad"
            label="Edad (días)"
            :rules="[requiredRule]"
          ></v-text-field>
        </v-col>

        <!-- Selección de alimentos -->
        <v-col cols="12" sm="6">
          <v-autocomplete
            v-model="alimentoSeleccionado"
            :items="alimentos"
            item-title="nombre"
            item-value="id"
            label="Agregar alimento"
            clearable
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="3">
          <v-text-field
            v-if="alimentoSeleccionado"
            v-model.number="cantidadAlimento"
            label="MTC Kg"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="3">
          <v-text-field
            v-if="alimentoSeleccionado"
            v-model.number="precioAlimento"
            label="Precio x Kg"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-btn
            v-if="alimentoSeleccionado && cantidadAlimento && precioAlimento"
            @click="agregarAlimento"
            color="primary"
            class="mt-2"
          >
            Agregar
          </v-btn>

          <v-list two-line subheader>
            <v-subheader>Alimentos seleccionados</v-subheader>
            <v-list-item
              v-for="(a, i) in alimentosSeleccionados"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title>{{ a.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ a.cantidad }} kg - ${{ a.precio }} x kg
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="removeAlimento(i)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Campos calculados -->
        <v-col cols="12" sm="6">
          <v-text-field
            label="Consumo total (kg)"
            :value="consumoTotal"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Costo total ($)"
            :value="costoTotal"
            readonly
          ></v-text-field>
        </v-col>

      </v-row>

      <v-btn type="submit" color="success" class="mt-4">Guardar</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { getAllAlimentos } from '../db/indexedDB'

export default {
  data() {
    return {
      datos: {
        peso: null,
        gdpv: null,
        sexo: null,
        edad: null,
      },
      alimentos: [],
      alimentoSeleccionado: null,
      cantidadAlimento: null,
      precioAlimento: null,
      alimentosSeleccionados: [],
      formValid: false,
    }
  },
  computed: {
    consumoTotal() {
      return this.alimentosSeleccionados.reduce(
        (acc, a) => acc + (a.cantidad || 0),
        0
      )
    },
    costoTotal() {
      return this.alimentosSeleccionados.reduce(
        (acc, a) => acc + (a.cantidad || 0) * (a.precio || 0),
        0
      )
    },
  },
  async mounted() {
    this.alimentos = await getAllAlimentos()
  },
  methods: {
    requiredRule(v) {
      return (v !== null && v !== undefined && String(v).trim() !== '') || 'Campo obligatorio'
    },
    agregarAlimento() {
      const alimento = this.alimentos.find(a => a.id === this.alimentoSeleccionado)
      if (alimento && this.cantidadAlimento > 0 && this.precioAlimento > 0) {
        this.alimentosSeleccionados.push({
          ...alimento,
          cantidad: this.cantidadAlimento,
          precio: this.precioAlimento
        })
        this.alimentoSeleccionado = null
        this.cantidadAlimento = null
        this.precioAlimento = null
      }
    },
    removeAlimento(index) {
      this.alimentosSeleccionados.splice(index, 1)
    },
    submitForm() {
      const form = this.$refs.cabritoForm
      if (!form.validate()) return
      console.log('Datos guardados:', this.datos, this.alimentosSeleccionados)
      // Aquí puedes guardar los datos en IndexedDB o enviar a backend
    },
  },
}
</script>
