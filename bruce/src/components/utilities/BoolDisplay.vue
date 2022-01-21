<template>
  <div
    class="rounded-full h-5 w-5 flex justify-center items-center"
    :class="property ? 'bg-success' : 'bg-danger'"
  >
    <img src="/icons/check-lg.svg" v-if="property" />
    <img src="/icons/x-lg.svg" v-if="!property" />
  </div>
</template>

<script>
export default {
  props: {
    property: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
