<template>
  <div class="alarm-log" id="alarm-log">
    <div class="host-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i> -->
        <el-breadcrumb-item>门禁管理</el-breadcrumb-item>
        <el-breadcrumb-item>门禁日志</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="alarm-log-top">
      <div
        class="show-from"
        @click="activeName === 'first' ? (operationHidden = !operationHidden) : (eventHidden = !eventHidden)"
      >
        <i
          :class="
            activeName === 'first'
              ? operationHidden
                ? 'el-icon-arrow-down'
                : 'el-icon-arrow-up'
              : eventHidden
              ? 'el-icon-arrow-down'
              : 'el-icon-arrow-up'
          "
        ></i>
        <!-- <i class="el-icon-arrow-down"></i> -->
      </div>
      <el-tabs v-model="activeName" @tab-click="tabsClick" type="card">
        <el-tab-pane label="操作日志" name="first">
          <!-- <div class="zone-header" v-if="operationHidden"> -->
          <!-- <span @click="collapseClick('inquireInfo')" class="pointer">
                查询条件
                <i :class="collapseStatus.inquireInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span> -->
          <!-- <div class="zone-header-line"></div> -->
          <!-- </div> -->
          <div class="form-box" v-if="operationHidden" ref="form">
            <div class="form-content">
              <el-form :model="operating" label-position="right" size="mini" ref="noes" :rules="rules">
                <div class="box">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="operating.name" placeholder="请输入姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="IP地址" prop="ip">
                    <el-input v-model="operating.ip" placeholder="请输入IP地址"></el-input>
                  </el-form-item>
                  <el-form-item label="开始时间" prop="operatingStartTime">
                    <el-date-picker
                      size="mini"
                      v-model="operating.operatingStartTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      >></el-date-picker
                    >
                  </el-form-item>
                </div>
                <div class="box">
                  <el-form-item label="用户" prop="userName">
                    <el-input v-model="operating.userName" placeholder="请输入用户"></el-input>
                  </el-form-item>
                  <el-form-item label="操作类型" prop="eventType">
                    <el-select v-model="operating.Logtype" size="mini">
                      <el-option
                        v-for="(item, index) in getOperatingTypesArr"
                        :key="index"
                        :label="item.value"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="结束时间" prop="operatinendTime">
                    <el-date-picker
                      v-model="operating.operatinendTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      size="mini"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <div class="box">
                  <el-form-item label="所属机构" prop="orgName">
                    <el-autocomplete
                      class="inline-input"
                      size="mini"
                      v-model="operating.orgName"
                      value-key="name"
                      :fetch-suggestions="
                        (val, callback) => {
                          querySearch(1, 'org', val, callback)
                        }
                      "
                      placeholder="请输入机构"
                      :trigger-on-focus="false"
                      @select="
                        val => {
                          selectItem(1, 'org', val)
                        }
                      "
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="操作对象" prop="operatingObj">
                    <el-input v-model="operating.operatingObj" placeholder="请输入操作对象"></el-input>
                  </el-form-item>
                </div>
                <div class="box">
                  <el-form-item label="客户端类型" prop="ClientType">
                    <el-select v-model="operating.ClientType">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="B/S" value="1"></el-option>
                      <el-option label="APP" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="操作描述" prop="operatingInfo">
                    <el-input v-model="operating.operatingInfo" placeholder="请输入操作描述"></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div class="alarm-log-btn">
              <el-button type="primary" @click="OperationLogQuery" size="mini">查询</el-button>
              <el-button @click="resetClick('1')" size="mini">重置</el-button>
              <el-button @click="exportClick('操作日志')" size="mini">导出</el-button>
            </div>
          </div>
          <div class="alarm-log-bottom">
            <!-- <div class="zone-header">
                <span class="pointer">
                  查询结果
                  <i :class="collapseStatus.inquireList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
                <div class="zone-header-line"></div>
              </div> -->
            <div style="margin: 10px 0;" v-if="!printStatus">
              <!-- <el-button @click="exportClick" size="mini">导出</el-button> -->
              <!-- <el-button size="mini" @click="print">log-result-table打印</el-button>
              <el-button @click="delList" size="mini">删除</el-button>-->
            </div>
            <div class="alarm-log-result">
              <div class="" id="prints" v-if="!printStatus">
                <!-- .slice((OperationPage - 1) * pageSize, OperationPage * pageSize) -->
                <el-table
                  ref="eventTable"
                  border
                  :data="OperationLogList"
                  style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  @row-click="rowDataClick"
                  :height="operationHidden ? 480 : 700"
                  @select="select"
                  tooltip-effect="dark"
                >
                  <el-table-column width="80" type="selection"></el-table-column>
                  <el-table-column sortable width="80" label="序号" type="index"></el-table-column>
                  <el-table-column sortable prop="name" width="120" label="姓名"></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="userName"
                    width="140"
                    label="用户名"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="createdAt"
                    width="120"
                    label="时间"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="orgName"
                    width="120"
                    label="所属机构"
                  ></el-table-column>
                  <el-table-column show-overflow-tooltip sortable width="140" label="客户端类型">
                    <template slot-scope="scope">
                      <span v-if="scope.row.clientType == 1">B/S</span>
                      <span v-else>APP</span>
                      <div></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="ip"
                    label="IP地址"
                    width="140"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="operateName"
                    width="150"
                    label="操作类型"
                  ></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="action" label="动作"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="object" label="操作对象"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="result" width="120" label="操作结果">
                    <template slot-scope="scope">
                      <span v-if="scope.row.result == 1">成功</span>
                      <span v-else>APP</span>
                      <div></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="description"
                    width="220"
                    label="操作描述"
                  ></el-table-column>
                </el-table>
                <video-pagination
                  ref="listPagination"
                  :total="OperationLogTotal"
                  @paginationConfChange="eventChange"
                ></video-pagination>
                <!-- <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="OperationPage"
                  :page-sizes="[10, 25, 50, 100]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="OperationLogTotal"
                ></el-pagination>-->
              </div>
              <div class="log-info" v-if="printStatus">
                <ul class="left">
                  <h3>查询结果</h3>
                  <p>D1门-加钞间</p>
                  <li>
                    <i>所属机构 :</i>
                    <span>{{ viewList.platformName }}</span>
                  </li>
                  <li>
                    <i>所属重点部位 :</i>
                    <span>{{ viewList.keyPartName }}</span>
                  </li>
                  <li>
                    <i>所属设备 :</i>
                    <span>{{ viewList.channelName }}</span>
                  </li>
                  <li>
                    <i>品牌 :</i>
                    <span>xxxx</span>
                  </li>
                  <li>
                    <i>型号 :</i>
                    <span>xxxx</span>
                  </li>
                  <li>
                    <i>备注 :</i>
                    <span>xxx</span>
                  </li>
                  <div
                    style="float: right; margin-right: 30px; margin-top: 40px;"
                    class="log-result-btn"
                    v-if="printStatus"
                  >
                    <el-button class="part-info-btn" size="small" @click="closePrint">取消</el-button>
                    <el-button size="small" @click="closePrint">确认</el-button>
                  </div>
                </ul>
                <div class="UserImg">
                  <div style="width: 50%; border: 1px solid #e6e6e6;">
                    <img :src="viewList.picture" :alt="viewList.picture" />
                  </div>
                  <div class="right">
                    <ul>
                      <li>
                        <i>卡号:</i>
                        <span>{{ viewList.cardNumber }}</span>
                      </li>
                      <li>
                        <i>姓名:</i>
                        <span>{{ viewList.name }}</span>
                      </li>
                      <li>
                        <i>性别:</i>
                        <span>{{ viewList.sex }}</span>
                      </li>
                      <li>
                        <i>身份证:</i>
                        <span>{{ viewList.identityCard }}</span>
                      </li>
                      <li>
                        <i>部门:</i>
                        <span>{{ viewList.department }}</span>
                      </li>
                      <li>
                        <i>职务:</i>
                        <span>{{ viewList.job }}</span>
                      </li>
                      <li>
                        <i>事件类型:</i>
                        <span>{{ viewList.subLogType }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="事件日志" name="second">
          <!-- <div class="zone-header" v-if="eventHidden"> -->
          <!-- <span @click="collapseClick('inquireInfo')" class="pointer">
                查询条件
                <i :class="collapseStatus.inquireInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span> -->
          <!-- <div class="zone-header-line"></div> -->
          <!-- </div> -->
          <div class="form-box" v-if="eventHidden">
            <div class="form-content">
              <el-form :model="formInline" label-position="right" size="mini" ref="platformRules" :rules="rules">
                <div class="box">
                  <el-form-item label="所属机构" prop="orgName">
                    <el-autocomplete
                      class="inline-input"
                      size="mini"
                      v-model="formInline.orgName"
                      value-key="name"
                      :fetch-suggestions="
                        (val, callback) => {
                          querySearch(2, 'org', val, callback)
                        }
                      "
                      placeholder="请输入机构"
                      :trigger-on-focus="false"
                      @select="
                        val => {
                          selectItem(2, 'org', val)
                        }
                      "
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="所属重点部位" prop="keyPartName">
                    <el-autocomplete
                      class="inline-input"
                      size="mini"
                      v-model="formInline.keyPartName"
                      value-key="name"
                      :fetch-suggestions="
                        (val, callback) => {
                          querySearch(2, 'kp', val, callback)
                        }
                      "
                      placeholder="请输入重点部位"
                      :trigger-on-focus="false"
                      @select="
                        val => {
                          selectItem(2, 'kp', val)
                        }
                      "
                    ></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="所属门禁平台" prop="platformId">
                    <el-input size="mini" v-model="formInline.platformId" placeholder="请输入门禁平台"></el-input>
                  </el-form-item>
                  <el-form-item label="所属门禁主机" prop="deviceName">
                    <el-input size="mini" v-model="formInline.deviceName" placeholder="请输入所属门禁主机"></el-input>
                  </el-form-item>
                </div>
                <div class="box">
                  <el-form-item label="门禁通道名称" prop="orgName">
                    <el-input size="mini" v-model="formInline.channelName" placeholder="请输入门禁通道"></el-input>
                  </el-form-item>
                  <el-form-item label="事件名称">
                    <el-input v-model="formInline.eventName" size="mini" placeholder="请输入事件名称"></el-input>
                  </el-form-item>
                  <el-form-item label="部门" prop="department">
                    <el-input v-model="formInline.department" size="mini" placeholder="请输入部门"></el-input>
                  </el-form-item>
                  <el-form-item label="卡号" prop="cardNumber">
                    <el-input v-model="formInline.cardNumber" size="mini" placeholder="请输入卡号"></el-input>
                  </el-form-item>
                </div>
                <div class="box">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="formInline.name" size="mini" placeholder="请输入姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-select v-model="formInline.sex" size="mini">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="男" value="1"></el-option>
                      <el-option label="女" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="身份证" prop="card">
                    <el-input v-model="formInline.card" size="mini" placeholder="请输入身份证"></el-input>
                  </el-form-item>
                  <el-form-item label="开始时间">
                    <el-date-picker
                      v-model="formInline.startTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      size="mini"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <div class="box">
                  <el-form-item label="职务" prop="job">
                    <el-input v-model="formInline.job" size="mini" placeholder="请输入职务"></el-input>
                  </el-form-item>
                  <el-form-item label="结束时间">
                    <el-date-picker
                      v-model="formInline.endTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                      size="mini"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div class="alarm-log-btn">
              <el-button type="primary" @click="inquireClick" size="mini">查询</el-button>
              <el-button @click="resetClick('2')" size="mini">重置</el-button>
              <el-button @click="exportClick('事件日志')" size="mini">导出</el-button>
            </div>
          </div>
          <div class="alarm-log-bottom">
            <!-- <div class="zone-header">
                <span class="pointer">
                  查询结果
                  <i :class="collapseStatus.inquireList ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
                <div class="zone-header-line"></div>
              </div> -->
            <div style="margin: 10px 0;" v-if="!printStatus">
              <!-- <el-button @click="exportClick" size="mini">导出</el-button> -->
              <!-- <el-button size="mini" @click="print">打印</el-button> -->
              <!-- <el-button @click="delList" size="mini">删除</el-button> -->
            </div>

            <div class="alarm-log-result">
              <div class="log-result-table" style="overflow:hidden" id="prints" v-if="!printStatus">
                <!-- .slice((hostCurrentPage - 1) * EventPageSize, hostCurrentPage * EventPageSize)" -->
                <el-table
                  ref="multipleTable"
                  border
                  :data="eventList"
                  style="width: 100%;"
                  @selection-change="handleSelectionChange"
                  @row-click="rowDataClick"
                  :height="eventHidden ? 430 : 700"
                  @select="select"
                  tooltip-effect="dark"
                >
                  <el-table-column width="80" type="selection"></el-table-column>
                  <el-table-column sortable width="80" label="序号" type="index"></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="orgName"
                    width="140"
                    label="所属机构"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="keyPartName"
                    width="120"
                    label="所属重点部位"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="deviceName"
                    width="120"
                    label="所属门禁主机"
                  ></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="channelName"
                    width="140"
                    label="门禁通道名称"
                  ></el-table-column>
                  <el-table-column show-overflow-tooltip sortable label="日志类型" width="140" prop="eventType">
                    <!-- <template slot-scope="scope">
                      <span v-show="scope.row.EventType == 1">事件类型</span>
                      <span v-show="scope.row.EventType == 2">警告类型</span>
                      <span v-show="scope.row.EventType == 3">操作类型</span>
                    </template> -->
                  </el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="eventName" width="150" label="日志子类型">
                    <!-- <template slot-scope="scope">
                      <span v-show="scope.row.logType == 1">事件</span>
                      <span v-show="scope.row.logType == 2">警告</span>
                      <span v-show="scope.row.logType == 3">操作日志</span>
                    </template> -->
                  </el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="occurTime" label="时间"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="cardNumber" label="卡号"></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    sortable
                    prop="name"
                    width="120"
                    label="姓名"
                  ></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="sex" width="220" label="性别"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="identityCard" label="身份证"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="department" label="部门"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable prop="job" label="职务" width="120"></el-table-column>
                  <el-table-column show-overflow-tooltip sortable label="照片">
                    <!-- prop="picturePath" -->
                    <!-- <template slot-scope="scope">
                      <el-popover placement="top-start" title trigger="hover">
                        <img :src="scope.row.picturePath" alt style="width: 150px; height: 150px;" />
                        <img
                          v-if="scope.row.picturePath"
                          slot="reference"
                          :src="scope.row.picturePath"
                          style="width: 50px; height: 50px;"
                        />
                      </el-popover>
                    </template> -->
                  </el-table-column>
                </el-table>
                <video-pagination
                  ref="listPagination"
                  :total="EventPageSizeTotal"
                  @paginationConfChange="operatingChange"
                ></video-pagination>
                <!-- <el-pagination
                  @size-change="eventhandleSizeChange"
                  @current-change="eventhandleCurrentChange"
                  :current-page="hostCurrentPage"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="EventPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="EventPageSizeTotal"
                ></el-pagination>-->
              </div>
              <div class="log-info" v-if="printStatus">
                <ul class="left">
                  <h3>查询结果</h3>
                  <p>D1门-加钞间</p>
                  <li>
                    <i>所属机构 :</i>
                    <span>{{ viewList.platformName }}</span>
                  </li>
                  <li>
                    <i>所属重点部位 :</i>
                    <span>{{ viewList.keyPartName }}</span>
                  </li>
                  <li>
                    <i>所属设备 :</i>
                    <span>{{ viewList.channelName }}</span>
                  </li>
                  <li>
                    <i>品牌 :</i>
                    <span>xxxx</span>
                  </li>
                  <li>
                    <i>型号 :</i>
                    <span>xxxx</span>
                  </li>
                  <li>
                    <i>备注 :</i>
                    <span>xxx</span>
                  </li>
                  <div
                    style="float: right; margin-right: 30px; margin-top: 40px;"
                    class="log-result-btn"
                    v-if="printStatus"
                  >
                    <el-button class="part-info-btn" size="small" @click="closePrint">取消</el-button>
                    <el-button size="small" @click="closePrint">确认</el-button>
                  </div>
                </ul>
                <div class="UserImg">
                  <div style="width: 50%; border: 1px solid #e6e6e6;">
                    <img :src="viewList.picture" :alt="viewList.picture" />
                  </div>
                  <div class="right">
                    <ul>
                      <!-- <li v-for="(item, index) in items" :key="index"></li> -->
                      <li>
                        <i>卡号:</i>
                        <span>{{ viewList.cardNumber }}</span>
                      </li>
                      <li>
                        <i>姓名:</i>
                        <span>{{ viewList.name }}</span>
                      </li>
                      <li>
                        <i>性别:</i>
                        <span>{{ viewList.sex }}</span>
                      </li>
                      <li>
                        <i>身份证:</i>
                        <span>{{ viewList.identityCard }}</span>
                      </li>
                      <li>
                        <i>部门:</i>
                        <span>{{ viewList.department }}</span>
                      </li>
                      <li>
                        <i>职务:</i>
                        <span>{{ viewList.job }}</span>
                      </li>
                      <li>
                        <i>事件类型:</i>
                        <span v-show="viewList.subLogType == 1">{{ 事件类型 }}</span>
                        <span v-show="viewList.subLogType == 2">{{ 警告类型 }}</span>
                        <span v-show="viewList.subLogType == 3">{{ 操作类型 }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 查看录像和操作日志 -->
    <div class="alarm-model">
      <AlarmVideo
        :videoControl="alarmVideo.videoStatus"
        :alarmModelData="alarmVideo.alarmData"
        @sureClick="sureVideoClick"
        v-if="alarmVideo.videoStatus"
      ></AlarmVideo>
      <AlarmOperationLog
        :logControl="operLog.logStatus"
        :alarmModelData="operLog.alarmData"
        @sureClick="sureLogClick"
        v-if="operLog.logStatus"
      ></AlarmOperationLog>
    </div>
  </div>
</template>

<script>
import { accessLog, accessEventAlarm, accessAlarm } from '@src/http/access/accessAlarm'
import { FileDownLoad, delLogList } from '@src/http/access/event'
import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
import { getTreeApi, getAccessList } from '@src/http/access/accessMan'
import { getServeId, brandOrModelNum } from '@src/http/access/getId'
import { getHostList } from '@src/http/access/host'
import { OperationLog, operatingLogDownLoad, eventDownLoad, operatingType } from '@src/http/access/event'
import { download } from '@src/common/download.js'
import accessRules from 'assets/rules/validation/security/access'
import _ from 'lodash'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
export default {
  components: {
    AlarmVideo: () => import('./components/AlarmVideo'),
    AlarmOperationLog: () => import('./components/AlarmOperationLog'),
    treeBox: () => import('@src/components/tree/treeBox'),
    VideoPagination
  },
  data() {
    return {
      eventTaleHeight: 400,
      operationHidden: true,
      eventHidden: true,
      operatingList: [],
      OperationPage: 1,
      pageSize: 25,
      OperationLogTotal: 0,
      EventPageSize: 25,
      hostCurrentPage: 1,
      EventPageSizeTotal: 0,
      nameLable: '',
      partData: [],
      treeType: 3,
      activeName: 'first',
      MayEventType: [],
      viewList: {},
      ids: '',
      cuurtList: [],
      operating: {
        page: 1,
        limit: 100,
        eventType: '', // 日志类型
        ChildLogtype: '', // 日志子类型
        user: '', // 操作类型
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        disab: '',
        userName: '', // 姓名
        name: '',
        ip: '', // ip地址
        orgName: '', //所属机构
        operatingObj: '', //操作对象
        ClientType: '', // 客户端类型
        operatingInfo: '' // 操作描述
      },
      formInline: {
        page: '1',
        limit: '100',
        orgId: '',
        keyPartId: '',
        orgName: '', //机构
        keyPartName: '', // 重点部位
        // guardHostId: '', //平台
        deviceName: '', // 主机
        eventName: '', //门禁事件
        cardNumber: '', // 卡号
        name: '', // 用户名字
        sex: '', //性别
        department: '', //部门
        job: '', //职务
        platformId: '', // 平台id
        startTime: '', // 开始时间输入框
        endTime: '', // 结束时间输入框
        channelName: ''
      },
      rules: accessRules.accessLog,
      eventList: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      multipleSelection: [],
      collapseStatus: {
        inquireInfo: true
        // inquireList: true
      },
      // 视频弹框状态
      alarmVideo: {
        videoStatus: false,
        alarmData: ''
      },
      // 操作日志状态
      operLog: {
        logStatus: false,
        alarmData: ''
      },
      printStatus: false,
      printColumn: [],
      printData: '',
      href: '',
      serchDerive: [],
      brands: [], //事件类型
      modelNums: [], //事件子类型
      getAccessArr: [], // 所属平台
      hostArr: [], //主机
      OperationPage: 1,
      pageSize: 25,
      OperationLogList: [],
      getOperatingTypesArr: [] // 操作日志操作类型 list
    }
  },
  created() {
    this.getOperatingTypes()
    // let startTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    // this.formInline.receiveTime.push(startTime, endTime) //接警时间
    // this.formInline.dealTime.push(startTime, endTime) //处警时间
  },
  computed: {
    getEventTableSize() {
      return
    },
    getoperatingTableSize() {
      return
    }
  },
  methods: {
    /**
     * @description: 动态计算table的高度
     * @param {type}:
     * @type:
     * @return: Higeht size
     */
    // SizeTableHeight() {
    //   this.$nextTick(function () {
    //     this.eventTaleHeight = window.innerHeight - this.$refs.eventTable.$el.offsetTop - this.$refs.form.$el.offsetTop
    //     let that = this
    //     window.onresize = function () {
    //       that.eventTaleHeight = window.innerHeight - that.$refs.eventTable.$el.offsetTop - that.$refs.form.$el.offsetTop
    //     }
    //   })
    // },
    /**
     * @description: 获取操作日志 操作类型
     * @param {type}: 无
     * @type: get
     * @return: data
     */
    getOperatingTypes() {
      operatingType()
        .then(res => {
          if (res.data.code == 0) {
            this.getOperatingTypesArr = res.data.data
          } else {
          }
        })
        .catch(err => {
          console.log('Log', err)
        })
    },
    /**
     * @description: 操作日志 事件日志分页
     * @param {type}: Number 1-操作 2-事件
     * @return: 无
     */
    accessLogTbale(logType) {
      if (logType == 1) {
        this.operating.page = data.page
        this.operating.limit = data.limit
      } else {
        this.formInline.page = data.page
        this.formInline.limit = data.limit
        //
      }
    },
    /**
     * @description: 操作日志导出
     * @param {type}: Object
     * @type: get
     * @return: 无
     */
    exportClick(type) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (type == '事件日志') {
          if (this.serchDerive.length && this.serchDerive.length > 0) {
            const tHeader = [
              '姓名',
              '用户名',
              '时间',
              '所属机构',
              '客户端类型',
              'IP地址',
              '操作类型',
              '操作对象',
              '操作结果',
              '操作描述'
            ]
            const filterVal = [
              'name',
              'userName',
              'createdAt',
              'orgName',
              'clientType',
              'ip',
              'operateName',
              'action',
              'object',
              'result',
              'department',
              'description'
            ]
            let list = []
            list = this.$lodash.cloneDeep(this.serchDerive)
            list.forEach(item => {
              item.logType == 1
                ? (item.logType = '事件类型')
                : item.logType == 2
                ? (item.logType = '警告类型')
                : (item.logType = '操作类型')
            })
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, type)
          } else {
            let param = {}
            param = this.$lodash.cloneDeep(this.formInline) // 此处参数需要处理
            param = this.deleteObjKey(param)
            console.log('xxxx', param)
            debugger
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/guard/v1/record/explode`
            let name = `门禁事件日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(
              url,
              name,
              () => {},
              () => {
                this.$message({ type: 'info', message: '导出文件下载失败！' })
              },
              () => {},
              'post',
              param
            )
          }
        } else {
          if (this.operatingList && this.operatingList.length > 0) {
            const tHeader = [
              '所属机构',
              '所属重点部位',
              '所属门禁主机',
              '门禁通道名称',
              '日志类型',
              '日志子类型',
              '时间',
              '卡号',
              '姓名',
              '性别',
              '身份证',
              '部门',
              '职务'
              // '照片',
            ]
            const filterVal = [
              'orgName',
              'keyPartName',
              'deviceName',
              'channelName',
              'logType',
              'logType',
              'occurTime',
              'cardNumber',
              'name',
              'sex',
              'identityCard',
              'department',
              'job'
              // 'picture',
            ]
            let lists = []
            lists = this.$lodash.cloneDeep(this.operatingList)
            lists.forEach(item => {
              lists.clientType == 1 ? 'B/S' : 'APP'
            })
            const datas = this.formatJson(filterVal, lists)
            export_json_to_excel(tHeader, datas, type)
          } else {
            let params = {
              page: this.OperationPage,
              limit: this.pageSize,
              orgId: this.operating.orgId,
              orgName: this.operating.orgName,
              name: this.operating.name,
              ip: this.operating.ip,
              clientType: this.operating.ClientType,
              moduleType: 3,
              operatingObj: this.operating.operatingObj,
              userName: this.operating.username,
              startTime: this.operating.operatingStartTime,
              endTime: this.operating.operatinendTime,
              operateName: this.operating.operatingInfo, //操作名称
              action: ''
            }
            let result = this.$lodash.cloneDeep(params)
            let param = this.deleteObjKey(result)
            // operatingLogDownLoad(param).then(res => {
            //   if (res.data.code == 0) {
            //   }
            // })

            // return
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/guard/v1/operatelog/explode`
            let name = `门禁操作日志导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
            download(
              url,
              name,
              () => {},
              () => {
                this.$message({ type: 'info', message: '导出文件下载失败！' })
              },
              () => {},
              'post',
              param
            )
          }
        }
      }, 500)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    /**
     * @description: 机构树模糊查询 机构 / 重点部位   type = 1 为操作 2为事件
     * @param {type}: ...args
     * @return: 无
     */
    querySearch(classType, type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? (classType === 1 ? this.operating.orgId : this.formInline.orgId) : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },

    selectItem(classType, type, val) {
      if (classType === 1) {
        if (type === 'org') {
          this.operating.orgId = val.id
          this.operating.orgName = val.name
        } else if (type === 'kp') {
          this.operating.keyPartId = val.id
          this.operating.keyPartName = val.name
        }
      } else {
        if (type === 'org') {
          this.formInline.orgId = val.id
          this.formInline.orgName = val.name
        } else if (type === 'kp') {
          this.formInline.keyPartId = val.id
          this.formInline.keyPartName = val.name
        }
      }
    },
    /**
     * @description: 操作日志查询
     * @param {type}: Object
     * @return: data
     */
    OperationLogQuery(changePage) {
      /* Time 判断 */
      if (this.operating.endTime !== '' && this.operating.endTime !== null) {
        if (
          this.operating.startTime !== '' &&
          this.operating.startTime !== null &&
          this.$moment(this.operating.endTime).valueOf() - this.$moment(this.operating.startTime).valueOf() <= 0
        ) {
          this.$messageError('结束时间不能小于开始时间', '错误')
          return
        }
      }

      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        let params = {
          page: this.OperationPage,
          limit: this.pageSize,
          orgId: this.operating.orgId,
          orgName: this.operating.orgName,
          name: this.operating.name,
          ip: this.operating.ip,
          clientType: this.operating.ClientType,
          moduleType: 3,
          operatingObj: this.operating.operatingObj,
          userName: this.operating.userName,
          startTime: this.operating.operatingStartTime,
          endTime: this.operating.operatinendTime,
          operateName: this.operating.operatingInfo, //操作名称
          action: ''
          // result: 1
        }

        let result = this.$lodash.cloneDeep(Object.assign(params))
        result = this.deleteObjKey(result)
        OperationLog(result).then(res => {
          if (res.data.code == 0) {
            this.OperationLogTotal = res.data.data.page.totalNumber
            this.OperationLogList = res.data.data.logs
            if (changePage == true) return
            this.$notify({
              title: '成功',
              message: '查询成功',
              position: 'top-right',
              type: 'success'
            })
            if (!this.OperationLogTotal) {
              this.OperationLogTotal = res.data.data.page.totalNumber
              this.OperationLogList = []
              this.$notify({
                title: '成功',
                message: '暂未匹配日志',
                position: 'top-right',
                type: 'success'
              })
            }
          } else {
          }
        })
      }, 500)
    },
    /**
     * @description: 日志查询条件参数筛选
     * @param {type}: Object
     * @type:
     * @return: Object
     */
    deleteObjKey(Objects) {
      let newObj = {}
      for (let key in Objects) {
        if ((Objects[key] === 0 || Objects[key]) && Objects[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
          newObj[key] = Objects[key]
        }
      }
      return newObj
    },
    updateList(index, type) {
      let _this = this
      this.formInline.eventType = ''
      this.operating.ChildLogtype = ''

      let queryList = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '10' }]
      brandOrModelNum({ queryList }).then(res => {
        if (type == '全部') {
          _this.modelNums = res.data.data[0].attr
          return
        }
        _this.modelNums = res.data.data[0].attr
        let brand = _this.brands
        let modelList = _this.modelNums
        let data1 = brand[index].data
        let arr = []
        modelList.filter(v => {
          if (v.homeClass == data1) {
            arr.push(v)
          }
          _this.modelNums = arr
        })
      })
    },
    changeData(id) {
      this.getAccessArr = []
      let obj = {
        limit: 1000,
        page: 1,
        rescusive: true,
        keyPartId: id
      }
      getAccessList(obj).then(res => {
        this.getAccessArr = res.data.data.platforms
      })
    },
    changeHost(id) {
      this.hostArr = []
      let obj = {
        limit: 1000,
        page: 1,
        rescusive: true,
        keyPartId: this.formInline.keyPart // 携带重点部位id即可
      }
      getHostList(obj).then(res => {
        this.hostArr = res.data.data.hosts
      })
    },
    getTree(params) {
      return getTreeApi(params)
    },
    playBackGetData(data) {
      this.nameLable = data.name
      this.formInline.orgId = data.serial
      let obj = {
        type: 2,
        oId: data.serial
      }
      this.partData = []
      this.formInline.keyPart = ''
      getTreeApi(obj).then(res => {
        if (res.data.data.nodes) {
          res.data.data.nodes.forEach(item => {
            if (item.tierType === 'loc') {
              this.partData.push(item)
            }
          })
        }
      })
    },
    tabsClick(tab, event) {},
    select(s, row) {
      this.serchDerive = s
      this.operatingList = s
      this.ids = row.id
      this.cuurtList = s

      this.viewList = {
        platformName: row.platformName,
        keyPartName: row.keyPartName,
        channelName: row.channelName,
        picture: row.picture,
        cardNumber: row.cardNumber, //卡号
        name: row.name, //姓名
        sex: row.sex,
        identityCard: row.identityCard,
        department: row.department,
        job: row.job,
        subLogType: row.subLogType
      }
      this.cuurtList.forEach((item, index) => {})
    },
    // 折叠面板
    collapseClick(key) {
      this.collapseStatus[key] = !this.collapseStatus[key] //true || false
      if (this.collapseStatus[key]) {
        Object.keys(this.collapseStatus).forEach(item => {
          if (item !== key) {
            this.collapseStatus[item] = false
          }
        })
      }
    },
    /**
     * @description:事件日志查询
     * @param {type}: Object
     * @return: data
     */
    inquireClick(changePage) {
      if (this.endTime !== '' && this.endTime !== null) {
        if (
          this.formInline.startTime !== '' &&
          this.formInline.startTime !== null &&
          this.$moment(this.formInline.endTime).valueOf() - this.$moment(this.formInline.startTime).valueOf() <= 0
        ) {
          this.$messageError('结束时间不能小于开始时间', '错误')
          return
        }
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        let pageObj = {
          page: this.hostCurrentPage,
          limit: this.EventPageSize
        }
        let result = this.$lodash.cloneDeep(Object.assign(this.formInline, pageObj))
        delete result.orgName
        delete result.keyPartName
        result = this.deleteObjKey(result) // 条件过滤

        accessLog(result)
          .then(res => {
            if (res.data.code == 0) {
              this.eventList = res.data.data.guards
              this.EventPageSizeTotal = res.data.data.page.totalNumber
              if (changePage == true) {
                return
              }
              this.$notify({
                title: '成功',
                message: '查询成功',
                position: 'top-right',
                type: 'success'
              })
              if (!this.EventPageSizeTotal) {
                this.eventList = []
                this.EventPageSizeTotal = res.data.data.page.totalNumber
                this.$notify({
                  title: '成功',
                  message: '暂未匹配日志',
                  position: 'top-right',
                  type: 'success'
                })
              }
            } else {
              this.$notify({
                title: '错误',
                message: '查询失败',
                position: 'top-right',
                type: 'error'
              })
            }
          })
          .catch(error => this.$messageError('查询失败'))
      }, 500)
    },
    /**
     * @description: 操作日志事件日志重置
     * @param {type}: Number
     * @return: 无
     */
    resetClick(logType) {
      if (logType == 1) {
        for (let key in this.operating) {
          this.operating[key] = ''
        }
        this.OperationLogQuery()
      } else {
        for (let key in this.formInline) {
          this.formInline[key] = ''
        }
        this.inquireClick()
      }
    },

    // 查看录像
    viewVideoBtn(index, row) {
      // console.log('~~查看录像~~', index, row)
      this.alarmVideo.videoStatus = true
      this.alarmVideo.alarmData = row
    },
    // 查看录像弹框关闭事件
    sureVideoClick(data) {
      this.alarmVideo.videoStatus = data
    },
    // 查看操作日志
    viewLogBtn(index, row) {
      this.operLog.logStatus = true
      this.operLog.alarmData = row
    },
    // 操作日志弹框关闭事件
    sureLogClick(data) {
      this.operLog.logStatus = data
    },
    // 行选中信息
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log('选中信息', val)
    },
    // 行点击
    rowDataClick(row) {
      this.viewList = {
        platformName: row.platformName,
        keyPartName: row.keyPartName,
        channelName: row.channelName,
        picture: row.picture,
        cardNumber: row.cardNumber, //卡号
        name: row.name, //姓名
        sex: row.sex,
        identityCard: row.identityCard,
        department: row.department,
        job: row.job,
        subLogType: row.subLogType
      }
      this.printData = row
      // this.printStatus = true
      // this.printColumn = this.tableColumn.slice(1, this.tableColumn.length)
      // this.printColumn.forEach(item => {
      //   if (item.mark !== 'subsystem') {
      //     item.info = row[item.mark]
      //   }
      // })
    },
    operatingChange(data) {
      this.hostCurrentPage = data.page
      this.EventPageSize = data.limit
      this.inquireClick(true)
    },
    eventChange(data) {
      this.OperationPage = data.page
      this.pageSize = data.limit
      this.OperationLogQuery(true)
    },
    // handleSizeChange(val) {
    //   this.pageSize = val
    //   this.OperationLogQuery(true)
    // },
    // handleCurrentChange(val) {
    //   this.OperationPage = val // 操作日志分页
    //   this.OperationLogQuery(true)
    // },

    // eventhandleCurrentChange(val) {
    //   this.hostCurrentPage = val

    //   this.inquireClick(true)
    // },
    // eventhandleSizeChange(val) {
    //   this.EventPageSize = val

    //   this.inquireClick(true)
    // },
    closePrint() {
      // this.OperationLogQuery()
    }
  },
  mounted() {
    let brandsA = [{ type: '1', moduleId: '1', childModuleId: '4', dictId: '9' }]
    let queryList = brandsA
    let _this = this
    brandOrModelNum({ queryList }).then(res => {
      _this.brands = res.data.data[0].attr
    })

    // this.SizeTableHeight()
  },
  watch: {
    'formInline.startTime'(newVal) {}
  }
}
</script>

