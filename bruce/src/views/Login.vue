<template>
  <div class="flex items-center justify-center w-full">
    <div
      class="flex w-96 h-64 bg-grey rounded px-8 flex-col items-center justify-center mb-24 duration-300"
      :class="error.show ? 'h-80' : 'h-64'"
    >
      <h3 class="mb-4">Login</h3>
      <transition name="fade" :duration="{ enter: 300, leave: 100 }">
        <div v-if="error.show" class="bg-danger w-full mb-4 rounded shadow p-2">
          {{ error.message }}
        </div>
      </transition>
      <input
        placeholder="Email"
        class="mb-2 w-full"
        type="email"
        v-model="email"
        @input="this.error.show ? (this.error.show = false) : ''"
      />
      <input
        placeholder="Password"
        class="mb-4 w-full"
        type="password"
        v-model="password"
        @input="this.error.show ? (this.error.show = false) : ''"
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
      error: { show: false, message: "" },
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
          })
          .catch((err) => {
            console.log(err);
            let error = { err };

            if (error.err.response.status === 401) {
              this.error.message = "Incorrect credentials";
              this.error.show = true;
            } else {
              this.error.message = "Something went wrong";
              this.error.show = true;
            }
          });
    },
  },
};
</script>

<style></style>
