<template>
  <div class="flex flex-col rounded bg-grey-dark">
    <div class="flex rounded-t bg-grey-light p-2 font-medium">
      <div class="flex w-1/6">Name</div>
      <div class="flex w-1/6">Login</div>
      <div class="flex w-1/6">Last login</div>
      <div class="flex w-1/6">Admin</div>
      <div class="flex w-1/6">Active</div>
    </div>
    <user-list-item
      v-for="user in users"
      :key="user.id"
      :user="user"
      @usersUpdated="handleUsersUpdated"
    />
    <div class="flex p-2">
      <button class="btn btn-success w-24" @click="$router.push('/users/new')">
        Add user
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import UserListItem from "./UserListItem";

export default {
  data() {
    return {
      users: null,
    };
  },
  components: {
    UserListItem,
  },
  methods: {
    retrieveUserList() {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_API_URL}auth/users/list/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }).then((res) => {
        this.users = res.data;
      });
    },
    handleUsersUpdated() {
      this.retrieveUserList();
    },
  },
  mounted() {
    this.retrieveUserList();
  },
};
</script>

<style></style>
