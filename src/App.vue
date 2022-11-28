<template>
  <div id="app" class="relative">
    <a-config-provider :locale="zhTW">
      <a-layout class="absolute h-screen w-full">
        <a-layout-header>
          <navbar-header :title="headerTitle"></navbar-header>
          <!--<top-menu class="body-height"></top-menu>-->
        </a-layout-header>
        <a-layout-content class="absolute w-full" style="top: 64px; bottom: 0">
          <router-view class="overflow-auto" v-if="isReload" />
        </a-layout-content>
      </a-layout>
    </a-config-provider>
  </div>
</template>

<script>
import NavbarHeader from "@/components/Navbar/header";
// import topMenu from "@/components/Navbar/topMenu";
import zhTW from "@arco-design/web-vue/es/locale/lang/zh-tw";

export default {
  name: "app",
  components: {
    NavbarHeader,
    // topMenu,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      zhTW,
      isReload: true,
      collapsed: true,
      checkHidden: false,
      selected: 0,
      tabsList: [
        {
          id: 0,
          name: "定價表",
          link: "/",
        },
        {
          id: 1,
          name: "配置圖設定",
          link: "/config-setting",
        },
      ],
      active: false,
      headerTitle: "會議記錄系統",

      tableData: [
        {
          date: "2016-05-03",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036",
          tag: "Home",
        },
        {
          date: "2016-05-02",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036",
          tag: "Office",
        },
        {
          date: "2016-05-04",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036",
          tag: "Home",
        },
        {
          date: "2016-05-01",
          name: "Tom",
          state: "California",
          city: "Los Angeles",
          address: "No. 189, Grove St, Los Angeles",
          zip: "CA 90036",
          tag: "Office",
        },
      ],
    };
  },
  methods: {
    listClose() {
      this.checkHidden = !this.checkHidden;
    },
    reload() {
      this.isReload = false;
      this.$nextTick(() => {
        this.isReload = true;
      });
    },
  },
};
</script>

<style lang="scss">
body {
  background: #f1f1f1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

@media only screen and (max-width: 500px) {
  .body-height {
    height: calc(100vh - 150px) !important;
    padding-bottom: env(safe-area-bottom);
  }
}
.body-height {
  height: calc(100vh - 64px);
}

.body-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
}

.sideMenu_model {
  @apply absolute z-50 flex w-full flex-col space-y-5 bg-gray-900 p-4 pr-20 md:relative md:w-80;

  .router-link-active {
    @apply border border-blue-500 bg-blue-600 bg-opacity-20;
  }
}

.listHidden-button {
  @apply absolute right-5 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white;
  //@apply absolute right-5 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-6;
}

.listShow_button {
  @apply -right-14 top-2 bg-gray-800;
}

.sideMenu_hidden {
  @apply absolute -left-8 mr-0 w-0 pr-0 md:-left-8;
}
</style>
