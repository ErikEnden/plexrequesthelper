<template>
  <div class="flex flex-col w-1/6 pr-6">
    <div class="w-full bg-grey rounded flex flex-col">
      <sidebar-item
        :title="item.title"
        :target="item.target"
        v-for="(item, index) in sidebarItems"
        :key="index"
        :class="[
          index === 0
            ? 'rounded-t'
            : index === sidebarItems.length - 1
            ? 'rounded-b'
            : '',
        ]"
      ></sidebar-item>
    </div>
  </div>
</template>

<script>
import SidebarItem from "@/components/SidebarItem";
export default {
  data() {
    return {
      sidebarItems: [
        { title: "Dashboard", icon: null, target: "/dashboard" },
        { title: "Requests", icon: null, target: "/requests" },
        { title: "Settings", icon: null, target: "/settings" },
      ],
    };
  },
  components: {
    SidebarItem,
  },
};
</script>

<style></style>
