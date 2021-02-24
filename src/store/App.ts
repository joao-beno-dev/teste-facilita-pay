import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const AppStore = new Vuex.Store({
  state: {
    menu: false
  },
  mutations: {
    toggleMenu(state) {
      state.menu = !state.menu;
    }
  },
  actions: {
    alternarMenu(contexto) {
      contexto.commit("toggleMenu");
    }
  },
  modules: {}
});
