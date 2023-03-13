import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),

  getters: {
    getCart: (state) => {
      return () => state.cart;
    },
    getCartLength: (state) => {
      return () => state.cart.length;
    },
  },

  actions: {
    addItemToCart(item) {
      this.cart.push(item);
    },
    removeItemFromCart(id) {
      const newCart = this.cart.filter((i) => i.publicacionid !== id);
      this.cart = newCart;
    },
    setCartList(list) {
      this.cart = list;
    },
  },
  persist: true,
});
