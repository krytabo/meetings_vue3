<template>
  <!--<el-dialog title="選擇人員" draggable>
    <div class="flax space-x-4">
      <div class=""></div>
      <el-table :data="memberList" ref="multipleTable" @selection-change="select">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="編號" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="部門" prop="department"></el-table-column>
      </el-table>
    </div>

    &lt;!&ndash;    <el-input v-model="searchText"></el-input>&ndash;&gt;
    <el-button @click="childClick">確定</el-button>
  </el-dialog>-->

  <el-dialog title="選擇人員" draggable :show-close="false" v-model="dialogShow">
    <div class="flax mb-5 space-x-4">
      <el-table ref="multipleTables" :data="memberList" @selection-change="select">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="編號" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="部門" prop="department"></el-table-column>
      </el-table>
    </div>

    <div class="flex w-full items-center justify-center space-x-2">
      <a-button status="primary" @click="memberListDialog_Cance">取消</a-button>
      <a-button type="primary" @click="childClick">確定</a-button>
    </div>
  </el-dialog>
</template>

<script>
import { userList } from "@/views/config/api";

export default {
  name: "memberDialog",
  prop: {
    inputName: String,
    modelValue: {
      type: String,
      default: "",
    },
    dialogObject: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  emits: ["dialogClose", "dialogSuccess"],
  data() {
    return {
      searchText: this.inputName,
      memberList: [],
      selected: null,
      dialog: this.dialogPage,
    };
  },
  mounted() {
    userList().then((res) => {
      this.memberList = res.data;
    });
  },
  methods: {
    childClick() {
      this.$emit("childByValue", this.searchText);
    },
    select(rows) {
      this.searchText = rows;
    },
    selectAll(rows) {
      this.searchText = rows;
    },
    sendSearch(e) {
      this.$emit("update:modelValue", e);
      this.searchText = e;
    },
    memberListDialog_Cance() {
      this.dialogShow = false;
      this.$nextTick(() => {
        this.editForm.countersign.forEach((item) => {
          this.$refs.multipleTables.toggleRowSelection(item, false);
        });
      });
    },
  },
  watch: {
    multipleTable() {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(this.memberList[0], true);
      });
    },
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialogObject;
      },
      set(val) {
        this.$emit("updateVisible", val);
      },
    },
  },
};
</script>

<style scoped></style>
