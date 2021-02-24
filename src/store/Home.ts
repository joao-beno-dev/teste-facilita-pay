import Vue from "vue";
import Vuex from "vuex";
import { GraficoAlcance } from "@/enum";

Vue.use(Vuex);

export const HomeStore = new Vuex.Store({
  state: {
    taxa: 0.0,
    symbolFrom: "BRL",
    symbolTo: "USD",
    valueBefore: 0.0,
    valueAfter: 0.0,
    alcanceGrafico: GraficoAlcance.TRIMESTRE,
    historico: []
  },
  mutations: {
    increment(state, taxa) {
      state.taxa = taxa;
    },
    setSymbolFrom(state, value) {
      state.symbolFrom = value;
    },
    setSymbolTo(state, value) {
      state.symbolTo = value;
    },
    setValueBefore(state, value) {
      state.valueBefore = value;
    },
    setValueAfter(state, value) {
      state.valueAfter = value;
    },
    convertFromTo(state) {
      state.valueAfter = state.valueBefore * state.taxa;
    },
    convertToFrom(state) {
      state.valueBefore = state.valueAfter / state.taxa;
    },
    setHistorico(state, historico) {
      state.historico = historico;
    },
    setAlcance(state, alcance) {
      state.alcanceGrafico = alcance;
    }
  },
  actions: {},
  modules: {}
});
