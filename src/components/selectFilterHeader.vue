<template>
  <el-date-picker
    v-if="!isDoubleTime"
    :model-value="datePickerData.defaultT"
    :value-format="timeType == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
    :type="timeType"
    :format="timeType == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
    :placeholder="placeholder"
    :shortcuts="datePickerData.shortcuts"
    @change="changeData"
  ></el-date-picker>
  <el-date-picker
    v-else
    :model-value="datePickerData.dateTimeDbl"
    :default-value="datePickerData.dateTimeDbl"
    :value-format="timeTypeDbl == 'daterange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
    :type="timeTypeDbl"
    range-separator="至"
    start-placeholder="開始"
    end-placeholder="結束"
    :shortcuts="datePickerData.shortcutsDbl"
    @change="changeData"
  ></el-date-picker>
</template>
<script>
import { reactive } from "vue";
const datePickerData = reactive({
  defaultT: "",
  dateTimeDbl: [], // 多个默认时间展示
  shortcuts: [], // 默认时间的处理
  shortcutsDbl: [], // 默认时间的处理
});

const initEffect = (props) => {
  const init = () => {
    // 单个时间的数据展示
    if (!props.isDoubleTime) {
      datePickerData.defaultT = props.defaultTime;
      const arr = [];
      if (!props.shortcuts.length) {
        datePickerData.shortcuts = arr;
      } else {
        props.shortcuts.forEach((e) => {
          arr.push({
            text: `前${e}天`,
            value: () => {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * e);
              return date;
            },
          });
        });
        datePickerData.shortcuts = arr;
      }
    } else {
      // 多个时间的快捷选择
      const arr = [new Date(), new Date()];
      if (!props.defaultTimeDbl.length) {
        datePickerData.dateTimeDbl = [new Date(), new Date()];
      }
      if (!props.shortcutsDbl.length) {
        datePickerData.shortcutsDbl = arr;
      } else {
        props.shortcutsDbl.forEach((e) => {
          arr.push({
            text: `前${e}天`,
            value: () => {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * e);
              return [start, end];
            },
          });
        });
        datePickerData.shortcutsDbl = arr;
      }
    }
  };
  return { init };
};
export default {
  props: {
    value: {
      default() {
        return "";
      },
      type: String,
    },
    // 是否是时间组合
    isDoubleTime: {
      default() {
        return false;
      },
      type: Boolean,
    },
    // 单个默认时间展示
    defaultTime: {
      default() {
        return "";
      },
      type: String,
    },
    // 多个默认时间展示
    defaultTimeDbl: {
      default() {
        return [];
      },
      type: Array,
    },
    // 时间类型  datetime  /   date   是否需要时分秒
    timeType: {
      default() {
        return "date";
      },
      type: String,
    },
    // 时间类型  datetime  /   date   是否需要时分秒
    timeTypeDbl: {
      default() {
        return "daterange";
      },
      type: String,
    },
    placeholder: {
      default() {
        return "开始时间";
      },
      type: String,
    },
    // 快捷时间的展示 只用传天数  不用就传[]  空数组
    shortcuts: {
      default() {
        return [];
      },
      type: Array,
    },
    // 快捷时间的展示 只用传天数  不用就传[]  空数组
    shortcutsDbl: {
      default() {
        return [];
      },
      type: Array,
    },
  },
  emits: ["dataPickerChange", "input"],
  setup(props, ctx) {
    const { init } = initEffect(props);
    init();
    const changeData = (val) => {
      // const time = []
      console.log(val);
      ctx.emit("dataPickerChange", val);
    };
    return { datePickerData, changeData };
  },
};
</script>
