<template>
  <div class="transfer-tree">
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <el-checkbox v-model="leftAllChecked" :disabled="!(leftDataList && leftDataList.length)" :indeterminate="isIndeterminateLeft" @change="handleCheckAllChangeLeft">{{ leftTitle }}</el-checkbox>
      </div>
      <div class="transfer-panel-body">
        <el-tree ref="leftTree" show-checkbox check-on-click-node default-expand-all :node-key="defaultProps.key" :data="leftDataList" :props="defaultProps" @check="handleCheckLeft"></el-tree>
      </div>
    </div>
    <div class="transfer-buttons">
      <el-button class="mb8" size="mini" icon="el-icon-arrow-left" :disabled="!(rightCheckedList && rightCheckedList.length)" @click="handleLeftChange"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-arrow-right" :disabled="!(leftCheckedList && leftCheckedList.length)" @click="handleRightChange"></el-button>
    </div>
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <el-checkbox v-model="rightAllChecked" :disabled="!(rightDataList && rightDataList.length)" :indeterminate="isIndeterminateRight" @change="handleCheckAllChangeRight">
          {{ rightTitle }}
        </el-checkbox>
        <!-- 右侧数据量/限制最大可保存数据量 -->
        <span class="transfer-panel-ratio">{{ rightDataList.length }}/{{ maxLimitCount }}</span>
      </div>
      <div class="transfer-panel-body">
        <el-checkbox-group v-if="rightDataList && rightDataList.length" v-model="rightCheckedKeyList" @change="handleCheckRight">
          <draggable v-model="rightDataList" chosenClass="chosen" forceFallback="true" animation="200" @start="drag = true" @end="drag = false" @update="handleOrder">
            <transition-group>
              <el-checkbox v-for="(item, index) in rightDataList" :key="`right_${item[defaultProps.key]}_${index}`" :label="item[defaultProps.key]">
                {{ item[defaultProps.label] }}
                <!--<img src="@/assets/drag_icon.svg" alt="拖拽排序" width="40" height="15" />-->
                <i class="ri-drag-move-2-fill"></i>
              </el-checkbox>
            </transition-group>
          </draggable>
        </el-checkbox-group>
        <el-empty description="暂无数据" v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
// import { number } from "echarts";
// import draggable from "vuedraggable";

