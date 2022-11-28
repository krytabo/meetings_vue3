import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/tailwind.css";
import "remixicon/fonts/remixicon.css";

//axios
import axios from "axios";
import VueAxios from "vue-axios";

// Sweetalert2
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const options = {
  confirmButtonColor: "#41b882",
  cancelButtonColor: "#ff7674",
};

//loading view
// import loadView from "vue3-loading-views";

// Element-pluss
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/es/locale/lang/zh-tw";

//Arco
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";

// Naive Ui
import { create, NLayout } from "naive-ui";

const naive = create({
  components: [NLayout],
});

import moment from "moment";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(VueAxios, axios);
app.provide("$axios", axios);
app.use(VueSweetalert2, options);
// app.use(loadView);
app.use(ElementPlus, { locale: locale });
app.use(ArcoVue);
app.use(naive);
app.config.globalProperties.$moment = moment; //prototype方式
app.mount("#app");
