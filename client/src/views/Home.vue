<template>
  <div>
    <h1>Home</h1>
    <div class="d-flex justify-content-around container flex-wrap">
      <div
        v-for="(item, i) in list"
        :key="i"
        class="card mt-5"
        style="width: 18rem"
      >
        <img
          :src="
            item.photo
              ? `http://localhost:5000/public/images/${item.photo}`
              : `@/assets/img/jabon.jpg`
          "
          style="width: 100%; height: 200px; object-fit: contain"
          class="card-img-top"
          alt="foto"
        />
        <div class="card-body">
          <h5 class="card-text">
            <span class="font-weight-bold">Vendedor</span>: {{ item.name }}
          </h5>
          <h6 class="card-title">
            <span class="font-weight-bold">Producto</span>:
            {{ item.publication_name }}
          </h6>
          <h6 class="card-title">
            <span class="font-weight-bold">Stock</span>:
            {{
              item.stock_available
                ? item.stock_available - item.value
                : item.stock_available
            }}
          </h6>
          <h6 class="card-title">
            <span class="font-weight-bold">Precio</span>: {{ item.price }} CLP
          </h6>
          <div className="d-flex flex-row justify-content-between ">
            <div className="d-flex flex-nowrap">
              <button
                className="btn-count btn btn-secondary"
                @click="addItem(item.publication_id)"
              >
                +
              </button>
              <input
                :value="item.value"
                @input="item.value = $event.target.value"
                type="number"
                class="w-50 mr-2 ml-2"
              />
              <button
                className="btn-count btn btn-secondary"
                @click="removeItem(item.publication_id)"
              >
                -
              </button>
            </div>

            <button
              class="btn btn-warning ml-2"
              @click="openDetailModal(item.publication_id)"
            >
              Detalles
            </button>
          </div>
          <div style="height: 40px" class="mt-3">
            <RouterLink
              class="btn btn-success mt-2"
              v-show="item.value > 0"
              to="/cart"
            >
              Reservar
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal>
    <template v-slot:title>
      <span>{{ "Detalles de producto" }}</span>
    </template>
    <div>
      <img
        :src="
          itemDetailes.photo
            ? `http://localhost:5000/public/images/${itemDetailes.photo}`
            : ``
        "
        style="width: 100%; height: 200px; object-fit: contain"
        class="card-img-top"
        alt="foto"
      />

      <h6 class="card-title mt-5">
        <span class="font-weight-bold">Producto</span>:
        {{ itemDetailes.publication_name }}
      </h6>
      <h6 class="card-title">
        <span class="font-weight-bold">Precio</span>:
        {{ itemDetailes.price }} CLP
      </h6>
      <h6 class="card-title">
        <span class="font-weight-bold">Detalle</span>:
        {{ itemDetailes.description }}
      </h6>
    </div>
    <template v-slot:btn> </template>
  </Modal>
</template>
<script setup>
import Modal from "@/components/Modal.vue";
import { ref, computed, watch } from "vue";
import { useCartStore } from "@/stores/cart-store.js";
import { useAuthStore } from "@/stores/auth-store.js";

import axios from "axios";

const itemsList = ref([]);
const cartStore = useCartStore();
const authStore = useAuthStore();
const itemDetailes = ref({});

const props = defineProps({
  tableTitle: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
});

const list = computed(() => {
  const cartList = itemsList.value.filter((item) => item.value > 0);
  cartStore.setCartList(cartList);
  return itemsList.value;
});

const addItem = (id) => {
  const item = itemsList.value.find((item) => item.publication_id === id);
  if (item.value < item.stock_available) {
    item.value++;
  } else if (!item.value) {
    item.value = 1;
  }
};

const removeItem = (id) => {
  const item = itemsList.value.find((item) => item.publication_id === id);
  if (item.value > 0) {
    item.value--;
  } else if (!item.value) {
    item.value = 0;
  }
};

watch(
  () => itemsList.value,
  (newVal, prevVal) => {
    newVal.forEach((element) => {
      if (typeof element.value === "string") {
        const arr = element.value.split("");
        const regex = /^[1-9a-zA-Z][0-9a-zA-Z]*$/; // 1-99
        const checked = arr
          .filter((str) => {
            return regex.test(str) === true;
          })
          .join("");

        const num = parseInt(checked);

        num > element.stock_available
          ? (element.value = element.stock_available)
          : num < 0
          ? (element.value = 0)
          : (element.value = num);
      }
    });
  },
  { deep: true }
);

const getItems = async () => {
  return new Promise(async (resolve, reject) => {
    axios
      .get("https://mercado-api-m4ay.onrender.com/publications")
      .then((res) => {
        console.log(res.data);
        setTimeout(async () => {
          const modifData = res.data.map((obj) => {
            return { ...obj, value: 0 };
          });
          itemsList.value = modifData;
          resolve(true);
        }, 2000);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const openDetailModal = async (id) => {
  try {
    const res = await axios.get(`https://mercado-api-m4ay.onrender.com/publication/${id}`, {
      headers: { authToken: authStore.getUserToken() },
    });
    if (res.status === 200) {
      console.log(res.data[0]);
      itemDetailes.value = res.data[0];
      $("#modal").modal();
    } else {
      await getPublications();
    }
  } catch (e) {
    console.log(e);
  }
};

await getItems();
</script>
