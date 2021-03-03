<template>
  <div class="row">
    <div class="col-5 content-center">
      <SymbolSelect :list="list" :selected="selected[0]" :disabled="selected[1]" v-on:set-moeda="setMoedaUm" />
    </div>
    <div class="col-2">
      <q-btn round color="primary" icon="fas fa-exchange-alt" @click="atualizarMoedas" />
    </div>
    <div class="col-5">
      <SymbolSelect :list="list" :selected="selected[1]" :disabled="selected[0]" v-on:set-moeda="setMoedaDois" />
    </div>
  </div>
</template>

<script>
import SymbolSelect from "@/components/SymbolSelect";
export default {
  name: "SymbolPicker",
  components: { SymbolSelect },
  props: {
    list: Array,
    selected: Array
  },
  methods: {
    atualizarMoedas: function() {
      this.$emit("switch-coins");
    },
    setMoedaUm: function(val) {
      if (val !== this.$props.selected[1]) {
        this.$emit("set-first-currency", val);
      }
    },
    setMoedaDois: function(val) {
      if (val !== this.$props.selected[0]) {
        this.$emit("set-second-currency", val);
      }
    }
  }
};
</script>

<style scoped>

</style>
