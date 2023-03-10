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
        :tableHeaders="tableHeaders"
        :isAdmin="isAdmin"
        @agentUpdate="agentUpdate"
      ></table-body-rows>
    </tbody>
  </table>
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
import TableTitle from "@/components/TableTitle.vue";
import TableBodyRows from "@/components/TableBodyRows.vue";
import TableHeaderRow from "@/components/TableHeaderRow.vue";
import { useAuthStore } from "@/stores/auth-store.js";
import { ref, computed } from "vue";
import axios from "axios";

const authStore = useAuthStore();

const props = defineProps({
  tableTitle: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
  tableRows: {
    type: Array,
  },
  tableHeaders: {
    type: Array,
  },
});

const total = computed(() => {
  let total = 0;
  props.tableRows.forEach((item) => {
    total += item.value * item.precio;
  });
  return total;
});
// const getPublicaciones = async () => {
//   const id = authStore.getUser().userid;
//   console.log(id);
//   return new Promise(async (resolve, reject) => {
//     axios
//       .post(
//         "http://localhost:5000/user-publicaciones",
//         { id },
//         { headers: { authToken: authStore.getUserToken() } }
//       )
//       .then((res) => {
//         setTimeout(async () => {
//           tableRows.value = res.data.data;
//           console.log(tableRows.value);
//           tableHeaders.value = [];
//           Object.entries(res.data.table_headers).forEach(([key, value]) => {
//             tableHeaders.value.push({ value: key, title: value });
//           });
//           resolve(true);
//         }, 2000);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

const updateStatus = async (id, val) => {
  try {
    const res = await axios.put(`http://localhost:5000/admin/${id}`, {
      is_confirmed: val,
    });
  } catch (e) {
    console.log(e);
  }
};

const agentUpdate = async (id) => {
  emit("updateCart", id);
};

const emit = defineEmits(["updateCart"]);
</script>
