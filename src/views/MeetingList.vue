<template>
  <div class="w-full h-full p-5 meeting_list">
    <!--<load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>-->
    <div class="flex-col space-y-10 rounded-xl bg-white p-10 shadow-6">
      <!--標題-->
      <div class="title-before mb-5 flex border-b border-b-gray-300 pb-5">
        <div class="flex flex-1 space-x-2">
          <a-button type="primary" @click="add">新增會議記錄</a-button>
          <a-button type="primary" status="success">匯出資料</a-button>
        </div>
        <div class="flex space-x-4 inline-block items-center">
          <div class="flex-1 text-right">快速搜尋：</div>
          <el-input v-model="wholeSearch" placeholder="請輸入關鍵字" class="flex-1"></el-input>
        </div>
      </div>
      <!--表格-->
      <el-table :data="tables.slice((currentPage - 1) * pageSize, currentPage * pageSize)" ref="multipleTable" style="width: 100%">
        <el-table-column label="類型" prop="type" width="100" :filters="typeSelect" :filter-method="filterHandler" :filter-multiple="false">
          <template #default="scope">
            <span v-html="showDate(scope.row.type)"></span>
          </template>
        </el-table-column>
        <el-table-column label="專案代碼及名稱" prop="name" min-width="250">
          <template #default="scope">
            <span v-html="showDate(scope.row.name)"></span>
          </template>
        </el-table-column>
        <el-table-column label="會議主題" prop="theme" width="200">
          <template #default="scope">
            <span v-html="showDate(scope.row.theme)"></span>
          </template>
        </el-table-column>
        <el-table-column label="會議日期" prop="date" align="center" width="150">
          <template #header>
            <div class="flex items-center">
              會議日期
              <a-trigger trigger="click" :unmount-on-close="false">
                <a-button><i class="ri-search-line"></i></a-button>
                <template #content>
                  <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                    <selectFilterHeader v-model="dateSearch" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                  </div>
                </template>
              </a-trigger>
            </div>
          </template>
          <template #default="scope">
            <span v-html="showDate(scope.row.date)"></span>
          </template>
        </el-table-column>
        <el-table-column label="負責人" prop="principal" align="center" width="100">
          <template #default="scope">
            <span v-html="showDate(scope.row.principal)"></span>
          </template>
        </el-table-column>
        <el-table-column label="部門" prop="chairman" align="center" width="100">
          <template #default="scope">
            <span v-html="showDate(scope.row.chairman)"></span>
          </template>
        </el-table-column>
        <el-table-column label="出席人員" prop="member" width="250">
          <template #default="scope">
            <span v-html="showDate(scope.row.member)"></span>
          </template>
        </el-table-column>
        <el-table-column label="簽核" prop="approvals" align="center" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.approvals === '已簽核'" type="success" v-html="showDate(scope.row.approvals)"></el-tag>
            <el-tag v-else-if="scope.row.approvals === '待簽核'" type="danger" v-html="showDate(scope.row.approvals)"></el-tag>
            <a-button v-else type="primary" @click="sendPetition(scope.row)">送簽</a-button>
          </template>
        </el-table-column>
        <el-table-column label="備註" prop="remark" width="250">
          <template #default="scope">
            <span v-if="scope.row.remark === ''">無</span>
            <span v-else v-html="showDate(scope.row.remark)"></span>
          </template>
        </el-table-column>
        <el-table-column label="編修" align="center" fixed="right" width="100">
          <template #default="scope">
            <!--<el-button type="text" size="small">檢視</el-button>-->

            <el-button type="text" size="small" class="ml-0" @click="Edit_PricingList(scope.$index, scope.row)">修改</el-button>
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
</template>

<script>
import selectFilterHeader from "@/components/selectFilterHeader";
import axios from "axios";
export default {
  name: "HomeView",
  components: { selectFilterHeader },
  created() {
    this.getApi();
  },
  data() {
    return {
      wholeSearch: "",
      currentPage: 1, //默認顯示頁面為1
      pageSize: 5, //每頁顯示的數據
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
      dataList: [],
    };
  },
  methods: {
    // 獲取API
    getApi() {
      function getAPI() {
        return axios.get("http://localhost:3000/meetingList");
      }

      Promise.all([getAPI()]).then((response) => {
        this.dataList = response[0].data;
        this.loadingData = 100;
      });

      setTimeout(() => {
        if (this.loadingData === 100) {
          this.loading = false;
        }
      }, 1500);
    },

    Edit_PricingList(index, result) {
      let data = JSON.stringify(result);
      this.$router.push({ path: "editMeeting", query: { res: data } });
      /*this.$router.push({
        path: "editMeeting",
        query: {
          id: row.id,
          principal: row.principal,
          type: row.type,
          name: row.name,
          textarea: row.textarea,
          chairman: row.chairman,
          record: row.record,
          date: row.date,
          time: row.time,
          theme: row.theme,
          member: row.member,
          offer: row.offer,
          accessory: row.accessory,
          fileList: row.fileList,
          detailList: JSON.parse(JSON.stringify(row.detailList)),
        },
      });*/
    },

    add() {
      this.$router.push({ name: "addMeeting" });
    },

    getTime(val) {
      //   获取时间并格式化
      var now = new Date();
      val === 0 ? "" : now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * val); //   获取前val天的时间
      // val === 0 ? "" : now.setTime(now.getTime() + 24 * 60 * 60 * 1000 * val); //   获取后val天的时间
      const hh = (now.getHours() + "").padStart(2, "0");
      const mm = (now.getMinutes() + "").padStart(2, "0");
      const ss = (now.getSeconds() + "").padStart(2, "0");
      //获取当前的星期
      let wk = now.getDay();
      let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      let week = weeks[wk];
      this.form.time = week;
      return `${hh}:${mm}:${ss}`; // 获取的时间格式为 2021-11-16 11:37:15
      //return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`; // 获取的时间格式为 2021年11月16日 11:37:15
      // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`; // 获取的时间格式为 2021-04-09 11:37:15
      // return y + m + d                           // 获取的时间格式为  20210409
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
  },
  computed: {
    // 搜尋
    tables() {
      const search = this.wholeSearch;
      if (search) {
        return this.dataList.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(search) > -1;
          });
        });
      }
      return this.dataList;
    },
  },
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
}
</style>
