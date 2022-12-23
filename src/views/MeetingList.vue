<template>
  <div class="meeting_list h-full w-full p-5">
    <!--<load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>-->
    <div class="flex-col space-y-10 rounded-xl bg-white p-10 shadow-6">
      <!--標題-->
      <div class="title-before mb-5 flex border-b border-b-gray-300 pb-5">
        <div class="flex flex-1 space-x-2">
          <a-button type="primary" @click="add">新增會議記錄</a-button>
          <a-button type="primary">個人會辦</a-button>
          <a-button type="primary" status="success">匯出資料</a-button>
        </div>
        <div class="inline-block flex items-center space-x-4">
          <div class="flex-1 text-right">快速搜尋：</div>
          <el-input v-model="wholeSearch" placeholder="請輸入關鍵字" class="flex-1"></el-input>
        </div>
      </div>

      <test></test>
      <!--表格-->
      <el-table :data="tables.slice((currentPage - 1) * pageSize, currentPage * pageSize)" ref="multipleTable" :header-cell-style="handerMethod">
        <el-table-column label="類型" prop="type" sortable>
          <el-table-column prop="type">
            <template #header>
              <el-select v-model="search.type" size="mini" placeholder="請選擇" clearable>
                <el-option v-for="item in typeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
            <template #default="scope">
              <span v-html="showDate(scope.row.type)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="專案編碼及名稱" prop="name" sortable>
          <el-table-column prop="name" show-overflow-tooltip>
            <template #header>
              <el-input placeholder="關鍵字" v-model="search.name"></el-input>
            </template>
            <template #default="scope">
              <span class="truncate" v-html="showDate(scope.row.name)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="會議主題" prop="theme" sortable>
          <el-table-column prop="theme">
            <template #header>
              <el-input placeholder="關鍵字" v-model="search.theme"></el-input>
            </template>
            <template #default="scope">
              <span v-html="showDate(scope.row.theme)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="會議日期" prop="date" sortable>
          <el-table-column prop="date">
            <template #header>
              <a-trigger trigger="click" :unmount-on-close="false">
                <el-button class="w-full">日期搜尋</el-button>
                <template #content>
                  <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                    <el-date-picker v-model="search.start" type="date" placeholder="開始" value-format="YYYY-MM-DD"></el-date-picker>
                    <el-date-picker v-model="search.end" type="date" placeholder="結束" value-format="YYYY-MM-DD"></el-date-picker>
                  </div>
                </template>
              </a-trigger>
            </template>
            <template #default="scope">
              <span v-html="showDate(scope.row.date)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="負責人員" prop="principal" sortable>
          <el-table-column prop="principal">
            <template #header>
              <el-input placeholder="關鍵字" v-model="search.principalName"></el-input>
            </template>
            <template #default="scope">
              <span v-html="showDate(scope.row.principal.name)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="部門" prop="chairman" sortable>
          <el-table-column prop="chairman">
            <template #header>
              <el-input placeholder="關鍵字" v-model="search.principalDepartment"></el-input>
            </template>
            <template #default="scope">
              <span v-html="showDate(scope.row.principal.department)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="出席人員" prop="member" sortable>
          <el-table-column prop="member" width="130" show-overflow-tooltip>
            <template #header>
              <el-input placeholder="關鍵字" v-model="search.member"></el-input>
            </template>
            <template #default="scope">
              <span class="truncate" v-html="showDate(scope.row.member)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="簽核" prop="approvals" sortable>
          <el-table-column prop="approvals" min-width="110">
            <template #header>
              <el-select v-model="search.approvals" size="mini" placeholder="請選擇" clearable>
                <el-option v-for="item in approvalsSelect" :key="item.value" :label="item.value" :value="item.value"></el-option>
              </el-select>
            </template>
            <template #default="scope">
              <a-tag v-if="scope.row.approvals === '已簽核'" color="arcoblue" v-html="showDate(scope.row.approvals)"></a-tag>
              <div v-else-if="scope.row.approvals === '待送簽'" class="flex items-center space-x-2">
                <a-tag v-show="scope.row.approvals === '待送簽'" color="red" v-html="showDate(scope.row.approvals)"></a-tag>
                <a-button v-show="scope.row.approvals === '待送簽' && scope.row.principal.name === '王大明'" type="primary" @click="sendPetition(scope.row)">送簽</a-button>
              </div>
              <a-tag v-else color="purple" v-html="showDate(scope.row.approvals)"></a-tag>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="會辦" prop="countersign">
          <el-table-column show-overflow-tooltip min-width="40">
            <template #default="scope">
              <a-button type="primary" status="success" v-show="countersignEdit === false" @click="edit_countersign(scope.$index, scope.row)">編輯</a-button>
              <!--<el-input v-model="scope.row.countersign.name" @focus="edit_countersign(scope.$index, scope.row)"></el-input>-->
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="會辦人員" prop="countersign">
          <el-table-column prop="countersign" width="130" show-overflow-tooltip>
            <template #default="scope">
              <div class="truncate">
                <span v-for="item in scope.row.countersign" :key="item.id">{{ item.name }},</span>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="備註" prop="remark" sortable>
          <el-table-column prop="remark" show-overflow-tooltip>
            <template #header>
              <el-input placeholder="關鍵字" v-model="search.remark"></el-input>
            </template>
            <template #default="scope">
              <span v-if="scope.row.remark === ''">無</span>
              <span v-else class="truncate" v-html="showDate(scope.row.remark)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="編修" align="center" fixed="right" width="100">
          <template #header>
            <div class="w-full text-center">編修</div>
          </template>
          <template #default="scope">
            <!--待送簽僅負責人可以修改-->
            <a-button v-if="scope.row.approvals === '待送簽' && scope.row.principal.name === '王大明'" type="text" class="ml-0 w-full" @click="Edit_PricingList(scope.$index, scope.row)">
              修改
              <i class="ri-pencil-fill"></i>
            </a-button>

            <!--部門主管可以修改未簽核的所有事件-->
            <a-button v-if="scope.row.approvals !== '已簽核' && scope.row.principal.department === '建一部2'" type="text" class="ml-0 w-full" @click="Edit_PricingList(scope.$index, scope.row)">
              修改
              <i class="ri-pencil-fill"></i>
            </a-button>

            <!--已簽核即無法修改-->
            <a-button v-else type="text" status="success" class="ml-0 w-full" @click="View_PricingList(scope.$index, scope.row)">
              檢視
              <i class="ri-eye-fill"></i>
            </a-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分頁-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes,prev, pager, next"
        :total="dataList.length"
        prev-text="上一頁"
        next-text="下一頁"
      ></el-pagination>
    </div>
  </div>

  <!--<memberDialog v-model="dialogVisible" @resetPopupData="memberListDialog_Cancel" @submitPopupData="memberListDialog_Confirm" @selected-user="selectedUser"></memberDialog>-->
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
</template>

