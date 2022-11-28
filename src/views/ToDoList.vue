<template>
  <div class="flex-1 h-full p-5">
    <!--<load-view :loading="loading" :progress-data="loadingData" :color="color"></load-view>-->
    <div class="flex-col space-y-10 rounded-xl bg-white p-10 shadow-6 flex-1">
      <a-tabs default-active-key="1" class="toDo_tabs">
        <template #extra>
          <div class="flex space-x-4 inline-block">
            <div class="flex-1 text-right">快速搜尋：</div>
            <el-input v-model="wholeSearch" placeholder="請輸入關鍵字" class="flex-1"></el-input>
          </div>
        </template>
        <a-tab-pane key="1">
          <!-- <div class="h-96 relative">
            <iframe
              id="fp_embed_player"
              src="https://flashphoner.ezplus.com.tw:8888/embed_player?urlServer=wss://flashphoner.ezplus.com.tw:8443&streamName=rtsp://admin:a-123456@125.227.202.189:5544/cam/realmonitor?channel=1%26subtype=0&mediaProviders=WebRTC,MSE,WSPlayer"
              marginwidth="0"
              marginheight="0"
              frameborder="0"
              scrolling="no"
              class="w-full h-full absolute top-0 left-0"
              allowfullscreen="allowfullscreen"
            ></iframe>
          </div>-->
          <template #title><a-button class="toDo_tabs_button">待辦事項總表</a-button></template>
          <!--<a-table :data="toDoList" column-resizable :bordered="{ cell: true }" :row-selection="rowSelection" @row-click="chang">
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
          <el-table :data="tables" style="width: 100%">
            <!--<el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.propName" :label="item.labelName" :width="item.width"></el-table-column>-->
            <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
            <el-table-column fixed label="待辦編碼" width="250" sortable>
              <el-table-column prop="no" label="待辦編碼" width="250">
                <template #header>
                  <el-input v-model="search.no" size="mini" placeholder="请输入" />
                </template>
                <!--<template #default="scope">
                  <span v-html="showDate(scope.row.no)"></span>
                </template>-->
              </el-table-column>
            </el-table-column>
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
            <el-table-column fixed prop="principal" label="負責人" width="100" sortable align="center">
              <el-table-column prop="principal" label="負責人" width="100" align="center">
                <template #header>
                  <el-input v-model="search.principal" size="mini" placeholder="關鍵字" />
                </template>
                <template #default="scope">
                  <span v-html="showDate(scope.row.principal)"></span>
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column prop="department" label="部門" width="150" sortable align="center" :filters="headerSelect" :filter-method="filterHandler" :filter-multiple="false">
              <template #default="scope">
                <span v-html="showDate(scope.row.department)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="執行狀態" width="150" sortable align="center" :filters="statusSelect" :filter-method="filterHandler" :filter-multiple="false">
              <template #default="scope">
                <span v-html="showDate(scope.row.status)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="signedStatus" label="簽核狀態" width="150" sortable align="center">
              <template #default="scope">
                <span v-if="scope.row.signedStatus.length === 0" class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>
                <a-trigger v-else trigger="click">
                  <a-button type="text" v-html="showDate(scope.row.auditStatus)"></a-button>
                  <template #content>
                    <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
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
            <el-table-column prop="date" label="待辦發生日期" width="180" sortable>
              <template #header>
                <div class="flex items-center">
                  待辦發生日期
                  <a-trigger trigger="click" :unmount-on-close="false">
                    <a-button><i class="ri-search-line"></i></a-button>
                    <template #content>
                      <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                        <selectFilterHeader v-model="value2" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
              <template #default="scope">
                <span v-html="showDate(scope.row.date)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="doneDate" label="預計完成日期" width="180" sortable>
              <template #header>
                <div class="flex items-center">
                  待辦發生日期
                  <a-trigger trigger="click" :unmount-on-close="false">
                    <a-button><i class="ri-search-line"></i></a-button>
                    <template #content>
                      <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                        <selectFilterHeader v-model="value2" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
              <template #default="scope">
                <span v-html="showDate(scope.row.doneDate)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="defer" label="遞延次數" width="120" sortable align="center">
              <template #default="scope">
                <span v-html="showDate(scope.row.defer)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="KPI" label="KPI" width="100" sortable align="center">
              <template #default="scope">
                <span v-html="showDate(scope.row.KPI)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="transfer" label="移轉紀錄" width="150" sortable align="center">
              <template #default="scope">
                <span v-if="scope.row.transfer.length === 0"></span>
                <a-trigger v-else trigger="click">
                  <a-button type="text">紀錄</a-button>
                  <template #content>
                    <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
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

            <el-table-column prop="zip" label="會議記錄" width="100" align="center" fixed="right">
              <template #default="scope">
                <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
              </template>
            </el-table-column>
          </el-table>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title><a-button class="toDo_tabs_button">當日到期待辦事項</a-button></template>
          <el-table :data="tables" style="width: 100%" table-layout="fixed">
            <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
            <el-table-column fixed prop="no" label="待辦編碼" width="250" sortable>
              <template #default="scope">
                <span v-html="showDate(scope.row.no)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="projectNo" label="專案代碼" width="100" align="center">
              <template #default="scope">
                <span v-html="showDate(scope.row.projectNo)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="principal" label="負責人" width="100" align="center">
              <template #default="scope">
                <span v-html="showDate(scope.row.principal)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部門" width="100" align="center" :filters="headerSelect" :filter-method="filterHandler" :filter-multiple="false">
              <template #default="scope">
                <span v-html="showDate(scope.row.department)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="meetingList" label="待辦事項" width="240">
              <template #default="scope">
                <span v-html="showDate(scope.row.meetingList)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="待辦發生日期" width="180">
              <template #header>
                <div class="flex items-center">
                  待辦發生日期
                  <a-trigger trigger="click" :unmount-on-close="false">
                    <a-button><i class="ri-search-line"></i></a-button>
                    <template #content>
                      <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                        <selectFilterHeader v-model="value2" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
              <template #default="scope">
                <span v-html="showDate(scope.row.date)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="doneDate" label="預計完成日期" width="180">
              <template #header>
                <div class="flex items-center">
                  預計完成日期
                  <a-trigger trigger="click" :unmount-on-close="false">
                    <a-button><i class="ri-search-line"></i></a-button>
                    <template #content>
                      <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                        <selectFilterHeader v-model="value2" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
              <template #default="scope">
                <span v-html="showDate(scope.row.doneDate)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="執行狀態" width="100" align="center" :filters="statusSelect" :filter-method="filterHandler" :filter-multiple="false">
              <template #default="scope">
                <span v-html="showDate(scope.row.status)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="principalDone" label="負責人回覆是否完成" width="120" align="center">
              <template #default="scope">
                <el-radio-group v-model="scope.row.principalDone" class="w-full text-center">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column prop="principalCommit" label="負責人說明" width="250" align="center">
              <template #default="scope">
                <el-input type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.principalCommit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="KPI" label="KPI" width="200" align="center">
              <template #default="scope">
                <div class="flex flex-col">
                  <el-checkbox v-model="scope.row.KPIOption">評分</el-checkbox>
                  <el-input-number :disabled="scope.row.KPIOption === false" v-model="scope.row.KPI" @change="handleChange"></el-input-number>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="managerCommit" label="直屬主管意見" width="250" align="center">
              <template #default="scope">
                <el-input type="textarea" :rows="2" placeholder="請輸入內容" v-model="scope.row.managerCommit"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="signedStatus" label="簽核狀態" width="100" align="center" fixed="right">
              <template #default="scope">
                <span v-if="scope.row.signedStatus.length === 0" class="w-full text-center" v-html="showDate(scope.row.auditStatus)"></span>
                <a-trigger v-else trigger="click">
                  <a-button type="text" v-html="showDate(scope.row.auditStatus)"></a-button>
                  <template #content>
                    <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
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
            <el-table-column prop="zip" label="會議記錄" width="100" align="center" fixed="right">
              <template #default="scope">
                <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
              </template>
            </el-table-column>
          </el-table>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #title><a-button class="toDo_tabs_button">個人待辦事項</a-button></template>
          <el-table :data="tables" ref="filterTable" style="width: 100%">
            <!--<el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item.propName" :label="item.labelName" :width="item.width"></el-table-column>-->
            <el-table-column fixed label="序號" type="index" width="60" align="center"></el-table-column>
            <el-table-column fixed prop="no" label="待辦編碼" width="250" sortable>
              <template #default="scope">
                <span v-html="showDate(scope.row.no)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="projectNo" label="專案代碼" width="100" align="center">
              <template #default="scope">
                <span v-html="showDate(scope.row.projectNo)"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="principal"
              label="負責人"
              width="100"
              align="center"
              :filtered-value="filteredVal"
              :filters="personSelect"
              :filter-method="filterHandler"
              :filter-multiple="false"
              column-key="tagKey"
            >
              <template #default="scope">
                <span v-html="showDate(scope.row.principal)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="department" label="部門" width="100" align="center" :filters="headerSelect" :filter-method="filterHandler">
              <template #default="scope">
                <span v-html="showDate(scope.row.department)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="meetingList" label="待辦事項" width="240">
              <template #default="scope">
                <span v-html="showDate(scope.row.meetingList)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="待辦發生日期" width="180">
              <template #header>
                <div class="flex items-center">
                  待辦發生日期
                  <a-trigger trigger="click" :unmount-on-close="false">
                    <a-button><i class="ri-search-line"></i></a-button>
                    <template #content>
                      <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                        <selectFilterHeader v-model="value2" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
              <template #default="scope">
                <span v-html="showDate(scope.row.date)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="doneDate" label="預計完成日期" width="180">
              <template #header>
                <div class="flex items-center">
                  待辦發生日期
                  <a-trigger trigger="click" :unmount-on-close="false">
                    <a-button><i class="ri-search-line"></i></a-button>
                    <template #content>
                      <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
                        <selectFilterHeader v-model="value2" :shortcuts-dbl="[7, 30, 60]" range-separator="至" is-double-time></selectFilterHeader>
                      </div>
                    </template>
                  </a-trigger>
                </div>
              </template>
              <template #default="scope">
                <span v-html="showDate(scope.row.doneDate)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="執行狀態" width="100" align="center" :filters="statusSelect" :filter-method="filterHandler" :filter-multiple="false">
              <template #default="scope">
                <span v-html="showDate(scope.row.status)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="defer" label="遞延次數" width="120" align="center" sortable>
              <template #default="scope">
                <span v-html="showDate(scope.row.defer)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="KPI" label="KPI" width="100" align="center" sortable>
              <template #default="scope">
                <span v-html="showDate(scope.row.KPI)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="transfer" label="移轉紀錄" width="100" align="center">
              <template #default="scope">
                <span v-if="scope.row.transfer.length === 0"></span>
                <a-trigger v-else trigger="click">
                  <a-button type="text">紀錄</a-button>
                  <template #content>
                    <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
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
            <el-table-column prop="signedStatus" label="簽核狀態" width="100" align="center" fixed="right">
              <template #default="scope">
                <a-button v-if="scope.row.signedStatus.length === 0" @click="sendPetition(scope.row)" type="primary" class="w-full">送簽</a-button>
                <a-trigger v-else trigger="click">
                  <a-button type="text" v-html="showDate(scope.row.auditStatus)"></a-button>
                  <template #content>
                    <div class="demo-basic shadow-xl border border-gray-200 rounded-md bg-white p-2">
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
            <el-table-column prop="zip" label="會議記錄" width="100" align="center" fixed="right">
              <template #default="scope">
                <a-button @click="Edit_PricingList(scope.$index, scope.row)" type="primary" status="success" size="small">檢視</a-button>
              </template>
            </el-table-column>
          </el-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import selectFilterHeader from "@/components/selectFilterHeader";

