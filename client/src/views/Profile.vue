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
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store.js";
import Form from "@/components/Form.vue";

import { ref } from "vue";
const router = useRouter();
const authStore = useAuthStore();

const newItemFormModel = ref({
  producto: {
    tag: "input",
    type: "text",
    placeholder: "Ingrese nombre de producto",
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
  stockinicial: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
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
  precio: {
    tag: "input",
    type: "number",
    placeholder: "Ingrese cantidad de producto",
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
  descripcion: {
    tag: "textarea",
    type: null,
    placeholder: "Descripción del producto",
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
</script>
