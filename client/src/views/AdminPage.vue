<template>
  <div>
    <TableLayout>
      <Table
        :isAdmin="true"
        :tableRows="tableRows"
        :tableHeaders="tableHeaders"
        tableTitle="Mis Publicaciones"
      />
    </TableLayout>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store.js";
import axios from "axios";
import Table from "@/components/Table.vue";
import TableLayout from "@/layouts/TableLayout.vue";
const tableRows = ref();

const authStore = useAuthStore();

const tableHeaders = ref([
  { value: "vendedorid", title: "vendedorID" },
  { value: "producto", title: "producto" },
  { value: "foto", title: "foto" },
  { value: "stockinicial", title: "stockInicial" },
  { value: "stockdisponible", title: "stockDisponible" },
  { value: "precio", title: "precio" },
  { value: "acciones", title: "acciones" },
]);

const getPublicaciones = async () => {
  const id = authStore.getUser().userid;
  console.log(id);
  return new Promise(async (resolve, reject) => {
    axios
      .post(
        "http://localhost:5000/user-publicaciones",
        { id },
        { headers: { authToken: authStore.getUserToken() } }
      )
      .then((res) => {
        setTimeout(async () => {
          tableRows.value = res.data.data;
          console.log(tableRows.value);
          // tableHeaders.value = [];
          // Object.entries(res.data.table_headers).forEach(([key, value]) => {
          //   tableHeaders.value.push({ value: key, title: value });
          // });
          // console.log(tableHeaders.value);
          resolve(true);
        }, 2000);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const updateStatus = async (id, val) => {
  // console.log(id);
  // console.log(userData.value);

  // if (userData.value.password != newPassword.value) {
  //   return;
  // }
  try {
    const res = await axios.put(
      `http://localhost:5000/admin/${id}`,
      {
        is_confirmed: val,
      }
      // { headers: { authToken: authStore.getUserToken() } }
    );
  } catch (e) {
    console.log(e);
  }
};

await getPublicaciones();
</script>
