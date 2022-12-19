<template>
  <el-scrollbar class="h-full w-full">
    <!--<load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>-->
    <breadcrumb></breadcrumb>
    <div class="mx-5 mb-5 flex-col flex-col space-y-7 rounded-xl bg-white p-10 shadow-6">
      <!--標題-->
      <div class="title-before flex h-14 border-b border-b-gray-300 pb-5">
        <p v-if="editStatus === true" class="flex-1 text-left text-3xl font-bold">會議記錄表-{{ formTitle }}</p>
        <p v-else class="flex-1 text-left text-3xl font-bold">會議記錄表</p>
        <div class="flex h-10 space-x-2">
          <el-button plain @click="$router.push({ path: '/meetingList' })">返回</el-button>
          <div :class="{ hidden: editStatus === false }" class="flex h-10 space-x-2">
            <a-button type="primary" status="danger" @click="finishButton" :disabled="form.finish === true">結束會議</a-button>
            <!--編輯會議記錄的暫存-->
            <a-button v-show="newMeeting === false" type="outline" @click="patchData('form')">暫存</a-button>
            <!--新增會議紀錄的暫存-->
            <a-button v-show="newMeeting === true" type="outline" @click="postData('form')">暫存</a-button>
            <!--編輯會議記錄的送簽-->
            <a-button v-show="newMeeting === false" type="primary" @click="patchApprove('form')">送簽</a-button>
            <!--新增會議紀錄的暫存-->
            <a-button v-show="newMeeting === true" type="primary" @click="postApprove('form')">送簽</a-button>
          </div>
        </div>
      </div>
      <!--表格-->
      <el-form ref="form" :rules="rules" :model="form" :inline="true" class="meeting_form flex flex-col space-y-3">
        <!--會議標題-->
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="負責人" prop="principal" class="mb-0 flex w-full">
            <member-list-dialog v-if="editStatus === true" v-model="form.principal" :value="form.principal.name" :disabled="form.detailList.length === 0"></member-list-dialog>
            <p v-else>{{ form.principal.name }}</p>
          </el-form-item>
          <el-form-item label="專案代碼及名稱" prop="name" class="mb-0 flex w-full">
            <div v-if="editStatus === true" class="w-full">
              <el-cascader
                v-if="selectDialogFrist === false"
                v-model="form.name"
                :options="options"
                clearable
                @change="handleChange"
                :disabled="form.detailList.length === 0 || editStatus === false"
                class="w-full flex-1"
              ></el-cascader>
              <el-cascader v-else v-model="form.name" :options="options" clearable @change="handleChange" class="w-full flex-1"></el-cascader>
            </div>
            <p v-else>{{ form.name }}</p>
          </el-form-item>
        </div>
        <!--摘要-->
        <div class="flex flex-col space-y-4 rounded-lg bg-gray-100 p-5" :class="{ hidden: editStatus === false }">
          <div class="flex space-x-3">
            <div class="justify-star flex flex-1 space-x-3">
              <a-button type="primary" status="success" :disabled="form.name === '' || form.name.length === 0" @click="openopenDialogOption">目前待辦</a-button>
              <a-button type="primary" status="success" :disabled="form.name === '' || form.name.length === 0" @click="openMeetingDialog">前次會議記錄</a-button>
            </div>
            <el-button plain @click="clearTextarea" :disabled="form.textarea === ''">清空</el-button>
            <a-button type="primary" :disabled="form.textarea === ''" @click="send">新增</a-button>
          </div>
          <el-input type="textarea" :rows="5" placeholder="請輸入摘要內容" v-model="form.textarea"></el-input>
        </div>
        <!--詳細內容-->
        <div class="meetingForm flex flex-col space-y-4 rounded-lg bg-gray-100 p-5">
          <div class="grid grid-cols-4 gap-4">
            <el-form-item label-width="80px" label="主席" prop="chairman" class="mb-0 flex w-full">
              <member-list-dialog v-if="editStatus === true" v-model="form.chairman" :value="form.chairman.name" :disabled="form.detailList.length === 0"></member-list-dialog>
              <p v-else>{{ form.chairman.name }}</p>
            </el-form-item>
            <el-form-item label="紀錄" prop="record" class="mb-0 flex w-full">
              <member-list-dialog v-if="editStatus === true" v-model="form.record" :value="form.record.name" :disabled="form.detailList.length === 0"></member-list-dialog>
              <p v-else>{{ form.record.name }}</p>
            </el-form-item>
            <el-form-item label="會議日期" prop="date" class="mb-0 flex w-full">
              {{ form.date }}
              <!--<el-date-picker placeholder="請選擇日期" type="date" v-model="form.date" :disabled="form.detailList.length === 0"></el-date-picker>-->
            </el-form-item>
            <el-form-item label="會議時間" prop="time" class="mb-0 flex w-full">
              <!--<el-time-picker
                type="date"
                v-model="form.time"
                is-range
                range-separator="~"
                start-placeholder="開始時間"
                end-placeholder="結束時間"
                :disabled="form.detailList.length === 0"
              ></el-time-picker>-->
              <div class="flex">
                <p>{{ form.time }}</p>
                <!--<el-time-picker v-model="form.time" :disabled="form.detailList.length === 0" placeholder="開始時間" value-format="HH:mm:ss"></el-time-picker>-->
                <p class="mx-2">至</p>
                {{ form.endTime }}
                <!--<el-time-picker v-model="form.endTime" :disabled="form.detailList.length === 0" placeholder="結束時間" value-format="HH:mm:ss"></el-time-picker>-->
              </div>
            </el-form-item>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="會議主題" prop="theme" class="mb-0 flex w-full">
              <el-input v-if="editStatus === true" v-model="form.theme" placeholder="請輸入內容" :disabled="form.detailList.length === 0"></el-input>
              <p v-else>{{ form.theme }}</p>
            </el-form-item>
            <el-form-item label="出席人員" prop="member" class="mb-0 flex w-full">
              <member-list-dialog-even v-if="editStatus === true" v-model="form.member" :value="form.member" :disabled="form.detailList.length === 0"></member-list-dialog-even>
              <p v-else>{{ form.member.toString() }}</p>
            </el-form-item>
          </div>

          <el-form-item label-width="80px" label="備註" prop="remark" class="mb-0 flex w-full">
            <el-input v-if="editStatus === true" v-model="form.remark" type="textarea" :rows="2" placeholder="請輸入內容" :disabled="form.detailList.length === 0"></el-input>
            <p v-else>{{ form.remark }}</p>
          </el-form-item>

          <el-form-item label="客戶提供內容" prop="accessory" class="radio_center flex">
            <el-radio-group v-model="form.offer" class="justify-star flex items-center" :disabled="form.detailList.length === 0 || editStatus === false">
              <el-radio :label="0" v-model="form.offer">否</el-radio>
              <el-radio :label="1" v-model="form.offer">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="form.offer === 1" class="flex flex-col space-y-2 rounded-lg bg-gray-200 p-4">
            <div :class="{ hidden: editStatus === true }">
              <div class="flex space-x-2">
                <a-tag v-for="item in form.accessory" :key="item.id" color="arcoblue" :class="{ block: item.accessoryNo === '' }">
                  <p>{{ item.accessoryLabel }}</p>
                  <p class="ml-2 text-gray-500">{{ item.accessoryNo }}</p>
                </a-tag>
              </div>
              <div class="flex flex-col space-y-1">
                <p class="w-full text-left">上傳的檔案</p>
                <div class="flex flex-col space-y-2 rounded-md bg-white p-4">
                  <div v-for="item in form.fileList" :key="item.uid" class="flex w-full space-x-2 rounded px-4 py-2 text-left" style="background: #f7f8fa">{{ item.name }}</div>
                </div>
              </div>
            </div>
            <div :class="{ hidden: editStatus === false }">
              <el-checkbox-group v-model="form.rulesId" :disabled="editStatus === false">
                <el-checkbox v-for="(item, index) in accessoryList" :label="item.accessoryLabel" :key="index" :velus="item.accessoryLabel" @change="(val) => handleChecked(val, item)">
                  {{ item.accessoryLabel }}
                  <el-input
                    class="w-56"
                    v-show="item.accessoryLabel === '光碟' || item.accessoryLabel === '建材樣品' || item.accessoryLabel === '其他'"
                    v-model="item.accessoryNo"
                    size="small"
                    placeholder="請輸入內容"
                  ></el-input>
                </el-checkbox>
              </el-checkbox-group>
              <a-upload action="http://localhost:3000/meetingList" :auto-upload="false" multiple :default-file-list="form.fileList" @change="onChange" :disabled="editStatus === false" />
            </div>
          </div>
        </div>
        <!--會議列表-->
        <el-table :data="form.detailList">
          <el-table-column fixed prop="name" label="內容摘要" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-if="scope.row.edit === true" v-model="scope.row.content" placeholder="請輸入摘要內容" clearable></el-input>
              <span v-else class="truncate">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="流水編號" show-overflow-tooltip>
            <template #default="scope">
              <el-input v-if="scope.row.edit === true" v-model="scope.row.number" placeholder="請輸入內容" clearable></el-input>
              <span v-else class="truncate">{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="結論待辦" width="100px">
            <template #default="scope">
              <div v-if="scope.row.edit === true">
                <el-select v-model="scope.row.conclusion" class="w-full flex-1" clearable>
                  <el-option v-for="item in conclusionOption" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </div>
              <div v-else>
                <span v-if="scope.row.conclusion === '結案'" class="truncate text-green-500">{{ scope.row.conclusion }}</span>
                <span v-else class="truncate text-red-500">{{ scope.row.conclusion }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="專案代碼及名稱" show-overflow-tooltip>
            <template #default="scope">
              <el-cascader v-if="scope.row.edit === true" v-model="scope.row.name" :options="options" clearable @change="handleTableChange($event, scope.$index)"></el-cascader>
              <span v-else class="truncate">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="principal" label="負責人" show-overflow-tooltip>
            <template #default="scope">
              <member-list-dialog v-if="scope.row.edit === true" v-model="scope.row.principal" :value="scope.row.principal.name"></member-list-dialog>
              <span v-else class="truncate">{{ scope.row.principal.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="預計日期" width="180px">
            <template #default="scope">
              <el-date-picker v-if="scope.row.edit === true" v-model="scope.row.date" type="date" placeholder="請選擇日期" clearable format="YYYY/MM/DD" value-format="YYYY年MM月DD日"></el-date-picker>
              <span v-else>{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="member" label="相關人員" show-overflow-tooltip>
            <template #default="scope">
              <member-list-dialog-even v-if="scope.row.edit === true" v-model="scope.row.member" :value="scope.row.member.name" disabled="false"></member-list-dialog-even>
              <span v-else class="truncate">{{ scope.row.member.toString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accessory" label="附件" show-overflow-tooltip>
            <template #default="scope">
              <a-upload v-if="scope.row.edit === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
              </a-upload>
              <span v-else class="truncate">{{ scope.row.accessory }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="editStatus === true" label="操作" align="center" fixed="right" width="120px">
            <template #default="scope">
              <div v-if="scope.row.edit === true">
                <el-button type="text" @click="scope.row.edit = !scope.row.edit" class="text-red-500">取消</el-button>
                <el-button type="text" @click="scope.row.edit = !scope.row.edit && this.getApi">確定</el-button>
              </div>
              <div v-else>
                <el-button type="text" class="text-red-500" @click="handleDelete(scope.$index)">刪除</el-button>
                <el-button type="text" @click="scope.row.edit = !scope.row.edit">編輯</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
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
          <template #header>
            <el-input v-model="form.principal.name"></el-input>
          </template>
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
import { to_doList } from "@/views/config/api";

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
  watch: {},
  data() {
    return {
      value1: [],
      value2: "",
      /** Loading相關 */
      number: "",
      loading: true,
      loadingData: 0,
      color: "#673ab7",
      selectDialogFrist: false,
      formTitle: "",
      editStatus: true, //true=可編輯 false=預覽
      newMeeting: false, //true=新增 false=編輯
      rulesId: [], //checkbox暫存欄位

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
          name: "待辦",
        },
        {
          id: 1,
          name: "結案",
        },
      ],
      //客戶提供內容選項
      accessoryList: [
        {
          id: 0,
          accessoryLabel: "書籍",
          accessoryNo: "",
        },
        {
          id: 1,
          accessoryLabel: "文件",
          accessoryNo: "",
        },
        {
          id: 2,
          accessoryLabel: "光碟",
          accessoryNo: "",
        },
        {
          id: 3,
          accessoryLabel: "物件",
          accessoryNo: "",
        },
        {
          id: 4,
          accessoryLabel: "建材樣品",
          accessoryNo: "",
        },
        {
          id: 5,
          accessoryLabel: "其他",
          accessoryNo: "",
        },
      ],
      options: [
        {
          id: 0,
          value: "全部",
          label: "全部",
        },
        {
          id: 1,
          value: "專案",
          label: "專案",
          children: [
            {
              id: 11,
              value: "A18002-公共工程投標案",
              label: "A18002-公共工程投標案",
            },
            {
              id: 12,
              value: "A22003-億集科技例行會議",
              label: "A22003-億集科技例行會議",
            },
          ],
        },
        {
          id: 2,
          value: "例行性會議",
          label: "例行性會議",
          children: [
            {
              id: 21,
              value: "UD0840-0840早會",
              label: "UD0840-0840早會",
            },
            {
              id: 22,
              value: "UD1330-1330部門會議",
              label: "UD1330-1330部門會議",
            },
          ],
        },
        {
          id: 3,
          value: "建築行政",
          label: "建築行政",
          children: [
            {
              id: 31,
              value: "MYN2B/-製圖準則",
              label: "MYN2B/-製圖準則",
            },
            {
              id: 32,
              value: "MYN2D/-室內",
              label: "MYN2D/-室內",
            },
          ],
        },
        {
          id: 4,
          value: "一般行政",
          label: "一般行政",
          children: [
            {
              id: 41,
              value: "GYN06/-財務會計",
              label: "GYN06/-財務會計",
            },
          ],
        },
      ],
      personSelect: [
        {
          text: "王大明",
          value: "王大明",
        },
        {
          text: "張三",
          value: "張三",
        },
        {
          text: "李四",
          value: "李四",
        },
        {
          text: "蔡先生",
          value: "蔡先生",
        },
        {
          text: "吳先生",
          value: "吳先生",
        },
      ], //人員選單

      //表單內容
      form: {
        finish: false,
        id: "",
        principal: "", //負責人
        type: "", //類型
        name: [], //專案代碼及名稱
        textarea: "", //摘要內容
        chairman: "", //主席
        record: "", //紀錄
        date: "", //會議日期
        time: "", //會議開始時間
        endTime: "", //會議結束時間
        theme: "", //會議主題
        member: [], //出席人員
        remark: "",
        approvals: "待送簽",
        offer: 0, //客戶是否提供
        accessory: [], //提供的內容
        rulesId: [], //提供的內容暫存用
        fileList: [],
        detailList: [],
      },
      //驗證規則
      rules: {
        principal: [{ required: true, message: "請選擇負責人", trigger: "blur" }],
        // name: [{ required: true, message: "請選擇專案", trigger: "change" }],
        chairman: [{ required: true, message: "請選擇主席", trigger: "change" }],
        record: [{ required: true, message: "請選擇紀錄人員", trigger: "change" }],
        date: [{ type: "date", required: true, message: "請選擇日期", trigger: "change" }],
        theme: [{ required: true, message: "請輸入會議主題", trigger: "blur" }],
        member: [{ required: true, message: "請輸入出席人員", trigger: "blur" }],
      },

      /** 目前待辦＋前次會議記錄共用 */
      dialogTitle: "",
      openDialogOption: false,
      toDoList: [],
      toDoListSelectSearch: "",
      toDoListSelect: "",
      toDoListPrincipal: "",

      test: "",

      /** 待刪除 */
      index: 1,
      detailList: [],
      initFileList: [],
      isIndeterminate: true,
      limit: 1, //上傳數量
      checkAll: false,
      rowSelection: { type: "radio" },

      nowWeek: "",
      aa: "",
      bb: "",
      timer: "",
    };
  },
  created() {
    this.getApi();
    this.getinfo();
  },
  methods: {
    getTime(val) {
      var now = new Date();
      val == 0 ? "" : now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * val);
      const hh = (now.getHours() + "").padStart(2, "0");
      const mm = (now.getMinutes() + "").padStart(2, "0");
      // const ss = (now.getSeconds() + "").padStart(2, "0");
      return `${hh}:${mm}`;
    },
    getDate(val) {
      //   獲取時間並格式化
      var now = new Date();
      // val === 0 ? "" : now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * val); //   获取前val天的时间
      val === 0 ? "" : now.setTime(now.getTime() + 24 * 60 * 60 * 1000 * val); //   获取后val天的时间
      const y = now.getFullYear();
      const m = (now.getMonth() + 1 + "").padStart(2, "0");
      const d = (now.getDate() + "").padStart(2, "0");
      let wk = now.getDay();
      let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      let week = weeks[wk];
      this.nowWeek = week;
      return `${y}-${m}-${d}`;
    },
    /*getDateTime(val) {
      //   獲取時間並格式化
      var now = new Date();
      val === 0 ? "" : now.setTime(now.getTime() - 24 * 60 * 60 * 1000 * val); //   获取前val天的时间
      // val === 0 ? "" : now.setTime(now.getTime() + 24 * 60 * 60 * 1000 * val); //   获取后val天的时间
      const y = now.getFullYear();
      const m = (now.getMonth() + 1 + "").padStart(2, "0");
      const d = (now.getDate() + "").padStart(2, "0");
      const hh = (now.getHours() + "").padStart(2, "0");
      const mm = (now.getMinutes() + "").padStart(2, "0");
      const ss = (now.getSeconds() + "").padStart(2, "0");
      //獲取當前星期
      let wk = now.getDay();
      let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      let week = weeks[wk];
      this.nowWeek = week;
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`; // 獲取的時間格式為 2021-11-16 11:37:15
      //return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`; // 獲取的時間格式為 2021年11月16日 11:37:15
      // return `${y}-${m}-${d} ${hh}:${mm}:${ss}`; // 獲取的時間格式為 2021-04-09 11:37:15
      // return y + m + d                           // 獲取的時間格式為  20210409
    },*/
    getinfo() {
      if (this.$route.query && this.$route.query.res) {
        let data = JSON.parse(this.$route.query.res);
        this.form = Object.assign({}, data);
        this.formTitle = "編輯";
        this.editStatus = JSON.parse(this.$route.query.editStatus);
        this.newMeeting = false;

        console.log("有值", this.$route.query);
      } else {
        this.form = {
          finish: false,
          id: "",
          principal: "", //負責人
          type: "", //類型
          name: "", //專案代碼及名稱
          textarea: "", //摘要內容
          chairman: "", //主席
          record: "", //紀錄
          date: JSON.parse(JSON.stringify(this.getDate(0))), //會議日期
          time: JSON.parse(JSON.stringify(this.getTime(0))), //會議時間
          endTime: "",
          theme: "", //會議主題
          member: [], //出席人員
          remark: "", //備註欄位
          approvals: "待送簽",
          offer: 0, //客戶是否提供
          accessory: [], //提供的內容
          fileList: [],
          detailList: [],
        };
        this.formTitle = "新增";
        this.newMeeting = true;

        console.log(this.form.time);
      }
    },
    // 獲取API
    getApi() {
      to_doList().then((res) => {
        this.toDoList = res.data.toDoList;
        this.loadingData = 100;
        this.loading = false;

        this.toDoListSelectSearch = this.form.name;
      });
    },

    // 送簽
    saveButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$router.push({ path: "/meetingList" });
        } else {
          return false;
        }
      });
    },

    //結束
    finishButton() {
      this.form.endTime = JSON.parse(JSON.stringify(this.getTime(0)));
      this.form.finish = true;
    },

    //新增會議紀錄
    addPriceForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
                    finish: this.form.finish,
                    id: this.form.id,
                    principal: this.form.principal, //負責人
                    type: this.form.type, //類型
                    name: this.form.name, //專案代碼及名稱
                    textarea: this.form.textarea, //摘要內容
                    chairman: this.form.chairman, //主席
                    record: this.form.record, //紀錄
                    date: this.form.date, //會議日期
                    time: this.form.time, //會議時間
                    endTime: this.form.endTime, //結束時間
                    theme: this.form.theme, //會議主題
                    member: this.form.member, //出席人員
                    remark: this.form.remark, //備註欄位
                    approvals: "待送簽",
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
        } else {
          return false;
        }
      });
    },

    // 暫存-新增值到api
    postData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$swal
            .fire({
              title: "存檔完成！",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#0084ff",
              confirmButtonText: "返回列表",
              cancelButtonText: "繼續編輯",
            })
            .then((result) => {
              this.axios
                .post("http://localhost:3000/meetingList?_sort=id", {
                  finish: this.form.finish,
                  id: this.form.id,
                  principal: this.form.principal, //負責人
                  type: this.form.type, //類型
                  name: this.form.name, //專案代碼及名稱
                  textarea: this.form.textarea, //摘要內容
                  chairman: this.form.chairman, //主席
                  record: this.form.record, //紀錄
                  date: this.form.date, //會議日期
                  time: this.form.time, //會議時間
                  endTime: this.form.endTime, //結束時間
                  theme: this.form.theme, //會議主題
                  member: this.form.member, //出席人員
                  remark: this.form.remark, //備註欄位
                  approvals: "待送簽",
                  offer: this.form.offer, //客戶是否提供
                  accessory: this.form.accessory, //提供的內容
                  rulesId: this.form.rulesId, //提供的內容暫存
                  fileList: this.form.fileList,
                  detailList: this.form.detailList,
                })
                .then((response) => {
                  this.configForm.id = response.data.id;
                  this.getApi();
                })
                .catch((error) => {
                  console.error("There was an error!", error);
                });
              if (result.isConfirmed) {
                this.getApi();
                this.$router.push({ path: "/meetingList" });
              }
            });
        } else {
          return false;
        }
      });
    },

    // 暫存-變更資料到api
    patchData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$swal
            .fire({
              title: "存檔完成！",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#0084ff",
              confirmButtonText: "返回列表",
              cancelButtonText: "繼續編輯",
            })
            .then((result) => {
              const obj = this.form;
              const id = this.form.id;
              this.axios
                .patch("http://localhost:3000/meetingList/" + `${id}`, obj)
                .then((response) => {
                  this.form.id = response.data.id;
                  this.getApi();
                })
                .catch((error) => {
                  console.error("There was an error!", error);
                });
              if (result.isConfirmed) {
                this.getApi();
                this.$router.push({ path: "/meetingList" });
              }
            });
        } else {
          return false;
        }
      });
    },

    // 送簽-新增值到api
    postApprove(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$swal
            .fire({
              title: "存檔完成！",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#0084ff",
              confirmButtonText: "返回列表",
              cancelButtonText: "繼續編輯",
            })
            .then((result) => {
              this.axios
                .post("http://localhost:3000/meetingList?_sort=id", {
                  finish: this.form.finish,
                  id: this.form.id,
                  principal: this.form.principal, //負責人
                  type: this.form.type, //類型
                  name: this.form.name, //專案代碼及名稱
                  textarea: this.form.textarea, //摘要內容
                  chairman: this.form.chairman, //主席
                  record: this.form.record, //紀錄
                  date: this.form.date, //會議日期
                  time: this.form.time, //會議時間
                  endTime: this.form.endTime, //結束時間
                  theme: this.form.theme, //會議主題
                  member: this.form.member, //出席人員
                  remark: this.form.remark, //備註欄位
                  approvals: "待簽核",
                  offer: this.form.offer, //客戶是否提供
                  accessory: this.form.accessory, //提供的內容
                  rulesId: this.form.rulesId, //提供的內容暫存
                  fileList: this.form.fileList,
                  detailList: this.form.detailList,
                })
                .then((response) => {
                  this.configForm.id = response.data.id;
                  this.getApi();
                })
                .catch((error) => {
                  console.error("There was an error!", error);
                });
              if (result.isConfirmed) {
                this.getApi();
                this.$router.push({ path: "/meetingList" });
              }
            });
        } else {
          return false;
        }
      });
    },

    // 送簽-變更資料到api
    patchApprove(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$swal
            .fire({
              title: "你確定嗎？",
              text: "會議狀態即將改為「待簽核」",
              icon: "warning",
              showCancelButton: true,
              cancelButtonColor: "#0084ff",
              confirmButtonColor: "#cccccc",
              confirmButtonText: "確定送簽",
              cancelButtonText: "取消",
              closeOnConfirm: false,
            })
            .then((result) => {
              const obj = this.form;
              const id = this.form.id;
              if (result.isConfirmed) {
                this.form.approvals = "待簽核";
                this.axios
                  .patch("http://localhost:3000/meetingList/" + `${id}`, obj)
                  .then((response) => {
                    this.form.id = response.data.id;
                    this.getApi();
                    this.$router.push({ path: "/meetingList" });
                  })
                  .catch((error) => {
                    console.error("There was an error!", error);
                  });
              }
            })
            .catch(() => {});
        } else {
          return false;
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
      if (value.slice(0).toString() === "全部") {
        this.toDoListSelectSearch = "";
        this.form.name = value.slice(0).toString();
      } else {
        this.toDoListSelectSearch = value.slice(1).toString();
        this.form.name = value.slice(1).toString();
      }

      console.log(this.toDoListSelectSearch);
    },
    handleTableChange(value, event) {
      if (value.slice(0).toString() === "全部") {
        this.form.detailList[event].name = value.slice(0).toString();
      } else {
        this.form.detailList[event].name = value.slice(1).toString();
      }
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

    getNowTime() {
      let d = new Date();
      let year1, month1, day1;
      [year1, month1, day1] = [d.getFullYear(), d.getMonth(), d.getDate()];
      let date1 = new Date(year1, month1, day1, 7);
      this.value1.push(date1);
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
        number: "系統自動帶出",
        conclusion: "待辦",
        name: this.form.name,
        principal: this.form.principal,
        date: JSON.parse(JSON.stringify(this.getDate(7))),
        member: "",
        accessory: "",
        edit: false,
      });

      console.log(this.form.detailList[0]);

      if (this.form.detailList[0].principal === "") {
        this.form.detailList[0].name = this.form.name;
        this.form.detailList[0].principal = this.form.principal;
        console.log("目前沒有");
      } else {
        console.log("目前有資料");
      }

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
        this.deleteItem(item.id, this.form.accessory);
      }
    },
    deleteItem(item, list) {
      for (var key in list) {
        if (list[key].id === item) {
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
      // principal
      const search = this.toDoListSelectSearch;
      const search3 = this.form.principal.name;
      if (search) {
        return this.toDoList.filter((dataNews) => {
          return String(dataNews.name).toLowerCase().includes(search.toLowerCase());
        });
      } else if (search3) {
        return this.toDoList.filter((dataNews) => {
          return String(dataNews.principal).toLowerCase().includes(search3.toLowerCase());
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
    @apply h-28 flex-1 overflow-auto rounded-lg bg-white px-2 pb-2;

    .el-upload-list__item {
      text-align: left;
    }
  }

  .list_select {
    .el-table__row:hover {
      cursor: pointer !important;
    }
    .el-table__body {
      cursor: pointer !important;
    }
    .el-table__body tr.current-row > td.el-table__cell {
      background-color: #ffeb3b;
    }
  }

  .disUoloadSty {
    .el-upload {
      display: none !important;
    }
  }

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

.meetingForm {
  .arco-upload-wrapper {
    @apply flex space-x-2;
  }
  .arco-upload-list.arco-upload-list-type-text .arco-upload-list-item:first-of-type {
    @apply mt-0;
  }
  .arco-upload-list {
    @apply h-28 overflow-auto rounded-lg bg-white p-4;
  }
}

textarea:focus,
input:focus {
  outline: none;
}
*:focus {
  outline: none;
}
</style>
