<template>
  <div class="error">{{ message }}</div>
</template>

<script>
export default {
  props: {
    message: String,
  },
  setup() {},
};
</script>

<style>
.error {
  background-color: #af5a56;
  color: #fff;
  padding: 10px;
}
</style>