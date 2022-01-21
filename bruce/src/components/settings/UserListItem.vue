<template>
  <div class="flex p-2">
    <div class="flex w-1/6">{{ user.name }}</div>
    <div class="flex w-1/6">{{ user.login }}</div>
    <div class="flex w-1/6">{{ lastLogin }}</div>
    <div class="flex w-1/6">
      <bool-display :property="user.is_admin" />
    </div>
    <div class="flex w-1/6">
      <bool-display :property="user.is_active" />
    </div>
    <div class="flex w-1/6 justify-end">
      <button
        class="btn btn-danger w-24"
        @click="deactivateUser"
        v-if="user.is_active && user.id !== $store.state.auth.user.decoded.id"
      >
        Deactivate
      </button>
      <button
        class="btn btn-success w-24 mr-2"
        @click="reactivateUser"
        v-if="!user.is_active"
      >
        Reactivate
      </button>
      <button
        class="btn btn-danger w-20"
        @click="deleteUser"
        v-if="!user.is_active"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    deactivateUser() {
      this.$store
        .dispatch("auth/deactivateUser", { userId: this.user.id })
        .then((res) => {
          if (res.status === 200) this.$emit("usersUpdated");
        });
    },
    reactivateUser() {
      this.$store
        .dispatch("auth/reactivateUser", { userId: this.user.id })
        .then((res) => {
          if (res.status === 200) this.$emit("usersUpdated");
        });
    },
    deleteUser() {
      this.$store
        .dispatch("auth/deleteUser", { userId: this.user.id })
        .then((res) => {
          if (res.status === 200) this.$emit("usersUpdated");
        });
    },
  },
  computed: {
    lastLogin() {
      if (!this.user.last_login) return "Never";
      return DateTime.fromISO(this.user.last_login)
        .toLocal()
        .toLocaleString(DateTime.DATETIME_SHORT);
    },
  },
};
</script>

<style></style>
