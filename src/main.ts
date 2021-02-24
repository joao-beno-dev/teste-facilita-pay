import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import API from "@/service/api";
import "./quasar";

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(vueNumeralFilterInstaller, { locale: "pt-br" });
Vue.use(API, null);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
