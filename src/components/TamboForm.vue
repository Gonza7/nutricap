<template>
  <v-container fluid>
    <h1 class="text-h5 mb-4">Formulario Carne</h1>

    <v-form ref="carneForm" v-model="formValid" @submit.prevent="submitForm">
      <v-row dense>
        <!-- Datos generales -->
        <v-col cols="12" sm="4">
          <v-text-field v-model.number="datos.pv" label="PV (Peso vivo)" :rules="[requiredRule]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model.number="datos.gb" label="GB (Grasa butirosa)" :rules="[requiredRule]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model.number="datos.litrosLeche" label="Litros de leche diarios" :rules="[requiredRule]"></v-text-field>
        </v-col>

        <!-- Actividades -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="datos.actividadVoluntaria"
            label="Actividad voluntaria (%)"
            :rules="[requiredRule, v => v >= 10 && v <= 40 || 'Debe estar entre 10 y 40']"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="datos.actividadReproductiva"
            label="Actividad reproductiva (%)"
            :rules="[v => v <= 10 || 'Máximo 10%']"
          ></v-text-field>
        </v-col>

        <!-- Movilización -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="datos.pdpv"
            label="PDPV (Perdida diaria de PV)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="datos.gdpv"
            label="GDPV (Ganancia diaria de PV)"
          ></v-text-field>
        </v-col>

        <!-- Gestación -->
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="datos.penc"
            label="PENC (Peso nacimiento cria)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="datos.nc"
            label="NC (Número de crías)"
          ></v-text-field>
        </v-col>

        <!-- Selección de alimentos -->
        <v-col cols="12">
          <v-autocomplete
            v-model="alimentoSeleccionado"
            :items="alimentos"
            item-title="nombre"
            item-value="id"
            label="Agregar alimento"
            clearable
          ></v-autocomplete>
          <v-text-field
            v-if="alimentoSeleccionado"
            v-model.number="cantidadAlimento"
            label="Cantidad (kg)"
          ></v-text-field>
          <v-btn
            v-if="alimentoSeleccionado && cantidadAlimento"
            @click="agregarAlimento"
            color="primary"
            class="mt-2"
          >
            Agregar
          </v-btn>

          <v-list two-line subheader>
            <v-subheader>Alimentos seleccionados</v-subheader>
            <v-list-item v-for="(a, i) in alimentosSeleccionados" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{ a.nombre }}</v-list-item-title>
                <v-list-item-subtitle>{{ a.cantidad }} kg</v-list-item-subtitle>
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
          <v-text-field label="Consumo total (kg)" :value="consumoTotal" readonly></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field label="Peso esperado" :value="pesoEsperado" readonly></v-text-field>
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
        pv: null,
        gb: null,
        litrosLeche: null,
        actividadVoluntaria: null,
        actividadReproductiva: null,
        pdpv: null,
        gdpv: null,
        penc: null,
        nc: null,
      },
      alimentos: [],
      alimentoSeleccionado: null,
      cantidadAlimento: null,
      alimentosSeleccionados: [],
      formValid: false,
    }
  },
  computed: {
    consumoTotal() {
      return this.alimentosSeleccionados.reduce((acc, a) => acc + (a.cantidad || 0), 0)
    },
    pesoEsperado() {
      // ejemplo simple: PV + GDPV - PDPV
      return (this.datos.pv || 0) + (this.datos.gdpv || 0) - (this.datos.pdpv || 0)
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
      if (alimento && this.cantidadAlimento > 0) {
        this.alimentosSeleccionados.push({ ...alimento, cantidad: this.cantidadAlimento })
        this.alimentoSeleccionado = null
        this.cantidadAlimento = null
      }
    },
    removeAlimento(index) {
      this.alimentosSeleccionados.splice(index, 1)
    },
    submitForm() {
      const form = this.$refs.carneForm
      if (!form.validate()) return
      console.log('Datos guardados', this.datos, this.alimentosSeleccionados)
      // aquí podrías guardar en IndexedDB o enviar a backend
    },
  },
}
</script>
