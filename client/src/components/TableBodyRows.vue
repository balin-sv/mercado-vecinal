<template>
  <tr v-for="(item, index) in tableRows" :key="index">
    <td scope="row">{{ index + 1 }}</td>
    <td>{{ item.vendedorid }}</td>
    <td>{{ item.producto }}</td>
    <td></td>
    <td>{{ item.stockinicial }}</td>
    <td>{{ item.stockdisponible }}</td>
    <td>{{ item.precio }}</td>
    <td><button type="button" class="btn btn-primary">Editar</button></td>
  </tr>
</template>

<script setup>
const props = defineProps({
  tableRows: {
    type: Array,
  },
  isAdmin: {
    type: Boolean,
  },
});

const test = (id, val) => {
  console.log(val);
  emit("update", id, val);
};

const emit = defineEmits(["update"]);
</script>
