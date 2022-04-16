<template>
  <div class="flex flex-col w-1/6 pr-6">
    <div class="w-full bg-grey rounded flex flex-col">
      <sidebar-item
        :title="item.title"
        :target="item.target"
        v-for="(item, index) in sidebarItemsComputed"
        :key="index"
        :class="[
          index === 0
            ? 'rounded-t'
            : index === sidebarItemsComputed.length - 1
            ? 'rounded-b'
            : '',
        ]"
      ></sidebar-item>
    </div>
  </div>
</template>

<script>
import SidebarItem from "@/components/SidebarItem";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      sidebarItems: [
        { title: "Dashboard", icon: null, target: "/dashboard", admin: false },
        { title: "Admin", icon: null, target: "/admin", admin: true },
      ],
    };
  },
  components: {
    SidebarItem,
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
    }),
    sidebarItemsComputed() {
      return this.user.decoded.isAdmin
        ? this.sidebarItems
        : this.sidebarItems.filter((x) => !x.admin);
    },
  },
};
</script>

<style></style>
