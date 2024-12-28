<template>
  <div class="nav-container">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.nav-container {
  display: flex;
  flex-flow: row;
  align-items: flex-end;
  justify-content: flex-end;
}

.nav-container a {
  padding-right: 15px;
}
</style>
