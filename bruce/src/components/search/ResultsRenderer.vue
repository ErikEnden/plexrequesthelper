<template>
  <div class="flex flex-col" v-if="configData">
    <result
      v-for="result in data.results"
      :key="result.id"
      :exists="existingRequests.includes(result.id)"
      :data="result"
      :imageConfig="configData"
      :mediaType="data.mediaType"
    ></result>
  </div>
</template>
<script>
import Result from "./Result";
import axios from "axios";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    existingRequests: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      configData: null,
    };
  },
  components: {
    Result,
  },
  mounted() {
    this.getImageAPIConfig();
  },
  methods: {
    getImageAPIConfig() {
      axios({
        method: "GET",
        url: `https://api.themoviedb.org/3/configuration?api_key=${process.env.VUE_APP_TMDB_KEY}`,
      }).then((res) => {
        this.configData = res.data.images;
      });
    },
  },
};
</script>
<style></style>
