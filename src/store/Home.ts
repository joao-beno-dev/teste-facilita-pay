import Vue from "vue";
import Vuex from "vuex";
import { GraficoAlcance } from "@/enum";

Vue.use(Vuex);

export const HomeStore = new Vuex.Store({
  state: {
    taxa: 0.0,
    symbolFrom: "USD",
    symbolTo: "BRL",
    valueBefore: 0.0,
    valueAfter: 0.0,
    alcanceGrafico: GraficoAlcance.TRIMESTRE,
    historico: []
  },
  mutations: {
    setTaxa(state, taxa) {
      state.taxa = taxa;
    },
    setSymbolFrom(state, value) {
      state.symbolFrom = value;
    },
    setSymbolTo(state, value) {
      state.symbolTo = value;
    },
    setValueBefore(state, value) {
      console.log(`4: ${value}`);
      state.valueBefore = value;
    },
    setValueAfter(state, value) {
      state.valueAfter = value;
    },
    convert(state, invert = false) {
      if (invert) {
        console.log(`6b:\n\tantes: ${state.valueBefore}\n\tdepois: ${state.valueAfter}`);
        state.valueBefore = state.valueAfter * state.taxa;
        console.info(`--> Taxa: ${state.taxa}`);
        console.log(`7b:\n\tantes: ${state.valueBefore}\n\tdepois: ${state.valueAfter}`);
      } else {
        console.log(`6a:\n\tantes: ${state.valueBefore}\n\tdepois: ${state.valueAfter}`);
        state.valueAfter = state.valueBefore / state.taxa;
        console.info(`--> Taxa: ${state.taxa}`);
        console.log(`7a:\n\tantes: ${state.valueBefore}\n\tdepois: ${state.valueAfter}`);
      }
    },
    setHistorico(state, historico) {
      state.historico = historico;
    },
    setAlcance(state, alcance) {
      state.alcanceGrafico = alcance;
    }
  },
  actions: {
    converterAB(store) {
      console.log("5: converter A -> B");
      store.commit("convert");
    },
    converterBA(store) {
      console.log("5: converter A <- B");
      store.commit("convert", true);
    }
  },
  modules: {}
});
