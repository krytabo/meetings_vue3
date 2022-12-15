<template>
  <el-dialog title="選擇人員" draggable>
    <div class="flax space-x-4">
      <div class=""></div>
      <el-table :data="memberList" @select="select" @select-all="selectAll">
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
      this.memberList = res.data.memberList;
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
};
</script>

<style scoped></style>
