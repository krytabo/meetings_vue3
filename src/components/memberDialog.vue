<template>
  <el-dialog title="選擇人員" draggable>
    <div class="flax space-x-4">
      <div class=""></div>
      <el-table :data="memberList" ref="multipleTable" @selection-change="select">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="編號" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="部門" prop="department"></el-table-column>
      </el-table>
    </div>

    <!--    <el-input v-model="searchText"></el-input>-->
    <el-button @click="childClick">確定</el-button>
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
  },
  data() {
    return {
      searchText: this.inputName,
      memberList: [],
      selected: null,
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
  },
  watch: {
    multipleTable() {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(this.memberList[0], true);
      });
    },
  },
};
</script>

<style scoped></style>
