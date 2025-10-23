<template>
  <v-container fluid>
    <h1 class="text-h5 mb-4">Formulario Cabrito</h1>

    <v-expansion-panels v-model="panelActivo">
      <v-expansion-panel>
        <v-expansion-panel-title>Formulario de Producción</v-expansion-panel-title>
        <v-expansion-panel-text>

          <!-- 🔹 Datos Básicos -->
          <h3 class="text-h6 mb-2">Datos Básicos</h3>
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

          <v-divider class="my-4"></v-divider>

          <!-- 🔹 Actividad y Reproducción -->
          <h3 class="text-h6 mb-2">Datos de Actividad y Reproducción</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Actividad voluntaria" v-model="form.actVoluntaria" type="number" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Actividad reproductiva" v-model="form.actReproductiva" type="number" />
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- 🔹 Movilización -->
          <h3 class="text-h6 mb-2">Datos de Movilización</h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Ganancia diaria de peso vivo (GDPV)" v-model="form.gdpv" type="number" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="Pérdida diaria de peso vivo (PDPV)" v-model="form.pdpv" type="number" />
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- 🔹 Gestación -->
          <h3 class="text-h6 mb-2">Datos de Gestación</h3>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field label="Peso nacimiento cría (PENC)" v-model="form.penc" type="number" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Número de crías (NC)" v-model="form.nc" type="number" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Días de gestación" v-model="form.dGestacion" type="number" />
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- 🔹 Alimentos -->
          <h3 class="text-h6 mb-2">Alimentos</h3>
          <v-btn color="primary" variant="outlined" class="mb-4" @click="agregarAlimento">
            + Agregar alimento
          </v-btn>

          <v-row v-for="(item, index) in form.alimentos" :key="index" class="mb-2">
            <!-- Autocompletar de alimentos -->
            <v-col cols="12" sm="5">
              <v-autocomplete :items="alimentos" v-model="item.alimento" item-title="nombre" item-value="id"
                label="Seleccionar alimento" return-object clearable>
                <!-- Opciones en el desplegable -->
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.raw.nombre"
                    :subtitle="`${item.raw.grupo} - ${item.raw.momento}`" />
                </template>
                <!-- Texto al seleccionar -->
                <template #selection="{ item }">
                  {{ item.raw.nombre }} ({{ item.raw.grupo }} - {{ item.raw.momento }})
                </template>
              </v-autocomplete>
            </v-col>

            <!-- Cantidad MTC -->
            <v-col cols="12" sm="4">
              <v-text-field v-model="item.mtc" type="number" label="MTC (kg)" />
            </v-col>

            <!-- Botón eliminar -->
            <v-col cols="12" sm="3" class="d-flex align-center">
              <v-btn color="error" variant="outlined" @click="eliminarAlimento(index)">
                Eliminar
              </v-btn>
            </v-col>
          </v-row>



        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- 🔹 Resultados -->
      <v-expansion-panel>
        <v-expansion-panel-title>
          Resultados
        </v-expansion-panel-title>
        <v-expansion-panel-text>

          <!-- Subcategoría: Requerimientos Nutricionales -->
          <h3 class="text-h6 mb-2">Requerimientos Lactancia</h3>
          <v-row>
            <v-col cols="12" sm="3" v-for="(valor, label) in {
              'PB Total (gr)': resultados.totalPB,
              'EM Total': resultados.emTotal,
              'EM Total(ajustado)': resultados.emAjustado,
              'EM x Movilización': resultados.emMov,
              'EM x Recuperación': resultados.emRec,
              'Calcio (g/d)': resultados.ca,
              'Fósforo (g/d)': resultados.p,
              'FDN total %': resultados.fdnTotal,
              'CTMS / PV': resultados.ctmsPv,
              'CTMS / PV (Inicio Lactancia)': resultados.ctmsPvInicio,
              'CTMS / PV (Mitad Lactancia)': resultados.ctmsPvMitad,
            }" :key="label">
              <v-card outlined elevation="0" class="pa-2 text-center resultado-card"
                :style="{ borderColor: isDark ? '#fff' : '#000' }">
                <div>{{ label }}</div>
                <div>
                  <strong>{{ mostrarValor(valor) }}</strong>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          <!-- Subcategoría: Otros Indicadores -->
          <h3 class="text-h6 mb-2">Requerimientos Último Tercio de Gestación</h3>
          <v-row>
            <v-col cols="12" sm="4" v-for="(valor, label) in {
              'UTG PB': resultados.utgPB,
              'UTG EM': resultados.utgEM,
              'UTG CTMS / PV': resultados.ctmsPvUTG,
            }" :key="label">
              <v-card outlined elevation="0" class="pa-2 text-center resultado-card"
                :style="{ borderColor: isDark ? '#fff' : '#000' }">
                <div>{{ label }}</div>
                <div>
                  <strong>{{ mostrarValor(valor) }}</strong>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          <!-- Subcategoría: Aportes de Dieta -->
          <h3 class="text-h6 mb-2">Aportes</h3>
          <v-row>
            <v-col cols="12" sm="4" v-for="(valor, label) in {
              'MTC Total (kg)': resultados.sumaMtc,
              'MS Total (kg)': resultados.sumaMs,
              'PB Total': resultados.sumaPb,
              'EM Total': resultados.sumaEm,
              'Ca Total': resultados.sumaCa,
              'P Total': resultados.sumaP,
              'FDN Total': resultados.sumaFdn,
              'Ca / P': resultados.caP,
              'Costo Total': resultados.sumaCosto
            }" :key="label">
              <v-card outlined elevation="0" class="pa-2 text-center resultado-card"
                :style="{ borderColor: isDark ? '#fff' : '#000' }">
                <div>{{ label }}</div>
                <div>
                  <strong>{{ mostrarValor(valor) }}</strong>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          <!-- Subcategoría: Balances -->
          <h3 class="text-h6 mb-2">Balances</h3>
          <v-row>
            <v-col cols="12" sm="3" v-for="(valor, label) in {
              'Balance PB': resultados.balancePb,
              'Balance EM': resultados.balanceEm,
              'Balance Ca': resultados.balanceCa,
              'Balance P': resultados.balanceP,
              'Balance FDN': resultados.balanceFdn
            }" :key="label">
              <v-card outlined elevation="0" class="pa-2 text-center resultado-card"
                :style="{ borderColor: isDark ? '#fff' : '#000' }">
                <div>{{ label }}</div>
                <div :class="{ 'text-red': valor < 0, 'text-green': valor >= 0 }">
                  <strong>{{ mostrarValor(valor) }}</strong>
                </div>
              </v-card>
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
import { th } from 'vuetify/locale';
import { initDB, getAllAlimentos } from '../db/indexedDB'
import { useTheme } from 'vuetify'
export default {
  data() {
    return {
      panelActivo: [0],
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
        dGestacion: null,
        alimentos: []
      },
      resultados: {
        totalPB: null,
        emTotal: null,
        emAjustado: null,
        emMov: null,
        emRec: null,
        ca: null,
        p: null,
        lipidos: 6,
        fdnTotal: 40,
        fdnEfectiva: 25,
        utgPB: null,
        utgEM: null,
        ctmsPv: null,
        sumaMtc: null,
        sumaMs: null,
        sumaPb: null,
        sumaEm: null,
        sumaCa: null,
        sumaP: null,
        sumaFdn: null,
        sumaEe: null,
        sumaCosto: null,
        balancePb: null,
        balanceEm: null,
        balanceCa: null,
        balanceP: null,
        caP: null,
        ctmsPvInicio: null,
        ctmsPvMitad: null,
        ctmsPvUTG: null,
        balanceFdn: null,
      },
      alimentos: [] // lista cargada desde la BD
    }
  },
  async mounted() {
    await initDB()
    this.alimentos = await getAllAlimentos()
  },
  computed: {
    isDark() {
      const theme = useTheme()
      return theme.global.current.value.dark
    }
  },
  methods: {
    mostrarValor(valor) {
      if (valor === null || valor === undefined || valor === '' || isNaN(valor)) {
        return '-'
      }
      return valor
    },
    // 🔹 Función auxiliar para redondear en 2 decimales
    round2(value) {
      return Math.round(value * 100) / 100
    },
    agregarAlimento() {
      this.form.alimentos.push({ alimento: null, mtc: null })
    },
    eliminarAlimento(index) {
      this.form.alimentos.splice(index, 1)
    },
    calcular() {
      // Variables auxiliares
      const pbMant = 15.667 + (1.1315 * this.form.pVivo)
      const pbMantAjust = ((pbMant * this.form.actReproductiva) / 100) + pbMant
      const pbProd = this.form.ltDiarios * (36.905 + (8.9048 * this.form.gButirosa))

      const emMant = 0.4 + (0.0289 * this.form.pVivo)
      const emMantAjust = emMant + ((emMant * this.form.actVoluntaria) / 100) + ((emMant * this.form.actReproductiva) / 100)
      const emProd = (1.1192 + (0.0317 * this.form.gButirosa)) * this.form.ltDiarios
      this.resultados.sumaMtc = 0
      this.resultados.sumaMs = 0
      this.resultados.sumaPb = 0
      this.resultados.sumaEm = 0
      this.resultados.sumaCa = 0
      this.resultados.sumaP = 0
      this.resultados.sumaFdn = 0
      this.resultados.sumaCosto = 0


      this.form.alimentos.forEach(item => {
        if (item.alimento && item.mtc) {
          const ali = item.alimento
          const mtc = parseFloat(item.mtc)
          const ms = mtc * parseFloat((ali.ms + "").replace(",", "."))
          console.log("MTC:", mtc, "MS(%):", ali.ms, "MS calculado:", mtc * (ali.ms / 100))
          console.log("ali.ms (crudo):", ali.ms, "typeof:", typeof ali.ms)

          this.resultados.sumaMtc = (this.resultados.sumaMtc || 0) + mtc
          this.resultados.sumaMs = (this.resultados.sumaMs || 0) + ms
          this.resultados.sumaPb = (this.resultados.sumaPb || 0) + ((ms * parseFloat(ali.pb))*10)
          this.resultados.sumaEm = (this.resultados.sumaEm || 0) + (ms * parseFloat(ali.em))
          this.resultados.sumaCa = (this.resultados.sumaCa || 0) + (ms * parseFloat(ali.calcio))
          this.resultados.sumaP = (this.resultados.sumaP || 0) + (ms * parseFloat(ali.fosforo))
          this.resultados.sumaFdn = (this.resultados.sumaFdn || 0) + ((ms * parseFloat(ali.fdn)) / 100)
          this.resultados.sumaCosto = (this.resultados.sumaCosto || 0) + (ms * parseFloat(ali.precio))
        }
      })

      // Resultados redondeados
      this.resultados.totalPB = this.round2(pbMantAjust + pbProd)
      this.resultados.emTotal = this.round2(emMantAjust + emProd)
      this.resultados.emMov = this.round2(9.98 * this.form.pdpv)
      this.resultados.emRec = this.round2(10.51 * this.form.gdpv)
      this.resultados.emAjustado = this.round2(this.resultados.emTotal - this.resultados.emMov + this.resultados.emRec)
      this.resultados.ca = this.round2(((0.623 * this.resultados.sumaMs) + 0.228) / 0.45 + (1.4 * this.form.ltDiarios) / 0.45)
      this.resultados.p = this.round2(((0.881 + (0.88 * this.resultados.sumaMs)) / 0.65) + (1 * this.form.ltDiarios) / 0.65)
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
      this.resultados.ctmsPv = this.round2((this.resultados.sumaMs / this.form.pVivo) * 100)
      this.resultados.sumaMtc = this.round2(this.resultados.sumaMtc)
      this.resultados.sumaMs = this.round2(this.resultados.sumaMs)
      this.resultados.sumaPb = this.round2(this.resultados.sumaPb)
      this.resultados.sumaEm = this.round2(this.resultados.sumaEm)
      this.resultados.sumaCa = this.round2(this.resultados.sumaCa)
      this.resultados.sumaP = this.round2(this.resultados.sumaP)
      this.resultados.sumaCosto = this.round2(this.resultados.sumaCosto)
      this.resultados.sumaFdn = this.round2(this.resultados.sumaFdn / this.resultados.sumaMs * 100)
      this.resultados.balancePb = this.round2(this.resultados.sumaPb - this.resultados.totalPB)
      this.resultados.balanceEm = this.round2(this.resultados.sumaEm - this.resultados.emAjustado)
      this.resultados.balanceCa = this.round2(this.resultados.sumaCa - this.resultados.ca)
      this.resultados.balanceP = this.round2(this.resultados.sumaP - this.resultados.p)
      this.resultados.balanceFdn = this.round2(this.resultados.sumaFdn - this.resultados.fdnTotal)
      this.resultados.ctmsPvInicio = this.round2((((165+(368.6*this.form.ltDiarios)+(34.8*this.form.pVivo**0.75))/1000)/this.form.pVivo)*100)
      this.resultados.ctmsPvMitad = this.round2((((533+(305.2*this.form.ltDiarios)+(13.3*this.form.pVivo))/1000)/this.form.pVivo)*100)
      this.resultados.ctmsPvUTG = this.round2(2+(0.25*this.form.nc-1))
      this.resultados.caP = this.round2(this.resultados.sumaCa / this.resultados.sumaP)
      this.panelActivo = [1]
    }
  }
}
</script>
<style scoped>
.resultado-card {
  border: 1px solid #000;
  /* borde sólido negro */
  border-radius: 6px;
  /* opcional, esquinas redondeadas */
}
</style>