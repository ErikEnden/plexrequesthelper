<template>
  <div class="content-page">
    <div class="flex">
      <button
        class="btn btn-danger w-16"
        @click="$router.push('/settings#users')"
      >
        Back
      </button>
    </div>
    <div class="flex flex-col w-1/2 mx-auto items-center">
      <h3>Add new user</h3>
      <div class="flex w-full">
        <h4>Name</h4>
      </div>
      <input class="w-full p-1 mb-2" v-model="user.name" />
      <div class="flex w-full">
        <h4>Login</h4>
      </div>
      <input class="w-full p-1 mb-2" v-model="user.login" />
      <div class="flex w-full">
        <h4>Password</h4>
      </div>
      <input class="w-full mb-2 p-1" v-model="user.password" type="password" />
      <div class="flex w-full items-center mb-4">
        <h4 class="mr-4">Is an admin</h4>
        <input type="checkbox" v-model="user.isAdmin" class="h-5 w-5" />
      </div>
      <button class="w-40 h-8 btn btn-success" @click="createUser">
        Create user
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: "",
        login: "",
        password: "",
        isAdmin: false,
      },
    };
  },
  methods: {
    createUser() {
      this.$store.dispatch("auth/createUser", this.user).then((res) => {
        if (res.status === 201) this.$router.push("/settings");
      });
    },
  },
};
</script>

<style></style>
