<template>
  <div>
    <Nav class="nav-container"></Nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Nav from './components/Nav.vue'
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
