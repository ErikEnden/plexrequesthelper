<template>
  <div class="flex flex-col">
    <h3>My requests</h3>
    <div class="flex flex-col" v-if="!requestsUpdating">
      <request
        v-for="item in data.results"
        :key="item.id"
        :request="item"
      ></request>
      <span v-if="data.results && data.results.length === 0">
        You haven't made any requests yet
      </span>
    </div>
  </div>
</template>

<script>
import Request from "./Request.vue";
import { mapGetters } from "vuex";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { Request },
  computed: {
    ...mapGetters({
      requestsUpdating: "request/requestsUpdating",
    }),
  },
};
</script>

<style></style>
