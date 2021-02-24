<template>
  <div>
    <h2>{{ taxa }}</h2>
<!--    <ul>-->
<!--      <template v-for="(taxa, data) in historico">-->
<!--        <li :key="data">-->
<!--          <b> {{ data }}: </b> {{ taxa }}-->
<!--        </li>-->
<!--      </template>-->
<!--    </ul>-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Calculadora extends Vue {
  @Prop() private taxa!: number;
}
</script>

<style scoped lang="scss"></style>
