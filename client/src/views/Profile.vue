<template>
  <Form
    :isAuthRequired="false"
    formTitle="Registrarse"
    :formModel="newItemFormModel"
    @submit="createAccount"
  />
</template>
<script setup>
import { RouterLink } from "vue-router";
import { useRoute } from "vue-router";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store.js";
import Form from "@/components/Form.vue";

import { ref } from "vue";
const router = useRouter();
const authStore = useAuthStore();

const newItemFormModel = ref({
  publication_name: {
    tag: "input",
    type: "text",
    placeholder: "Ingrese nombre de producto",
    name: "producto",
    label: "Nombre",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
  stock_initial: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
    name: "stockinicial",
    label: "Cantidad",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
    min: 1,
    max: 100,
  },
  price: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
    name: "precio",
    label: "Precio",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
    min: 1,
    max: 1000000,
  },
  photo: {
    tag: "input",
    type: "file",
    placeholder: "Agrega foto de producto",
    name: "foto",
    label: "Foto",
    value: null,
    rules: {
      pattern: {
        value: /([a-zA-Z0-9\s_\\.\-\(\):])+(.jpg|.jpeg|.png)$/i,
        message:
          "Debe tener extensión .jpg, .jpeg o .png y no puede pesar mas que 200KB",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
  description: {
    tag: "textarea",
    type: null,
    placeholder: "Descripción del producto",
    name: "descripcion",
    label: "Describe su producto",
    value: null,
    rules: {
      pattern: {
        value: /.*\S.*/,
        message: "No puede estar vacío",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
});
const createAccount = async (payload) => {
  const id = authStore.getUser().user_id;
  const token = authStore.getUserToken();
  console.log(token);

  const itemPayload = {
    ...payload,
    seller_id: id,
    stock_available: payload.stock_initial,
  };

  console.log(itemPayload);
  try {
    const { data } = await axios.post(
      `https://mercado-api-m4ay.onrender.com/new-item`,

      itemPayload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    router.push("/");
  } catch (e) {
    console.log(e);
  }
};
</script>
