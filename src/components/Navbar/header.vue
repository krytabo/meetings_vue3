<template>
  <div class="navbar z-50 flex h-16 w-full items-center bg-blue-500 px-5 sm:space-x-5">
    <img src="@/assets/logo/EZPLUS_white.svg" alt="" class="h-10" />
    <!--<p class="hidden flex-1 text-left text-xl font-bold text-white sm:flex">{{ title }}</p>-->

    <div class="sm:block hidden flex-1">
      <top-menu class="body-height"></top-menu>
    </div>

    <!--功能-->
    <div class="space-x-2 sm:block hidden">
      <div class="flex cursor-pointer rounded p-2 text-white hover:bg-blue-600">
        <i class="ri-user-line"></i>
        王大明
      </div>
    </div>
    <div class="ml-auto cursor-pointer rounded p-2 text-white hover:bg-blue-600 sm:hidden">
      <i class="ri-menu-fill"></i>
    </div>
  </div>
</template>

<script>
import topMenu from "@/components/Navbar/topMenu";
export default {
  name: "NavbarHeader",
  components: { topMenu },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="scss"></style>
