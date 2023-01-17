<template>
  <div>
    <!--<p class="text-red-500">{{ tags }}</p>-->
    <div class="flex w-full items-center">
      <div v-show="tagsInput === true" class="relative w-full">
        <div class="flex h-8 flex-1 items-center space-x-2 rounded border border-gray-200 bg-white px-4 hover:border-gray-300" :class="{ inputError: validateState === 'error' }">
          <a-tag v-for="tag in tags" :key="tag.name" color="#165dff" class="rounded" closable @close="handleClose(tag)">{{ tag.name }}</a-tag>
          <input v-show="allowCreate === true" v-model="inputValue" @keyup.enter="handleInputConfirm" class="flex-1" @blur="handleInputConfirm" />
        </div>
        <p v-show="validateState === 'error'" class="absolute text-red-500" style="bottom: -20px">請選擇對象</p>
      </div>
      <a-button :type="type" :size="size" :plain="plain" :circle="circle" :status="status" @click="edit_countersign">選擇</a-button>
    </div>
    <el-dialog title="選擇人員" draggable v-model="dialogVisible" :show-close="false">
      <div class="flax mb-5 space-x-4">
        <el-table ref="memberTables" :data="memberList" @selection-change="select" :row-key="getRowKeys">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="編號" prop="id"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="部門" prop="department"></el-table-column>
        </el-table>
      </div>
      <div class="flex w-full items-center justify-center space-x-2">
        <a-button status="primary" @click="memberListDialog_Cancel">取消</a-button>
        <a-button v-if="rulesOption === true" type="primary" @click="memberListDialog_Confirm">確定</a-button>
        <a-button v-else type="primary" @click="memberListDialog_Confirm2">確定</a-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GenNonDuplicateID } from "@/common/until";
import { userList } from "@/views/config/api";
export default {
  name: "testPage",
  components: {},
  props: {
    status: {
      type: String,
      default: null,
    },
    circle: {
      type: String,
      default: null,
    },
    plain: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    // 可新增
    allowCreate: {
      type: Boolean,
      default: true,
    },
    // 輸入欄位
    tagsInput: {
      type: Boolean,
      default: true,
    },
    // 驗證
    rulesOption: {
      type: Boolean,
      default: true,
    },
    //內容
    tagsValue: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      tags: this.tagsValue,
      inputValue: "",
      memberList: [],
      selectTags: [],
      validateState: "success",
    };
  },
  methods: {
    // 獲取API
    getApi() {
      userList().then((res) => {
        this.memberList = res.data;
        //object中新增數值
        /*for (let stage of this.memberList) {
          Object.assign(stage, { isSelected: false });
        }*/
      });
    },
    // 會辦畫面選擇對象
    select(val) {
      this.selectTags = JSON.parse(JSON.stringify(val));
      console.log(this.selectTags);
    },
    //開啟會辦選擇視窗
    edit_countersign() {
      this.dialogVisible = true;
      // this.tags = JSON.parse(JSON.stringify(row));
      // this.editForm = row;

      // el-table的checkbox預設勾選
      this.$nextTick(() => {
        this.$refs.memberTables.clearSelection();
        this.tags.forEach((item) => {
          this.memberList.forEach((subItem) => {
            if (item.id === subItem.id) {
              this.$refs.memberTables.toggleRowSelection(subItem);
            }
          });
        });
      });
    },
    // 送出確定會辦人員(驗證)
    memberListDialog_Confirm() {
      this.tags = this.selectTags;
      this.dialogVisible = false;

      /** 驗證 */
      if (this.tags.length === 0) {
        this.validateState = "error";
      } else {
        this.validateState = "success";
        const rows = this.tags;
        this.$emit("sand-form", rows);
      }
    },
    // 送出確定會辦人員
    memberListDialog_Confirm2() {
      this.tags = this.selectTags;
      this.dialogVisible = false;
      const rows = this.tags;
      this.$emit("sand-form", rows);
    },
    //取消
    memberListDialog_Cancel() {
      this.dialogVisible = false;
    },

    // 刪除tag
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.selectTags.splice(this.tags.indexOf(tag), 1);
    },
    // input輸入
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tags.push({
          name: inputValue,
          id: GenNonDuplicateID(8),
          department: "",
        });
      }
      this.inputValue = "";
    },

    getRowKeys(row) {
      return row.id;
    },

    test() {
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          this.memberList.forEach((subItem) => {
            if (item.id === subItem.id) {
              this.$refs.memberTables.toggleRowSelection(subItem, true);
            }
          });
        });
      });
    },
  },
  mounted() {
    this.getApi();
    this.test();
  },
  created() {},
};
</script>

<style scoped lang="scss">
.inputError {
  border: #f56c6c 1px solid;
}
</style>
