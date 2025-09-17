<template>
  <v-container fluid>
    <h1 class="text-h5 mb-4">Formulario Carne</h1>

    <v-expansion-panels multiple>

      <!-- 🔹 Datos básicos -->
      <v-expansion-panel>
        <v-expansion-panel-title>Datos Básicos</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Peso vivo" v-model="form.pVivo" type="number" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Grasa butirosa" v-model="form.gButirosa" type="number" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Litros por día" v-model="form.ltDiarios" type="number" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 🔹 Datos de actividad -->
      <v-expansion-panel>
        <v-expansion-panel-title>Datos de Actividad y Reproducción</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Actividad voluntaria" v-model="form.actVoluntaria" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Actividad reproductiva" v-model="form.actReproductiva" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Pérdida diaria de peso vivo" v-model="form.pdpv" type="number" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Ganancia diaria de peso vivo" v-model="form.gdpv" type="number" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Peso nacimiento cría" v-model="form.penc" type="number" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Número de crías" v-model="form.nc" type="number" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Días de gestación" v-model="form.dGestacion" type="number" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 🔹 Resultados -->
      <v-expansion-panel>
        <v-expansion-panel-title>Resultados</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Total PB (gr)" v-model="resultados.totalPB" disabled />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="EM total" v-model="resultados.emTotal" disabled />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="EM total ajustado" v-model="resultados.emAjustado" disabled />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="EM x mov" v-model="resultados.emMov" disabled />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="EM x rec" v-model="resultados.emRec" disabled />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Ca (g/d)" v-model="resultados.ca" disabled />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="P (g/d)" v-model="resultados.p" disabled />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="% Lípidos" v-model="resultados.lipidos" disabled />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="FDN total %" v-model="resultados.fdnTotal" disabled />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="FDN efectiva %" v-model="resultados.fdnEfectiva" disabled />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="UTG PB" v-model="resultados.utgPB" disabled />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="UTG EM" v-model="resultados.utgEM" disabled />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 🔹 Botón Calcular -->
    <v-btn color="primary" class="mt-4" @click="calcular">Calcular</v-btn>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        pVivo: null,
        gButirosa: null,
        ltDiarios: null,
        actVoluntaria: null,
        actReproductiva: null,
        pdpv: null,
        gdpv: null,
        penc: null,
        nc: null,
        dGestacion: null
      },
      resultados: {
        totalPB: null,
        emTotal: null,
        emAjustado: null,
        emMov: null,
        emRec: null,
        ca: null,
        p: null,
        lipidos: null,
        fdnTotal: null,
        fdnEfectiva: null,
        utgPB: null,
        utgEM: null
      }
    }
  },
  methods: {
    // 🔹 Función auxiliar para redondear en 2 decimales
    round2(value) {
      return Math.round(value * 100) / 100
    },

    calcular() {
      // Variables auxiliares
      const pbMant = 15.667 + (1.1315 * this.form.pVivo)
      const pbMantAjust = ((pbMant * this.form.actReproductiva) / 100) + pbMant
      const pbProd = this.form.ltDiarios * (36.905 + (8.9048 * this.form.gButirosa))

      const emMant = 0.4 + (0.0289 * this.form.pVivo)
      const emMantAjust = emMant + ((emMant * this.form.actVoluntaria) / 100) + ((emMant * this.form.actReproductiva) / 100)
      const emProd = (1.1192 + (0.0317 * this.form.gButirosa)) * this.form.ltDiarios

      // Resultados redondeados
      this.resultados.totalPB = this.round2(pbMantAjust + pbProd)
      this.resultados.emTotal = this.round2(emMantAjust + emProd)
      this.resultados.emMov = this.round2(9.98 * this.form.pdpv)
      this.resultados.emRec = this.round2(10.51 * this.form.gdpv)
      this.resultados.emAjustado = this.round2(this.resultados.emTotal - this.resultados.emMov + this.resultados.emRec)
      this.resultados.ca = this.round2(10)
      this.resultados.p = this.round2(5)
      this.resultados.lipidos = this.round2(6)
      this.resultados.fdnTotal = this.round2(40)
      this.resultados.fdnEfectiva = this.round2(25)
      this.resultados.utgPB = this.round2(
        (((-155.62 - (8.6668 * this.form.penc) + (2.6495 * this.form.dGestacion) + (0.0041667 * this.form.nc) -
        (0.011049 * this.form.dGestacion * this.form.dGestacion)) +
        (0.097691 * this.form.penc * this.form.dGestacion) -
        (12.136 * this.form.penc * this.form.nc) +
        (0.14631 * this.form.penc * this.form.dGestacion * this.form.nc)) / 0.65) + pbMant
      )
      this.resultados.utgEM = this.round2(
        ((-15.467 - (1.1439 * this.form.penc) + (0.26316 * this.form.dGestacion) -
        (0.0021667 * this.form.nc) - (0.0010963 * this.form.dGestacion * this.form.dGestacion) +
        (0.011772 * this.form.penc * this.form.dGestacion) -
        (0.98352 * this.form.penc * this.form.nc) +
        (0.011735 * this.form.penc * this.form.dGestacion * this.form.nc)) * 0.239) + emMantAjust
      )
    }
  }
}
</script>

