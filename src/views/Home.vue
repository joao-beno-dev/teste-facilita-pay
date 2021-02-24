<style scoped>
.grafico {
  height: 300px;
}
</style>

<template>
  <div class="home container">
    <Calculadora :taxa="taxa" class="row flex-center" />
    <Grafico :historico="historico" :alcance="alcance" class="grafico row" />
    <div class="row flex-center">
    <span class="q-mr-lg text-accent">Selecione o intervalo:</span>
      <q-btn-group outline>
        <q-btn :outline="alcance === 0 ? null : true" color="accent" label="Ano" @click="mudarAlcance(0)" />
        <q-btn :outline="alcance === 1 ? null : true" color="accent" label="Semestre" @click="mudarAlcance(1)" />
        <q-btn :outline="alcance === 2 ? null : true" color="accent" label="Trimestre" @click="mudarAlcance(2)" />
        <q-btn :outline="alcance === 3 ? null : true" color="accent" label="Bimestre" @click="mudarAlcance(3)" />
        <q-btn :outline="alcance === 4 ? null : true" color="accent" label="Mês" @click="mudarAlcance(4)" />
        <q-btn :outline="alcance === 5 ? null : true" color="accent" label="Quinzena" @click="mudarAlcance(5)" />
        <q-btn :outline="alcance === 6 ? null : true" color="accent" label="Semana" @click="mudarAlcance(6)" />
      </q-btn-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HomeStore } from "@/store";
import Calculadora from "@/components/Calculadora.vue";
import { TaxaEm } from "@/model";
import Grafico from "@/components/Grafico.vue"; // @ is an alias to /src

function diaDoAno(data: Date): number {
  const start = new Date(data.getFullYear(), 0, 0);
  const diff = data - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function sortHistorico(taxas: TaxaEm): Array {
  const hist = Array(366);

  for (const dt in taxas) {
    const tx = taxas[dt];
    const dat = new Date(dt);

    let dias = diaDoAno(dat);
    dias += dat.getFullYear() === (new Date()).getFullYear() ? 365 : 0;

    hist[dias] = { data: dat, rate: tx };
  }

  return hist.filter(el => el != null);
}

@Component({
  store: HomeStore,
  components: {
    Grafico,
    Calculadora
  },
  computed: {
    taxa() {
      return this.$store.state.taxa;
    },
    historico() {
      return this.$store.state.historico;
    },
    alcance() {
      return this.$store.state.alcanceGrafico;
    }
  },
  beforeMount: function() {
    this.$api.forex.getTaxa("BRL", "USD").then(resposta => {
      this.$store.commit("increment", resposta.data.rates["BRL"]);
    });

    const today = new Date();
    const yesteryear = new Date((new Date()).setFullYear(today.getFullYear() - 1));

    this.$api.forex.getHistorico("USD", "BRL", yesteryear, today)
      .then(resposta =>
        this.$store.commit("setHistorico", sortHistorico(resposta.data.rates))
      );
  },
  methods: {
    mudarAlcance: function (alcance) {
      this.$store.commit("setAlcance", alcance);
    }
  }
})
export default class Home extends Vue {}
</script>
