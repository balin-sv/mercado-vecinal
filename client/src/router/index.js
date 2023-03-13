import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { useNotyf } from "@/composable/useNotyf";
const notif = useNotyf();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      meta: {
        layout: "TableLayout",
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
      meta: {
        layout: "FormLayout",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/Register.vue"),
      meta: {
        layout: "FormLayout",
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/Profile.vue"),
      meta: {
        layout: "FormLayout",
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminPage.vue"),
      meta: {
        layout: "TableLayout",
      },
    },
    {
      path: "/cart",
      name: "cart",
      component: () => import("../views/CartPage.vue"),
      meta: {
        layout: "TableLayout",
      },
    },
  ],
});

router.beforeEach(async (to, from) => {
  console.log("in router");
  const authStore = useAuthStore();
  const isUserToken = await authStore.getUserToken();
  console.log(isUserToken);

  // if (!isAdmin && to.name == "admin") {
  //   notif.error("entra con sus credenciales");
  //   return { name: "login" };
  // }

  // if (!isUser.value && to.name == "profile") {
  //   notif.error("entra con sus credenciales");
  //   return { name: "login" };
  // }
});
export default router;
