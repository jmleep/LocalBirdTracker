<template>
  <sl-radio-group
    :label="label"
    :name="name"
    :value="model"
    @sl-change="$emit('update:modelValue', $event.target.value)"
  >
    <template v-for="item in items" :key="item.value">
      <sl-radio :value="item.value" :checked="item.value === model">{{ item.label }}</sl-radio>
    </template>
  </sl-radio-group>
</template>

<script setup lang="ts">
type IRadioItem = { value: string; label: string }
// @ts-ignore
const model = defineModel()

defineProps<{ items: IRadioItem[]; name: string; label: string }>()
</script>
