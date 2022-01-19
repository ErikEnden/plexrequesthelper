<template>
  <div class="content-page">
    <admin-requests
      v-if="user.decoded.isAdmin && requests"
      :data="requests"
    ></admin-requests>
    <user-requests v-else></user-requests>
  </div>
</template>

<script>
import AdminRequests from "@/components/requests/AdminRequests";
import UserRequests from "@/components/requests/UserRequests";
import { mapGetters } from "vuex";
export default {
  components: { AdminRequests, UserRequests },
  mounted() {
    this.$store.dispatch("request/retrieveRequests");
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      requests: "request/requests",
    }),
  },
};
</script>

<style></style>
