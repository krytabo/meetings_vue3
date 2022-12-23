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

  <el-dialog title="選擇人員" draggable :show-close="false">
    <div class="flax mb-5 space-x-4">
      <el-table ref="multipleTables" :data="memberList" @selection-change="select">
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
    value: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isSingel: {
      type: Boolean,
      default: false,
    },
  },
  // emits: ["selected-user"],
  /*setup(props, { emit }) {
    // 选择用户
    const setSelectRows = (selection) => {
      // 单选
      if (props.isSingel) {
        if (selection.length > 1) {
          const del_row = selection.shift();
          state.table.toggleRowSelection(del_row, false); //设置这一行取消选中
        }
      }
      // 多选
      state.selectRows = selection;
    };

    // 打开弹框
    const showModel = () => {
      state.dialogFormVisible = true;
    };

    // 关闭弹框
    const close = () => {
      state.dialogFormVisible = false;
    };

    // 保存选择的用户
    const save = () => {
      emit("selected-user", state.selectRows); // 派发事件，具体逻辑在父组件中实现
      close();
    };

    return {
      ...toRefs(state),
      setSelectRows,
      showModel,
      close,
      save,
    };
  },*/
  data() {
    return {
      memberList: [],
      search: this.value,
      checkedDetail: [],
    };
  },
  mounted() {
    userList().then((res) => {
      this.memberList = res.data;
    });
  },
  methods: {
    // table選擇框
    select(rows) {
      this.checkedDetail = rows;
      this.$emit("selected-user", rows);
    },
    // 確認按鈕
    confirmButton() {
      let val = this.checkedDetail;
      this.search = val;
      this.$emit("submitPopupData", "update:modelValue", val);
    },
    // 取消按鈕
    cancelButton() {
      this.$emit("resetPopupData");
      /* this.$nextTick(() => {
        this.editForm.countersign.forEach((item) => {
          this.$refs.multipleTables.toggleRowSelection(item, false);
        });
      });*/
    },
  },
  watch: {
    /*multipleTable() {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(this.memberList[0], true);
      });
    },*/
  },
  computed: {
    /*dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("updateVisible", val);
      },
    },*/
  },
};
</script>

<style scoped></style>
