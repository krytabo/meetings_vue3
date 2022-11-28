<template>
  <el-scrollbar class="w-full h-full">
    <load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>
    <breadcrumb></breadcrumb>
    <div class="flex-col space-y-7 mx-5 mb-5 flex-col rounded-xl bg-white p-10 shadow-6">
      <!--標題-->
      <div class="title-before flex border-b border-b-gray-300 pb-5 h-14">
        <p class="flex-1 text-left text-3xl font-bold">會議記錄表-新增</p>
        <div class="flex space-x-2 h-10">
          <el-button plain @click="saveButton">返回</el-button>
          <el-button type="primary" plain @click="saveButton">暫存</el-button>
          <el-button type="primary" @click="saveButton">送簽</el-button>
        </div>
      </div>
      <!--表格-->
      {{ form }}
      <el-form ref="form" :rules="rules" :model="form" :inline="true" class="flex flex-col space-y-3 meeting_form">
        <!--會議標題-->
        <div class="grid grid-cols-3 gap-4">
          <el-form-item label="負責人" prop="principal" class="flex mb-0 w-full">
            <member-list-dialog v-model="form.principal" :value="form.principal"></member-list-dialog>
          </el-form-item>
          <el-form-item label="類型" prop="type" class="flex mb-0 w-full">
            <el-select v-model="form.type" class="flex-1 w-full" :disabled="form.detailList.length === 0" @change="getRole($event)" clearable placeholder="請選擇">
              <el-option v-for="item in select1" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="專案代碼及名稱" prop="name" class="flex mb-0 w-full">
            <el-select v-model="form.name" class="flex-1 w-full" filterable placeholder="請先選擇類型" :disabled="form.detailList.length === 0" @change="getList($event)">
              <el-option v-for="item in select2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!--摘要-->
        <div class="p-5 rounded-lg bg-gray-100 flex flex-col space-y-4">
          <div class="flex">
            <div class="flex-1 flex justify-star">
              <el-button type="success" :disabled="form.name === '' || form.name.length === 0" @click="openopenDialogOption">目前待辦</el-button>
              <el-button type="success" :disabled="form.name === '' || form.name.length === 0" @click="openMeetingDialog">前次會議記錄</el-button>
            </div>
            <el-button plain @click="clearTextarea">清空</el-button>
            <el-button type="primary" @click="send">新增</el-button>
          </div>
          <el-input type="textarea" :rows="5" placeholder="請輸入摘要內容" v-model="form.textarea"></el-input>
        </div>
        <!--詳細內容-->
        <div class="p-5 rounded-lg bg-gray-100 flex flex-col space-y-2 meetingForm">
          <div class="grid grid-cols-4 gap-4">
            <el-form-item label-width="69px" label="主席" prop="chairman" class="flex mb-0 w-full">
              <member-list-dialog v-model="form.chairman" :value="form.chairman"></member-list-dialog>
            </el-form-item>
            <el-form-item label="紀錄" prop="record" class="flex mb-0 w-full">
              <member-list-dialog v-model="form.record" :value="form.record"></member-list-dialog>
            </el-form-item>
            <el-form-item label="會議日期" prop="date" class="flex mb-0 w-full">
              <el-date-picker placeholder="請選擇日期" type="date" v-model="form.date" :disabled="form.detailList.length === 0"></el-date-picker>
            </el-form-item>
            <el-form-item label="會議時間" prop="time" class="flex mb-0 w-full">
              <el-time-picker
                type="date"
                v-model="form.time"
                is-range
                range-separator="~"
                start-placeholder="開始時間"
                end-placeholder="結束時間"
                :disabled="form.detailList.length === 0"
              ></el-time-picker>
            </el-form-item>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <el-form-item label="會議主題" prop="theme" class="flex mb-0 w-full">
              <el-input v-model="form.theme" placeholder="請輸入內容" :disabled="form.detailList.length === 0"></el-input>
            </el-form-item>
            <el-form-item label="出席人員" prop="member" class="flex mb-0 w-full">
              <member-list-dialog-even v-model="form.member" :value="form.member"></member-list-dialog-even>
            </el-form-item>
          </div>

          <el-form-item label="客戶提供內容" prop="accessory" class="flex radio_center">
            <el-radio-group v-model="form.offer" class="flex justify-star items-center" :disabled="form.detailList.length === 0">
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
            <!--<el-upload class="flex space-x-2" ref="upload" action="" :on-success="handleAvatarSuccess" :auto-upload="false" :before-remove="beforeRemove" multiple drag :file-list="form.fileList">
              <el-button size="small" type="primary">選擇檔案</el-button>
            </el-upload>-->
          </div>
        </div>
        <!--會議列表-->
        <!--<t-table row-key="index" :data="form.detailList" :columns="columns" resizable />-->
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
                  <span v-if="record.conclusion === '已簽核'" class="text-blue-500">{{ record.conclusion }}</span>
                  <span v-else-if="record.conclusion === '待簽核'" class="text-green-500">{{ record.conclusion }}</span>
                  <span v-else class="text-red-500">{{ record.conclusion }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="專案代碼及名稱">
              <template #cell="{ record }">
                <el-input v-if="record.edit === true" v-model="record.name" placeholder="請輸入內容" clearable></el-input>
                <span v-else>{{ record.name }}</span>
              </template>
            </a-table-column>
            <a-table-column title="負責人">
              <template #cell="{ record }">
                <!--<select-table
                  v-if="record.edit === true"
                  class="flex-1"
                  v-model="record.principal"
                  :arrData="testData"
                  :defalutValue="{ label: 'name', value: 'name' }"
                  @change="handleSelect"
                  :options="[
                    { name: '員工編號', value: 'id' },
                    { name: '部門', value: 'department' },
                    { name: '姓名', value: 'name' },
                  ]"
                ></select-table>-->
                <span>{{ record.principal }}</span>
              </template>
            </a-table-column>
            <a-table-column title="預計日期">
              <template #cell="{ record }">
                <!--<a-date-picker v-if="record.edit === true" v-model="record.date" type="date" placeholder="請選擇日期" />-->
                <el-date-picker v-if="record.edit === true" v-model="record.date" type="date" placeholder="請選擇日期" clearable format="YYYY/MM/DD" value-format="YYYY年MM月DD日"></el-date-picker>
                <span v-else>{{ record.date }}</span>
              </template>
            </a-table-column>
            <a-table-column title="相關人員">
              <template #cell="{ record }">
                <el-input v-if="record.edit === true" v-model="record.member" placeholder="請輸入內容" clearable></el-input>
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
            <a-table-column title="操作" width="120" align="center" fixed="right">
              <template #cell="{ record }">
                <div v-if="record.edit === true">
                  <el-button type="text" @click="record.edit = !record.edit" class="text-red-500">取消</el-button>
                  <el-button type="text" @click="record.edit = !record.edit">確定</el-button>
                </div>
                <div v-else>
                  <el-button type="text" class="text-red-500" @click="handleDelete">刪除</el-button>
                  <el-button type="text" @click="record.edit = !record.edit">編輯</el-button>
                </div>
              </template>
            </a-table-column>
          </template>
        </a-table>
        <!--<el-table :data="form.detailList" ref="multipleTable" class="meeting_table" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave">-->
        <!-- <el-table :data="form.detailList" ref="multipleTable" class="meeting_table">
          <el-table-column label="項次" align="center" width="50" fixed="left" type="index">
            &lt;!&ndash;<template #default="scope">{{ scope.row.id + 1 }}</template>&ndash;&gt;
          </el-table-column>
          <el-table-column label="內容摘要" prop="content" width="250" fixed="left">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.content" placeholder="請輸入摘要內容" size="small"></el-input>
              <span v-else>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="流水號編碼" prop="number" width="150">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.number" placeholder="請輸入內容" size="small"></el-input>
              <span v-else>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="結論待辦" prop="conclusion" align="center" width="110">
            <template #default="scope">
              <div v-if="scope.row.edit === true">
                <el-select v-model="scope.row.conclusion" class="flex-1 w-full" size="small">
                  <el-option v-for="item in conclusionOption" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </div>
              <div v-else>
                <span v-if="scope.row.conclusion === '已簽核'" class="text-blue-500">{{ scope.row.conclusion }}</span>
                <span v-else-if="scope.row.conclusion === '待簽核'" class="text-green-500">{{ scope.row.conclusion }}</span>
                <span v-else class="text-red-500">{{ scope.row.conclusion }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="專案代碼及名稱" prop="name" align="center" width="250">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.name" placeholder="請輸入內容" size="small"></el-input>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="負責人" prop="principal" align="center" width="110">
            <template #default="scope">
              <select-table
                size="small"
                v-if="scope.row.edit"
                class="flex-1"
                v-model="scope.row.principal"
                :arrData="testData"
                :defalutValue="{ label: 'name', value: 'name' }"
                @change="handleSelect"
                :options="[
                  { name: '員工編號', value: 'id' },
                  { name: '部門', value: 'department' },
                  { name: '姓名', value: 'name' },
                ]"
              ></select-table>
              <span v-else>{{ scope.row.principal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="預計日期" prop="date" align="center" width="150" :formatter="formatDate">
            <template #default="scope">
              <el-date-picker v-if="scope.row.edit" v-model="scope.row.date" type="date" placeholder="請選擇日期" size="small"></el-date-picker>
              <span v-else>{{ scope.row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="相關人員" prop="member" align="center" width="350">
            <template #default="scope">
              <el-input v-if="scope.row.edit" v-model="scope.row.member" placeholder="請輸入相關人員" size="small"></el-input>
              <span v-else>{{ scope.row.member }}</span>
            </template>
          </el-table-column>
          <el-table-column label="附件" prop="accessory" align="center" width="150">
            <template #default="scope">
              <a-upload v-if="scope.row.edit" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
              </a-upload>
              <span v-else>{{ scope.row.accessory }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="100">
            <template #default="scope">
              <div v-if="scope.row.edit">
                <el-button type="text" @click="confirmData(scope.row)" class="text-red-500">取消</el-button>
                <el-button type="text" @click="confirmData(scope.row)">確定</el-button>
              </div>
              <div v-else>
                <el-button type="text" class="text-red-500" @click="handleDelete(scope)">刪除</el-button>
                <el-button type="text" @click="editData(scope.row)">編輯</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>-->
      </el-form>
    </div>
    <a-modal :title="dialogTitle" v-model:visible="openDialogOption" :width="1000" draggable class="list_select">
      <el-input v-model="toDoListSelect"></el-input>
      <!--<a-table :columns="toDoColumns" :data="toDoList" column-resizable :scroll="{ x: 2000 }" :row-selection="rowSelection" />-->
      <!--<a-table :data="toDoList" column-resizable :scroll="{ x: 2000 }" :row-selection="rowSelection" @row-click="chang">
        <template #columns>
          <a-table-column fixed="left" title="代辦發生日期" width="150">
            <template #cell="{ record }">
              <span>{{ record.date }}</span>
            </template>
          </a-table-column>
          <a-table-column title="待辦事項"></a-table-column>
          <a-table-column title="流水號編碼" width="150">
            <template #cell="{ record }">
              <div v-if="record.edit === true">
                <el-select v-model="record.conclusion" class="flex-1 w-full" clearable>
                  <el-option v-for="item in conclusionOption" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </div>
              <div v-else>
                <span v-if="record.conclusion === '已簽核'" class="text-blue-500">{{ record.conclusion }}</span>
                <span v-else-if="record.conclusion === '待簽核'" class="text-green-500">{{ record.conclusion }}</span>
                <span v-else class="text-red-500">{{ record.conclusion }}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column title="執行狀態">
            <template #cell="{ record }">
              <el-input v-if="record.edit === true" v-model="record.name" placeholder="請輸入內容" clearable></el-input>
              <span v-else>{{ record.name }}</span>
            </template>
          </a-table-column>
          <a-table-column title="專案代碼及名稱">
            <template #cell="{ record }">
              <select-table
                v-if="record.edit === true"
                class="flex-1"
                v-model="record.principal"
                :arrData="testData"
                :defalutValue="{ label: 'name', value: 'name' }"
                @change="handleSelect"
                :options="[
                  { name: '員工編號', value: 'id' },
                  { name: '部門', value: 'department' },
                  { name: '姓名', value: 'name' },
                ]"
              ></select-table>
              <span v-else>{{ record.principal }}</span>
            </template>
          </a-table-column>
          <a-table-column title="負責人" width="150">
            <template #cell="{ record }">
              <el-date-picker v-if="record.edit === true" v-model="record.date" type="date" placeholder="請選擇日期" clearable format="YYYY/MM/DD" value-format="YYYY年MM月DD日"></el-date-picker>
              <span v-else>{{ record.date }}</span>
            </template>
          </a-table-column>
          <a-table-column title="預計完成日期">
            <template #cell="{ record }">
              <el-input v-if="record.edit === true" v-model="record.member" placeholder="請輸入內容" clearable></el-input>
              <span v-else>{{ record.member }}</span>
            </template>
          </a-table-column>
          <a-table-column title="相關人員" width="150">
            <template #cell="{ record }">
              <a-upload v-if="record.edit === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
              </a-upload>
              <span v-else>{{ record.accessory }}</span>
            </template>
          </a-table-column>
          <a-table-column title="附件" width="150">
            <template #cell="{ record }">
              <a-upload v-if="record.edit === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
              </a-upload>
              <span v-else>{{ record.accessory }}</span>
            </template>
          </a-table-column>
        </template>
      </a-table>-->
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
        <a-button type="outline" @click="openDialogOption = false">取消</a-button>
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
  watch: {},
  data() {
    return {
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
      form: {
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
        member: ["ddd", "dddd", "dddd"], //出席人員
        offer: 0, //客戶是否提供
        accessory: [], //提供的內容
        fileList: [],
        detailList: [],
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
      /*toDoList: [
        {
          key: "1",
          date: "2022年04月20日", //待辦發生日期
          meetingList: "用Checklist檢討103-03排水圖", //待辦事項
          no: "A21033-220420-t0093-220429-01", //流水號編碼
          status: "未完成", //執行狀態
          name: "A18002-公共工程投標案", //專案代碼及名稱
          principal: "王大明",
          doneDate: "2022年04月29日",
          member: "",
          accessory: "",
        },
        {
          key: "2",
          date: "2022年04月13日", //待辦發生日期
          meetingList: "合約報價修改", //待辦事項
          no: "A21006-220413-t0098-220428-02", //流水號編碼
          status: "未完成", //執行狀態
          name: "A22003-億集科技例行會議", //專案代碼及名稱
          principal: "張三",
          doneDate: "2022年04月28日",
          member: "李四",
          accessory: "",
        },
        {
          key: "3",
          date: "2022年04月10日", //待辦發生日期
          meetingList: "相關法律規範確認", //待辦事項
          no: "", //流水號編碼
          status: "已完成", //執行狀態
          name: "A22003-億集科技例行會議", //專案代碼及名稱
          principal: "",
          doneDate: "",
          member: "",
          accessory: "",
        },
        {
          key: "4",
          date: "2022年04月08日", //待辦發生日期
          meetingList: "設計圖修改", //待辦事項
          no: "A21017-220408-t0092-220429-03", //流水號編碼
          status: "未完成", //執行狀態
          name: "A18002-公共工程投標案", //專案代碼及名稱
          principal: "李四",
          doneDate: "2022年4月29日",
          member: "王大明",
          accessory: "",
        },
      ],*/

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
  },
  methods: {
    // 獲取API
    getApi() {
      function getAPI() {
        return axios.get("/db.json");
      }
      Promise.all([getAPI()]).then((response) => {
        this.toDoList = response[0].data.toDoList;
        this.loadingData = 100;
      });

      setTimeout(() => {
        if (this.loadingData === 100) {
          this.loading = false;
        }
      }, 1500);
    },

    // 送簽
    saveButton() {
      this.$router.push({ path: "/" });
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
      this.toDoListSelect = opt;
      // console.log(opt);
    },
    showDate(val) {
      val = val + "";
      if (val.indexOf(this.toDoListSelect) !== -1 && this.toDoListSelect !== "") {
        return val.replace(this.toDoListSelect, '<font color="#409EFF">' + this.toDoListSelect + "</font>");
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
      /*let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();*/
    },
    /** 單筆刪除會議列表 */
    handleDelete(index, row) {
      // this.form.detailList = row;
      // const id = this.configForm.id;

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
            this.form.detailList.splice(row, 1);
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
    selectMeetingDoneButton() {
      this.form.textarea = this.toDoListSelect.meetingList;
      this.openDialogOption = false;
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

textarea:focus,
input:focus {
  outline: none;
}
*:focus {
  outline: none;
}
</style>