export default {
  name: "transferPage",
  components: {
    // draggable,
  },
  props: {
    // tree的默认结构
    defaultProps: {
      type: Object,
      required: true,
      default: () => ({
        children: "children",
        label: "label",
        key: "key",
        parentKey: "parent", // 这个属性不是 tree组件需要的，是子节点数据中记录父节点标识的属性
      }),
    },
    // left 原始数据
    leftOriginalList: {
      type: Array,
      default: () => [],
    },
    // right 原始数据
    rightOriginalList: {
      type: Array,
      default: () => [],
    },
    // 最大可保存数据量
    maxLimitCount: {
      type: Number,
      default: 0,
    },
    // left 标题
    leftTitle: {
      type: String,
      default: "可选项",
    },
    // right 标题
    rightTitle: {
      type: String,
      default: "已选项",
    },
  },
  data() {
    return {
      leftAllChecked: false, // left 全选checkbox
      leftDataList: [], // left 所有数据
      leftCheckedList: [], // left 选中的数据
      isIndeterminateLeft: false,
      rightAllChecked: false, // right 全选checkbox
      rightDataList: [], // right 所有数据
      rightCheckedList: [], // right 选中的数据 =>rightCheckedKeyList对应的 对象数组
      rightCheckedKeyList: [], // right 选中的 key list => 绑定在 el-checkbox-group上的 list
      isIndeterminateRight: false,
      drag: false,
    };
  },
  // 初始化
  watch: {
    leftOriginalList: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.leftDataList = JSON.parse(JSON.stringify(newVal));
        this.leftCheckedList = [];
        this.leftAllChecked = false;
        this.isIndeterminateLeft = false;
      },
    },
    rightOriginalList: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.rightDataList = JSON.parse(JSON.stringify(newVal));
        this.rightCheckedList = [];
        this.rightCheckedKeyList = [];
        this.rightAllChecked = false;
        this.isIndeterminateRight = false;
      },
    },
  },
  computed: {
    // left 所有子节点数据的数量
    leftDataTotal() {
      let count = 0;
      this.leftDataList.forEach((v) => {
        if (v[this.defaultProps.children]) {
          count += v[this.defaultProps.children].length;
        }
      });
      return count;
    },
  },
  methods: {
    // 选择——left
    handleCheckLeft(val, { checkedNodes }) {
      // 包含了父节点
      const checkedCount = checkedNodes.length;
      const totalNodeCount = this.leftDataTotal + this.leftDataList.length;
      this.leftAllChecked = checkedCount === totalNodeCount;
      this.isIndeterminateLeft = checkedCount > 0 && checkedCount < totalNodeCount;
      // 手动剔除父节点
      this.leftCheckedList = checkedNodes.filter((v) => !v[this.defaultProps.children]);
    },
    // 选择——right
    handleCheckRight(val) {
      const checkedCount = val.length;
      this.rightAllChecked = checkedCount === this.rightDataList.length;
      this.isIndeterminateRight = checkedCount > 0 && checkedCount < this.rightDataList.length;
      // 手动组织对象数组
      this.rightCheckedList = this.rightDataList.filter((v) => val.includes(v[this.defaultProps.key]));
    },
    // 全选——left
    handleCheckAllChangeLeft(val) {
      this.isIndeterminateLeft = false;
      const checkedNodes = [];
      if (val) {
        this.leftDataList.forEach((v) => {
          checkedNodes.push(v);
          if (v[this.defaultProps.children]) {
            v[this.defaultProps.children].forEach((child) => {
              checkedNodes.push(child);
            });
          }
        });
      }
      // 手动赋checkedlist值
      this.leftCheckedList = checkedNodes.filter((v) => !v[this.defaultProps.children]);
      this.$refs.leftTree.setCheckedNodes(checkedNodes);
    },
    // 全选——right
    handleCheckAllChangeRight(val) {
      this.isIndeterminateRight = false;
      this.rightCheckedKeyList = val ? this.rightDataList.map((v) => v[this.defaultProps.key]) : [];
      // 手动赋checkedlist值
      this.rightCheckedList = val ? this.rightDataList.map((v) => v) : [];
    },
    // 传递 right => left
    handleLeftChange() {
      // left +
      const leftDataMap = {};
      this.leftDataList.forEach((v) => {
        leftDataMap[v[this.defaultProps.key]] = v[this.defaultProps.children] || [];
      });
      this.rightCheckedList.forEach((v) => {
        leftDataMap[v[this.defaultProps.parentKey]].push(v);
      });
      // right -
      this.rightDataList = this.rightDataList.filter((v) => !this.rightCheckedKeyList.includes(v[this.defaultProps.key]));
      // 清空选中数组
      this.rightCheckedList = [];
      this.rightCheckedKeyList = [];
      // right 全选 => 直接取消
      this.rightAllChecked = false;
      this.isIndeterminateRight = false;
      // left 全选 => 原先没有选中/半选中=>不动，原先全选=>半选中 => 重新渲染一次 tree组件选中
      if (this.leftAllChecked && !this.isIndeterminateLeft) {
        this.leftAllChecked = false;
        this.isIndeterminateLeft = true;
      }
      // 先清空再重置，直接重置的话，父节点的状态会有问题
      this.$refs.leftTree.setCheckedNodes([]);
      this.$nextTick(() => {
        this.$refs.leftTree.setCheckedNodes(this.leftCheckedList);
      });
      // 传递当前数据分布
      this.$emit("change", {
        left: this.leftDataList,
        right: this.rightDataList,
      });
    },
    // 传递 left => right
    handleRightChange() {
      // right +
      this.rightDataList.push(...this.leftCheckedList);
      // left -
      const { key, children } = this.defaultProps;
      const checkedKeys = this.leftCheckedList.map((v) => v[key]);
      this.leftDataList.forEach((v) => {
        if (v[children]) {
          v[children] = v[children].filter((child) => !checkedKeys.includes(child[key]));
        }
      });
      // 清空选中数组
      this.leftCheckedList = [];
      // 清空 tree组件选中
      this.$refs.leftTree.setCheckedNodes([]);
      // left 全选 => 直接取消
      this.leftAllChecked = false;
      this.isIndeterminateLeft = false;
      // right 全选 => 原先没有选中/半选中=>不动，原先全选=>半选中
      if (this.rightAllChecked && !this.isIndeterminateRight) {
        this.rightAllChecked = false;
        this.isIndeterminateRight = true;
      }
      // 传递当前数据分布
      this.$emit("change", {
        left: this.leftDataList,
        right: this.rightDataList,
      });
    },
    handleOrder() {
      // 传递当前数据分布
      this.$emit("change", {
        left: this.leftDataList,
        right: this.rightDataList,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-tree {
  display: flex;
  width: 100%;
  .transfer-panel {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid #165dff;
    .transfer-panel-header {
      display: flex;
      justify-content: space-between;
      height: 30px;
      line-height: 30px;
      border-radius: 3px 3px 0px 0px;
      padding: 0 12px;
      ::v-deep .el-checkbox {
        .el-checkbox__label {
          color: #165dff;
          font-size: 14px;
          padding-left: 8px;
        }
      }
      .transfer-panel-ratio {
        font-size: 12px;
        color: #165dff;
      }
    }
    .transfer-panel-body {
      height: 200px;
      padding: 12px 12px 0 12px;
      border-top: 1px solid #165dff;
      overflow: auto;
      .transfer-panel-filter {
        float: right;
        width: 170px;
        .el-checkbox__label {
          color: #165dff;
          font-size: 12px;
          padding-left: 8px;
        }
        .el-input__inner {
          height: 26px;
          border: none;
        }
      }
      ::v-deep .el-tree {
        color: #165dff;
        margin-bottom: 4px;
        .el-tree-node__content {
          height: 22px;
          margin-bottom: 8px;
          .el-tree-node__label {
            font-size: 12px;
          }
        }
        .el-tree-node__children {
          .el-tree-node__content {
            padding-left: 12px !important;
          }
        }
        .el-tree-node__expand-icon {
          margin-left: -6px;
        }
      }
      ::v-deep .el-checkbox-group {
        margin-bottom: 4px;
        .el-checkbox {
          display: block;
          line-height: 22px;
          color: #165dff;
          margin-bottom: 8px;
          width: 100%;
          .el-checkbox__label {
            width: calc(100% - 5px);
            position: relative;
            font-size: 12px;
            padding-left: 8px;
            img {
              position: absolute;
              right: 0;
              top: 2px;
            }
          }
        }
      }
    }
  }
  .transfer-buttons {
    display: flex;
    justify-content: center;
    flex-flow: column;
    margin: 0 12px;
    .el-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 24px;
      padding: 0;
      margin-left: 0;
    }
  }
}
::v-deep .el-empty {
  height: 60px;
  padding: 0;
  .el-empty__image {
    display: none;
  }
  .el-empty__description {
    margin: 0;
  }
}
</style>
