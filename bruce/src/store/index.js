import { createStore } from "vuex";
import { auth } from "./modules/auth.module";
import { staticdata } from "./modules/staticdata.module";
import { request } from "./modules/request.module";

export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, staticdata, request },
});