export default {
  name: "HomeView",
  components: { selectFilterHeader },
  data() {
    return {
      wholeSearch: "",
      selectofearmonth: "",
      loading: true,
      loadingData: 0,
      color: "#673ab7",

      /** 表頭搜尋 */
      search: {
        no: "",
        projectNo: "",
        meetingList: "",
        principal: "",
      },

      /** 待api匯入 */
      dataList: [], //待辦事項
      KPI: false,
      todayList: [], //當天到期
      personal: "王大明", //個人待辦事項
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
      filteredVal: ["王大明"],

      /**待刪除*/
      tableData: [],
      headerSelected: "all",
      value2: "",

      base3d: {},
      parseImgUrl: "https://obs.line-scdn.net/0hcWuufstfPHhIDCu61uRDL3BaMAl7aiZxaj1wGmRcMBhjICwqJj5vGz5ba1Q2Oi8naDgkTmRea0hga38qIA/w1200",
      // pointImg: require("../../../public/01.svg"),
      pointImg: "https://cdn-icons-png.flaticon.com/512/2377/2377922.png",
      pointSize: 10, //点的大小
      banMa: [],
      // parseImgUrl: "https://obs.line-scdn.net/0hcWuufstfPHhIDCu61uRDL3BaMAl7aiZxaj1wGmRcMBhjICwqJj5vGz5ba1Q2Oi8naDgkTmRea0hga38qIA/w1200",

      tableHeader: [
        {
          propName: "name",
          labelName: "姓名",
          width: "auto",
        },
        {
          propName: "age",
          labelName: "年龄",
          // width: 180,
          width: "auto",
        },
        {
          propName: "hobby",
          labelName: "爱好",
          // width: 180,
          width: "auto",
        },
        {
          propName: "home",
          labelName: "家乡",
          // width: 180,
          width: "auto",
        },
      ],
    };
  },
  created() {
    this.getApi();
    // this.tableData = this.dataList;
    if (sessionStorage.getItem("tableHeader")) {
      this.tableHeader = JSON.parse(sessionStorage.getItem("tableHeader"));
    }
  },
  methods: {
    todoSearchItself(headerItem) {
      headerItem.visible = false;
      if (headerItem.seachSetting.type === "Input") {
        this.seachFormItself[headerItem.seachSetting.rename && headerItem.seachSetting.rename !== "" ? headerItem.seachSetting.rename : headerItem.prop] = headerItem.seachSetting.value;
      }
      this.todoSearch(this.seachFormItself);
    },
    clearSearchItself(headerItem) {
      if (headerItem.seachSetting && headerItem.seachSetting.type) {
        headerItem.visible = false;
        if (headerItem.seachSetting.type === "Input") {
          headerItem.seachSetting.value = "";
          this.seachFormItself[headerItem.seachSetting.rename && headerItem.seachSetting.rename !== "" ? headerItem.seachSetting.rename : headerItem.prop] = "";
        }
        this.clearSearch(this.seachFormItself);
      }
    },
    // 触发的方法-操作
    clearSearch(val) {
      console.log("清空--clearSearch", val);
      this.pageNum = 1;
      this.pageSize = 10;
      this.seachForm = val;
      this.computedTableData();
    },
    todoSearch(val) {
      console.log("val---todoSearch", val);
      this.pageNum = 1;
      this.pageSize = 10;
      this.seachForm = val;
      this.computedTableData();
    },
    headerDragend(newWidth, oldWidth, column, event) {
      // 饿了么UI中提供的有对应参数，主要用到的是newWidth和column.property
      console.log(newWidth, oldWidth, column, event);

      // 根据column中的信息就可以知道用户拖动的是哪一列，从而将新的列宽度替换原来的列宽度
      let newTableHeader = this.tableHeader.map((item) => {
        if (item.propName == column.property) {
          item.width = newWidth;
        }
        return item;
      });

      // 最后存一份到本地，当刷新的时候，就用本地的这个记录了用户拖动宽度的表头数组数据
      sessionStorage.setItem("tableHeader", JSON.stringify(newTableHeader));
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

    // 獲取API
    getApi() {
      function getAPI() {
        return axios.get("https://run.mocky.io/v3/a960258d-f742-47cd-965a-9ce87dcb35b7");
      }

      Promise.all([getAPI()]).then((response) => {
        this.dataList = response[0].data.toDoList;
        this.loadingData = 100;
        this.loading = false;
      });
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

    // 檢視
    Edit_PricingList() {
      /* let data = JSON.stringify(result);
      this.$router.push({ path: "editMeeting", query: { res: data.id } });*/
      this.$router.push({ path: "toDoList/viewMeeting" });
    },

    createMarker(x, y) {
      var div = document.createElement("div");
      div.className = "marker";
      div.id = "marker" + this.banMa.length;
      y = y + document.getElementById("myBiaoZhu").offsetTop - this.pointSize / 2;
      x = x + document.getElementById("myBiaoZhu").offsetLeft - this.pointSize / 2;
      div.style.width = this.pointSize * 4.4 + "px";
      div.style.height = this.pointSize * 5.8 + "px";
      // div.style.backgroundColor = this.pointColor;
      div.style.background = "url(" + this.pointImg + ") no-repeat";
      div.style.position = "absolute";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.oncontextmenu = (e) => {
        //阻止冒泡行为和默认右键菜单事件，同时删除该点
        var id = e.target.id;
        document.getElementById("myBiaoZhuDiv").removeChild(div);
        this.banMa = this.banMa.filter((item) => item.id != id.slice(6, id.length));
        this.banMa = [];
        this.banMa.push({ regionId: this.regionId });
        this.unbunding(); // 解绑接口 用不到删除即可
        if (e && e.preventDefault) {
          //阻止默认浏览器动作(W3C)
          e.preventDefault();
        } else {
          //IE中阻止函数器默认动作的方式
          window.event.returnValue = false;
        }
        return false;
      };
      document.getElementById("myBiaoZhuDiv").appendChild(div);
      this.submitEqArr(); // 提交接口 用不到删除即可
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

      if (search) {
        return this.dataList.filter((data) => {
          return Object.keys(data).some((key) => {
            // return String(data[key]).toLowerCase().indexOf(search) > -1;
            return String(data[key]).toLowerCase().includes(search.toLowerCase());
          });
        });
      } else if (search2) {
        return this.dataList.filter((data) => {
          return String(data.no).toLowerCase().includes(search2.toLowerCase());
        });
      } else if (search3) {
        return this.dataList.filter((data) => {
          return String(data.projectNo).toLowerCase().includes(search3.toLowerCase());
        });
      } else if (search4) {
        return this.dataList.filter((data) => {
          return String(data.meetingList).toLowerCase().includes(search4.toLowerCase());
        });
      } else if (search5) {
        return this.dataList.filter((data) => {
          return String(data.principal).toLowerCase().includes(search5.toLowerCase());
        });
      }

      return this.dataList;
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
}
</style>
