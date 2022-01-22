<template>
  <nav>
    <div class="logo">Plex Request Helper</div>
    <div class="search">
      <input
        placeholder="🔎 Search"
        class="w-96"
        v-model="searchQuery"
        @focus="attachSearchListener"
        @blur="detachSearchListener"
      />
    </div>
    <div class="user-icon">
      <div
        class="rounded-full bg-grey-light h-12 w-12 cursor-pointer flex items-center justify-center"
        @click="displayUserMenu = !displayUserMenu"
      ></div>
    </div>
    <div class="user-menu" v-if="displayUserMenu">
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchQuery: "",
      displayUserMenu: false,
    };
  },
  methods: {
    attachSearchListener() {
      window.addEventListener("keydown", this.keystrokeHandler);
    },
    detachSearchListener() {
      window.removeEventListener("keydown", this.keystrokeHandler);
    },
    keystrokeHandler(e) {
      if (e.keyCode === 13) {
        this.$router.push(`/search?q=${this.searchQuery}`);
      }
    },
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push("/");
      });
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
};
</script>

<style lang="scss" scoped>
nav {
  @apply h-16 flex items-center justify-between px-6 bg-grey relative;
  .logo {
    @apply w-56 flex items-center;
  }
  .search {
    @apply flex flex-grow justify-center items-center;
  }
  .user-icon {
    @apply w-56 flex justify-end items-center;
  }
  .user-menu {
    @apply absolute w-64 bg-grey-light p-4 flex flex-col rounded-b right-6;
    top: 100%;
  }
}
</style>
