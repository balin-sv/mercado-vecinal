<template>
  <h2><slot></slot></h2>
</template>
<script setup>
const props = defineProps({ tableTitle: { type: String } });
</script>
