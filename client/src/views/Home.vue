<template>
  <div>
    <MainLayout>
      <template #page-title>
        <h1>Home</h1>
      </template>
      <div class="d-flex justify-content-around container flex-wrap">
        <div
          v-for="(item, i) in itemsList"
          :key="i"
          class="card mt-5"
          style="width: 18rem"
        >
          <img
            src="https://d2qem9mw3cct22.cloudfront.net/images/spree/images/7028/attachments/large/4411118.jpg?1524252898"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">{{ item.producto }}</h5>
            <p class="card-text">
              {{ item.descripcion }}
            </p>
            <a href="#" class="btn btn-primary">Reservar</a>
          </div>
        </div>
      </div>
    </MainLayout>
  </div>
</template>
<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const itemsList = ref([]);

const props = defineProps({
  tableTitle: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
});

console.log(props.isAdmin);
const getItems = async () => {
  return new Promise(async (resolve, reject) => {
    axios
      .get("http://localhost:5000/publicaciones")
      .then((res) => {
        setTimeout(async () => {
          itemsList.value = res.data.data;
          console.log(itemsList.value);
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
