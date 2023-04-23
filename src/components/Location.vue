<template>
  <div class="location-data">
    <div class="location-item">
      <div>Latitude:</div>
      <div>{{ userLat.toFixed(4) }}</div>
    </div>
    <div class="location-item">
      <div>Longitude:</div>
      <div>{{ userLon.toFixed(4) }}</div>
    </div>
    <div class="location-item">
      <div>Region code:</div>
      <div>{{ regionCode }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLocation from '../composables/location'

const { regionCode, userLat, userLon } = useLocation()
</script>

<style>
.location-item {
  display: flex;
  flex-flow: row;
  gap: 20px;
}

.location-item div:nth-child(1) {
  width: 100px;
  font-weight: 800;
}
</style>
