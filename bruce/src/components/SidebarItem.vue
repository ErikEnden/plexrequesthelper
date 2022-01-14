<template>
  <router-link :to="target" class="sidebar-item">
    <span>{{ title }}</span>
  </router-link>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    target: { type: String, default: "/" },
    icon: { type: String, default: "" },
  },
};
</script>

<style lang="scss" scoped>
.sidebar-item {
  @apply flex p-2 duration-100;
  &:hover {
    @apply bg-grey-light cursor-pointer;
  }
  &.router-link-exact-active {
    @apply bg-grey-light text-white;
  }
}
</style>
