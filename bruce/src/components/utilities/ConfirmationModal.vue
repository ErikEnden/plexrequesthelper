<template>
  <div class="modal">
    <div class="modal-body">
      <h4>Confirmation</h4>
      <p>{{ text }}</p>
      <div class="flex">
        <button class="btn btn-accent h-8 w-20 mr-4" @click="confirm">
          Yes
        </button>
        <button class="btn btn-accent h-8 w-20" @click="close">No</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style></style>
