<template>
  <div id="app">
    <q-layout class="">
      <q-header elevated class="bg-purple">
        <q-toolbar class="text-white">
          <q-btn flat round dense icon="menu" @click="acaoBtnMenu" />
          <q-toolbar-title>
            Teste - Vue
          </q-toolbar-title>
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
      </q-header>

      <q-drawer
        :value="menu"
        overlay
        :width="350"
        :breakpoint="700"
        elevated
        content-class="bg-primary text-white">

        <q-scroll-area class="fit">
          <q-list>
            <template v-for="(menuItem, index) in menuList">
              <q-item :key="index" clickable v-ripple :to="menuItem.link" active-class="text-white bg-orange" exact>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </template>

          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page class="q-mt-xl">
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Home</router-link>-->
    <!--      |-->
    <!--      <router-link to="/about">About</router-link>-->
    <!--    </div>-->

  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script lang="ts">
import Vue from "vue";
import { AppStore } from "@/store/App";
import { mapActions } from "vuex";
import Component from "vue-class-component";

const menuList = [
  {
    icon: "home",
    label: "Inicio",
    separator: true,
    link: "/"
  },
  {
    icon: "quiz",
    label: "Sobre",
    separator: false,
    link: "/about"
  },
  {
    icon: "question_answer",
    label: "Sobre",
    separator: false,
    link: "/sobre"
  },
  {
    icon: "help",
    label: "Sobre",
    separator: false,
    link: "/saiba-mais"
  },
];

export default Vue.extend({
  store: AppStore,
  name: "App",
  data: function() {
    return {
      menuList: menuList
    };
  },
  computed: {
    menu() {
      return this.$store.state.menu;
    }
  },
  methods: {
    ...mapActions({
      acaoBtnMenu: "alternarMenu"
    })
  },
  watch: {
    $route(to, from) {
      this.$store.commit("toggleMenu");
    }
  }
});
</script>
