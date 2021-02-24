import Vue from "vue";
import Vuex from "vuex";
import { GraficoAlcance, GraficoMode } from "@/enum";

Vue.use(Vuex);

export const GraficoStore = new Vuex.Store({
  state: {
    data: {},
    labels: [],
    options: {},
    mode: GraficoMode.SINGLE_SYMBOL
  },
  mutations: {
    updateData(state, data) {
      state.data = data;
    },
    updateOptions(state, options) {
      state.options = options;
    },
    setMode(state, mode) {
      state.mode = mode;
    }
  },
  actions: {},
  modules: {}
});
