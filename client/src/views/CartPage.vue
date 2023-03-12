<template>
  <div>
    <table-title>Cart Page</table-title>
    <table class="table container">
      <thead>
        <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
      </thead>
      <tbody>
        <table-body-rows
          :tableRows="tableRows"
          :tableHeaders="tableHeaders"
          @clickHandler="openDeleteModal"
        ></table-body-rows>
      </tbody>
    </table>
    <Modal>
      <p>{{ deleteText }}</p>
      <template v-slot:btn>
        <button-custom buttonStyle="btn-success" @click="updateCart">
          Eliminar
        </button-custom>
        <button-custom buttonStyle="btn-danger" data-dismiss="modal"
          >Cancelar</button-custom
        >
      </template>
    </Modal>
  </div>
  <hr v-if="total" class="container" />
  <div
    v-if="total"
    class="container d-flex direction-row justify-content-between pr-5"
  >
    <h3>Total:</h3>
    <h5>{{ total }}</h5>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cart-store.js";
import { onBeforeMount } from "vue";
import Modal from "@/components/Modal.vue";
import TableTitle from "@/components/TableTitle.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import ButtonCustom from "@/components/ButtonCustom.vue";

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
  deleteText.value = "Desea eliminar el producto: " + item.producto;
  $("#modal").modal();
};
const defineAction = () => {};
</script>
