<template>
  <div class="flex p-2">
    <div class="flex w-1/6">{{ user.name }}</div>
    <div class="flex w-1/6">{{ user.login }}</div>
    <div class="flex w-1/6">{{ lastLogin }}</div>
    <div class="flex w-1/6">
      <bool-display :property="user.is_admin" />
    </div>
    <div class="flex w-1/6">
      <bool-display :property="user.is_active" />
    </div>
    <div class="flex w-1/6 justify-end">
      <button
        class="btn btn-danger w-24"
        @click="
          openConfirmModal(
            `Are you sure you want to deactivate the selected user? (${user.name})`,
            deactivateUser
          )
        "
        v-if="user.is_active && user.id !== $store.state.auth.user.decoded.id"
      >
        Deactivate
      </button>
      <button
        class="btn btn-success w-24 mr-2"
        @click="
          openConfirmModal(
            `Are you sure you want to reactivate the selected user? (${user.name})`,
            reactivateUser
          )
        "
        v-if="!user.is_active"
      >
        Reactivate
      </button>
      <button
        class="btn btn-danger w-20"
        @click="
          openConfirmModal(
            `Are you sure you want to delete the selected user? (${user.name})`,
            deleteUser
          )
        "
        v-if="!user.is_active"
      >
        Delete
      </button>
    </div>
    <confirmation-modal
      v-if="displayConfirmModal"
      :text="confirmModalText"
      @confirm="confirmModalCallback()"
      @close="closeConfirmModal"
    ></confirmation-modal>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import ConfirmationModal from "../utilities/ConfirmationModal";

export default {
  data() {
    return {
      confirmModalText: "",
      confirmModalCallback: null,
      displayConfirmModal: false,
    };
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { ConfirmationModal },
  methods: {
    openConfirmModal(text, callback) {
      this.confirmModalText = text;
      this.confirmModalCallback = callback;
      this.displayConfirmModal = true;
    },
    closeConfirmModal() {
      this.confirmModalText = "";
      this.confirmModalCallback = null;
      this.displayConfirmModal = false;
    },
    deactivateUser() {
      this.$store
        .dispatch("auth/deactivateUser", { userId: this.user.id })
        .then((res) => {
          if (res.status === 200) this.$emit("usersUpdated");
        });
    },
    reactivateUser() {
      this.$store
        .dispatch("auth/reactivateUser", { userId: this.user.id })
        .then((res) => {
          if (res.status === 200) this.$emit("usersUpdated");
        });
    },
    deleteUser() {
      this.$store
        .dispatch("auth/deleteUser", { userId: this.user.id })
        .then((res) => {
          if (res.status === 200) this.$emit("usersUpdated");
        });
    },
  },
  computed: {
    lastLogin() {
      if (!this.user.last_login) return "Never";
      return DateTime.fromISO(this.user.last_login)
        .toLocal()
        .toLocaleString(DateTime.DATETIME_SHORT);
    },
  },
};
</script>

<style></style>
