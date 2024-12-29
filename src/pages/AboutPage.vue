<template>
  <div class="about-container">
    <h2>About</h2>
    <br />
    Data is sourced from Cornell University's bird tracking software eBird.
    <a :href="eBirdLink" target="_blank">
      Enter your own sightings and track birds in more detail using their application
    </a>
    <br />

    <p>This application was made with Vite and Vue.js and uses the eBird API</p>
    <p>© 2020-2024 Jordan Leeper</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let eBirdLink = ref('https://ebird.org/home')
const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
if (/android/i.test(userAgent)) {
  eBirdLink.value =
    'https://play.google.com/store/apps/details?id=edu.cornell.birds.ebird&hl=en_US&gl=US'
}

// iOS detection from: http://stackoverflow.com/a/9039885/177710
if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
  eBirdLink.value = 'https://apps.apple.com/us/app/ebird/id988799279'
}
</script>

<style scoped>
.about-container {
  display: flex;
  flex-flow: column;
  align-items: center;
}
</style>
