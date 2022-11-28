<template>
  <el-scrollbar class="w-full h-full">
    <!--<load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>-->
    <breadcrumb></breadcrumb>
    <div class="flex-col space-y-7 mx-5 mb-5 flex-col rounded-xl bg-white p-10 shadow-6">
      <!--標題-->
      <div class="title-before flex border-b border-b-gray-300 pb-5 h-14">
        <p class="flex-1 text-left text-3xl font-bold">會議記錄表-{{ formTitle }}</p>
        <div class="flex space-x-2 h-10">
          <el-button plain @click="saveButton">返回</el-button>
        </div>
      </div>
      <!--表格-->
      <el-form ref="form" :rules="rules" :model="form" :inline="true" class="flex flex-col space-y-3 meeting_form">
        <!--會議標題-->
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="負責人" prop="principal" class="flex mb-0 w-full">
            <member-list-dialog v-model="form.principal" :value="form.principal" disabled></member-list-dialog>
          </el-form-item>
          <el-form-item label="專案代碼及名稱" prop="name" class="flex mb-0 w-full">
            <el-cascader v-model="form.name" :options="options" clearable @change="handleChange" disabled class="flex-1 w-full"></el-cascader>
          </el-form-item>
        </div>
        <!--摘要-->
        <div class="p-5 rounded-lg bg-gray-100 flex flex-col space-y-4">
          <div class="flex space-x-3">
            <div class="flex-1 flex justify-star space-x-3">
              <a-button type="primary" status="success" disabled @click="openopenDialogOption">目前待辦</a-button>
              <a-button type="primary" status="success" disabled @click="openMeetingDialog">前次會議記錄</a-button>
            </div>
            <el-button plain @click="clearTextarea" disabled>清空</el-button>
            <a-button type="primary" disabled @click="send">新增</a-button>
          </div>
          <el-input type="textarea" :rows="5" placeholder="請輸入摘要內容" v-model="form.textarea" disabled></el-input>
        </div>
        <!--詳細內容-->
        <div class="p-5 rounded-lg bg-gray-100 flex flex-col space-y-4 meetingForm">
          <div class="grid grid-cols-4 gap-4">
            <el-form-item label-width="69px" label="主席" prop="chairman" class="flex mb-0 w-full">
              <member-list-dialog v-model="form.chairman" :value="form.chairman" disabled></member-list-dialog>
            </el-form-item>
            <el-form-item label="紀錄" prop="record" class="flex mb-0 w-full">
              <member-list-dialog v-model="form.record" :value="form.record" disabled></member-list-dialog>
            </el-form-item>
            <el-form-item label="會議日期" prop="date" class="flex mb-0 w-full">
              <el-date-picker placeholder="請選擇日期" type="date" v-model="form.date" disabled></el-date-picker>
            </el-form-item>
            <el-form-item label="會議時間" prop="time" class="flex mb-0 w-full">
              <el-time-picker type="date" v-model="form.time" is-range range-separator="~" start-placeholder="開始時間" end-placeholder="結束時間" disabled></el-time-picker>
            </el-form-item>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="會議主題" prop="theme" class="flex mb-0 w-full">
              <el-input v-model="form.theme" placeholder="請輸入內容" disabled></el-input>
            </el-form-item>
            <el-form-item label="出席人員" prop="member" class="flex mb-0 w-full">
              <member-list-dialog-even v-model="form.member" :value="form.member" disabled></member-list-dialog-even>
            </el-form-item>
          </div>

          <el-form-item label="客戶提供內容" prop="accessory" class="flex radio_center">
            <el-radio-group v-model="form.offer" class="flex justify-star items-center" disabled>
              <el-radio :label="0" v-model="form.offer">否</el-radio>
              <el-radio :label="1" v-model="form.offer">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="form.offer === 1" class="flex flex-col space-y-2 p-4 rounded-lg bg-gray-200">
            <el-checkbox-group v-model="form.accessory">
              <el-checkbox v-for="item in accessoryList" :label="item.accessoryLabel" :key="item.accessoryLabel" :velus="item.accessoryLabel" @change="(val) => handleChecked(val, item)">
                {{ item.accessoryLabel }}
                <el-input class="w-56" v-show="item.accessoryLabel === '光碟' || item.accessoryLabel === '建材樣品'" v-model="item.accessoryNo" size="small" placeholder="請輸入內容"></el-input>
              </el-checkbox>
            </el-checkbox-group>

            <a-upload action="/" :auto-upload="false" multiple :default-file-list="form.fileList" @change="onChange" />
          </div>
        </div>
        <!--會議列表-->
        <a-table :columns="columns" :data="form.detailList" column-resizable :scroll="{ x: 2000 }">
          <template #columns>
            <a-table-column fixed="left" title="內容摘要">
              <template #cell="{ record }">
                <el-input v-if="record.edit === true" v-model="record.content" placeholder="請輸入摘要內容" clearable></el-input>
                <span v-else>{{ record.content }}</span>
              </template>
            </a-table-column>
            <a-table-column title="流水編號">
              <template #cell="{ record }">
                <el-input v-if="record.edit === true" v-model="record.number" placeholder="請輸入內容" clearable></el-input>
                <span v-else>{{ record.number }}</span>
              </template>
            </a-table-column>
            <a-table-column title="結論待辦">
              <template #cell="{ record }">
                <div v-if="record.edit === true">
                  <el-select v-model="record.conclusion" class="flex-1 w-full" clearable>
                    <el-option v-for="item in conclusionOption" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </div>
                <div v-else>
                  <span v-if="record.conclusion === '結案'" class="text-green-500">{{ record.conclusion }}</span>
                  <span v-else class="text-red-500">{{ record.conclusion }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="專案代碼及名稱">
              <template #cell="{ record }">
                <!-- <div v-if="record.edit === true" class="flex flex-col space-y-2">
                  <el-select v-model="record.name1" class="flex-1 w-full" @change="getRole($event)" clearable placeholder="請選擇">
                    <el-option v-for="item in select1" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select v-model="record.name" class="flex-1 w-full" filterable placeholder="請先選擇類型" @change="getList($event)">
                    <el-option v-for="item in select2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </div>-->
                <el-cascader v-if="record.edit === true" v-model="record.name" :options="options" clearable @change="record.name = record.name.slice(1).toString()"></el-cascader>
                <span v-else>{{ record.name }}</span>
              </template>
            </a-table-column>
            <a-table-column title="負責人">
              <template #cell="{ record }">
                <member-list-dialog v-if="record.edit === true" v-model="record.principal" :value="record.principal"></member-list-dialog>
                <span v-else>{{ record.principal }}</span>
              </template>
            </a-table-column>
            <a-table-column title="預計日期">
              <template #cell="{ record }">
                <el-date-picker v-if="record.edit === true" v-model="record.date" type="date" placeholder="請選擇日期" clearable format="YYYY/MM/DD" value-format="YYYY年MM月DD日"></el-date-picker>
                <span v-else>{{ record.date }}</span>
              </template>
            </a-table-column>
            <a-table-column title="相關人員">
              <template #cell="{ record }">
                <member-list-dialog v-if="record.edit === true" v-model="record.member" :value="record.member"></member-list-dialog>
                <span v-else>{{ record.member }}</span>
              </template>
            </a-table-column>
            <a-table-column title="附件">
              <template #cell="{ record }">
                <a-upload v-if="record.edit === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                  <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
                </a-upload>
                <span v-else>{{ record.accessory }}</span>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </el-form>
    </div>
    <a-modal :title="dialogTitle" v-model:visible="openDialogOption" :width="1000" draggable class="list_select">
      <el-table ref="filterTable" :data="tables" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
        <el-table-column prop="date" label="待辦發生日期" width="150">
          <template #default="scope">
            <span v-html="showDate(scope.row.date)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="meetingList" label="待辦事項" width="250">
          <template #default="scope">
            <span v-html="showDate(scope.row.meetingList)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="no" label="流水號編碼" width="300">
          <template #default="scope">
            <span v-html="showDate(scope.row.no)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="執行狀態" align="center">
          <template #default="scope">
            <span v-html="showDate(scope.row.status)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="專案代碼及名稱" width="250" column-key="tagKey">
          <template #default="scope">
            <span v-html="showDate(scope.row.name)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="負責人">
          <template #default="scope">
            <span v-html="showDate(scope.row.principal)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="doneDate" label="預計完成日期" width="150">
          <template #default="scope">
            <span v-html="showDate(scope.row.doneDate)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="member" label="相關人員" width="250">
          <template #default="scope">
            <span v-html="showDate(scope.row.member)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="accessory" label="附件" width="150"></el-table-column>
      </el-table>
      <template #footer>
        <a-button type="outline" @click="selectMeetingCancelButton">取消</a-button>
        <a-button type="primary" @click="selectMeetingDoneButton">送出</a-button>
      </template>
    </a-modal>
  </el-scrollbar>
</template>

<script>
import breadcrumb from "@/components/breadcrumb";
import moment from "moment";
import memberListDialog from "@/components/memberListDialog";
import memberListDialogEven from "@/components/memberListDialogEven";
import axios from "axios";
// import axios from "axios";

let select1 = [
  { value: "專案", label: "專案" },
  { value: "例行性會議", label: "例行性會議" },
  { value: "建築行政", label: "建築行政" },
  { value: "一般行政", label: "一般行政" },
];
let allrole = [
  { pro: "專案", label: "A18002-公共工程投標案" },
  { pro: "專案", label: "A22003-億集科技例行會議" },
  { pro: "例行性會議", label: "UD0840-0840早會" },
  { pro: "例行性會議", label: "UD1330-1330部門會議" },
  { pro: "建築行政", label: "MYN2B/-製圖準則" },
  { pro: "建築行政", label: "MYN2D/-室內" },
  { pro: "一般行政", label: "GYN06/-財務會計" },
];

export default {
  name: "HomeView",
  components: {
    breadcrumb,
    memberListDialog,
    memberListDialogEven,
  },
  data() {
    return {
      search: ["fg", "dfg", "dfgh", "dfg", "fg", "dfcv", "dfg", "fg", "fg"],
      /** Loading相關 */
      loading: true,
      loadingData: 0,
      color: "#673ab7",

      /** 共用 */
      //會議列表表格資訊
      columns: [
        {
          title: "內容摘要",
          colKey: "content",
          dataIndex: "content",
          slotName: "content",
          fixed: "left",
          width: 140,
        },
        {
          title: "流水編號",
          colKey: "number",
          dataIndex: "number",
          slotName: "number",
        },
        {
          title: "結論待辦",
          colKey: "conclusion",
          dataIndex: "conclusion",
          slotName: "conclusion",
          width: 100,
        },
        {
          title: "專案代碼及名稱",
          colKey: "name",
          dataIndex: "name",
          slotName: "name",
        },
        {
          title: "負責人",
          colKey: "principal",
          dataIndex: "principal",
          slotName: "principal",
        },
        {
          title: "預計日期",
          colKey: "date",
          dataIndex: "date",
          slotName: "date",
          width: 100,
        },
        {
          title: "相關人員",
          colKey: "member",
          dataIndex: "member",
          slotName: "member",
        },
        {
          title: "附件",
          colKey: "accessory",
          dataIndex: "accessory",
          slotName: "accessory",
          width: 150,
        },
        {
          title: "狀態",
          colKey: "edit",
          dataIndex: "edit",
          slotName: "edit",
        },
        {
          title: "操作",
          colKey: "options",
          slotName: "options",
          fixed: "right",
          width: 30,
        },
      ],
      //類型選項
      select1: select1,
      //專案代碼及名稱選項
      select2: [],
      // 結論待辦選單
      conclusionOption: [
        {
          id: 0,
          name: "待簽核",
        },
        {
          id: 1,
          name: "已簽核",
        },
        {
          id: 2,
          name: "待辦",
        },
      ],
      //客戶提供內容選項
      accessoryList: [
        {
          accessoryLabel: "書籍",
          accessoryNo: "",
        },
        {
          accessoryLabel: "文件",
          accessoryNo: "",
        },
        {
          accessoryLabel: "光碟",
          accessoryNo: "",
        },
        {
          accessoryLabel: "物件",
          accessoryNo: "",
        },
        {
          accessoryLabel: "建材樣品",
          accessoryNo: "",
        },
      ],

      //表單內容
      id: this.$route.params.id,
      form: {
        id: 0,
        principal: "王大明", //負責人
        type: "專案", //類型
        name: "A18002-公共工程投標案", //專案代碼及名稱
        textarea: "", //摘要內容
        chairman: "李先生", //主席
        record: "李先生", //紀錄
        date: "2021/12/14", //會議日期
        time: ["2022-10-27T06:42:13.000Z", "2022-10-27T07:42:13.000Z"], //會議時間
        theme: "會議主題1", //會議主題
        member: ["王大明", "蔡先生", "吳先生", "張三"], //出席人員
        approvals: "未開始",
        offer: 0, //客戶是否提供
        accessory: [], //提供的內容
        fileList: [],
        detailList: [
          {
            id: 1,
            content: "5/11召開會議",
            number: "aaaa-11234567-234",
            conclusion: "待辦",
            name: "A21033-企業辦公大樓興建工程",
            principal: "王大明",
            date: "2021/12/14",
            member: "王大明",
            accessory: "",
            edit: false,
          },
          {
            id: 2,
            content: "會議議程:代碼編碼原則確認",
            number: "aaaa-11234567-234",
            conclusion: "待辦",
            name: "A21033-企業辦公大樓興建工程",
            principal: "王大明",
            date: "2021/12/14",
            member: "王大明",
            accessory: "",
            edit: false,
          },
        ],
      },
      //驗證規則
      rules: {
        principal: [{ required: true, message: "請選擇負責人", trigger: "blur" }],
        type: [{ required: true, message: "請選擇類型", trigger: "change" }],
        name: [{ required: true, message: "請書專案名稱", trigger: "blur" }],
      },

      /** 目前待辦＋前次會議記錄共用 */
      dialogTitle: "",
      openDialogOption: false,
      toDoList: [],
      toDoListSelect: "",

      /** 待刪除 */
      index: 1,
      detailList: [],
      initFileList: [],
      isIndeterminate: true,
      limit: 1, //上傳數量
      checkAll: false,
      rowSelection: { type: "radio" },
    };
  },
  created() {
    this.getApi();
    // this.getinfo();
  },
  methods: {
    getinfo() {
      if (this.$route.query && this.$route.query.res) {
        let data = JSON.parse(this.$route.query.res);
        this.form = Object.assign({}, data);
        this.formTitle = "編輯";

        console.log("有值", this.$route.query);
      } else {
        this.form = {
          id: "",
          principal: "", //負責人
          type: "", //類型
          name: [], //專案代碼及名稱
          textarea: "", //摘要內容
          chairman: "", //主席
          record: "", //紀錄
          date: "", //會議日期
          time: "", //會議時間
          theme: "", //會議主題
          member: [], //出席人員
          offer: 0, //客戶是否提供
          accessory: [], //提供的內容
          fileList: [],
          detailList: [],
        };
        this.formTitle = "新增";
      }
    },
    // 獲取API
    getApi() {
      function getAPI() {
        return axios.get("https://run.mocky.io/v3/a960258d-f742-47cd-965a-9ce87dcb35b7");
      }
      Promise.all([getAPI()]).then((response) => {
        this.toDoList = response[0].data.toDoList;
        this.loadingData = 100;
        this.loading = false;
      });
    },

    // 送簽
    saveButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push({ path: "/toDoList" });
        } else {
          return false;
        }
      });
    },
    addPriceForm() {
      this.$swal
        .fire({
          title: "存檔完成！",
          icon: "success",
          confirmButtonColor: "#0084ff",
          confirmButtonText: "確定",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.axios
              .post("http://localhost:3000/meetingList?_sort=id", {
                id: this.form.id,
                principal: this.form.principal, //負責人
                type: this.form.type, //類型
                name: this.form.name, //專案代碼及名稱
                textarea: this.form.textarea, //摘要內容
                chairman: this.form.chairman, //主席
                record: this.form.record, //紀錄
                date: this.form.date, //會議日期
                time: this.form.time, //會議時間
                theme: this.form.theme, //會議主題
                member: this.form.member, //出席人員
                approvals: "未開始",
                offer: this.form.offer, //客戶是否提供
                accessory: this.form.accessory, //提供的內容
                fileList: this.form.fileList,
                detailList: this.form.detailList,
              })
              .then((response) => {
                this.form.id = response.data.id;
                this.getApi();
              })
              .catch((error) => {
                console.error("There was an error!", error);
              });
          }
        });
    },

    getRole(prov) {
      let roles = [];
      this.form.name = [];
      for (var val of allrole) {
        if (prov === val.pro) {
          roles.push({ label: val.label, value: val.label });
        }
        this.select2 = roles;
      }
    },
    getList(opt) {
      this.toDoListSelectSearch = opt;
      // console.log(opt);
    },
    handleChange(value) {
      this.toDoListSelectSearch = value.slice(1).toString();
      this.form.name = value.slice(1).toString();
    },
    handleChange2(value) {
      this.test = value.slice(1).toString();
      console.log(value.slice(1).toString());
      console.log(this.form.detailList.name, 123);
    },
    // 搜尋高光
    showDate(val) {
      val = val + "";
      if (val.indexOf(this.toDoListSelectSearch) !== -1 && this.toDoListSelectSearch !== "") {
        return val.replace(this.toDoListSelectSearch, '<span style="color: #000; background: gold">' + this.toDoListSelectSearch + "</span>");
      } else {
        return val;
      }
    },

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //           當前表格
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    /** 檔案上傳用 */
    onChange(fileList) {
      this.form.fileList = fileList;
    },
    /** 新增摘要 */
    send() {
      this.form.detailList.push({
        // id: index,
        content: this.form.textarea,
        number: "",
        conclusion: "待辦",
        name: "",
        principal: "",
        date: "",
        member: "",
        accessory: "",
        edit: false,
      });

      this.form.textarea = "";

      //紀錄點擊次數
      /*var x = 0;
      x = this.number + 1;
      this.number = x;*/
    },
    /** 清空摘要input */
    clearTextarea() {
      this.$swal
        .fire({
          title: "你確定嗎？",
          text: "摘要內容清空後後將無法復原",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#0084ff",
          confirmButtonColor: "#cccccc",
          confirmButtonText: "確定清空",
          cancelButtonText: "取消",
          closeOnConfirm: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.form.textarea = "";
          }
        })
        .catch(() => {});
    },

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //           會議列表
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    /** 時間格式話 */
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data != null) {
        // return null;
        return moment(data).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    /** 單筆刪除會議列表 */
    handleDelete(index) {
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
            /* this.axios
                  .delete("http://localhost:3000/configForm/" + `${id}`, row)
                  .then((response) => {
                    this.configForm.id = response.data.id;
                    this.getApi();
                  })
                  .catch((error) => {
                    console.error("There was an error!", error);
                  });*/
            this.form.detailList.splice(index, 1);
          }
        })
        .catch(() => {});
    },
    /** 滑鼠移入 */
    handleCellEnter(row) {
      row.edit = true;
    },
    /** 滑鼠移出 */
    handleCellLeave(row) {
      row.edit = false;
    },
    /** 點選編輯 */
    editData(row) {
      row.edit = true;
      // console.log(row.edit);
    },
    /** 點選存檔 */
    confirmData(row) {
      row.edit = false;
      this.$notify({
        title: "Success",
        message: "編輯成功",
        type: "success",
        duration: 2000,
      });
    },

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //         彈跳視窗使用
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    /** 開啟目前待辦視窗 */
    openopenDialogOption() {
      this.openDialogOption = true;
      this.dialogTitle = "目前待辦列表";
    },
    openMeetingDialog() {
      this.openDialogOption = true;
      this.dialogTitle = "前次會議記錄列表";
    },
    /** 「目前待辦」的視窗選擇 */
    handleCurrentChange(val) {
      this.toDoListSelect = val;
    },
    /** 目前待辦視窗確認按鈕 */
    selectMeetingDoneButton(row) {
      this.form.textarea = this.toDoListSelect.meetingList;
      this.openDialogOption = false;
      this.toDoListSelect = "";
      this.$refs.filterTable.setCurrentRow(row);
      this.selectDialogFrist = true;
    },
    selectMeetingCancelButton(row) {
      this.openDialogOption = false;
      this.toDoListSelect = "";
      this.$refs.filterTable.setCurrentRow(row);
    },

    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //           共用
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    /** 下拉選擇人員 */
    handleSelect(value) {
      //內容改變時觸發
      console.log(value);
    },
    /** 選擇Chckbox */
    handleChecked(val, item) {
      if (val) {
        this.form.accessory.push(item);
      } else {
        this.deleteItem(item.accessoryLabel, this.form.accessory);
      }
    },
    deleteItem(item, list) {
      for (var key in list) {
        if (list[key].accessoryLabel === item) {
          list.splice(key, 1);
        }
      }
    },
    /** 刪除戴上傳 */
    beforeRemove(file) {
      return this.$confirm(`確定刪除 ${file.name}？`);
    },
  },
  computed: {
    // 篩選表格
    tables: function () {
      const search = this.toDoListSelect;
      if (search) {
        return this.toDoList.filter((dataNews) => {
          return Object.keys(dataNews).some((key) => {
            return String(dataNews[key]).indexOf(search.toUpperCase()) > -1;
            //.indexOF()區分大小寫 .indexOf(.toUpperCase())不分大小寫 .toLowerCase()轉換小寫
          });
        });
      }
      return this.toDoList;
    },
  },
};
</script>
<style lang="scss">
.meeting_form {
  .form_top {
    .el-form-item__label-wrap {
      margin-left: 0 !important;
    }
  }
  .el-form-item__content {
    flex: 1 1 0% !important;
  }
  .radio_center {
    .el-form-item__content {
      display: flex !important;
    }
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100% !important;
  }

  .el-checkbox-group {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .el-upload-dragger {
    width: 80px;
    height: 32px;
    border: none;
  }
  .el-upload-list {
    @apply flex-1 bg-white rounded-lg h-28 px-2 overflow-auto pb-2;

    .el-upload-list__item {
      text-align: left;
    }
  }

  .list_select {
    .el-table__row:hover {
      cursor: pointer !important;
    }
  }

  .disUoloadSty {
    .el-upload {
      display: none !important;
    }
  }
}

.meetingForm {
  .arco-upload-wrapper {
    @apply flex space-x-2;
  }
  .arco-upload-list.arco-upload-list-type-text .arco-upload-list-item:first-of-type {
    @apply mt-0;
  }
  .arco-upload-list {
    @apply bg-white rounded-lg p-4 h-28 overflow-auto;
  }
}
</style>
