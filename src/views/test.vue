<template>
  {{ tags }}
  <div class="relative flex w-full items-center">
    <div class="flex h-8 flex-1 items-center space-x-2 rounded bg-white px-4" :class="{ inputError: validateState === 'error' }">
      <a-tag v-for="tag in tags" :key="tag.name" color="#165dff" class="rounded" closable @close="handleClose(tag)">{{ tag.name }}</a-tag>
      <input v-model="inputValue" @keyup.enter="handleInputConfirm" class="flex-1" @blur="handleInputConfirm" />
    </div>
    <p v-show="validateState === 'error'" class="absolute text-red-500" style="bottom: -20px">請選擇對象</p>
    <el-button plain @click="edit_countersign">選擇</el-button>
  </div>
  <el-dialog title="選擇人員" draggable v-model="dialogVisible" :show-close="false">
    <div class="flax mb-5 space-x-4">
      <el-table ref="multipleTables" :data="memberList" @selection-change="select">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="編號" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="部門" prop="department"></el-table-column>
      </el-table>
    </div>

    <div class="flex w-full items-center justify-center space-x-2">
      <a-button status="primary" @click="memberListDialog_Cancel">取消</a-button>
      <a-button type="primary" @click="memberListDialog_Confirm">確定</a-button>
    </div>
  </el-dialog>

  <a-button @click="sand">驗證</a-button>
  <!--<memberDialog v-model="dialogVisible" @resetPopupData="memberListDialog_Cancel" @submitPopupData="memberListDialog_Confirm" @selected-user="selectedUser"></memberDialog>-->
</template>

<script>
import { GenNonDuplicateID } from "@/common/until";
// import memberDialog from "@/components/memberDialog";
import { userList } from "@/views/config/api";
export default {
  name: "testPage",
  components: {},
  data() {
    return {
      dialogVisible: false,
      tags: [
        {
          id: "t0095",
          department: "建一部",
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
      ],
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
      });
    },
    // 會辦畫面選擇對象
    select(val) {
      this.selectTags = JSON.parse(JSON.stringify(val));
    },
    //開啟會辦選擇視窗
    edit_countersign() {
      this.dialogVisible = true;
      // this.tags = JSON.parse(JSON.stringify(row));
      // this.editForm = row;

      // el-table的checkbox預設勾選
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          this.memberList.forEach((subItem) => {
            if (item.id === subItem.id) {
              this.$refs.multipleTables.toggleRowSelection(subItem, true);
            }
          });
        });
      });
    },
    // 送出確定會辦人員
    memberListDialog_Confirm() {
      this.tags = this.selectTags;
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          this.$refs.multipleTables.toggleRowSelection(item, false);
        });
      });
    },
    //取消
    memberListDialog_Cancel() {
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.tags.forEach((item) => {
          this.$refs.multipleTables.toggleRowSelection(item, false);
        });
      });
    },

    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
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
    sand() {
      if (this.tags.length === 0) {
        this.validateState = "error";
      }
    },
  },
  mounted() {
    this.getApi();
  },
};
</script>

<style scoped lang="scss">
.inputError {
  border: #f56c6c 1px solid;
}
</style>
