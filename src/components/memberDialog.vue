<template>
  <el-dialog title="選擇人員" draggable v-model="dialogFormVisible" :show-close="false">
    <div class="flax mb-5 space-x-4">
      <el-table ref="memberTables" :data="memberList" @selection-change="select">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="編號" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="部門" prop="department"></el-table-column>
      </el-table>
    </div>

    <div class="flex w-full items-center justify-center space-x-2">
      <a-button status="primary" @click="cancelButton">取消</a-button>
      <a-button type="primary" @click="confirmButton">確定</a-button>
    </div>
  </el-dialog>
</template>

<script>
import { userList } from "@/views/config/api";

export default {
  name: "memberDialog",
  prop: {
    isSingel: {
      type: Boolean,
      default: false,
    },
    //內容
    tagsValue: {
      type: Array,
      default: () => [],
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      memberList: [],
      selectTags: [],
      // dialogVisible: false,
      dialogFormVisible: this.dialogVisible,
      internalVisible: false,
      tags: this.tagsValue,
    };
  },
  mounted() {
    userList().then((res) => {
      this.memberList = res.data;
    });
  },
  computed: {},
  methods: {
    // table選擇框
    select(val) {
      this.selectTags = JSON.parse(JSON.stringify(val));
      this.$emit("selected-user", val);
    },
    // 確認按鈕
    confirmButton() {
      this.tags = this.selectTags;
      const rows = this.tags;
      this.$emit("submitPopupData", "update:modelValue", rows);
    },
    // 取消按鈕
    cancelButton() {
      this.$emit("resetPopupData", false);
    },
  },
  watch: {
    dialogShow(val) {
      this.dialogFormVisible = val;
    },
  },
};
</script>

<style scoped></style>
