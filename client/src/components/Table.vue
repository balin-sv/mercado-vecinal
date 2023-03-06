<template>
  <table-title :tableTitle="tableTitle"></table-title>
  <table class="table container">
    <thead>
      <table-header-row :tableHeaders="tableHeaders"> </table-header-row>
    </thead>
    <tbody>
      <table-body-rows
        @update="updateStatus"
        :tableRows="tableRows"
        :isAdmin="isAdmin"
      ></table-body-rows>
    </tbody>
  </table>
</template>

<script setup>
import TableTitle from "@/components/TableTitle.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import { useAuthStore } from "@/stores/auth-store.js";
import { ref } from "vue";
import axios from "axios";

const authStore = useAuthStore();
const tableRows = ref([]);
const tableHeaders = ref();

const props = defineProps({
  tableTitle: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
});

const getPublicaciones = async () => {
  const id = authStore.getUser().userid;
  console.log(id);
  return new Promise(async (resolve, reject) => {
    axios
      .post("http://localhost:5000/user-publicaciones", { id }, { headers: { authToken: authStore.getUserToken() } })
      .then((res) => {
        setTimeout(async () => {
          tableRows.value = res.data.data;
          console.log(tableRows.value);
          tableHeaders.value = [];
          Object.entries(res.data.table_headers).forEach(([key, value]) => {
            tableHeaders.value.push({ value: key, title: value });
          });
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
