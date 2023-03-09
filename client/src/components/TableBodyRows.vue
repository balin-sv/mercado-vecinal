<template>
  <tr v-for="(item, index) in tableRows" :key="index">
    <td scope="row">{{ index + 1 }}</td>
    <td>{{ item.vendedorid }}</td>
    <td>{{ item.producto }}</td>
    <td>
      <img
        :src="
          item.foto
            ? `http://localhost:5000/public/images/${item.foto}`
            : `@/assets/img/jabon.jpg`
        "
        style="width: 100%; height: 50px; object-fit: contain"
      />
    </td>
    <td>{{ item.stockinicial }}</td>
    <td>{{ item.stockdisponible }}</td>
    <td>{{ item.precio }}</td>
    <td>
      <button type="button" class="btn btn-success mr-3">Editar</button>
      <button
        type="button"
        class="btn btn-danger"
        @click="test(item.publicacionid)"
      >
        Eliminar
      </button>
    </td>
  </tr>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "@/stores/auth-store.js";

const authStore = useAuthStore();

const props = defineProps({
  tableRows: {
    type: Array,
  },
  isAdmin: {
    type: Boolean,
  },
});

const test = async (id) => {
  console.log(id);
  try {
    const { data } = await axios.delete(
      `http://localhost:5000/delete-publicacion/${id}`,
      { headers: { authToken: authStore.getUserToken() } }
    );
    location.reload();
  } catch (e) {
    console.log(e);
  }
};

const emit = defineEmits(["update"]);
</script>
