<template>
  <h2>Carrito de Compras</h2>
  <Table>
    <template v-slot:thead>
      <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
    </template>
    <table-body-rows
      v-for="seller in tableRows"
      :tableRows="seller.data"
      :tableHeaders="tableHeaders"
      @clickHandler="openDeleteModal"
    >
      <tr>
        <td colspan="10">
          <h5>
            POR PRODUCTOS DE VENDEDOR # {{ seller.seller }} :
            {{ seller.total }}
          </h5>
        </td>
      </tr>
    </table-body-rows>
  </Table>
  <div
    v-if="total"
    class="container d-flex direction-row justify-content-between pr-5"
  >
    <h4>TOTAL A PAGAR:</h4>
    <h5>{{ total }} CLP</h5>
  </div>
  <button-custom buttonStyle="btn-success" @click="callapi">
    Reservar productos
  </button-custom>
  <Modal>
    <template v-slot:title>
      <span> Confirma la accion </span>
    </template>
    <p>{{ deleteText }}</p>
    <font-awesome-icon size="2xl" icon="fa-solid fa-circle-exclamation" />
    <template v-slot:btn>
      <button-custom buttonStyle="btn-danger" @click="updateCart">
        Eliminar
      </button-custom>
      <button-custom buttonStyle="btn-success" data-dismiss="modal"
        >Cancelar</button-custom
      >
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cart-store.js";
import { useAuthStore } from "@/stores/auth-store.js";
import axios from "axios";
import { useRouter } from "vue-router";

import { onBeforeMount } from "vue";
import Modal from "@/components/Modal.vue";
import Table from "@/components/Table.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import ButtonCustom from "@/components/ButtonCustom.vue";
import Form from "@/components/Form.vue";

/* add fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* add some free styles */
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleExclamation);

const tableRows = ref();
const cartStore = useCartStore();
const authstore = useAuthStore();
const router = useRouter();
const deleteText = ref("");
const itemToDelete = ref();
const tableHeaders = ref([
  { value: "publication_name", title: "producto" },
  { value: "photo", title: "foto" },
  { value: "amount", title: "cantidad" },
  { value: "price", title: "precio" },
  { value: "total_price", title: "valor total" },
  { value: "delete", title: "eliminar" },
]);

const total = computed(() => {
  let total = 0;
  if (!tableRows.value) {
    return;
  } else {
    tableRows.value.forEach((item) => {
      total += item.total;
    });
    return total;
  }
});

onBeforeMount(async () => {
  ordenCartBySeller();
});

const ordenCartBySeller = () => {
  const arrayToOrden = cartStore.getCart();
  let indexes = [];
  let uniqueIndexes = [];
  arrayToOrden.forEach((item) => {
    indexes.push(item.seller_id);
    uniqueIndexes = indexes.filter((element, index) => {
      return indexes.indexOf(element) === index;
    });
  });
  let resultArray = [];
  uniqueIndexes.forEach((index, i) => {
    let arr = [];
    arr = arrayToOrden.filter((item) => {
      return item.seller_id == index;
    });
    resultArray.push({
      i: i,
      seller: index,
      data: arr,
      total: computed(() => {
        return tableRows.value[i].data.reduce(
          (a, b) => a + b.value * b.price,
          0
        );
      }),
    });
  });
  tableRows.value = resultArray;
};

const updateCart = async () => {
  cartStore.removeItemFromCart(itemToDelete.value.publication_id);
  ordenCartBySeller();
  $("#modal").modal("hide");
};

const openDeleteModal = async (item) => {
  itemToDelete.value = item;
  deleteText.value = "Desea eliminar " + item.publication_name + "?";
  $("#modal").modal();
};

const callapi = async () => {
  const cartToSave = cartStore.getCart();
  const id = authstore.getUser().user_id;

  await cartToSave.forEach(async (order) => {
    const payload = {
      buyer_id: id,
      seller_id: order.seller_id,
      publication_id: order.publication_id,
      price: order.price,
      amount: order.value,
      total_price: order.price * order.value,
      reserve_date: new Date(),
    };
    try {
      const { data } = await axios.post(
        `http://localhost:5000/new-reserve`,
        payload
      );
    } catch (e) {
      console.log(e);
    }
  });

  await cartStore.clearCart();
  router.push("/");
};
</script>
