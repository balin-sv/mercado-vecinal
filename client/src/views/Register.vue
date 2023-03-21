<template>
  <Form
    :isAuthRequired="false"
    formTitle="Registrarse"
    :formModel="registerFormModel"
    @submit="createAccount"
  />
  <p class="mt-5">
    ¿Tienes cuenta?
    <RouterLink to="/login">Login</RouterLink>
  </p>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store.js";
import Form from "@/components/Form.vue";
import axios from "axios";

import { ref } from "vue";
const router = useRouter();
const authStore = useAuthStore();

const registerFormModel = ref({
  nombre: {
    tag: "input",
    type: "text",
    placeholder: "Ingrese su nombre",
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
  email: {
    tag: "input",
    type: "email",
    placeholder: "Ingrese su email",
    label: "Email",
    value: null,
    rules: {
      pattern: {
        value: /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i,
        message: "Ingrese un email válido",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
  password: {
    tag: "input",
    type: "password",
    placeholder: "Ingrese su contraseña",
    label: "Password",
    value: null,
    rules: {
      pattern: {
        value: /^[a-zA-Z0-9]{3,10}$/,
        message: "Ingrese una contraseña válida",
      },
    },
    errorMsg: null,
    isPayload: true,
  },
  password_repeat: {
    tag: "input",
    type: "password",
    placeholder: "Repite su contraseña",
    label: "Pepite su contraseña",
    value: null,
    rules: null,
    errorMsg: null,
    isPayload: false,
  },
});

const createAccount = async (payload) => {
  try {
    const { data } = await axios.post(
      `https://mercado-api-m4ay.onrender.com/new-user`,
      payload
    );
    const loginPayload = {
      email: payload.email,
      password: payload.password,
    };
    authStore.logIn(loginPayload);
    router.push("/");
  } catch (e) {
    console.log(e);
  }
};
</script>
