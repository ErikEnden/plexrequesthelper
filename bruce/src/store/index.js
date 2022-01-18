import { createStore } from "vuex";
import { auth } from "./modules/auth.module";
import { staticdata } from "./modules/staticdata.module";

export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, staticdata },
});
