<style scoped>
.grafico {
  height: 300px;
}
</style>

<template>
  <div class="home container">
    <SymbolPicker :list="['BRL', 'USD', 'EUR']" :selected="[simboloUm, simboloDois]" v-on:switch-coins="switchCoins"
      v-on:set-first-currency="setFirstCurrency" v-on:set-second-currency="setSecondCurrency"/>
    <Calculadora
      :valor-converter="valorUm"
      :valor-convertido="valorDois"
      v-on:antes="atualizarAntes"
      :simbolo-um="simboloUm"
      :simbolo-dois="simboloDois"
      v-on:depois="atualizarDepois"
      class="row flex-center"
    />
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
import { Taxa, TaxaEm } from "@/model";
import Grafico from "@/components/Grafico.vue";
import SymbolPicker from "@/components/SymbolPicker.vue"; // @ is an alias to /src

/**
 * Obtem o dia aproximado do ano de uma determinada Data.
 * Usado apenas para ordenar o histórico de cotações
 * @param {Date} data - A data a contar os dias.
 * @returns {number} a posição aproximada da data no ano.
 */
function diaDoAno(data: Date): number {
  const start = new Date(data.getFullYear(), 0, 0);
  const diff = data - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Ordena a resposta da API de acordo com a data das Cotações.
 * @param {TaxaEm} taxas - Dicionário com as datas e as cotações.
 * @returns {Array} Retorna uma array com as cotações.
 */
function sortHistorico(taxas: TaxaEm): Array<{ data: Date; rate: Taxa }> {
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
    SymbolPicker,
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
    },
    valorUm() {
      return this.$store.state.valueBefore;
    },
    valorDois() {
      return this.$store.state.valueAfter;
    },
    simboloUm() {
      return this.$store.state.symbolFrom;
    },
    simboloDois() {
      return this.$store.state.symbolTo;
    }
  },
  mounted: function() {

    this.refreshQuotes();

    this.refreshHistory();

  },
  methods: {
    mudarAlcance: function(alcance) {
      this.$store.commit("setAlcance", alcance);
    },
    atualizarAntes: function(val) {
      console.log(`2a: ${val}`);
      const numVal = (typeof val === "number") ? val : Number.parseFloat(val.replace(/[.,](?=\d{3})|(^.{1,3}\s)/g, "").replace(/[,](?=\d{2}$)/g, "."));
      console.log(`3a: ${numVal}`);
      this.$store.commit("setValueBefore", numVal);
      this.$store.dispatch("converterAB");
    },
    atualizarDepois: function(val) {
      console.log(`2b: ${val}`);
      const numVal = (typeof val === "number") ? val : Number.parseFloat(val.replace(/[.,](?=\d{3})|(^.{1,3}\s)/g, "").replace(/[,](?=\d{2}$)/g, "."));
      console.log(`3b: ${numVal}`);
      this.$store.commit("setValueAfter", numVal);
      this.$store.dispatch("converterBA");
    },
    switchCoins: function() {
      const tempSymbol = this.$store.state.symbolFrom;
      const tempValue = this.$store.state.valueBefore;

      this.$store.commit("setValueBefore", this.$store.state.valueAfter);
      this.$store.commit("setValueAfter", tempValue);

      this.$store.commit("setSymbolFrom", this.$store.state.symbolTo);
      this.$store.commit("setSymbolTo", tempSymbol);

      Promise.allSettled([this.refreshQuotes(), this.refreshHistory()]).then(() => {
        this.$store.dispatch("converterAB");
      });
    },
    refreshQuotes: function(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) =>
          this.$api.forex.getTaxa(this.$store.state.symbolFrom, this.$store.state.symbolTo)
        .then(resposta => {
          this.$store.commit("setTaxa", resposta.data.rates[this.$store.state.symbolFrom]);
        }).finally(() => resolve(true))
      );
    },
    refreshHistory: function(): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        const today = new Date();
        const yesteryear = new Date((new Date()).setFullYear(today.getFullYear() - 1));

        this.$api.forex.getHistorico(this.$store.state.symbolTo, this.$store.state.symbolFrom, yesteryear, today)
            .then(resposta =>
                this.$store.commit("setHistorico", sortHistorico(resposta.data.rates))
            )
            .finally(() => resolve(true));
      });
    },
    setFirstCurrency: function(val) {
      this.$store.commit("setSymbolFrom", val);
      Promise.allSettled([this.refreshQuotes(), this.refreshHistory()]).then(() => {
        this.$store.dispatch("converterAB");
      });
    },
    setSecondCurrency: function(val) {
      this.$store.commit("setSymbolTo", val);
      Promise.allSettled([this.refreshQuotes(), this.refreshHistory()]).then(() => {
        this.$store.dispatch("converterAB");
      });
    }
  }
})
export default class Home extends Vue {}
</script>
