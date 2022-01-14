import axios from "axios";

export const auth = {
  namespaced: true,
  state: {
    user: null,
  },
  mutations: {
    login(state, user) {
      state.user = user;
      localStorage.set("access", user);
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
            url: `${process.env.VUE_APP_API_URL}/login`,
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
  },
  getters: {
    getUser: (state) => {
      return state.user ?? false;
    },
  },
};
