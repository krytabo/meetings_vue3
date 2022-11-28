<template>
  <el-breadcrumb separator="/" class="m-5 p-4 bg-gray-100 rounded">
    <el-breadcrumb-item v-for="item in lists" :key="item.path">
      <router-link :to="item.name">{{ item.meta.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "breadcrumbPage",
  data() {
    return {
      lists: [],
    };
  },
  created() {
    // console.log(this.$route.matched);
    this.lists = this.$route.matched;
  },
  watch: {
    $route(to) {
      // console.log(from);
      this.lists = to.matched;
    },
  },
};
</script>

<style scoped></style>
