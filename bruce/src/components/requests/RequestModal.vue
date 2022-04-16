<template>
  <div class="modal">
    <div class="modal-body w-1/3">
      <h3 class="mb-4">Create request</h3>
      <div class="flex mb-4">
        <div class="w-1/4 flex">
          <img :src="requestTarget.poster" class="rounded" />
        </div>
        <div class="flex flex-col w-3/4 pl-4">
          <h4 class="mb-2">
            {{
              `${
                requestTarget.data.title
                  ? requestTarget.data.title
                  : requestTarget.data.name
              } (${
                requestTarget.data.release_date
                  ? requestTarget.data.release_date.split("-")[0]
                  : requestTarget.data.first_air_date
                  ? requestTarget.data.first_air_date.split("-")[0]
                  : "No release date"
              })`
            }}
          </h4>
          <p class="bg-grey-light rounded p-2">
            {{ requestTarget.data.overview }}
          </p>
        </div>
      </div>

      <textarea
        class="mb-4"
        placeholder="Notes (optional)"
        v-model="notes"
      ></textarea>
      <div class="flex">
        <button class="btn btn-success w-24 h-8 mr-4" @click="createRequest">
          Request
        </button>
        <button class="btn btn-danger w-24 h-8" @click="closeModal">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      notes: "",
    };
  },
  methods: {
    closeModal() {
      this.$store.dispatch("request/closeCreateRequestModal");
    },
    createRequest() {
      this.$store
        .dispatch("request/createRequest", { notes: this.notes })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.closeModal();
          }
        });
    },
  },
  computed: {
    ...mapGetters({
      requestTarget: "request/requestTarget",
    }),
  },
};
</script>

<style></style>