<style scoped lang="less">
.alarm-log {
  box-sizing: border-box;
  padding: 0px 10px;
  position: relative;
  width: 100%;
  .show-from {
    width: 37px;
    height: 35px;
    border: 1px solid #9eadc1;
    position: absolute;
    right: 0px;
    top: 20px;
    cursor: pointer;
    text-align: center;
    i {
      color: #333;
      font-size: 18px;
      line-height: 35px;
      font-weight: 600;
    }
  }
  .host-header {
    padding: 10px 0;
  }
  .form-box {
    width: 80%;
    height: auto;
    margin: 0 auto;
    .form-content {
      display: flex;
      font-size: 12px;
      padding: 10px;
      background: #f5f5f5;
      .box {
        flex: 1;
        float: left;
        width: 25%;
        .el-input {
          margin-top: 2px;
        }
        .el-date-editor--datetimerange.el-input,
        .el-date-editor--datetimerange.el-input__inner {
          margin-top: 2px;
        }
        .el-select {
          // width: 70% !important;
          margin-top: 2px;
        }
        /deep/ .el-input__inner {
          width: 240px;
        }
        /deep/ .el-form-item__label {
        }
      }
      .alarm-time {
        width: 520px;
      }
    }
    .alarm-log-btn {
      width: 1438px;
      text-align: center;
      margin-top: 10px;
    }
  }
  .alarm-log-bottom {
    .alarm-log-result {
      // padding: 10px;
      .log-result-btn {
        margin: 10px 0;
      }
      .log-result-table {
        overflow: hidden;
        .el-pagination {
          float: right;
          margin: 10px 0;
        }
      }
      .log-info {
        width: 913px;
        height: 256px;
        border: 1px solid #bcbcbc;
        margin: 0 auto;
        display: flex;
        h3 {
          text-align: center;
          font-weight: 700;
          font-size: 20px;
        }
        p {
          text-align: left;
          font-weight: 700;
          font-size: 18px;
          margin-top: 30px;
          margin-bottom: 5px;
        }
        .left {
          width: 80%;
          padding: 10px;
          overflow: hidden;
          li {
            width: 50%;
            float: left;
            padding: 2px 0;
            i {
              border-right: 1px solid #fff;
            }
            .info {
              float: left;
              overflow: hidden;
              padding-left: 20px;
            }
          }
          li:nth-child(4n + 3) {
            background: #fff;
          }
          li:nth-child(4n + 4) {
            background: #fff;
          }
        }
        .UserImg {
          display: flex;
          width: 20%;
          height: 100%;
          img {
            line-height: 200px;
          }
          .right {
            ul {
              margin-top: 60px;
              padding: 5px 2px;
            }
          }
        }
      }
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 10px;
    display: flex;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(33, 33, 33, 1);
    span {
      width: 100px;
    }
    .zone-header-line {
      display: inline-block;
      flex: 1;
      border-top: 1px solid #bcbcbc;
      margin-top: 10px;
    }
  }
  /deep/ .el-form-item__label {
    width: 120px !important;
  }
  /deep/ .el-form-item__content {
    margin-left: 120px;
    padding: 0 !important;
    margin: 0 !important;
  }

  /deep/ .el-form-item {
    display: flex;
    width: 400px;
  }
  /deep/.el-tabs {
    height: calc(~'100% - 1px');
    .el-tabs__header {
      border-bottom: 1px solid #e1e1e1;
      width: calc(~'100% - 75px');

      .el-tabs__nav-wrap {
        .el-tabs__nav-scroll {
          .el-tabs__nav {
            border-radius: 0;
            border: none;
            .el-tabs__item {
              border-top-color: #fff;
              border-left: 1px solid #fff;
              border-right: 1px solid #fff;
            }
            .is-active {
              border-top: 2px solid #2d72d3;
              border-left: 1px solid #e1e1e1;
              border-right: 1px solid #e1e1e1;
            }
          }
        }
      }
    }
  }
  .alarm-log-top {
    width: 100%;
    position: relative;
    margin-top: 17px;
    .show-from {
      width: 37px;
      height: 35px;
      border: 1px solid #9eadc1;
      position: absolute;
      right: 0px;
      top: 20px;
      cursor: pointer;
      text-align: center;
      i {
        color: #333;
        font-size: 18px;
        line-height: 35px;
        font-weight: 600;
      }
    }
  }
}
/deep/ .el-input__inner {
  // width: 240px;
  height: 35px;
  border-radius: 0px;
  line-height: 35px;
}
/deep/ .el-form-item__label {
  line-height: 35px;
}
.pointer {
  position: relative;
  margin-left: 5px;
  color: #2d71d3;
  padding-left: 7px;
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 2px;
    height: 12px;
    background: #2d71d3;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
