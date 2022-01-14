<template>
  <nav>
    <div class="logo">Plex Request Helper</div>
    <div class="search">
      <input placeholder="🔎 Search" class="w-96" />
    </div>
    <div class="user-menu">
      <div class="rounded-full bg-grey-light h-12 w-12"></div>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
nav {
  @apply h-16 flex items-center justify-between px-6 bg-grey;
  .logo {
    @apply w-56 flex items-center;
  }
  .search {
    @apply flex flex-grow justify-center items-center;
  }
  .user-menu {
    @apply w-56 flex justify-end items-center;
  }
}
</style>
