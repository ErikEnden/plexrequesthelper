<template>
  <div class="content-page">
    <h4 v-if="data" class="mb-2">
      Searching for {{ $route.query.q }} ({{ data.total_results }} results)
    </h4>
    <ResultsRenderer :data="this.data" v-if="data"></ResultsRenderer>
  </div>
</template>
<script>
import axios from "axios";
import ResultsRenderer from "@/components/search/ResultsRenderer";
export default {
  data() {
    return {
      query: "",
      data: null,
      page: 1,
    };
  },
  mounted() {
    if (this.$route.query.q) {
      this.query = this.$route.query.q;
      this.searchMovies();
    }
  },
  methods: {
    searchMovies() {
      axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/search/movie?api_key=${process.env.VUE_APP_TMDB_KEY}&query=${this.query}&page=${this.page}`,
      }).then((res) => {
        this.data = res.data;
        this.data.results = this.data.results.sort((a, b) => {
          return b.popularity - a.popularity;
        });
      });
    },
  },
  components: { ResultsRenderer },
  watch: {
    "$route.query.q": {
      handler(val) {
        this.query = val;
        this.searchMovies();
      },
    },
  },
};
</script>
<style></style>
