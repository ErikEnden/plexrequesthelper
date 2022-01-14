<template>
  <div class="flex items-center justify-center w-full">
    <div
      class="flex w-96 h-64 bg-grey rounded px-8 flex-col items-center justify-center mb-24"
    >
      <h3 class="mb-4">Login</h3>
      <input
        placeholder="Email"
        class="mb-2 w-full"
        type="email"
        v-model="email"
      />
      <input
        placeholder="Password"
        class="mb-4 w-full"
        type="password"
        v-model="password"
      />
      <button class="btn btn-accent" @click="login">Login</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.email && this.password)
        this.$store
          .dispatch("auth/login", {
            email: this.email,
            password: this.password,
          })
          .then(() => {
            this.$router.push("/dashboard");
          });
    },
  },
};
</script>

<style></style>
