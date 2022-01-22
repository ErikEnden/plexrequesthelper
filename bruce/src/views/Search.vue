<template>
  <div class="content-page">
    <h4 v-if="data" class="mb-2">
      Searching for {{ $route.query.q }} ({{ data.total_results }} results)
    </h4>
    <ResultsRenderer
      :data="data"
      :existingRequests="existingRequests"
      v-if="data"
    ></ResultsRenderer>
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
      existingRequests: [],
      page: 1,
    };
  },
  mounted() {
    this.retrieveExisting();
    if (this.$route.query.q) {
      this.query = this.$route.query.q;
      this.searchMovies();
    }
    if (!this.movieGenres) this.$store.dispatch("staticdata/getMovieGenres");
    if (!this.tvGenres) this.$store.dispatch("staticdata/getTVGenres");
  },
  methods: {
    searchMovies() {
      axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/search/movie?api_key=${process.env.VUE_APP_TMDB_KEY}&query=${this.query}&page=${this.page}`,
      }).then((res) => {
        this.data = res.data;
      });
    },
    retrieveExisting() {
      axios({
        method: "GET",
        url: `${process.env.VUE_APP_API_URL}requests/existing`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }).then(
        (res) =>
          (this.existingRequests = res.data.existing_requests.map((x) =>
            parseInt(x.tmdb_id)
          ))
      );
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
