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
      <h4>Name</h4>
      <input class="w-full" v-model="user.name" />
      <h4>Login</h4>
      <input class="w-full" v-model="user.login" />
      <h4>Password</h4>
      <input class="w-full" v-model="user.password" type="password" />
      <h4>Admin?</h4>
      <input class="mb-4" type="checkbox" v-model="user.isAdmin" />
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
        console.log(res);
      });
    },
  },
};
</script>

<style></style>
