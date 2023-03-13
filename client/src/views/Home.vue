<template>
  <div>
    <MainLayout>
      <template #page-title>
        <h1>Home</h1>
      </template>
      <div class="d-flex justify-content-around container flex-wrap">
        <div
          v-for="(item, i) in list"
          :key="i"
          class="card mt-5"
          style="width: 18rem"
        >
          <img
            :src="
              item.foto
                ? `http://localhost:5000/public/images/${item.foto}`
                : `@/assets/img/jabon.jpg`
            "
            style="width: 100%; height: 200px; object-fit: contain"
            class="card-img-top"
            alt="foto"
          />
          <div class="card-body">
            <h5 class="card-title">{{ item.producto }}</h5>
            <p class="card-text">
              {{ item.descripcion }}
            </p>
            <div className="d-flex flex-row justify-content-between ">
              <div className="d-flex flex-nowrap">
                <button
                  className="btn-count btn btn-secondary"
                  @click="addItem(item.publicacionid)"
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
                  @click="removeItem(item.publicacionid)"
                >
                  -
                </button>
              </div>
              <RouterLink
                v-if="item.value > 0"
                class="btn btn-success ml-2"
                to="/cart"
                >Reservar
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  </div>
</template>
<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useCartStore } from "@/stores/cart-store.js";
import axios from "axios";

const itemsList = ref([]);
const cartStore = useCartStore();

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
  console.log(id);
  console.log(list.value);
  const item = itemsList.value.find((item) => item.publicacionid === id);
  if (item.value < item.stockdisponible) {
    item.value++;
  } else if (!item.value) {
    item.value = 1;
  }
};

const removeItem = (id) => {
  console.log(id);
  const item = itemsList.value.find((item) => item.publicacionid === id);
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

        num > element.stockdisponible
          ? (element.value = element.stockdisponible)
          : num < 0
          ? (element.value = 0)
          : (element.value = num);
      }
    });
  },
  { deep: true }
);

console.log(props.isAdmin);
const getItems = async () => {
  return new Promise(async (resolve, reject) => {
    axios
      .get("http://localhost:5000/publicaciones")
      .then((res) => {
        setTimeout(async () => {
          const modifData = res.data.data.map((obj) => {
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

await getItems();
</script>
