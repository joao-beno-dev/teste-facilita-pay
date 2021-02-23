import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    taxa: 1
  },
  mutations: {
    increment(state, taxa) {
      state.taxa = taxa;
    }
  },
  actions: {},
  modules: {}
});
