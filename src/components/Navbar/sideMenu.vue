<template>
  <div class="sideMenu_model" :class="{ sideMenu_hidden: checkHidden === true }">
    <div v-for="(item, index) in tabsList" class="menu flex flex-col items-center space-y-1" :key="index">
      <router-link :to="item.link" class="w-full rounded px-4 py-3 text-left text-white hover:bg-white hover:bg-opacity-10">{{ item.name }}</router-link>
    </div>

    <div @click="listClose" class="listHidden-button" :class="{ listShow_button: checkHidden === true }">
      <i v-if="checkHidden === false" class="ri-arrow-left-s-line"></i>
      <i v-else class="ri-arrow-right-s-line text-white"></i>
    </div>
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
.sideMenu_model {
  @apply absolute z-50 flex h-full w-full flex-col space-y-5 bg-gray-900 p-4 pr-20 md:relative md:w-80;

  .router-link-exact-active {
    @apply border border-blue-500 bg-blue-600 bg-opacity-20;
  }
}

.listHidden-button {
  @apply absolute right-5 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-6;
}

.listShow_button {
  @apply -right-14 top-2 bg-gray-800;
}

.sideMenu_hidden {
  @apply absolute -left-8 mr-0 w-0 pr-0 md:-left-8;
}
</style>
