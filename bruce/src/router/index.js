import { createRouter, createWebHistory } from "vue-router";
import { store } from "@/store/index";
import Login from "@/views/Login";
import Search from "@/views/Search";
import Requests from "@/views/Requests";
import Settings from "@/views/Settings";
import AddUser from "@/views/AddUser";

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
    path: "/search",
    name: "Search",
    component: Search,
    meta: {
      public: false,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
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
  {
    path: "/users/new",
    name: "AddUser",
    component: AddUser,
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
