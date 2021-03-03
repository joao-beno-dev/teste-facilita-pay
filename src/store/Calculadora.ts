import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const CalculadoraStore = new Vuex.Store({
  state: {
    valorAntes: 0.0,
    valorDepois: 0.0
  },
  mutations: {
    updateAntes(state, valor) {
      state.valorAntes = valor;
    },
    updateDepois(state, valor) {
      state.valorDepois = valor;
    }
  }
});
