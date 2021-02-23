<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" :msgd="taxa" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  store: store,
  components: {
    HelloWorld
  },
  computed: {
    taxa() {return this.$store.state.taxa}
  },
  beforeMount: function() {
    this.$api.forex.getTaxa("BRL", "USD").then((resposta) => {
      store.commit("increment", resposta.data.rates["BRL"]);
    });
  }
})
export default class Home extends Vue {}
</script>
