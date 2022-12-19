<template>
  <div class="navbar z-50 flex h-16 w-full items-center bg-blue-500 px-5 sm:space-x-5">
    <img src="@/assets/logo/EZPLUS_white.svg" alt="" class="h-10" />
    <!--<p class="hidden flex-1 text-left text-xl font-bold text-white sm:flex">{{ title }}</p>-->

    <div class="hidden flex-1 sm:block">
      <top-menu class="body-height"></top-menu>
    </div>

    <!--功能-->
    <div class="hidden space-x-2 sm:block">
      <a-trigger trigger="click" :unmount-on-close="false">
        <div class="flex cursor-pointer rounded p-2 text-white hover:bg-blue-600">
          <i class="ri-notification-3-line"></i>
        </div>
        <template #content>
          <div class="demo-basic">
            <div class="ac-navbar-message-box">
              <div class="ac-navbar-message-box-header">
                <span class="arco-react-typography ac-navbar-message-box-header-title">通知</span>
                <a-button type="text">
                  <span>全部已讀</span>
                </a-button>
              </div>
              <div class="ac-navbar-message-box-list">
                <template v-for="item in message" :key="item.id">
                  <a class="ac-navbar-message-box-item" :href="item.link" target="_blank" rel="noreferrer">
                    <span class="arco-react-badge">
                      <div class="arco-react-typography ac-navbar-message-box-item-title" style="margin-bottom: 0px">
                        {{ item.title }}
                        <a-badge :class="{ hidden: item.read === true }" :count="9" dot :dotStyle="{ width: '5px', height: '5px' }"></a-badge>
                      </div>
                    </span>
                    <div class="arco-react-typography ac-navbar-message-box-item-date" style="margin-bottom: 0px; margin-top: 4px">{{ item.date }}</div>
                  </a>
                </template>
              </div>
            </div>
          </div>
        </template>
      </a-trigger>
    </div>
    <div class="hidden space-x-2 sm:block">
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
  data() {
    return {
      message: [
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: false,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: false,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: true,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: true,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: true,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: true,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: true,
        },
        {
          title: "測試",
          date: "2022-08-25",
          link: "",
          read: true,
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.demo-basic {
  padding: 10px;
  width: 350px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px #00000026;
}

.ac-navbar-message-box {
  display: flex;
  flex-direction: column;
  /*box-shadow: 0 4px 10px #0000001a;
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-fill-3);
  box-sizing: border-box;
  background-color: var(--color-bg-popup);
  width: 324px;*/
  max-height: 360px;
}

.ac-navbar-message-box-header {
  width: 100%;
  height: 40px;
  min-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--color-fill-3);
}

.ac-navbar-message-box-header-title {
  font-weight: 500;
}

.ac-navbar-message-box-list {
  flex: 1;
  padding: 4px 0;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

.ac-navbar-message-box-item {
  display: inline-block;
  width: 100%;
  padding: 8px 20px;
  box-sizing: border-box;
  text-decoration: none;
  transition: all 0.2s;
}

.ac-navbar-message-box-item:hover {
  background-color: var(--color-fill-2);
}

.ac-navbar-message-box-item[href]:hover .title {
  color: rgb(var(--primary-6));
}

.ac-navbar-message-box-item-description {
  font-size: 12px;
  color: var(--color-text-2);
  line-height: auto;
}

.ac-navbar-message-box-item-date {
  font-size: 12px;
  color: var(--color-text-3);
}
</style>
