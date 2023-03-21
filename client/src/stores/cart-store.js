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
      // this.cart.push(item);
      if (this.cart.length > 0) {
        this.cart.forEach((obj) => {
          console.log(Object.keys(obj));
        });
      }
    },
    removeItemFromCart(id) {
      const newCart = this.cart.filter((i) => i.publication_id !== id);
      this.cart = newCart;
    },
    setCartList(list) {
      this.cart = list;
    },
    clearCart() {
      this.cart = [];
    },
  },
  persist: true,
});
