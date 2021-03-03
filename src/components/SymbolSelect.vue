<template>
  <q-btn color="primary" :label="selected">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup v-for="symbol in list" :key="symbol" :class="symbol === selected ? 'hidden' : null">
          <q-item-section
            :disabled="symbol === disabled ? '' : null"
            @click="trocarMoeda(symbol)"
          >
            {{ symbol }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: "SymbolSelect",
  props: {
    list: Array,
    selected: String,
    disabled: String
  },
  methods: {
    trocarMoeda: function(val) {
      this.$emit("set-moeda", val);
    }
  }
};
</script>

<style scoped>

</style>
