<template>
  <Nav />
  <div class="about-container">
    <h2>About</h2>
    <p>This application was made with Vite and Vue.js and uses the eBird API</p>
    <p>© 2020 Jordan Leeper</p>
  </div>
</template>

<script setup>
import Nav from "/src/components/Nav.vue";
</script>

<style scoped>
.about-container {
  display: flex;
  flex-flow: column;
  align-items: center;
}
</style>