<template>
  <button type="button" :class="['btn', buttonStyle]"><slot></slot></button>
</template>
<script setup>
const props = defineProps({ buttonStyle: { type: String } });
</script>
