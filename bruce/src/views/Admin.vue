<template>
  <div class="content-page">
    <h3>Admin panel</h3>
    <div class="flex flex-col">
      <h4 class="mb-2">Users</h4>
      <user-manager class="mb-4" ref="userManager"></user-manager>
      <h4 class="mb-2">User requests</h4>
      <user-request-manager
        ref="userRequestManager"
        @usersUpdated="handleUsersUpdated"
      ></user-request-manager>
    </div>
  </div>
</template>

<script>
import UserManager from "@/components/settings/UserManager";
import UserRequestManager from "../components/settings/UserRequestManager.vue";
export default {
  components: {
    UserManager,
    UserRequestManager,
  },
  methods: {
    handleUsersUpdated() {
      this.$refs.userManager.retrieveUserList();
      this.$refs.userRequestManager.retrieveUserRequestList();
    },
  },
};
</script>

<style></style>
