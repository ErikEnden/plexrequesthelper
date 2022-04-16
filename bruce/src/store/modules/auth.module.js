import axios from "axios";
import jwtDecode from "jwt-decode";

export const auth = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    login(state, user) {
      state.user = { token: user.access, decoded: jwtDecode(user.access) };
      localStorage.setItem("access", user.access);
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("access");
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        {
          axios({
            method: "post",
            data: {
              login: user.login,
              password: user.password,
            },
            url: `${process.env.VUE_APP_API_URL}auth/login`,
          })
            .then((res) => {
              commit("login", res.data);
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        }
      });
    },
    logout({ commit }) {
      return new Promise((res) => {
        commit("logout");
        res();
      });
    },
    useExistingToken({ commit }) {
      return new Promise((resolve) => {
        commit("login", { access: localStorage.getItem("access") });
        resolve();
      });
    },
    createUser(context, user) {
      return axios({
        method: "post",
        data: user,
        url: `${process.env.VUE_APP_API_URL}auth/users/create`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
    requestUser(context, user) {
      return axios({
        method: "post",
        data: user,
        url: `${process.env.VUE_APP_API_URL}auth/users/requests/new`,
      });
    },
    deleteUser(context, userId) {
      return axios({
        method: "post",
        data: userId,
        url: `${process.env.VUE_APP_API_URL}auth/users/delete`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
    deactivateUser(context, userId) {
      return axios({
        method: "post",
        data: userId,
        url: `${process.env.VUE_APP_API_URL}auth/users/deactivate`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
    reactivateUser(context, userId) {
      return axios({
        method: "post",
        data: userId,
        url: `${process.env.VUE_APP_API_URL}auth/users/reactivate`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
    processUser(context, data) {
      return axios({
        method: "post",
        data: data,
        url: `${process.env.VUE_APP_API_URL}auth/users/requests/process`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
  },
  getters: {
    getUser: (state) => {
      return state.user ?? null;
    },
  },
};
