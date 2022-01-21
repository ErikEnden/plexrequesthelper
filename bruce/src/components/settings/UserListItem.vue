<template>
  <div class="flex p-2">
    <div class="flex w-1/5">{{ user.name }}</div>
    <div class="flex w-1/5">{{ user.email }}</div>
    <div class="flex w-1/5">{{ lastLogin }}</div>
    <div class="flex w-1/5">{{ user.isAdmin }}</div>
    <div class="flex w-1/5 justify-end">
      <button class="btn btn-danger w-20">Delete</button>
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
  computed: {
    lastLogin() {
      return DateTime.fromISO(this.user.last_login)
        .toLocal()
        .toLocaleString(DateTime.DATETIME_SHORT);
    },
  },
};
</script>

<style></style>
