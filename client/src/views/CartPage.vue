<template>
  <div>
    <Table
      :isAdmin="true"
      :tableRows="tableRows"
      :tableHeaders="tableHeaders"
      tableTitle="Mis Publicaciones"
      @updateCart="updateCart"
    />
    <button class="btn btn-success ml-2">Reservar</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "@/stores/cart-store.js";
import { onBeforeMount } from "vue";
import Table from "@/components/Table.vue";

const tableRows = ref();
const cartStore = useCartStore();

const tableHeaders = ref([
  { value: "producto", title: "producto" },
  { value: "foto", title: "foto" },
  { value: "cantidad", title: "cantidad" },
  { value: "precio", title: "precio" },
  { value: "total", title: "valor total" },
  { value: "delete", title: "eliminar" },
]);

onBeforeMount(async () => {
  tableRows.value = cartStore.getCart();
});

const updateCart = async (id) => {
  cartStore.removeItemFromCart(id);
  tableRows.value = cartStore.getCart();
};
</script>
