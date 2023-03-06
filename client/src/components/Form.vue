<template>
  <hr class="w-50" />
  <form>
    <div class="form-group row w-50 m-auto">
      <div class="form-group col-12 col-sm-6">
        <label>Nombre</label>
        <input v-model="formData.producto" class="form-control m-auto" />
      </div>

      <div class="form-group form-group col-12 col-sm-6">
        <label>Descripcion</label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          v-model="formData.descripcion"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group col-12 col-sm-6">
        <label>Precio</label>
        <input class="form-control m-auto" v-model="formData.precio" />
      </div>
      <div class="form-group col-12 col-sm-6">
        <label>Cantidad</label>
        <input class="form-control m-auto" v-model="formData.stockInicial" />
      </div>
    </div>
    <div class="mb-1">
      <button
        @click="
          (e) => {
            e.preventDefault();
            createAccount();
          }
        "
        class="btn btn-primary"
      >
        Publicar Producto
      </button>
    </div>
  </form>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth-store.js";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();
const formData = ref({
  vendedorID: "",
  producto: "",
  descripcion: "",
  stockInicial: "",
  precio: "",
});

const props = defineProps({
  isAuthRequired: {
    type: Boolean,
    required: true,
  },
  formTitle: {
    type: String,
    required: true,
  },
});

const createAccount = async () => {
  console.log(formData.value);
  const id = authStore.getUser().userid;
  try {
    const { data } = await axios.post(`http://localhost:5000/new-item`, {
      vendedorid: id,
      producto: formData.value.producto,
      foto: null,
      descripcion: formData.value.descripcion,
      stockinicial: formData.value.stockInicial,
      stockdisponible: formData.value.stockInicial,
      precio: formData.value.precio,
    });
    router.push("/");
  } catch (e) {
    console.log(e);
  }
};
</script>
