<template>
  <!--<div class="w-full flex bg-white h-10 items-center px-5" style="top: 60px">
    <template v-for="(item, index) in tabsList" :key="index">
      <router-link :to="item.link" class="px-4 py-2 text-base text-gray-900 hover:bg-gray-500 hover:bg-opacity-10">{{ item.name }}</router-link>
    </template>
  </div>-->
  <div class="flex h-10 w-full items-center space-x-2" style="top: 60px">
    <template v-for="(item, index) in tabsList" :key="index">
      <router-link :to="item.link" class="rounded-md px-4 py-2 text-base text-white hover:bg-blue-900 hover:bg-opacity-40" class-active="active">{{ item.name }}</router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: "sideMenu",
  data() {
    return {
      collapsed: true,
      checkHidden: false,
      screenWidth: "",
      selected: 0,
      tabsList: [
        {
          id: 0,
          name: "會議記錄總表",
          link: "/meetingList",
        },
        {
          id: 1,
          name: "待辦事項",
          link: "/toDoList",
          // link: "/price_list",
        },
        /*{
          id: 2,
          name: "KPI專區",
          link: "/",
          // link: "/division_list",
        },
        {
          id: 3,
          name: "基本資料",
          link: "/",
          // link: "/division_list",
        },*/
      ],
      active: false,
    };
  },
  methods: {
    listClose() {
      this.checkHidden = !this.checkHidden;
    },
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        if (this.screenWidth < 1240) {
          this.checkHidden = true;
        } else if (this.screenWidth > 1240) {
          this.checkHidden = false;
        }
      })();
    };
  },
};
</script>

<style scoped lang="scss">
.router-link-active {
  @apply rounded-md border-b-2 border-blue-500 bg-blue-900 bg-opacity-50 text-white;
}
.router-link-active {
  //color: #165dff !important;
  color: #fff !important;
}
/*.router-link-exact-active {
  @apply text-white border-b-2 border-blue-500 bg-blue-900 bg-opacity-50 rounded-md;
}
.router-link-exact-active {
  //color: #165dff !important;
  color: #fff !important;
}*/
.sideMenu_model {
  @apply flex w-full flex-col space-y-5 bg-gray-900 p-4 pr-20 md:relative md:w-80;

  .router-link-exact-active {
    @apply border border-blue-500 bg-blue-600 bg-opacity-20;
  }
}

.listHidden-button {
  //@apply absolute right-5 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-6;
  @apply absolute right-5 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white;
}

.listShow_button {
  @apply -right-14 top-2 bg-gray-800;
}

.sideMenu_hidden {
  @apply absolute -left-8 mr-0 w-0 pr-0 md:-left-8;
}
</style>
