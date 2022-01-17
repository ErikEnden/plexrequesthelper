<template>
  <navbar v-if="user" />
  <div
    class="flex w-full px-6 py-4"
    :class="[user ? 'content' : 'content-full']"
  >
    <sidebar v-if="user" />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  components: {
    Navbar,
    Sidebar,
  },
  computed: {
    ...mapGetters({ user: "auth/getUser" }),
  },
  mounted() {
    let token = localStorage.getItem("access");
    if (token) {
      axios({
        url: `${process.env.VUE_APP_API_URL}/verify`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.status === 200) {
          this.$store.dispatch("auth/useExistingToken").then(() => {
            this.$router.push("/dashboard");
          });
        }
      });
    } else {
      this.$store.dispatch("auth/logout");
    }
  },
};
</script>
<style lang="scss">
.content-full {
  @apply h-screen w-screen;
}
.content {
  height: calc(100vh - 4rem);
  @apply w-5/6;
  .content-page {
    @apply bg-grey w-full rounded flex flex-col px-3 py-2;
    overflow-y: scroll;
  }
}
</style>
