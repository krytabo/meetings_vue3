<template>
  <div class="h-full flex-1 p-5">
    <!--<load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>-->
    <div class="flex-1 flex-col space-y-10 rounded-xl bg-white p-10 shadow-6">
      <a-tabs default-active-key="1" class="toDo_tabs">
        <template #extra>
          <div class="inline-block flex space-x-4">
            <div class="flex-1 text-right">快速搜尋：</div>
            <el-input v-model="wholeSearch" placeholder="請輸入關鍵字" class="flex-1"></el-input>
          </div>
        </template>
        <a-tab-pane key="1">
          <template #title><a-button class="toDo_tabs_button" @click="tab1">待辦事項總表</a-button></template>
          <el-form ref="validateForm" :inline="true" :model="editableTableData">
            <el-table :data="tables" style="width: 100%" :cell-style="rowClass">
              <!--<el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.propName" :label="item.labelName" :width="item.width"></el-table-column>-->
              <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
              <!--<el-table-column fixed label="待辦編碼" width="250" sortable>
                <el-table-column prop="no" label="待辦編碼" width="250">
                  <template #header>
                    <el-input v-model="search.no" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.no)"></span>
                  </template>
                </el-table-column>
              </el-table-column>-->
              <el-table-column fixed prop="projectNo" label="專案編碼" sortable>
                <el-table-column prop="projectNo" label="專案編碼">
                  <template #header>
                    <el-input v-model="search.projectNo" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.projectNo)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="meetingList" label="內容" sortable>
                <el-table-column prop="meetingList" label="內容">
                  <template #header>
                    <el-input v-model="search.meetingList" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.meetingList)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="principal" label="負責人" sortable>
                <el-table-column prop="principal" label="負責人">
                  <template #header>
                    <el-input v-model="search.principal" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.principal)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="department" label="部門" sortable>
                <el-table-column prop="department" label="部門">
                  <template #header>
                    <el-select v-model="search.department" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in headerSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.department)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="status" label="執行狀態" sortable>
                <el-table-column prop="status" width="150">
                  <template #header>
                    <el-select v-model="search.status" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.status)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="signedStatus" label="簽核狀態" sortable>
                <el-table-column prop="signedStatus" width="150">
                  <template #header>
                    <el-select v-model="search.signedStatus" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in auditStatusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-if="scope.row.signedStatus.length === 0" class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>
                    <a-trigger v-else trigger="click">
                      <a-button type="text" v-html="showDate(scope.row.auditStatus)" class="w-full"></a-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-table ref="filterTable" :data="scope.row.signedStatus">
                            <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
                            <el-table-column prop="level" label="關卡" width="150"></el-table-column>
                            <el-table-column prop="status" label="狀態" width="100"></el-table-column>
                            <el-table-column prop="date" label="時間" width="180"></el-table-column>
                            <el-table-column prop="commit" label="說明" width="150"></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="待辦發生日期" sortable>
                <el-table-column prop="date" width="150">
                  <template #header>
                    <a-trigger trigger="click" :unmount-on-close="false">
                      <el-button class="w-full">日期搜尋</el-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-date-picker v-model="startDate" type="date" placeholder="開始" value-format="YYYY-MM-DD"></el-date-picker>
                          <el-date-picker v-model="endDate" type="date" placeholder="結束" value-format="YYYY-MM-DD"></el-date-picker>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.date)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="doneDate" label="預計完成日期" sortable>
                <el-table-column prop="doneDate" width="150">
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
                    <span v-html="showDate(scope.row.doneDate)"></span>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column prop="defer" label="遞延次數" width="120" sortable align="center">
                <el-table-column prop="defer" width="120" align="center">
                  <template #header>
                    <el-input v-model="search.defer" size="mini" placeholder="關鍵字"></el-input>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.defer)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="KPI" label="KPI" width="100" sortable align="center">
                <el-table-column prop="KPI" width="100" align="center">
                  <template #header>
                    <el-input v-model="search.KPI" size="mini" placeholder="關鍵字"></el-input>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.KPI)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="transfer" label="移轉紀錄" width="150" sortable align="center">
                <template #default="scope">
                  <span v-if="scope.row.transfer.length === 0"></span>
                  <a-trigger v-else trigger="click">
                    <a-button type="text" long>紀錄</a-button>
                    <template #content>
                      <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                        <el-table ref="filterTable" :data="scope.row.transfer">
                          <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
                          <el-table-column prop="date" label="時間" width="150"></el-table-column>
                          <el-table-column prop="record" label="移轉紀錄" width="150">
                            <template #default="scope">
                              <div class="flex">
                                <span>{{ scope.row.record.form }}</span>
                                <i class="ri-arrow-right-line"></i>
                                <span>{{ scope.row.record.to }}</span>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="edit" label="修改人員" width="150"></el-table-column>
                        </el-table>
                      </div>
                    </template>
                  </a-trigger>
                </template>
              </el-table-column>

              <el-table-column label="會議記錄" width="100" align="center" fixed="right">
                <template #default="scope">
                  <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title><a-button class="toDo_tabs_button" @click="tab1">當日到期待辦事項(本人)</a-button></template>
          <el-form ref="ruleForm" :inline="true" :model="inServForm">
            <el-table :data="tables" style="width: 100%" table-layout="fixed" :cell-style="rowClass">
              <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
              <!--<el-table-column fixed label="待辦編碼" width="250" sortable>
                <el-table-column prop="no" label="待辦編碼" width="250">
                  <template #header>
                    <el-input v-model="search.no" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.no)"></span>
                  </template>
                </el-table-column>
              </el-table-column>-->
              <el-table-column fixed prop="projectNo" label="專案編碼及名稱" width="150" sortable align="center">
                <el-table-column prop="projectNo" label="專案編碼及名稱" width="150" align="center">
                  <template #header>
                    <el-input v-model="search.projectNo" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.projectNo)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="meetingList" label="內容" min-width="240" sortable>
                <el-table-column prop="meetingList" label="內容" min-width="240">
                  <template #header>
                    <el-input v-model="search.meetingList" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.meetingList)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="principal" label="負責人" width="200" sortable align="center">
                <el-table-column prop="principal" label="負責人" width="200" align="center">
                  <template #header>
                    <el-input v-model="search.principal" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.principal)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="department" label="部門" width="150" sortable align="center">
                <el-table-column prop="department" label="部門" width="150" align="center">
                  <template #header>
                    <el-select v-model="search.department" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in headerSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.department)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="status" label="執行狀態" width="150" sortable align="center">
                <el-table-column prop="status" width="150">
                  <template #header>
                    <el-select v-model="search.status" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.status)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="signedStatus" label="簽核狀態" width="150" sortable align="center">
                <el-table-column prop="signedStatus" width="150">
                  <template #header>
                    <el-select v-model="search.signedStatus" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in auditStatusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>
                    <!--                  <span v-if="scope.row.auditStatus === '待送簽' && scope.row.principal !== '王大明'" class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>-->
                    <a-button v-if="scope.row.auditStatus === '待送簽' && scope.row.principal === '王大明'" @click="patchApprove(scope.row)" type="primary" class="w-full">送簽</a-button>
                    <a-button v-if="scope.row.auditStatus === '確認簽核'" @click="sendPetition(scope.row)" type="primary" class="w-full">確認簽核</a-button>
                    <a-trigger v-if="scope.row.auditStatus === '已送簽'" trigger="click">
                      <a-button type="text" v-html="showDate(scope.row.auditStatus)" class="w-full"></a-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-table ref="filterTable" :data="scope.row.signedStatus">
                            <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
                            <el-table-column prop="level" label="關卡" width="150"></el-table-column>
                            <el-table-column prop="status" label="狀態" width="100"></el-table-column>
                            <el-table-column prop="date" label="時間" width="180"></el-table-column>
                            <el-table-column prop="commit" label="說明" width="150"></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="待辦發生日期" sortable>
                <el-table-column prop="date" width="150">
                  <template #header>
                    <a-trigger trigger="click" :unmount-on-close="false">
                      <el-button class="w-full">日期搜尋</el-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-date-picker v-model="startDate" type="date" placeholder="開始" value-format="YYYY-MM-DD"></el-date-picker>
                          <el-date-picker v-model="endDate" type="date" placeholder="結束" value-format="YYYY-MM-DD"></el-date-picker>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.date)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="doneDate" label="預計完成日期" sortable>
                <el-table-column prop="doneDate" width="150">
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
                    <span v-html="showDate(scope.row.doneDate)"></span>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column prop="principalDone" label="負責人回覆是否完成" width="400" align="center">
                <template #default="scope">
                  <div v-if="scope.row.principal === '王大明'" class="flex w-full space-x-2">
                    <el-form-item label=" " :prop="'dataList.' + scope.$index + '.principalDone'" :rules="inServForm.rules.principalCommit">
                      <el-radio-group v-model="scope.row.principalDone" class="text-center">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>

                      <a-upload class="w-1/2" v-if="scope.row.principalDone === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                        <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
                      </a-upload>
                      <el-input v-else class="w-1/2" type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.principalCommit"></el-input>
                    </el-form-item>
                    <!--                  <el-radio-group v-model="scope.row.principalDone" class="text-center" :disabled="scope.row.principal !== '王大明'">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>

                  <a-upload class="w-1/2" v-if="scope.row.principalDone === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                    <template #upload-button><a-button type="primary" :disabled="scope.row.principal !== '王大明'">選擇檔案</a-button></template>
                  </a-upload>
                  <el-input v-else class="w-1/2" type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.principalCommit" :disabled="scope.row.principal !== '王大明'"></el-input>-->
                  </div>
                  <div v-else class="flex w-full space-x-2">
                    <p v-if="scope.row.principalCommit === ''" class="text-gray-500">無</p>
                    <p v-else>{{ scope.row.principalCommit }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="KPI" label="KPI" width="200" align="center">
                <template #default="scope">
                  <!--<div class="flex flex-col">
                    <el-checkbox v-model="scope.row.KPIOption">評分</el-checkbox>
                    <el-select v-model="scope.row.KPI" size="mini" placeholder="請選擇" clearable filterable allow-create :disabled="scope.row.KPIOption === false">
                      <el-option v-for="item in KPISelect" :key="item.value" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                    &lt;!&ndash;<el-input-number :disabled="scope.row.KPIOption === false" v-model="scope.row.KPI" @change="handleChange"></el-input-number>&ndash;&gt;
                  </div>-->

                  <p v-if="scope.row.KPI === ''" class="text-gray-500">無</p>
                  <p v-else>{{ scope.row.KPI }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="managerCommit" label="直屬主管意見" width="250" align="center">
                <template #default="scope">
                  <!--                <el-input type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.managerCommit" disabled></el-input>-->
                  <p v-if="scope.row.managerCommit === ''" class="text-gray-500">無</p>
                  <p v-else>{{ scope.row.managerCommit }}</p>
                </template>
              </el-table-column>

              <el-table-column label="會議記錄" width="100" align="center" fixed="right">
                <template #default="scope">
                  <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #title><a-button class="toDo_tabs_button" @click="tab1">當日到期待辦事項(主管)</a-button></template>
          <el-form ref="validateForm" :inline="true" :model="editableTableData">
            <el-table :data="tables" style="width: 100%" table-layout="fixed" :cell-style="rowClass">
              <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
              <!--<el-table-column fixed label="待辦編碼" width="250" sortable>
                <el-table-column prop="no" label="待辦編碼" width="250">
                  <template #header>
                    <el-input v-model="search.no" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.no)"></span>
                  </template>
                </el-table-column>
              </el-table-column>-->
              <el-table-column fixed prop="projectNo" label="專案編碼及名稱" width="150" sortable align="center">
                <el-table-column prop="projectNo" label="專案編碼及名稱" width="150" align="center">
                  <template #header>
                    <el-input v-model="search.projectNo" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.projectNo)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="meetingList" label="內容" min-width="240" sortable>
                <el-table-column prop="meetingList" label="內容" min-width="240">
                  <template #header>
                    <el-input v-model="search.meetingList" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.meetingList)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="principal" label="負責人" width="200" sortable align="center">
                <el-table-column prop="principal" label="負責人" width="200" align="center">
                  <template #header>
                    <el-input v-model="search.principal" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.principal)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="department" label="部門" width="150" sortable align="center">
                <el-table-column prop="department" label="部門" width="150" align="center">
                  <template #header>
                    <el-select v-model="search.department" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in headerSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.department)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="status" label="執行狀態" width="150" sortable align="center">
                <el-table-column prop="status" width="150">
                  <template #header>
                    <el-select v-model="search.status" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.status)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="signedStatus" label="簽核狀態" width="150" sortable align="center">
                <el-table-column prop="signedStatus" width="200">
                  <template #header>
                    <el-select v-model="search.signedStatus" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in auditStatusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <div class="space-2 flex w-full flex-col">
                      <span class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>
                      <!--                  <span v-if="scope.row.auditStatus === '待送簽' && scope.row.principal !== '王大明'" class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>-->
                      <!--                  <a-button v-if="scope.row.auditStatus === '待送簽' && scope.row.principal === '王大明'" @click="sendPetition(scope.row)" type="primary" class="w-full">送簽</a-button>-->
                      <div class="flex space-x-2" v-if="scope.row.auditStatus === '待簽核'">
                        <a-button @click="patchPASS(scope.row)" type="primary" class="w-full">簽核通過</a-button>
                        <a-button @click="patchReturn(scope.row)" type="primary" class="w-full">退件</a-button>
                      </div>

                      <a-trigger v-if="scope.row.auditStatus === '已送簽'" trigger="click">
                        <a-button type="text" v-html="showDate(scope.row.auditStatus)" class="w-full"></a-button>
                        <template #content>
                          <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                            <el-table ref="filterTable" :data="scope.row.signedStatus">
                              <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
                              <el-table-column prop="level" label="關卡" width="150"></el-table-column>
                              <el-table-column prop="status" label="狀態" width="100"></el-table-column>
                              <el-table-column prop="date" label="時間" width="180"></el-table-column>
                              <el-table-column prop="commit" label="說明" width="150"></el-table-column>
                            </el-table>
                          </div>
                        </template>
                      </a-trigger>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="待辦發生日期" sortable>
                <el-table-column prop="date" width="150">
                  <template #header>
                    <a-trigger trigger="click" :unmount-on-close="false">
                      <el-button class="w-full">日期搜尋</el-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-date-picker v-model="startDate" type="date" placeholder="開始" value-format="YYYY-MM-DD"></el-date-picker>
                          <el-date-picker v-model="endDate" type="date" placeholder="結束" value-format="YYYY-MM-DD"></el-date-picker>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.date)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="doneDate" label="預計完成日期" sortable>
                <el-table-column prop="doneDate" width="150">
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
                    <span v-html="showDate(scope.row.doneDate)"></span>
                  </template>
                </el-table-column>
              </el-table-column>

              <el-table-column prop="principalDone" label="負責人回覆是否完成" width="400" align="center">
                <template #default="scope">
                  <!--                <div class="flex w-full space-x-2">
                  <el-radio-group v-model="scope.row.principalDone" class="text-center" :disabled="scope.row.principal !== '李四'">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>

                  <a-upload class="w-1/2" v-if="scope.row.principalDone === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                    <template #upload-button><a-button type="primary" :disabled="scope.row.principal !== '李四'">選擇檔案</a-button></template>
                  </a-upload>
                  <el-input v-else class="w-1/2" type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.principalCommit" :disabled="scope.row.principal !== '李四'"></el-input>
                </div>-->
                  <div v-if="scope.row.principal === '蔡先生'" class="flex w-full space-x-2">
                    <el-radio-group v-model="scope.row.principalDone" class="text-center">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>

                    <a-upload class="w-1/2" v-if="scope.row.principalDone === true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :limit="1">
                      <template #upload-button><a-button type="primary">選擇檔案</a-button></template>
                    </a-upload>
                    <el-input v-else class="w-1/2" type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.principalCommit"></el-input>
                  </div>
                  <div v-else class="flex w-full space-x-2">
                    <p v-if="scope.row.principalCommit === ''" class="text-gray-500">無</p>
                    <p v-else>{{ scope.row.principalCommit }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="KPI" label="KPI" width="200" align="center">
                <template #default="scope">
                  <div class="flex flex-col">
                    <el-checkbox v-model="scope.row.KPIOption">評分</el-checkbox>
                    <el-select v-model="scope.row.KPI" size="mini" placeholder="請選擇" clearable filterable allow-create :disabled="scope.row.KPIOption === false">
                      <el-option v-for="item in KPISelect" :key="item.value" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                    <!--<el-input-number :disabled="scope.row.KPIOption === false" v-model="scope.row.KPI" @change="handleChange"></el-input-number>-->
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="managerCommit" label="直屬主管意見" width="250" align="center">
                <template #default="scope">
                  <el-input type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.managerCommit"></el-input>
                </template>
              </el-table-column>

              <el-table-column label="會議記錄" width="100" align="center" fixed="right">
                <template #default="scope">
                  <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #title><a-button class="toDo_tabs_button" @click="tab3">個人待辦事項</a-button></template>
          <el-form ref="validateForm" :inline="true" :model="editableTableData">
            <el-table :data="tables" ref="filterTable" style="width: 100%" :cell-style="rowClass">
              <!--<el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.propName" :label="item.labelName" :width="item.width"></el-table-column>-->
              <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
              <!--<el-table-column fixed label="待辦編碼" width="250" sortable>
                <el-table-column prop="no" label="待辦編碼" width="250">
                  <template #header>
                    <el-input v-model="search.no" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.no)"></span>
                  </template>
                </el-table-column>
              </el-table-column>-->
              <el-table-column fixed prop="projectNo" label="專案編碼" width="150" sortable align="center">
                <el-table-column prop="projectNo" label="專案編碼" width="150" align="center">
                  <template #header>
                    <el-input v-model="search.projectNo" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.projectNo)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column fixed prop="meetingList" label="內容" min-width="240" sortable>
                <el-table-column prop="meetingList" label="內容" min-width="240">
                  <template #header>
                    <el-input v-model="search.meetingList" size="mini" placeholder="關鍵字" />
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.meetingList)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="principal" label="負責人" width="200" align="center">
                <!--<el-table-column prop="principal" label="負責人" width="100" :filtered-value="filteredVal" :filters="personSelect" :filter-method="filterHandler" :filter-multiple="false">-->
                <el-table-column label="負責人" width="200">
                  <template #header>
                    <el-select v-model="search.principal" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in personSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.principal)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="department" label="部門" width="150" sortable align="center">
                <el-table-column prop="department" label="部門" width="150" align="center">
                  <template #header>
                    <el-select v-model="search.department" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in headerSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.department)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="status" label="執行狀態" width="150" sortable align="center">
                <el-table-column prop="status" width="150">
                  <template #header>
                    <el-select v-model="search.status" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in statusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.status)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="signedStatus" label="簽核狀態" width="150" sortable align="center">
                <el-table-column prop="signedStatus" width="150">
                  <template #header>
                    <el-select v-model="search.signedStatus" size="mini" placeholder="請選擇" clearable>
                      <el-option v-for="item in auditStatusSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                  <template #default="scope">
                    <a-button v-if="scope.row.auditStatus === '待送簽'" @click="sendPetition(scope.row)" type="primary" class="w-full">送簽</a-button>
                    <a-trigger v-else trigger="click">
                      <a-button type="text" v-html="showDate(scope.row.auditStatus)" class="w-full"></a-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-table ref="filterTable" :data="scope.row.signedStatus">
                            <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
                            <el-table-column prop="level" label="關卡" width="150"></el-table-column>
                            <el-table-column prop="status" label="狀態" width="100"></el-table-column>
                            <el-table-column prop="date" label="時間" width="180"></el-table-column>
                            <el-table-column prop="commit" label="說明" width="150"></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="待辦發生日期" sortable>
                <el-table-column prop="date" width="150">
                  <template #header>
                    <a-trigger trigger="click" :unmount-on-close="false">
                      <el-button class="w-full">日期搜尋</el-button>
                      <template #content>
                        <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                          <el-date-picker v-model="startDate" type="date" placeholder="開始" value-format="YYYY-MM-DD"></el-date-picker>
                          <el-date-picker v-model="endDate" type="date" placeholder="結束" value-format="YYYY-MM-DD"></el-date-picker>
                        </div>
                      </template>
                    </a-trigger>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.date)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="doneDate" label="預計完成日期" sortable>
                <el-table-column prop="doneDate" width="150">
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
                    <span v-html="showDate(scope.row.doneDate)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="defer" label="遞延次數" width="120" sortable align="center">
                <el-table-column prop="defer" width="120" align="center">
                  <template #header>
                    <el-input v-model="search.defer" size="mini" placeholder="關鍵字"></el-input>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.defer)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="KPI" label="KPI" width="100" sortable align="center">
                <el-table-column prop="KPI" width="100" align="center">
                  <template #header>
                    <el-input v-model="search.KPI" size="mini" placeholder="關鍵字"></el-input>
                  </template>
                  <template #default="scope">
                    <span v-html="showDate(scope.row.KPI)"></span>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="transfer" label="移轉紀錄" width="150" sortable align="center">
                <template #default="scope">
                  <span v-if="scope.row.transfer.length === 0"></span>
                  <a-trigger v-else trigger="click">
                    <a-button type="text" long>紀錄</a-button>
                    <template #content>
                      <div class="demo-basic rounded-md border border-gray-200 bg-white p-2 shadow-xl">
                        <el-table ref="filterTable" :data="scope.row.transfer">
                          <el-table-column type="index" label="序號" width="60" align="center"></el-table-column>
                          <el-table-column prop="date" label="時間" width="150"></el-table-column>
                          <el-table-column prop="record" label="移轉紀錄" width="150">
                            <template #default="scope">
                              <div class="flex">
                                <span>{{ scope.row.record.form }}</span>
                                <i class="ri-arrow-right-line"></i>
                                <span>{{ scope.row.record.to }}</span>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="edit" label="修改人員" width="150"></el-table-column>
                        </el-table>
                      </div>
                    </template>
                  </a-trigger>
                </template>
              </el-table-column>

              <el-table-column label="會議記錄" width="100" align="center" fixed="right">
                <template #default="scope">
                  <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      value1: "",
      wholeSearch: "",
      selectofearmonth: "",
      loading: true,
      loadingData: 0,
      color: "#673ab7",
      dateOption: "",

      /** 表頭搜尋 */
      search: {
        no: "",
        projectNo: "",
        meetingList: "",
        principal: "",
        department: "",
        status: "",
        auditStatus: "",
        signedStatus: "",
        date: "",
        doneDate: "",
        defer: "",
        KPI: "",
        start: "",
        end: "",
      },

      /** 驗證規則 */

      /** 待api匯入 */
      inServForm: {
        dataList: [], //待辦事項
        rules: {
          principalCommit: [{ required: true, message: "請輸入內容", trigger: "blur" }],
        },
      },

      domains: [],
      KPI: false,
      todayList: [], //當天到期
      // personal: "王大明", //個人待辦事項
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
      headerSelect: [
        {
          text: "行政部",
          value: "行政部",
        },
        {
          text: "建一部",
          value: "建一部",
        },
        {
          text: "建二部",
          value: "建二部",
        },
        {
          text: "建三部",
          value: "建三部",
        },
      ], //部門選單
      statusSelect: [
        {
          text: "已完成",
          value: "已完成",
        },
        {
          text: "未完成",
          value: "未完成",
        },
      ], //執行狀態選單
      KPISelect: [
        {
          value: 0,
        },
        {
          value: "+2",
        },
        {
          value: "+3",
        },
        {
          value: "+5",
        },
        {
          value: "+7",
        },
        {
          value: "+10",
        },
        {
          value: "-2",
        },
        {
          value: "-3",
        },
        {
          value: "-5",
        },
        {
          value: "-7",
        },
        {
          value: "-10",
        },
      ], //KPI分數選單
      auditStatusSelect: [
        {
          text: "已簽核",
          value: "已簽核",
        },
        {
          text: "待送簽",
          value: "待送簽",
        },
        {
          text: "待簽核",
          value: "待簽核",
        },
      ], //簽核狀態選單
      filteredVal: ["王大明"],

      /**待刪除*/
      tableData: [],
      headerSelected: "all",
      value2: "",
      startDate: null,
      endDate: null,
    };
  },
  created() {
    this.getApi();

    // this.tableData = this.inServForm.dataList;
    if (sessionStorage.getItem("tableHeader")) {
      this.tableHeader = JSON.parse(sessionStorage.getItem("tableHeader"));
    }
  },
  methods: {
    // 獲取API
    getApi() {
      function getAPI() {
        // return axios.get("http://localhost:3000/toDoList");
        return axios.get("https://krytabo.github.io/meetings_vue3/db.json");
      }

      Promise.all([getAPI()]).then((response) => {
        // this.inServForm.dataList = response[0].data;
        this.inServForm.dataList = response[0].data.toDoList;
        this.loadingData = 100;
        this.loading = false;
      });
    },

    // 搜尋高光
    showDate(val) {
      val = val + "";
      if (val.toLowerCase().includes(this.wholeSearch.toLowerCase()) !== -1 && this.wholeSearch !== "") {
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

    /** 檢視按鈕 */
    View_PricingList(index, result) {
      let data = JSON.stringify(result);
      this.$router.push({ path: "editMeeting", query: { res: data, editStatus: false } });
    },

    /** 送簽  */
    patchApprove() {
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
    },

    /** 簽核通過 */
    patchPASS() {
      this.$swal
        .fire({
          title: "你確定嗎？",
          text: "會議狀態即將改為「已簽核」",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#0084ff",
          confirmButtonColor: "#cccccc",
          confirmButtonText: "確定通過",
          cancelButtonText: "取消",
          closeOnConfirm: false,
        })
        .then((result) => {
          const obj = this.form;
          const id = this.form.id;
          if (result.isConfirmed) {
            this.form.approvals = "已簽核";
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
    },
    /** 退件 */
    patchReturn() {
      this.$swal
        .fire({
          title: "你確定嗎？",
          text: "此會議將退件，簽核狀態將改為「待送簽」",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#0084ff",
          confirmButtonColor: "#cccccc",
          confirmButtonText: "確定退回",
          cancelButtonText: "取消",
          closeOnConfirm: false,
        })
        .then((result) => {
          const obj = this.form;
          const id = this.form.id;
          if (result.isConfirmed) {
            this.form.approvals = "待送簽";
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
    },

    //送出簽核
    send() {
      this.$swal
        .fire({
          title: "你確定嗎？",
          text: "即將送出簽核",
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#0084ff",
          confirmButtonColor: "#cccccc",
          confirmButtonText: "確定送出",
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
          }
        })
        .catch(() => {});
    },
    validateField(form, index) {
      let result = true;
      for (const item of this.$refs[form].fields) {
        if (item.prop.split(".")[1] === index.toString()) {
          this.$refs[form].validateField(item.prop, (error) => {
            if (error !== "") {
              result = false;
            }
          });
        }
      }
      return result;
    },
    sendPetition(index) {
      console.log(index);

      let isValid = this.validateField("ruleForm", index);
      if (!isValid) return false;

      /*this.$refs["productRuleForm"].validate((valid) => {
        if (valid) {
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
        } else {
          return false;
        }
      });*/
    },

    // 檢視
    Edit_PricingList() {
      /* let data = JSON.stringify(result);
      this.$router.push({ path: "editMeeting", query: { res: data.id } });*/
      this.$router.push({ path: "toDoList/viewMeeting" });
    },

    //日期區間搜尋使用
    localizeDate(date) {
      if (!date || !date.includes("-")) return date;
      const [yyyy, mm, dd] = date.split("-");
      return new Date(`${mm}/${dd}/${yyyy}`);
    },

    //依照狀態改變table顏色
    rowClass(row) {
      if (row.row.status === "未完成" && row.row.auditStatus === "待送簽") {
        let stylejson = {};
        stylejson.backgroundColor = "#f56c6c !important";
        return stylejson;
      } else if (row.row.status === "已完成" && row.row.auditStatus === "已簽核") {
        let stylejson = {};
        stylejson.backgroundColor = "#eeeeee !important";
        return stylejson;
      }
    },

    tab1() {
      this.search = {
        no: "",
        projectNo: "",
        meetingList: "",
        principal: "",
        department: "",
        status: "",
        auditStatus: "",
        signedStatus: "",
        date: "",
        doneDate: "",
        defer: "",
        KPI: "",
        start: "",
        end: "",
      };
    },
    tab3() {
      this.search.principal = "王大明";
    },
  },
  mounted() {},
  computed: {
    // 搜尋
    tables() {
      const search = this.wholeSearch;
      const search2 = this.search.no;
      const search3 = this.search.projectNo;
      const search4 = this.search.meetingList;
      const search5 = this.search.principal;
      const search6 = this.search.department;
      const search7 = this.search.status;
      const search8 = this.search.signedStatus;
      const search10 = this.search.doneDate;
      const search11 = this.search.defer;
      const search12 = this.search.KPI;

      if (search) {
        return this.inServForm.dataList.filter((data) => {
          return Object.keys(data).some((key) => {
            // return String(data[key]).toLowerCase().indexOf(search) > -1;
            return String(data[key]).toLowerCase().includes(search.toLowerCase());
          });
        });
      }

      if (search2) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.no).toLowerCase().includes(search2.toLowerCase());
        });
      }
      if (search3) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.projectNo).toLowerCase().includes(search3.toLowerCase());
        });
      }
      if (search4) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.meetingList).toLowerCase().includes(search4.toLowerCase());
        });
      } else if (search5) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.principal).toLowerCase().includes(search5.toLowerCase());
        });
      }
      if (search6) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.department).toLowerCase().includes(search6.toLowerCase());
        });
      }
      if (search7) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.status).toLowerCase().includes(search7.toLowerCase());
        });
      }
      if (search8) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.auditStatus).toLowerCase().includes(search8.toLowerCase());
        });
      }
      if (search10) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.doneDate).toLowerCase().includes(search10.toLowerCase());
        });
      }
      if (search11) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.defer).toLowerCase().includes(search11.toLowerCase());
        });
      }
      if (search12) {
        return this.inServForm.dataList.filter((data) => {
          return String(data.KPI).toLowerCase().includes(search12.toLowerCase());
        });
      } else {
        let startDate = this.localizeDate(this.startDate);
        let endDate = this.localizeDate(this.endDate);
        const startDone = this.localizeDate(this.search.start);
        const endDone = this.localizeDate(this.search.end);
        return this.inServForm.dataList.filter((item) => {
          const itemDate = new Date(item.date);
          const itemDate2 = new Date(item.doneDate);
          if (startDate && endDate) {
            return startDate <= itemDate && itemDate <= endDate;
          }
          if (startDate && !endDate) {
            return startDate <= itemDate;
          }
          if (!startDate && endDate) {
            return itemDate <= endDate;
          }

          if (startDone && endDone) {
            return startDone <= itemDate2 && itemDate2 <= endDone;
          }
          if (startDone && !endDone) {
            return startDone <= itemDate2;
          }
          if (!startDone && endDone) {
            return itemDate2 <= endDone;
          }
          return true;
        });
      }

      // return this.inServForm.dataList;
    },
  },
};
</script>
<style lang="scss">
.toDo_tabs {
  .arco-tabs-nav-type-line {
    .arco-tabs-tab {
      margin: 0 5px;
    }
    .arco-tabs-tab:hover {
      .arco-tabs-tab-title::before {
        background-color: #fff !important;
      }
    }
  }
  .arco-tabs-tab-active,
  .arco-tabs-tab-active:hover {
    .toDo_tabs_button {
      color: rgb(var(--primary-6));
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
  .el-table--border .el-table__cell {
    border-right: none !important;
  }

  .rowClass {
    background: #f56c6c !important;
  }
}
</style>
