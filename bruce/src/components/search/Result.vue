<template>
  <div class="flex mb-2">
    <div class="flex w-1/12">
      <img :src="posterUrl" class="rounded shadow" />
    </div>
    <div class="flex flex-col w-11/12 pl-3">
      <div class="flex items-center">
        <h3>{{ title }}</h3>
        <div class="rating-label">{{ data.vote_average }}</div>
        <a
          :href="`https://themoviedb.org/movie/${data.id}`"
          class="tmdb-link mr-3"
          target="_blank"
        >
          <img src="/tmdb.svg" class="h-8 w-8" />
        </a>
        <button class="btn btn-success w-40" @click="createRequest">
          Create request
        </button>
      </div>

      <p class="mb-2">{{ data.overview }}</p>
      <div class="flex items-center" v-if="genreList">
        <div v-for="item in genreList" :key="item" class="genre-tag">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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
  methods: {
    createRequest() {
      this.$store.dispatch("request/openCreateRequestModal", {
        data: this.data,
        poster: this.posterUrl,
      });
    },
  },
  computed: {
    title() {
      return `${this.data.title} (${
        this.data.release_date
          ? this.data.release_date.split("-")[0]
          : "No release date"
      })`;
    },
    posterUrl() {
      if (this.data.poster_path) {
        return `${this.imageConfig.secure_base_url}${this.imageConfig.poster_sizes[2]}${this.data.poster_path}`;
      } else {
        return `https://via.placeholder.com/130x195`;
      }
    },
    ...mapGetters({
      tvGenres: "staticdata/tvGenres",
      movieGenres: "staticdata/movieGenres",
    }),
    genreList() {
      if (this.movieGenres) {
        return this.data.genre_ids.map(
          (x) => this.movieGenres.genres.find((y) => y.id === x).name
        );
      } else {
        return [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.rating-label {
  @apply bg-accent rounded p-1 mx-3;
}
.genre-tag {
  @apply rounded bg-accent px-1 mr-2;
}
</style>
