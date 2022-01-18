import axios from "axios";

export const auth = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    login(state, user) {
      state.user = user;
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
              email: user.email,
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
    useExistingToken({ commit }) {
      return new Promise((resolve) => {
        commit("login", { access: localStorage.getItem("access") });
        resolve();
      });
    },
  },
  getters: {
    getUser: (state) => {
      return state.user ?? false;
    },
  },
};
