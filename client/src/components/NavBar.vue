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
          to="/orders"
          >Mis Compras</RouterLink
        >
        <RouterLink
          v-if="isAdmin"
          class="nav-item mr-5 text-secondary"
          to="/list"
          >Mis Ventas</RouterLink
        >
      </ul>
      <RouterLink
        class="test nav-item mr-5 text-secondary"
        v-if="isAdmin"
        to="/cart"
      >
        <div class="cart">{{ itemsInCart }}</div>
        <font-awesome-icon size="2xl" icon="fa-solid fa-cart-arrow-down" />
      </RouterLink>

      <button
        v-if="isAdmin"
        type="button"
        class="btn btn-secondary ml-5"
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
import { useCartStore } from "@/stores/cart-store.js";
/* add fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* add some free styles */
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";

library.add(faCartArrowDown);
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const isAdmin = computed(() => {
  return authStore.getUserToken();
});

const itemsInCart = computed(() => {
  const arr = cartStore.getCart();

  return arr.reduce((acc, item) => {
    return acc + item.value;
  }, 0);
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
<style scoped>
.cart {
  color: #fff;
  margin-left: 12px;
  margin-bottom: 12px;

  font-weight: bold;
  position: absolute;
  left: 6;
  top: -2;
  font-size: 0.6rem;
  background-color: #ba000d;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 20%;
}

.test {
  position: relative;
  margin-left: 6px;
}
</style>
