<template>
  <Form
    :isAuthRequired="false"
    formTitle="Login"
    :formModel="loginFormModel"
    @submit="login"
  />
  <p class="mt-5">
    ¿Aún no tienes cuenta?
    <RouterLink to="/register">Registrarme</RouterLink>
  </p>
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

const loginFormModel = ref({
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
});

const login = async (payload) => {
  console.log("in login ");
  try {
    authStore.logIn(payload).then(async (res) => {
      if (res) {
        const isUser = await authStore.getUserToken();
        console.log(isUser);
        if (isUser) {
          router.push("/");
        } else {
          router.push("/profile");
        }

        router.push("/");
      } else {
        //temporal
        location.reload();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
</script>
