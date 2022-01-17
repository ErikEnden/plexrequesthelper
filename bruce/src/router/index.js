import { createRouter, createWebHistory } from "vue-router";
import { store } from "@/store/index";
import Login from "@/views/Login";
import Dashboard from "@/views/Dashboard";
import Search from "@/views/Search";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      public: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      public: false,
    },
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.public) {
    next();
  } else {
    if (store.getters["auth/getUser"]) {
      next();
    } else {
      next("/");
    }
  }
});

export default router;
