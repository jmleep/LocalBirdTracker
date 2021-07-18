<template>
  <div>
    <Nav class="nav-container" />
    <router-view />
  </div>
</template>

<script setup>
import Nav from "./components/Nav.vue";
</script>

<style>
body {
  margin: 0;
}

.nav-container {
  padding: 15px 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  width: 100%;
  margin: auto;
  overflow-x: hidden;
}
</style>
