<template>
  <div class="member_select flex w-full">
    <a-input-tag v-if="disabled === true" v-model="search" placeholder="請選擇" class="flex-1 border border-gray-200 text-left" style="background: #f5f7fa" disabled />
    <a-input-tag v-else v-model="search" placeholder="請選擇" class="flex-1 border border-gray-300 bg-white text-left" @change="onInput" />

    <el-popover trigger="click" ref="visible" width="auto">
      <!--搜尋框-->
      <a-input placeholder="請輸入關鍵字" v-model="searchMember" />
      <!--列表-->
      <el-table ref="multipleTable" :data="tables" @selection-change="SelectionChange">
        <el-table-column type="selection" width="55">
          <template #defaule="scope">
            <el-checkbox @change="SelectionChange(scope)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="員工編號" width="250">
          <template #default="scope">
            <span class="cursor-pointer">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部門名稱" width="250"></el-table-column>
        <el-table-column prop="name" label="員工姓名" width="300" class="cursor-pointer"></el-table-column>
      </el-table>
      <!--確定按鈕-->
      <div style="text-align: right; margin: 0">
        <el-button @click="selectMeetingDoneButton">確定</el-button>
      </div>
      <!--選擇按鈕-->
      <template #reference>
        <div v-if="disabled === true" class="flex items-center justify-center rounded border border-gray-300 bg-gray-200 px-3 text-gray-400 hover:cursor-not-allowed">選擇</div>
        <div v-else class="flex items-center justify-center rounded border border-gray-300 bg-white px-3 hover:cursor-pointer hover:bg-gray-800 hover:text-white">選擇</div>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { userList } from "@/views/config/api";
export default {
  name: "tableSelect",
  components: {},
  props: {
    selectObject: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tag: "",
      memberListDialog: false,
      visible: false,
      search: this.value,
      searchMember: "",
      memberListSelect: "",
      memberListSelect2: [],
      memberList: [],
      checkedDetail: [],
      inputValue: "",
    };
  },
  mounted() {
    userList().then((res) => {
      this.memberList = res.data;
    });
  },
  methods: {
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.search.push(inputValue);
      }
      this.inputValue = "";
    },
    handleClose(tag) {
      this.search.splice(this.search.indexOf(tag), 1);
    },
    selectMeetingDoneButton() {
      let val = this.checkedDetail;
      this.$emit("update:modelValue", val);
      this.search = val;
      // this.search = Array.from(val);
      this.$refs.visible.hide(); //關閉視窗
      // this.searchMember = "";
    },
    onInput(e) {
      this.$emit("update:modelValue", e);
    },
    SelectionChange(val) {
      for (let i = 0; i < val.length; i++) {
        this.checkedDetail[i] = val[i].name;
      }
    },
  },
  computed: {
    // 篩選表格
    tables: function () {
      const search = this.searchMember;
      if (search) {
        return this.memberList.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search.toUpperCase()) > -1;
            //.indexOF()區分大小寫 .indexOf(.toUpperCase())不分大小寫 .toLowerCase()轉換小寫
          });
        });
      }
      return this.memberList;
    },
  },
  watch: {
    multipleTable() {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(this.tables[0], true);
      });
    },
  },
};
</script>

<style lang="scss">
.member_select {
  .el-table__row:hover {
    cursor: pointer !important;
  }
  .arco-input-tag.arco-input-tag-size-medium .arco-input-tag-tag {
    background-color: #3c7eff !important;
    color: #fff !important;
  }
}

.el-input-tag {
  border-color: #f56c6c;
  min-height: 42px;
}
.input-tag-wrapper {
  position: relative;
  font-size: 14px;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-flex;
  outline: none;
  padding: 0 10px 0 5px;
  //transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  cursor: text;
  transition: color 0.1s cubic-bezier(0, 0, 1, 1), border-color 0.1s cubic-bezier(0, 0, 1, 1), background-color 0.1s cubic-bezier(0, 0, 1, 1);
}
.tag-input {
  background: transparent;
  border: 0;
  font-size: inherit;
  outline: none;
  padding-left: 0;
  width: 100%;
}
</style>
