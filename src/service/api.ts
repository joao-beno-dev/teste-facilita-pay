import Vue from "vue";
import Forex from "@/service/forex";

// export default {
//   install: (Vue: any, options: any[]) => {
//     Vue.prototype.$api = {
//       forex: Forex(Vue.axios)
//     };
//   }
// };

export default (Vue: any, options: any[]) => {
  Vue.prototype.$api = {
    forex: Forex(Vue.axios)
  };
};
