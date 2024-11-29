<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { RouterView } from 'vue-router'
import Sidebar from "./components/Sidebar/index.vue";
import Navbar from "./components/Navbar/Navbar.vue";
import Configurator from "@/views/Configurator.vue";

const store = useStore();
const darkMode = computed(() => store.state.darkMode);
const showSidenav = computed(() => store.state.showSidenav);
const layout = computed(() => store.state.layout);
const isNavFixed = computed(() => store.state.isNavFixed);
const showNavbar = computed(() => store.state.showNavbar);
const isAbsolute = computed(() => store.state.isAbsolute);
const showConfig = computed(() => store.state.showConfig);
const hideConfigButton = computed(() => store.state.hideConfigButton);
const toggleConfigurator = () => store.commit("toggleConfigurator");
const navClasses = computed(() => {
  return {
    "position-sticky bg-white left-auto top-2 z-index-sticky":
        isNavFixed.value && !darkMode.value,
    "position-sticky bg-default left-auto top-2 z-index-sticky":
        isNavFixed.value && darkMode.value,/*暗黑模式*/
    "position-absolute px-4 mx-0 w-100 z-index-2": isAbsolute.value,
    "px-0 mx-4": !isAbsolute.value,
  };
});
</script>

<template>
  <div
      v-show="layout === 'landing'"
      class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>
  <Sidebar v-if="showSidenav" />

  <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
    <Navbar :class="[navClasses]" v-if="showNavbar"/>
    <router-view />
    <configurator :toggle="toggleConfigurator" :class="[showConfig ? 'show' : '', hideConfigButton ? 'd-none' : '']"/>
  </main>
</template>

<style scoped>
</style>
