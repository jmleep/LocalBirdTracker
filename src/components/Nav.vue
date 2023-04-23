<template>
  <div class="nav-container">
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
  </div>
</template>

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
