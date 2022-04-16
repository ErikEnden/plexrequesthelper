<template>
  <div class="grid grid-cols-4 p-2 items-center">
    <div class="flex">{{ user.login }}</div>
    <div class="flex">
      <input type="text" v-model="nameField" />
    </div>
    <div class="flex"><input type="checkbox" v-model="assignAdmin" /></div>
    <div class="flex justify-end">
      <button
        class="btn btn-success w-24 mr-2"
        @click="
          openConfirmModal(
            `Are you sure you want to approve the requested user? (${user.login})`,
            () => processUserRequest(true)
          )
        "
        v-if="!user.is_active"
      >
        Approve
      </button>
      <button
        class="btn btn-danger w-20"
        @click="
          openConfirmModal(
            `Are you sure you want to reject the requested user? (${user.name})`,
            () => processUserRequest(false)
          )
        "
        v-if="!user.is_active"
      >
        Decline
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
      nameField: "",
      confirmModalText: "",
      assignAdmin: false,
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
    processUserRequest(approve) {
      this.$store
        .dispatch("auth/processUser", {
          approve: approve,
          name: this.nameField,
          user: this.user,
        })
        .then((res) => {
          if (res.status === 201) this.$emit("usersUpdated");
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
