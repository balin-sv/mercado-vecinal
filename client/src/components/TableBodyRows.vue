<template>
  <tr v-for="(item, index) in tableRows" :key="index">
    <td scope="row">{{ index + 1 }}</td>
    <td v-for="(header, index) in tableHeaders">
      <img
        v-if="header.value === 'photo'"
        :src="
          item.photo
            ? `http://localhost:5000/public/images/${item.photo}`
            : `@/assets/img/jabon.jpg`
        "
        style="width: 100%; height: 50px; object-fit: contain"
      />
      <span v-if="header.value === 'acciones'">
        <button
          @click="emit('clickHandler', item, 'edit')"
          type="button"
          class="btn btn-success mr-3"
        >
          Editar
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="emit('clickHandler', item, 'delete')"
        >
          Eliminar
        </button>
      </span>
      <button
        v-if="header.value === 'delete'"
        type="button"
        class="btn btn-danger"
        @click="emit('clickHandler', item)"
      >
        Eliminar
      </button>

      <input
        class="w-50"
        type="number"
        v-if="header.value == 'amount' && !archiveTable"
        v-model="item.value"
      />

      <span v-if="header.value == 'total_price'">{{
        item.value * item.price
      }}</span>
      <span v-if="header.value !== 'photo'">{{ item[header.value] }}</span>
    </td>
  </tr>
  <slot></slot>
</template>

<script setup>
import axios from "axios";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth-store.js";
import { useCartStore } from "@/stores/cart-store.js";

const authStore = useAuthStore();
const cartStore = useCartStore();

const props = defineProps({
  tableRows: {
    type: Array,
  },
  tableHeaders: {
    type: Array,
  },
  isAdmin: {
    type: Boolean,
  },
});

const emit = defineEmits(["clickHandler"]);

const archiveTable = computed(() => {
  if (props.tableRows) {
    return props.tableRows.find((item) => item.total_price) ? true : false;
  } else {
    return;
  }
});

watch(
  () => props.tableRows,
  (newVal, prevVal) => {
    newVal.forEach((element) => {
      console.log(element);
      if (element.value === "" || !element.value) {
        element.value = 1;
      } else {
        element.value > element.stock_initial
          ? (element.value = element.stock_available)
          : element.value < 0
          ? (element.value = 1)
          : (element.value = element.value);
      }
    });
  },
  { deep: true }
);
</script>
