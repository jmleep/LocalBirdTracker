<template>
  <div class="radio">
    <label v-for="item in items" :key="item.value">
      <input
        type="radio"
        :value="item.value"
        :checked="item.value == modelValue"
        @change="$emit('update:modelValue', item.value)"
      />
      <span></span>
      {{ item.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
type IRadioItem = { value: string; label: string }
defineProps<{ modelValue: string; items: IRadioItem[] }>()
</script>

<style scoped>
.radio {
  display: flex;
  flex-flow: column;
}

.radio input[type='radio'] {
  display: none;
  /*removes original button*/
}

.radio label:before {
  /*styles outer circle*/
  content: ' ';
  display: inline-block;
  position: relative;
  top: 5px;
  margin: 0 5px 0 0;
  width: 16px;
  height: 16px;
  border-radius: 11px;
  border: 2px solid #3b597d;
  background-color: transparent;
}

.radio label {
  position: relative;
}

.radio label input[type='radio']:checked + span {
  /*styles inside circle*/
  border-radius: 11px;
  width: 12px;
  height: 12px;
  position: absolute;
  top: 9px;
  left: 4px;
  display: block;
  background-color: #567eaf;
}
</style>
