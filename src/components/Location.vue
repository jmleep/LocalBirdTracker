<template>
  <div class="location-data">
    <div class="location-item">
      <div>Latitude:</div>
      <div>{{ lat.toFixed(4) }}</div>
    </div>
    <div class="location-item">
      <div>Longitude:</div>
      <div>{{ lon.toFixed(4) }}</div>
    </div>
    <div class="location-item">
      <div>Region code:</div>
      <div>{{ regionCode }}</div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const regionCode = computed(() => store.state.location.regionCode);
const lat = computed(() => store.state.location.userLat);
const lon = computed(() => store.state.location.userLon);
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