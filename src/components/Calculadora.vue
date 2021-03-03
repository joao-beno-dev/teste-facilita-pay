<template>
  <div class="row flex-center flex-inline">
    <div class="col-5 row flex-center">
      <input v-model.lazy="valorAntes" v-moeda="moedaDe" class="valor text-center" />
    </div>
    <div class="col-2">
      <q-icon name="compare_arrows" size="xl" class="text-primary" />
    </div>
    <div class="col-5 row flex-center">
      <input v-model.lazy="valorDepois" v-moeda="moedaPara" class="valor text-center" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { CalculadoraStore } from "@/store";
import { VMoney as Money } from "v-money";

// Classe para servir de interface com a lib, e simplificar a definição das moedas
class BaseMoney {
  decimal = ";";
  thousands = ".";
  prefix = "€ ";
  suffix = "";
  precision = 2;
  masked = false;

  constructor(thousands: string, prefix: string, decimal: string) {
    this.thousands = thousands;
    this.prefix = prefix;
    this.decimal = decimal;
  }
}

/**
 * Componente sem nenhuma lógica direta, ele apenas recebe um valor "Number", e o exibe formatado conforme a moeda.
 */
@Component({
  store: CalculadoraStore,
  props: {
    valorConverter: Number,
    valorConvertido: Number,
    simboloUm: String,
    simboloDois: String,
  },
  data: function() {
    return {
      valorAntes: this.$props.valorConverter.toFixed(2),
      valorDepois: this.$props.valorConvertido.toFixed(2),
      atualizandoA: false,
      atualizandoB: false,
      moedaDe: {},
      moedaPara: {},
      moedas: {
        BRL: new BaseMoney(".", "R$ ", ","),
        USD: new BaseMoney(",", "US$ ", "."),
        EUR: new BaseMoney(",", "€ ", ".")
      }
    };
  },
  mounted() {
    this.$data.moedaDe = this.$data.moedas[this.$props.simboloUm];
    this.$data.moedaPara = this.$data.moedas[this.$props.simboloDois];
  },
  watch: {
    valorAntes: function(val) {
      console.log(`0: ${val}`);
      if (this.$data.atualizandoB) return;
      this.suspenderEventos("A");
      console.log(`1: ${val}`);
      this.$emit("antes", val);
    },
    valorDepois: function(val) {
      console.log(`9: ${val}`);
      if (this.$data.atualizandoA) return;
      this.suspenderEventos("B");
      console.log(`10: ${val}`);
      this.$emit("depois", val);
    },
    valorConverter: function(val) {
      if (this.$data.atualizandoA) return;
      console.log(`8b: ${val}`);
      this.$data.valorAntes = val.toFixed(2);
    },
    valorConvertido: function(val) {
      if (this.$data.atualizandoB) return;
      console.log(`8a: ${val}`);
      this.$data.valorDepois = val.toFixed(2);
    },
    simboloUm: function(val) {
      this.$data.moedaDe = this.$data.moedas[val];
    },
    simboloDois: function(val) {
      this.$data.moedaPara = this.$data.moedas[val];
    }
  },
  directives: {
    moeda: Money
  },
  methods: {
    suspenderEventos: function(sabor: string) {
      this.$data[`atualizando${sabor}`] = true;
      Vue.nextTick((sab = sabor) => {
        console.warn("tick");
        this.$data[`atualizando${sab}`] = false;
      });
    }
  }
})
export default class Calculadora extends Vue {}
</script>

<style scoped lang="scss">
.valor {
  font-family: "Montserrat", "Roboto Thin", sans-serif;
  font-weight: 100;
  font-size: 96px;
  border: none;
  color: rgba(0, 0, 0, 0.4);
  text-decoration: none;
  width: 100%;
  &:focus {
    outline: none;
  }
}
h4 {
  font-family: "Montserrat", "Roboto Thin", sans-serif;
  font-weight: 100;
  font-size: 96px;
  width: 40%;
  color: rgba(0, 0, 0, 0.25);
}
</style>
