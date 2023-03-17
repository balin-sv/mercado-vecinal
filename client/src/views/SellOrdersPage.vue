<template>
  <h2>Mis Ventas</h2>
  <Table>
    <template v-slot:thead>
      <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
    </template>
    <table-body-rows
      :tableRows="tableRows"
      :tableHeaders="tableHeaders"
    ></table-body-rows>
  </Table>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store.js";
import axios from "axios";
import Table from "@/components/Table.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
library.add(faCircleExclamation);

const tableRows = ref();
const authStore = useAuthStore();

const tableHeaders = ref([
  { value: "name", title: "comprador" },
  { value: "publication_name", title: "producto" },
  { value: "photo", title: "foto" },
  { value: "amount", title: "cantidad" },
  { value: "price", title: "precio" },
  { value: "total_price", title: "valor total" },
  { value: "reserve_date", title: "fecha de venta" },
  { value: "estado", title: "estado" },
]);

const getPublications = async () => {
  const id = authStore.getUser().user_id;
  console.log(id);
  console.log(authStore.getUserToken());
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        "http://localhost:5000/user-sell-orders",
        { id },
        { headers: { authToken: authStore.getUserToken() } }
      )
      .then((res) => {
        setTimeout(async () => {
          console.log(res.data);
          tableRows.value = res.data;
          resolve(true);
        }, 2000);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          authStore.logOut();
          resolve(true);
        } else {
          reject(err);
        }
      });
  });
};

await getPublications();
</script>
