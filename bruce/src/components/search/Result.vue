<template>
  <div class="flex mb-2">
    <div class="flex w-1/12">
      <img :src="posterUrl" class="rounded shadow" />
    </div>
    <div class="flex flex-col w-11/12 pl-3">
      <h3>{{ title }}</h3>
      <p>{{ data.overview }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    imageConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    title() {
      return `${this.data.title} (${this.data.release_date})`;
    },
    posterUrl() {
      if (this.data.poster_path) {
        return `${this.imageConfig.secure_base_url}${this.imageConfig.poster_sizes[2]}${this.data.poster_path}`;
      } else {
        return `https://via.placeholder.com/130x195`;
      }
    },
  },
};
</script>

<style></style>
