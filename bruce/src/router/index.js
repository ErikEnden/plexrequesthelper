import { createRouter, createWebHistory } from "vue-router";
import { store } from "@/store/index";
import Login from "@/views/Login";
import Dashboard from "@/views/Dashboard";
import Search from "@/views/Search";
import Requests from "@/views/Requests";
import Settings from "@/views/Settings";

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
    meta: {
      public: false,
    },
  },
  {
    path: "/requests",
    name: "Requests",
    component: Requests,
    meta: {
      public: false,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      public: false,
    },
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
