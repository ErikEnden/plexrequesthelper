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
        placeholder="Login"
        class="mb-2 w-full"
        :class="v$.loginField.$error ? 'ring-2 ring-danger' : ''"
        type="text"
        v-model="loginField"
        @input="this.error.show ? (this.error.show = false) : ''"
        @keyup.enter="$refs.password.focus"
      />
      <input
        placeholder="Password"
        class="mb-4 w-full"
        type="password"
        :class="v$.password.$error ? 'ring-2 ring-danger' : ''"
        v-model="password"
        ref="password"
        @keyup.enter="login"
        @input="this.error.show ? (this.error.show = false) : ''"
      />
      <button class="btn btn-accent h-8 w-24" @click="login">Login</button>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loginField: "",
      password: "",
      error: { show: false, message: "" },
    };
  },
  methods: {
    login() {
      this.v$.$touch();
      if (this.loginField && this.password)
        this.$store
          .dispatch("auth/login", {
            login: this.loginField,
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
  validations: {
    loginField: { required },
    password: { required },
  },
};
</script>

<style></style>
