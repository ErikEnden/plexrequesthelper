<template>
  <div class="flex flex-col rounded bg-grey-dark">
    <div class="grid grid-cols-4 rounded-t bg-grey-light p-2 font-medium">
      <div class="flex">Login</div>
      <div class="flex">Name</div>
      <div class="flex">Give admin</div>
    </div>
    <user-request-list-item
      v-for="user in userRequests"
      :key="user.id"
      :user="user"
      @usersUpdated="handleUsersUpdated"
    />
    <span v-if="userRequests && userRequests.length === 0" class="p-2">
      No new user requests
    </span>
  </div>
</template>

<script>
import axios from "axios";
import UserRequestListItem from "./UserRequestListItem";

export default {
  data() {
    return {
      userRequests: null,
    };
  },
  components: {
    UserRequestListItem,
  },
  methods: {
    retrieveUserRequestList() {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_API_URL}auth/users/requests/list`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }).then((res) => {
        this.userRequests = res.data;
      });
    },
    handleUsersUpdated() {
      this.$emit("usersUpdated");
    },
  },
  mounted() {
    this.retrieveUserRequestList();
  },
};
</script>

<style></style>
