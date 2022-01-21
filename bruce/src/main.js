import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import "@/assets/styles/main.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import BoolDisplay from "@/components/utilities/BoolDisplay";

createApp(App)
  .use(store)
  .use(router)
  .component("bool-display", BoolDisplay)
  .mount("#app");
