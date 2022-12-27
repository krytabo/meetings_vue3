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
    <el-button @click="confirmButton">確定</el-button>
  </el-dialog>-->

  <el-dialog title="選擇人員" draggable :visible="dialogFormVisible" :show-close="false">
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
    dialogShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      memberList: [],
      selectTags: [],
      // dialogVisible: false,
      dialogFormVisible: this.dialogShow,
      internalVisible: false,
      tags: this.tagsValue,
    };
  },
  mounted() {
    userList().then((res) => {
      this.memberList = res.data;
    });
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        // 当visible改变的时候，触发父组件的 updateVisible方法，在该方法中更改传入子组件的 centerDialogVisible的值
        this.$emit("updateVisible", val);
        console.log(123);
        this.$nextTick(() => {
          for (let i = 0; i < this.$refs.multipleTable.length; i++) {
            this.$refs.memberTables[i].clearSelection();
            this.tags.forEach((item) => {
              this.memberList.forEach((subItem) => {
                if (item.id === subItem.id) {
                  this.$refs.memberTables[i].toggleRowSelection(subItem, true);
                }
              });
            });
          }
          /*this.$refs.memberTables.clearSelection();
          this.tags.forEach((item) => {
            this.memberList.forEach((subItem) => {
              if (item.id === subItem.id) {
                this.$refs.memberTables.toggleRowSelection(subItem, true);
              }
            });
          });*/
        });
      },
    },
  },
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
      this.$emit("resetPopupData");
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
