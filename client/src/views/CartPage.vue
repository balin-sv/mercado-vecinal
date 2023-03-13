<template>
  <h2>Carrito de Compras</h2>
  <Table>
    <template v-slot:thead>
      <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
    </template>
    <table-body-rows
      :tableRows="tableRows"
      :tableHeaders="tableHeaders"
      @clickHandler="openDeleteModal"
    ></table-body-rows>
  </Table>
  <hr v-if="total" class="container" />
  <div
    v-if="total"
    class="container d-flex direction-row justify-content-between pr-5"
  >
    <h3>Total:</h3>
    <h5>{{ total }}</h5>
  </div>
  <Modal>
    <template v-slot:title>
      <span> Confirma la accion </span>
    </template>
    <p>{{ deleteText }}</p>
    <font-awesome-icon size="2xl" icon="fa-solid fa-circle-exclamation" />
    <template v-slot:btn>
      <button-custom buttonStyle="btn-success" @click="updateCart">
        Eliminar
      </button-custom>
      <button-custom buttonStyle="btn-danger" data-dismiss="modal"
        >Cancelar</button-custom
      >
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cart-store.js";
import { onBeforeMount } from "vue";
import Modal from "@/components/Modal.vue";
import Table from "@/components/Table.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import ButtonCustom from "@/components/ButtonCustom.vue";
/* add fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* add some free styles */
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleExclamation);

const tableRows = ref();
const cartStore = useCartStore();
const deleteText = ref("");
const itemToDelete = ref();

const tableHeaders = ref([
  { value: "producto", title: "producto" },
  { value: "foto", title: "foto" },
  { value: "cantidad", title: "cantidad" },
  { value: "precio", title: "precio" },
  { value: "total", title: "valor total" },
  { value: "delete", title: "eliminar" },
]);

const total = computed(() => {
  let total = 0;
  if (!tableRows.value) {
    return;
  } else {
    tableRows.value.forEach((item) => {
      total += item.value * item.precio;
    });
    return total;
  }
});

onBeforeMount(async () => {
  tableRows.value = cartStore.getCart();
});

const updateCart = async () => {
  cartStore.removeItemFromCart(itemToDelete.value.publicacionid);
  tableRows.value = cartStore.getCart();
  $("#modal").modal("hide");
};

const openDeleteModal = async (item) => {
  itemToDelete.value = item;
  deleteText.value = "Desea eliminar el producto " + item.producto + "?";
  $("#modal").modal();
};
</script>
