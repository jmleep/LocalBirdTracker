<template>
  <div class="error">{{ message }}</div>
</template>

<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<style>
.error {
  background-color: #af5a56;
  color: #fff;
  padding: 10px;
}
</style>
