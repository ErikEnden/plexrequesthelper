<template>
  <nav>
    <div class="logo">Plex Request Helper</div>
    <div class="search">
      <button
        @click="$store.commit('search/toggleMediaType')"
        class="btn btn-accent w-20 p-2"
      >
        {{ mediaType === "movie" ? "Movie" : "TV" }}
      </button>
      <input
        placeholder="🔎 Search"
        class="w-96 mx-2"
        :value="searchQuery"
        @input="updateSearchQuery"
        @focus="attachSearchListener"
        @blur="detachSearchListener"
      />
      <button @click="performSearch" class="btn btn-accent w-20 p-2">
        Search
      </button>
    </div>
    <div class="user-icon">
      <div
        class="rounded-full bg-grey-light h-12 w-12 cursor-pointer flex items-center justify-center"
        @click="displayUserMenu = !displayUserMenu"
      >
        {{ user.decoded.name[0] }}
      </div>
    </div>
    <div class="user-menu" v-if="displayUserMenu">
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
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
        this.performSearch();
      }
    },
    performSearch() {
      this.$store.dispatch("search/executeSearch").then(() => {
        if (this.$route.name !== "Search") this.$router.push("/search");
      });
    },
    updateSearchQuery(e) {
      this.$store.commit("search/updateSearchQuery", e.target.value);
    },
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push("/");
      });
    },
  },
  computed: {
    ...mapState({
      searchQuery: (state) => state.search.searchQuery,
    }),
    ...mapGetters({
      user: "auth/getUser",
      mediaType: "search/mediaType",
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
