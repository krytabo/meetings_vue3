<template>
  <el-select
    :disabled="disabled"
    :size="size"
    :value="selectValue"
    :multiple="multiple"
    :allow-create="allowCreate"
    :default-first-option="defaultFirstOption"
    @input="inputEvent"
    class="w-full"
    clearable
    filterable
    remote
    :remote-method="remoteMethod"
    @visible-change="focusEvent1"
    @change="handleSelect"
  >
    <el-option class="asdasd fixed bg-white z-1" :disabled="true" value="" label="">
      <div>
        <!--<span :style="setstyle">序號</span>-->
        <span :style="setstyle" v-for="(item, index) in options" :key="item.name + index + Math.random()">{{ item.name }}</span>
      </div>
    </el-option>

    <span class="top-10 relative">
      <el-option
        v-show="filterArr.length !== 0"
        v-for="(item, index) in filterArr || this.arrData"
        :key="index + Math.random()"
        class="asdasd"
        :label="item[defalutValue.label]"
        :value="item[defalutValue.value]"
      >
        <div @click="clickOption(item)">
          <span :style="setstyle" v-for="(item1, index1) in options" :key="index1 + item[item1.value] + Math.random()">{{ item[item1.value] }}</span>
        </div>
      </el-option>
      <el-option v-show="filterArr.length === 0" value="" label="" style="text-align: center; border-top: 1px solid black; margin: 0 6px" :disabled="true">
        <div>
          <span :style="setstyle">搜尋暫無資料</span>
        </div>
      </el-option>
    </span>
  </el-select>
</template>

<script>
export default {
  name: "selectTable",
  mounted() {
    this.filterArr = JSON.parse(JSON.stringify(this.arrData));
    this.selectValue = this.value ? JSON.parse(JSON.stringify(this.value)) : null;
  },
  data() {
    return {
      selectValue: "", //選中的值
      filterArr: [], //過濾後的值
    };
  },
  watch: {
    value: {
      // handler(newvalue, oldvalue) {
      handler() {
        this.selectValue = this.value;
        // console.log(newvalue, oldvalue);
      },
      deep: true,
    },
    // filterArr: {
    //   handler(oldvalue, newvalue) {
    //     console.log(oldvalue,newvalue,111)
    //   },
    //   deep: true
    // }
  },
  props: {
    multiple: {
      default: null,
    },
    allowCreate: {
      default: null,
    },
    defaultFirstOption: {
      default: null,
    },
    disabled: {
      default: null,
    },
    size: {
      default: null,
    },
    value: {
      default: null,
    },
    setstyle: {
      type: Object,
      default() {
        return {};
      },
    },
    defalutValue: {
      type: Object,
      default() {
        return {
          value: ["id", "name", "department"],
          label: ["id", "name", "department"],
        };
      },
    },
    arrData: {
      //查詢的結果
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Array,
      request: true,
    },
    getData: {
      type: Function,
      default: null,
    },
  },
  methods: {
    //點擊下拉
    clickOption(item) {
      this.$emit("click", item);
    },
    inputEvent(value) {
      this.selectValue = value; //選中的值
      this.$emit("input", value);
    },
    //選中時改變狀態
    handleSelect($event) {
      this.$emit("change", $event); //選中的值
    },
    //下拉顯示隱藏時觸發
    async focusEvent1(flag) {
      if (flag) {
        if (this.getData) {
          //請求的數據存在時觸發
          let { result } = await this.getData("");
          this.filterArr = result;
          return;
        }
        this.filterArr = this.arrData; //重置過濾後的結果
      }
    },
    //模糊查詢
    async remoteMethod(query) {
      if (this.getData) {
        //請求的數據存在時觸發
        let { result } = await this.getData(query);
        this.filterArr = result;
        return;
      }
      if (query !== "") {
        /*this.filterArr = this.arrData.filter((item) => {
          return item[this.defalutValue.label].toLowerCase().indexOf(query.toLowerCase()) > -1;

        });*/
        this.filterArr = this.arrData.filter((item) => item.name.includes(query) || item.department.includes(query) || item.id.includes(query));
      } else {
        this.filterArr = this.arrData;
      }
    },
  },
};
</script>

<style lang="scss">
.z-1 {
  z-index: 1;
}
.asdasd {
  white-space: nowrap;
  width: unset;
  border-top: 1px solid #ebeef5;
  padding: 0;
  margin: 0 6px;
}

.asdasd div {
  width: 100%;
  display: flex;
}
.asdasd div span {
  min-width: 120px;
  padding-left: 10px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  border-collapse: separate;
}
.el-select-dropdown__list {
  padding: 0 0 6px 0 !important;
}
</style>
