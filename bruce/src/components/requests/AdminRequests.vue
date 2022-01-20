<template>
  <div class="flex flex-col">
    <h3>Requests</h3>
    <div class="flex flex-col" v-if="!requestsUpdating">
      <request
        v-for="item in data.results"
        :key="item.id"
        :request="item"
      ></request>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Request from "./Request";
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Request,
  },
  computed: {
    ...mapGetters({
      requestsUpdating: "request/requestsUpdating",
    }),
  },
};
</script>

<style></style>
