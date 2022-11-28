<template>
  <div class="flex w-full">
    <el-input placeholder="請選擇" v-model="search" class="flex-1" @input="onInput" :disabled="disabled === true" />
    <el-popover trigger="click" ref="visible" width="auto">
      <!--搜尋框-->
      <a-input placeholder="請輸入關鍵字" v-model="searchMember" @input="onInput" />
      <!--列表-->
      <el-table ref="filterTable" :data="tables" highlight-current-row @current-change="handleCurrentChange">
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
        <div v-if="disabled === true" class="flex items-center justify-center px-3 rounded border border-gray-300 bg-gray-200 text-gray-400 hover:cursor-not-allowed">選擇</div>
        <div v-else class="flex items-center justify-center px-3 rounded border border-gray-300 bg-white hover:bg-gray-800 hover:text-white hover:cursor-pointer" @click="test">選擇</div>
      </template>
    </el-popover>

    <!-- <a-trigger trigger="click" class="member_select">
      <div class="flex items-center justify-center px-3 rounded border border-gray-300 bg-white hover:bg-gray-800 hover:text-white hover:cursor-pointer">選擇</div>
      <template #content>
        <div class="demo-basic bg-white p-4 rounded-lg shadow-6 flex flex-col space-y-4">
          <a-input placeholder="請輸入關鍵字" v-model="searchMember" />
          <el-table ref="filterTable" :data="tables" highlight-current-row @current-change="handleCurrentChange">
            <el-table-column prop="id" label="員工編號" width="250">
              <template #default="scope">
                <span class="cursor-pointer">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部門名稱" width="250"></el-table-column>
            <el-table-column prop="name" label="員工姓名" width="300" class="cursor-pointer"></el-table-column>
          </el-table>
          <div class="flex">
            <el-button v-if="multi === true" @click="selectMeetingDoneButton2">選擇2</el-button>
            <el-button v-else @click="selectMeetingDoneButton">確定</el-button>
          </div>
        </div>
      </template>
    </a-trigger>-->
  </div>
</template>

<script>
export default {
  name: "tableSelect",
  components: {},
  props: {
    selectObject: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
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
      memberList: [
        {
          id: "t0095",
          department: "建一部2",
          name: "王大明",
        },
        {
          id: "t0096",
          department: "建二部",
          name: "蔡先生",
        },
        {
          id: "t0097",
          department: "建三部",
          name: "吳先生",
        },
        {
          id: "t0098",
          department: "建四部",
          name: "張三",
        },
      ],
      checkedDetail: [],
    };
  },
  methods: {
    test() {
      this.search = null;
    },
    handleCurrentChange(val) {
      this.$emit("update:modelValue", val);
      this.memberListSelect = val;
    },
    selectMeetingDoneButton() {
      this.search = this.memberListSelect.name;
      this.searchMember = "";
      this.$refs.visible.hide(); //關閉視窗
    },
    onInput(e) {
      this.$emit("update:modelValue", e);
    },
    /*SelectionChange(val) {
      for (let i = 0; i < val.length; i++) {
        this.checkedDetail[i] = val[i].name;
      }
      console.log(this.checkedDetail);
    },
    clearSelect(row) {
      this.$refs.filterTable.setCurrentRow(row);
    },*/
  },
  computed: {
    // 篩選表格
    tables: function () {
      const search = this.searchMember;
      if (search) {
        return this.memberList.filter((data) => {
          return Object.keys(data).some((key) => {
            // return String(data[key]).toLowerCase().includes(search.toLowerCase());
            return String(data[key]).indexOf(search.toUpperCase()) > -1;
            //.indexOF()區分大小寫 .indexOf(.toUpperCase())不分大小寫 .toLowerCase()轉換小寫
          });
        });
      }
      return this.memberList;
    },
  },
};
</script>

<style lang="scss">
.member_select {
  .el-table__row:hover {
    cursor: pointer !important;
  }
}
</style>
