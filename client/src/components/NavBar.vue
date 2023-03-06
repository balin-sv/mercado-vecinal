<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-warning">
    <RouterLink class="navbar-brand logo" to="/">Mercado Vecinal</RouterLink>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <RouterLink class="nav-item mr-5 text-secondary" to="/"
          >Home</RouterLink
        >

        <RouterLink
          v-if="!isAdmin"
          class="nav-item mr-5 text-secondary"
          to="/register"
          >Registrate</RouterLink
        >
        <RouterLink
          v-if="!isAdmin"
          class="nav-item mr-5 text-secondary"
          to="/login"
          >Login</RouterLink
        >
        <RouterLink
          v-if="isAdmin"
          class="nav-item mr-5 text-secondary"
          to="/profile"
          >Publicar</RouterLink
        >

        <RouterLink
          v-if="isAdmin"
          class="nav-item mr-5 text-secondary"
          to="/admin"
          >Mis Publicaciones</RouterLink
        >

        <RouterLink
          v-if="isAdmin"
          class="nav-item mr-5 text-secondary"
          to="/admin"
          >Mis Compras</RouterLink
        >
      </ul>
      <button
        v-if="isAdmin"
        type="button"
        class="btn btn-secondary"
        @click="logout"
      >
        Cerrar sesion
      </button>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth-store.js";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isAdmin = computed(() => {
  return authStore.getUserToken();
});

const logout = async (e) => {
  e.preventDefault();
  try {
    authStore.logOut().then(async (res) => {
      if (res) {
        router.push("/");
      } else {
        //temporal
        // location.reload();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
</script>
<style scoped>
.logo {
  padding: 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
