<template>
  <div class="flex mb-2">
    <div class="flex w-1/12">
      <img
        :src="
          request.poster_url
            ? request.poster_url
            : `https://via.placeholder.com/130x195`
        "
        class="rounded shadow"
      />
    </div>
    <div class="flex w-11/12 flex-col pl-4">
      <div class="flex justify-between mb-2">
        <h4>
          {{ `${request.title} (${request.release_date.split("-")[0]})` }}
        </h4>
        <div class="flex items-center">
          <p class="mr-2">Status</p>
          <span class="rounded p-1 flex w-auto" :class="requestStatusLabel">{{
            requestStatus
          }}</span>
        </div>
      </div>
      <div class="flex mb-2">
        <p>
          Requested by
          <span v-for="(item, index) in request.requesters" :key="item.name"
            ><span v-if="index > 0">, </span>{{ item.name }}</span
          >
          <span class="text-white-dark ml-2">{{ requestTime }}</span>
        </p>
      </div>
      <div class="flex mb-4 flex-col">
        <p class="font-medium">Notes</p>
        <p class="italic">{{ request.notes ? `"${request.notes}"` : "-" }}</p>
      </div>
      <div class="flex">
        <button
          class="btn btn-success h-8 w-20 mr-2"
          v-if="request.status === 0 && user.decoded.isAdmin"
          @click="acceptRequest"
        >
          Accept
        </button>
        <button
          class="btn btn-danger h-8 w-20"
          v-if="request.status === 0 && user.decoded.isAdmin"
          @click="rejectRequest"
        >
          Reject
        </button>
        <button
          class="btn btn-success h-8 w-32 mr-2"
          v-if="request.status === 1 && user.decoded.isAdmin"
          @click="fulfillRequest"
        >
          Mark fulfilled
        </button>
        <button
          class="btn btn-danger h-8 w-20"
          v-if="request.status === 1"
          @click="cancelRequest"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { mapGetters } from "vuex";
import RequestStatusParser from "../../mixins/RequestStatusParser";
export default {
  mixins: [RequestStatusParser],
  props: {
    request: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    acceptRequest() {
      this.$store
        .dispatch("request/acceptRequest", this.request.id)
        .then((res) => {
          this.$store.dispatch("request/updateRequest", res.data);
        });
    },
    rejectRequest() {
      this.$store
        .dispatch("request/rejectRequest", this.request.id)
        .then((res) => {
          this.$store.dispatch("request/updateRequest", res.data);
        });
    },
    fulfillRequest() {
      this.$store
        .dispatch("request/fulfillRequest", this.request.id)
        .then((res) => {
          this.$store.dispatch("request/updateRequest", res.data);
        });
    },
    cancelRequest() {
      this.$store
        .dispatch("request/cancelRequest", this.request.id)
        .then((res) => {
          this.$store.dispatch("request/updateRequest", res.data);
        });
    },
  },
  computed: {
    requestTime() {
      return `(${DateTime.fromISO(this.request.created_at)
        .toLocal()
        .toLocaleString(DateTime.DATETIME_SHORT)})`;
    },
    requestStatus() {
      return this.parseRequestStatus(this.request.status);
    },
    requestStatusLabel() {
      if (this.request.status === 0) {
        return "bg-accent";
      } else if (this.request.status === 1) {
        return "bg-warning";
      } else if (this.request.status === 2) {
        return "bg-success";
      } else if (this.request.status === 3 || this.request.status === 4) {
        return "bg-danger";
      } else {
        return "";
      }
    },
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
};
</script>

<style></style>
