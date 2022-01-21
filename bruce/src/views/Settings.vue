<template>
  <div class="content-page">
    <h3>Settings</h3>
    <div class="flex flex-col">
      <h4>Users</h4>
      <user-manager></user-manager>
    </div>
  </div>
</template>

<script>
import UserManager from "@/components/settings/UserManager";
export default {
  components: {
    UserManager,
  },
};
</script>

<style></style>
