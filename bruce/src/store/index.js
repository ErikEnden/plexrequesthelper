import { createStore } from "vuex";
import { auth } from "./modules/authentication.module";

export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth },
});