<script>
import test from "@/views/test";
// import memberDialog from "@/components/memberDialog";
import { meetingList, userList } from "@/views/config/api";
export default {
  name: "HomeView",
  components: {
    // memberDialog,
    test,
  },
  created() {
    this.getApi();
  },
  data() {
    return {
      editForm: {
        id: "",
        countersign: "",
      }, //選擇員工待存區
      searchText: "",
      inputContent: "",
      dialogVisible: false,
      wholeSearch: "",
      currentPage: 1, //默認顯示頁面為1
      pageSize: 10, //每頁顯示的數據
      keywordSearch: "",
      loading: true,
      loadingData: 0,
      color: "#673ab7",

      dateSearch: "",
      typeSelect: [
        {
          text: "專案",
          value: "專案",
        },
        {
          text: "例行性會議",
          value: "例行性會議",
        },
        {
          text: "建築行政",
          value: "建築行政",
        },
        {
          text: "一般行政",
          value: "一般行政",
        },
      ], //類型選單
      approvalsSelect: [
        {
          value: "待送簽", //負責人是本人的狀態下出現「送簽按鈕」
        },
        {
          value: "待簽核", //已送簽，主管未簽核
        },
        {
          value: "已簽核",
        },
      ], //簽核狀態選單
      dataList: [],
      memberList: [],
      countersignEdit: false, //編輯會辦人員
      /** 表頭搜尋 */
      search: {
        type: "",
        name: "",
        theme: "",
        principalName: "",
        principalDepartment: "",
        chairman: "",
        member: "",
        approvals: "",
        remark: "",
        start: "",
        end: "",
      },
    };
  },
  methods: {
    // 獲取API
    getApi() {
      meetingList().then((res) => {
        this.dataList = res.data;
      });
      userList().then((res) => {
        this.memberList = res.data;
      });
      setTimeout(() => {
        if (this.loadingData === 100) {
          this.loading = false;
        }
      }, 1500);
    },

    Edit_PricingList(index, result) {
      let data = JSON.stringify(result);
      this.$router.push({ path: "editMeeting", query: { res: data, editStatus: true } });
    },

    View_PricingList(index, result) {
      let data = JSON.stringify(result);
      this.$router.push({ path: "editMeeting", query: { res: data, editStatus: false } });
    },

    add() {
      this.$router.push({ name: "addMeeting" });
    },

    getTime(val) {
      //   獲取時間並格式化
      var now = new Date();
      val === 0 ? "" : now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * val); //   獲取前val天的時間
      // val === 0 ? "" : now.setTime(now.getTime() + 24 * 60 * 60 * 1000 * val); //   獲取後val天的時間
      const hh = (now.getHours() + "").padStart(2, "0");
      const mm = (now.getMinutes() + "").padStart(2, "0");
      const ss = (now.getSeconds() + "").padStart(2, "0");
      //獲取當前的星期
      let wk = now.getDay();
      let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      let week = weeks[wk];
      this.form.time = week;
      return `${hh}:${mm}:${ss}`; // 獲取的時間格式為 2021-11-16 11:37:15
      //return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`; // 獲取的時間格式為 2021年11月16日 11:37:15
      // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`; // 獲取的時間格式為 2021-04-09 11:37:15
      // return y + m + d                           // 獲取的時間格式為  20210409
    },

    // 送簽
    sendPetition(index, row) {
      console.log(row);
      this.$swal.fire({
        title: "你確定嗎？",
        text: "即將送出簽核",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#0084ff",
        confirmButtonColor: "#cccccc",
        confirmButtonText: "確定送出",
        cancelButtonText: "取消",
        closeOnConfirm: false,
      });
    },

    /** 會辦 */
    selectedUser(userInfo) {
      const user = userInfo;
      if (user instanceof Array) {
        this.editForm.countersign = user;
      }
    },
    // 會辦畫面選擇對象
    select(val) {
      this.editForm.countersign = val;
    },
    //開啟會辦選擇視窗
    edit_countersign(index, row) {
      this.dialogVisible = true;
      this.editForm = JSON.parse(JSON.stringify(row));
      // this.editForm = row;

      // el-table的checkbox預設勾選
      this.$nextTick(() => {
        this.editForm.countersign.forEach((item) => {
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
      let id = this.editForm.id;
      let obj = this.editForm;
      this.axios
        .patch("http://localhost:3000/meetingList/" + `${id}`, obj)
        .then((response) => {
          this.editForm.id = response.data.id;
          this.getApi();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    //取消
    memberListDialog_Cancel() {
      this.dialogVisible = false;
      this.$nextTick(() => {
        this.editForm.countersign.forEach((item) => {
          this.$refs.multipleTables.toggleRowSelection(item, false);
        });
      });
    },

    /** 會議記錄總表 */
    //會議記錄總表表頭合併
    handerMethod({ row, columnIndex }) {
      if (row[0].level === 1) {
        row[8].colSpan = 2;
        row[9].colSpan = 0;
        if (columnIndex === 9) {
          return { display: "none" };
        }
      }
    },

    // 搜尋高光
    showDate(val) {
      val = val + "";
      if (val.indexOf(this.wholeSearch) !== -1 && this.wholeSearch !== "") {
        return val.replace(this.wholeSearch, '<span style="color: #000; background: gold">' + this.wholeSearch + "</span>");
      } else {
        return val;
      }
    },

    // table下拉篩選
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },

    //每頁下拉數據
    handleSizeChange: function (size) {
      this.pageSize = size;
    },

    //點擊第幾頁
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },

    // 單筆刪除
    handleDelete(index, row) {
      this.configForm = row;
      const id = this.configForm.id;

      this.$swal
        .fire({
          title: "你確定嗎？",
          text: "資料刪除後將無法復原",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#0084ff",
          confirmButtonColor: "#cccccc",
          confirmButtonText: "確定刪除",
          cancelButtonText: "取消",
          closeOnConfirm: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.axios
              .delete("http://localhost:3000/configForm/" + `${id}`, row)
              .then((response) => {
                this.configForm.id = response.data.id;
                this.getApi();
              })
              .catch((error) => {
                console.error("There was an error!", error);
              });
          }
        })
        .catch(() => {});
    },

    //日期區間搜尋使用
    localizeDate(date) {
      if (!date || !date.includes("-")) return date;
      const [yyyy, mm, dd] = date.split("-");
      return new Date(`${mm}/${dd}/${yyyy}`);
    },
  },
  computed: {
    // 搜尋
    tables() {
      const search = this.wholeSearch;
      const search2 = this.search.type;
      const search3 = this.search.name;
      const search4 = this.search.theme;
      const search5 = this.search.principalName;
      const search6 = this.search.principalDepartment;
      const search7 = this.search.member;
      const search8 = this.search.approvals;
      const search10 = this.search.remark;

      if (search) {
        return this.dataList.filter((data) => {
          return Object.keys(data).some((key) => {
            // return String(data[key]).toLowerCase().indexOf(search) > -1;
            return String(data[key]).toLowerCase().includes(search.toLowerCase());
          });
        });
      } else if (search2) {
        return this.dataList.filter((data) => {
          return String(data.type).toLowerCase().includes(search2.toLowerCase());
        });
      } else if (search3) {
        return this.dataList.filter((data) => {
          return String(data.name).toLowerCase().includes(search3.toLowerCase());
        });
      } else if (search4) {
        return this.dataList.filter((data) => {
          return String(data.theme).toLowerCase().includes(search4.toLowerCase());
        });
      } else if (search5) {
        return this.dataList.filter((data) => {
          return String(data.principal.name).toLowerCase().includes(search5.toLowerCase());
        });
      } else if (search6) {
        return this.dataList.filter((data) => {
          return String(data.principal.department).toLowerCase().includes(search6.toLowerCase());
        });
      } else if (search7) {
        return this.dataList.filter((data) => {
          return String(data.member).toLowerCase().includes(search7.toLowerCase());
        });
      } else if (search8) {
        return this.dataList.filter((data) => {
          return String(data.approvals).toLowerCase().includes(search8.toLowerCase());
        });
      } else if (search10) {
        return this.dataList.filter((data) => {
          return String(data.remark).toLowerCase().includes(search10.toLowerCase());
        });
      } else {
        const startDone = this.localizeDate(this.search.start);
        const endDone = this.localizeDate(this.search.end);
        return this.dataList.filter((item) => {
          const itemDate = new Date(item.date);
          if (startDone && endDone) {
            return startDone <= itemDate && itemDate <= endDone;
          }
          if (startDone && !endDone) {
            return startDone <= itemDate;
          }
          if (!startDone && endDone) {
            return itemDate <= endDone;
          }
          return true;
        });
      }

      // return this.dataList;
    },
  },
  watch: {},
  mounted() {},
};
</script>
<style lang="scss">
.meeting_list {
  .el-table {
    .cell {
      color: #1d2129;
      display: flex;
      align-items: center;
    }
    th.el-table__cell {
      background-color: #f2f3f5 !important;
    }
  }

  .el-table--border .el-table__cell {
    border-right: none !important;
  }
}
</style>
