<template>
  <div class="content-page" id="search-results">
    <h4 v-if="queryResult" class="mb-2">
      Searching for {{ queryResult.query }} ({{ queryResult.total_results }}
      results)
    </h4>
    <ResultsRenderer
      v-if="queryResult"
      :data="queryResult"
      :existingRequests="existingRequests"
    ></ResultsRenderer>
  </div>
</template>
<script>
import axios from "axios";
import ResultsRenderer from "@/components/search/ResultsRenderer";
// import { debounce } from "lodash";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      existingRequests: [],
      contentPane: null,
    };
  },
  mounted() {
    this.contentPane = document.getElementById("search-results");
    this.retrieveExisting();
    if (!this.movieGenres) this.$store.dispatch("staticdata/getMovieGenres");
    if (!this.tvGenres) this.$store.dispatch("staticdata/getTVGenres");
    this.contentPane.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    this.contentPane.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (
        this.contentPane.scrollTop ===
          this.contentPane.scrollHeight - this.contentPane.offsetHeight &&
        this.queryResult.page < this.queryResult.total_pages
      ) {
        this.$store.dispatch("search/executeSearch", this.queryResult.page + 1);
      }
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
  watch: {
    "queryResult.query"() {
      this.contentPane.scroll(0, 0);
    },
  },
  components: { ResultsRenderer },
  computed: {
    ...mapGetters({
      queryResult: "search/queryResult",
      searchQuery: "search/searchQuery",
      mediaType: "search/mediaType",
    }),
  },
};
</script>
<style></style>
