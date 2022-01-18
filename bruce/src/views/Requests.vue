<template>
  <div class="content-page">asd</div>
</template>

<script>
import axios from "axios";
export default {
  mounted() {
    this.retrieveRequests();
  },
  methods: {
    retrieveRequests() {
      axios({
        method: "get",
        url: `${process.env.VUE_APP_API_URL}requests/list`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
    },
  },
};
</script>

<style></style>
