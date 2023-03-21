import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    userToken: "",
  }),

  actions: {
    getUserToken() {
      return this.userToken;
    },
    getUserRol() {
      return this.user.is_admin;
    },
    getUser() {
      return this.user;
    },
    logIn(payload) {
      return new Promise((resolve, reject) => {
        axios
          .post("https://mercado-api-m4ay.onrender.com/login", payload)
          .then((result) => {
            if (result) {
              console.log(result.data);
              this.user = result.data.user;
              this.userToken = result.data.token;
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            resolve(false);
            reject(error);
          });
      });
    },
    logOut() {
      return new Promise((resolve, reject) => {
        this.user = {};
        this.userToken = "";
        resolve(true);
      });
    },
  },
  persist: true,
});
