<template>
  <div class="alarm-log">
      <div class="host-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>报警管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警日志</el-breadcrumb-item>
        <el-breadcrumb-item>查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="alarm-log-top">
        <el-tabs v-model="activeName" type="card">
          <!-- <div class="zone-header">
              <span @click="collapseClick('inquireInfo')">查询条件
                <i :class="collapseStatus.inquireInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </span>
              <div class="zone-header-line"></div>
          </div> -->
          <el-tab-pane label="报警日志" name="1">
            <div class="alarm-log-inquire" v-if="collapseStatus.inquireInfo">
                <div class="query-form">
                  <el-form ref="alarmForm" :model="formInline" :rules="alarmRules">
                    <el-form-item label="所属机构">
                      <el-autocomplete class="inline-input" size="mini" v-model="formInline.orgName" value-key="name"
                              :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}" placeholder="请输入机构"
                              :trigger-on-focus="false" @select="val=>{selectItem('org', val)}"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="所属重点部位">
                      <el-autocomplete class="inline-input" size="mini" :disabled="!formInline.orgId" v-model="locationName" value-key="name"
                              :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位"
                              :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="所属设备" prop="deviceName">
                      <el-input v-model="formInline.deviceName" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="所属子系统" prop="subsystem">
                      <el-select v-model="formInline.subsystem" size="mini">
                                <el-option v-for="(item, index) in subsystemList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="报警分类" prop="alarmType">
                      <el-select v-model="formInline.alarmType" size="mini">
                          <el-option v-for="(item, index) in alarmTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="事件类型" prop="eventType">
                      <el-select v-model="formInline.eventType" size="mini">
                          <el-option v-for="(item, index) in eventTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="资源名称" prop="channelName">
                      <el-input v-model="formInline.channelName" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="报警等级" prop="level">
                      <el-select v-model="formInline.level" size="mini">
                          <el-option v-for="(item, index) in levelList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    
                    <el-form-item label="发生时间">
                      <el-date-picker v-model="timeRanges.occurTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" range-separator="至"></el-date-picker>
                    </el-form-item>
                    <!-- <el-form-item label="结束时间" prop="deviceName">
                      <el-date-picker v-model="timeRanges.endTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" range-separator="至"></el-date-picker>
                    </el-form-item> -->
                    <el-form-item label="接警时间">
                      <el-date-picker v-model="timeRanges.receiveTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" range-separator="至"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="处警时间">
                      <el-date-picker v-model="timeRanges.dealTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" range-separator="至"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="处理类型">
                      <el-select v-model="formInline.dealType" size="mini">
                          <el-option v-for="(item, index) in dealTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="处理意见" prop="dealOpinion">
                      <el-input v-model="formInline.dealOpinion" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="是否升级">
                      <el-select v-model="formInline.isUpgrade" size="mini">
                          <el-option v-for="(item, index) in upgradeList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="alarm-log-btn">
                    <el-button type="primary" @click="inquireClick" size="mini">查询</el-button>
                    <el-button type="primary" @click="resetClick" size="mini">重置</el-button>
                    <el-button @click="exportFile" size="mini">导出</el-button>
                </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="事件日志" name="2">
            <div class="query-form">
              <el-form ref="evtForm" :rules="eventRules"
                       :model="eventForm">
                <el-form-item label="所属机构">
                  <el-autocomplete class="inline-input"
                                   size="mini"
                                   v-model="eventForm.orgName"
                                   value-key="name"
                                   :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                                   placeholder="请输入机构"
                                   :trigger-on-focus="false"
                                   @select="val=>{selectItem('org', val)}"></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属重点部位">
                  <el-autocomplete class="inline-input" size="mini" :disabled="!eventForm.orgId" v-model="keyPartName" value-key="name"
                              :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"  placeholder="请输入重点部位"
                              :trigger-on-focus="false" @select="val=>{selectItem('kp', val)}"></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属设备" prop="deviceName">
                  <el-input v-model="eventForm.deviceName"
                            placeholder="请输入所属设备"></el-input>
                </el-form-item>
                <el-form-item label="资源名称" prop="channelName">
                  <el-input v-model="eventForm.channelName"
                            placeholder="请输入资源名称"></el-input>
                </el-form-item>
                <el-form-item label="事件类型" prop="eventName">
                  <el-input v-model="eventForm.eventName"
                            placeholder="请输入事件类型"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-date-picker v-model="eventForm.startTime"
                                  type="datetime"
                                  :picker-options="eventPickerStartDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择开始时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker v-model="eventForm.endTime"
                                  type="datetime"
                                  :picker-options="eventPickerEndDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="from-button">
              <el-button size="small" @click="eventQuery">查询</el-button>
              <el-button size="small">重置</el-button>
              <el-button size="small" @click="eventExport">导出</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="3">
            <div class="query-form">
              <el-form ref="optForm" :rules="optRules"
                       :model="operationForm">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="operationForm.name"
                            placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="operationForm.userName"
                            placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="所属机构">
                  <el-autocomplete class="inline-input"
                                   size="mini"
                                   v-model="operationForm.orgName"
                                   value-key="name"
                                   :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                                   placeholder="请输入机构"
                                   :trigger-on-focus="false"
                                   @select="val=>{selectItem('org', val)}"></el-autocomplete>
                </el-form-item>
                <el-form-item label="客户端类型">
                  <el-select v-model="operationForm.clientType"
                             placeholder="请选择客户端类型">
                    <el-option
                      v-for="item in clientTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                  <el-input v-model="operationForm.ip"
                            placeholder="请输入IP地址"></el-input>
                </el-form-item>
                <el-form-item label="操作类型">
                  <el-select v-model="operateType">
                    <el-option
                      v-for="item in operationTypeList"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作对象" prop="object">
                  <el-input v-model="operationForm.object"
                            placeholder="请输入操作对象"></el-input>
                </el-form-item>
                <el-form-item label="操作描述" prop="description">
                  <el-input v-model="operationForm.description"
                            placeholder="请输入操作描述"></el-input>
                </el-form-item>
                <!-- <el-form-item label="动作">
                  <el-input v-model="operationForm.actions"
                            placeholder="请输入动作描述"></el-input>
                </el-form-item> -->
                <el-form-item label="开始时间">
                  <el-date-picker v-model="operationForm.startTime"
                                  type="datetime"
                                  :picker-options="operationPickerStartDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择开始时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker v-model="operationForm.endTime"
                                  type="datetime"
                                  :picker-options="operationPickerEndDate"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="请选择结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="from-button">
              <el-button size="small"
                         @click="optQuery">查询</el-button>
              <el-button size="small"
                         @click="optEmpty">重置</el-button>
              <el-button size="small"
                         @click="operationGetTabList">导出</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="alarm-log-bottom">
        <!-- <div class="zone-header">
            <span>查询结果
            </span>
            <div class="zone-header-line"></div>
        </div> -->
        <div class="alarm-log-result">
            <div class="log-result-btn" v-if="printStatus && activeName === '1'">
                <el-button class="part-info-btn" size="small" @click="printClick">打印</el-button>
                <el-button size="small" @click="closePrint">关闭</el-button>
            </div>
            <div class="log-result-table">
                <el-table ref="multipleTable" v-if="!printStatus && activeName === '1'" border :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="rowDataClick" height="410">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column show-overflow-tooltip v-for="(item,index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                    <el-table-column label="查看录像" width="120">
                      <template slot-scope="scope">
                        <el-button @click.native.prevent="viewVideoBtn(scope.$index, scope.row)" size="mini">查看录像</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作日志" width="150">
                      <template slot-scope="scope">
                        <el-button @click.native.prevent="viewLogBtn(scope.$index, scope.row)" size="mini">查看操作日志</el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" width="120"></el-table-column>
                </el-table>
                <el-table :data="eventTableData" v-if="activeName === '2'" border size="mini" stripe height="440" @selection-change="eventSelectionChange">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in eventTableColumn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :sortable="item.sortable"
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
                <el-table :data="opTableData" v-if="activeName === '3'" border size="mini" stripe height="440" @selection-change="optSelectionChange">
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in opTableColumn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :sortable="item.sortable"
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
                <!-- <el-pagination background v-if="activeName === '1'" @size-change="handleSizeChange" @current-change="handleCurrentPageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize"
                    :current-page="page" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination> -->
                <video-pagination v-if="!printStatus && activeName === '1'" ref="listAlarmPagination"
                  :total="total"
                  :limitDefault="pageSize"
                  @paginationConfChange="eventChange"></video-pagination>
                <!-- <el-pagination background v-if="activeName === '2'" @size-change="handleSizeChange" @current-change="handleCurrentPageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize2"
                    :current-page="page2" layout="total, sizes, prev, pager, next, jumper" :total="total2">
                </el-pagination> -->
                <video-pagination v-if="activeName === '2'" ref="listAlarmPagination"
                  :total="total2"
                  :limitDefault="pageSize2"
                  @paginationConfChange="eventChange2"></video-pagination>
                <!-- <el-pagination background v-if="activeName === '3'" @size-change="handleSizeChange" @current-change="handleCurrentPageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize3"
                    :current-page="page3" layout="total, sizes, prev, pager, next, jumper" :total="total3">
                </el-pagination> -->
                <video-pagination v-if="activeName === '3'" ref="listAlarmPagination"
                  :total="total3"
                  :limitDefault="pageSize3"
                  @paginationConfChange="eventChange3"></video-pagination>
            </div>
            <div class="log-info" id="print-log" v-if="printStatus && activeName === '1'">
              <ul>
                <li v-for="(item, index) in printColumn" :key="index" >
                  <span>{{item.label}}</span>
                  <div class="info">{{item.info ? item.info : ''}}</div>
                </li>
                <li>
                  <span>查看录像</span>
                  <div class="info">
                    <el-button @click.native.prevent="viewVideoBtn('', printData)" size="mini">查看录像</el-button>
                  </div>
                </li>
                <li>
                  <span>操作日志</span>
                  <div class="info">
                    <el-button @click.native.prevent="viewLogBtn('', printData)" size="mini">查看操作日志</el-button>
                  </div>
                </li>
              </ul>
            </div>
        </div>
      </div>
      <!-- 查看录像和操作日志 -->
      <div class="alarm-model">
        <AlarmVideo :videoControl="alarmVideo.videoStatus" :alarmModelData="alarmVideo.alarmData" @sureClick="sureVideoClick" v-if="alarmVideo.videoStatus"></AlarmVideo>
        <AlarmOperationLog :logControl="operLog.logStatus" :optLogData="operLog.alarmData" @sureClick="sureLogClick" v-if="operLog.logStatus"></AlarmOperationLog>
      </div>
  </div>
</template>

<script>
import AlarmVideo from './pages/AlarmVideo'
import AlarmOperationLog from './pages/AlarmOperationLog'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { mapActions } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { getAlarmOperationLog, getAlarmEventLog, getOperationType } from '@src/http/alarm/alarmHostConfig.api.js'
export default {
  components: {
    AlarmVideo,
    AlarmOperationLog,
    treeBox,
    VideoPagination
  },
  data() {
    return {
      operateType: '',
      alarmRules: {
        deviceName: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        channelName: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        dealOpinion: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ]
      },
      eventRules: {
        deviceName: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        channelName: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        eventName: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ]
      },
      optRules: {
        name: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        userName: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        ip: [
              {pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/, message: '请输入合法的IP'}
            ],
        object: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ],
        description: [
          { min: 0, max: 128, message: '最多可输入128个字符' }
        ]
      },
      operationTypeList: [],
      clientTypeList: [
        { label: '全部', value: 0 },
        { label: 'B/S', value: 1 },
        { label: 'APP', value: 2 }
      ],
      opTableData: [],
      eventTableData: [],
      activeName: '1',
      pageSize: 25,
      page: 1,
      total: 0,
      pageSize2: 25,
      page2: 1,
      total2: 0,
      pageSize3: 25,
      page3: 1,
      total3: 0,
      nameLable: '',
      treeType: 3,
      partData: [],
      timeRanges: {
        occurTime: [],
        endTime: [],
        receiveTime: [],
        dealTime: [],
      },
      locationName: '',
      keyPartName: '',
      eventForm: {
        orgId: '',
        orgName: '',
        keyPartId: '',
        deviceName: '',
        channelName: '',
        eventName: '',
        startTime: '',
        endTime: ''
      },
      operationForm: {
        moduleType: 2,
        name: '',
        userName: '',
        orgId: '',
        orgName: '',
        clientType: 0,
        ip: '',
        // operateType: 10000,
        object: '',
        description: '',
        // actions: '',
        startTime: '',
        endTime: ''
      },
      formInline: {
        orgId: '',
        orgName: '',
        locationId: '',
        deviceName: '',
        channelName: '',
        alarmType: '',
        eventType: '',
        subsystem: '',
        level: '',
        occurStartTime: '',
        occurEndTime: '',
        finishStartTime: '',
        finishEndTime: '',
        receiveStartTime: '',
        receiveEndTime: '',
        dealStartTime: '',
        dealEndTime: '',
        dealType: '',
        dealOpinion: '',
        isUpgrade: '' // 是否升级
      },
      upgradeList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'T',
          label: '是'
        },
        {
          value: 'F',
          label: '否'
        }
      ],
      dealTypeList: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '故障',
          label: '故障'
        },
        {
          value: '正常报警',
          label: '正常报警'
        },
        {
          value: '误报',
          label: '误报'
        }
      ],
      subsystemList: [],
      alarmTypeList: [],
      eventTypeList: [],
      levelList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: '1',
          label: '1级'
        },
        {
          value: '2',
          label: '2级'
        },
        {
          value: '3',
          label: '3级'
        },
        {
          value: '4',
          label: '4级'
        },
        {
          value: '5',
          label: '5级'
        }
      ],
      tableData: [],
      hostCurrentPage: 1,
      hostTotal: 0,
      multipleSelection: [],
      optSelection: [],
      eventSelection: [],
      tableColumn: [
        {
          prop: 'subsystemName',
          label: '所属子系统',
          width: '120'
        },
        {
          prop: 'orgName',
          label: '所属机构',
          width: '120'
        },
        {
          prop: 'locationName',
          label: '所属重点部位',
          width: '120'
        },
        {
          prop: 'deviceName',
          label: '所属设备',
          width: '120'
        },
        {
          prop: 'alarmType',
          label: '报警分类',
          width: '120'
        },
        {
          prop: 'eventType',
          label: '事件类型',
          width: '120'
        },
        {
          prop: 'subsystemNum',
          label: '子系统号',
          width: '120'
        },
        {
          prop: 'channelName',
          label: '资源名称',
          width: '120'
        },
        {
          prop: 'level',
          label: '报警等级',
          width: '120'
        },
        {
          prop: 'startTime',
          label: '发生时间',
          width: '120'
        },
        // {
        //   prop: 'endTime',
        //   label: '结束时间',
        //   width: '120'
        // },
        {
          prop: 'receiveTime',
          label: '接警时间',
          width: '120'
        },
        {
          prop: 'dealTime',
          label: '处警时间',
          width: '120'
        },
        {
          prop: 'dealPerson',
          label: '接警人',
          width: '120'
        },
        {
          prop: 'dealType',
          label: '处理类型',
          width: '120'
        },
        {
          prop: 'dealOpinion',
          label: '处理意见',
          width: '120'
        },
        {
          prop: 'isUpgrade',
          label: '是否升级',
          width: '120'
        }
      ],
      eventTableColumn: [
        { prop: 'orgName', label: '所属机构', width: '260', sortable: true },
        { prop: 'keyPartName', label: '所属重点部位', width: '300', sortable: true },
        { prop: 'deviceName', label: '所属设备', width: '300', sortable: true },
        { prop: 'eventName', label: '事件类型', width: '300', sortable: true },
        { prop: 'channelName', label: '资源名称', width: '300', sortable: true },
        { prop: 'occurTime', label: '发生时间', width: '300', sortable: true }
      ],
      opTableColumn: [
        { prop: 'name', label: '姓名', width: '150', sortable: true },
        { prop: 'userName', label: '用户名', width: '150', sortable: true },
        { prop: 'createdAt', label: '时间', width: '150', sortable: true },
        { prop: 'orgName', label: '所属机构', width: '150', sortable: true },
        { prop: 'clientName', label: '客户端类型', width: '150', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '150', sortable: true },
        { prop: 'operateName', label: '操作类型', width: '150', sortable: true },
        { prop: 'action', label: '动作', width: '150', sortable: true },
        { prop: 'object', label: '操作对象', width: '150', sortable: true },
        { prop: 'result', label: '操作结果', width: '150', sortable: true },
        { prop: 'description', label: '操作描述', width: '200', sortable: true }
      ],
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
      eventPickerStartDate: {
        disabledDate: (time) => {
          if (!this.eventForm.endTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() > new Date(this.eventForm.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      eventPickerEndDate: {
        disabledDate: (time) => {
          if (!this.eventForm.startTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return (
              time.getTime() < new Date(this.eventForm.startTime).getTime() - 1 * 24 * 60 * 60 * 1000 ||
              time.getTime() > Date.now() - 8.64e6
            )
          }
        },
      },
      operationPickerStartDate: {
        disabledDate: (time) => {
          if (!this.operationForm.endTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return time.getTime() > new Date(this.operationForm.endTime).getTime() - 1 * 24 * 60 * 60 * 1000
          }
        },
      },
      operationPickerEndDate: {
        disabledDate: (time) => {
          if (!this.operationForm.startTime) {
            return time.getTime() > Date.now() - 8.64e6
          } else {
            return (
              time.getTime() < new Date(this.operationForm.startTime).getTime() - 1 * 24 * 60 * 60 * 1000 ||
              time.getTime() > Date.now() - 8.64e6
            )
          }
        },
      }
    }
  },
  created() {
    // this.timeCommon()
    this.getLogSubsystem().then(res => {
      this.subsystemList = res
    })
    this.getAlarmType().then(res => {
      this.alarmTypeList = res
    })
    getOperationType().then(res => {
      this.operationTypeList = res.data.data
    })
    this.getAlarmLevelLinkVideo().then(res => {
      this.eventTypeList = []
      let eventTypeTemp = res.data.results
      eventTypeTemp.forEach(item => {
        let obj = {
          label: item.eventTypeDesc,
          value: item.eventType
        }
        this.eventTypeList.push(obj)
      })
    })
  },
  methods: {
    ...mapActions('alarmReceive', { getAlarmReceiveList: 'getAlarmReceiveList' }),
    ...mapActions(['getLogSubsystem', 'getAlarmType', 'getAlarmLevelLinkVideo', 'getAlarmLogList']),
    optEmpty() {
      this.operationForm = {
        moduleType: 2,
        name: '',
        userName: '',
        orgId: '',
        orgName: '',
        clientType: 0,
        ip: '',
        // operateType: 10000,
        object: '',
        description: '',
        // actions: '',
        startTime: '',
        endTime: ''
      }
    },
    eventQuery() {
      this.$refs.evtForm.validate(valid => {
        if (valid) {
          this.eventForm.pageNum = this.page2,
          this.eventForm.pageSize = this.pageSize2
          console.log(this.eventForm, 'this.eventForm======')
          getAlarmEventLog(this.eventForm).then(res => {
            console.log(res, 'res==========================')
            this.eventTableData = []
            this.total2 = res.data.data.page.totalNumber
            this.eventTableData = res.data.data.alarms
            Array.isArray(this.eventTableData) && this.eventTableData.forEach((item, index) => {
              item.index = index + 1
            })
          })
        }
      })
    },
    optQuery() {
      this.$refs.optForm.validate(valid => {
        if (valid) {
          let pageArgs = {
            page: this.page3,
            limit: this.pageSize3
          }
          if (this.operateType !== '') {
            this.operationForm.operateType = Number(this.operateType)
          }
          getAlarmOperationLog(this.operationForm, pageArgs).then(res => {
            this.opTableData = []
            this.total3 = res.data.data.page.totalNumber
            this.opTableData = res.data.data.logs
            Array.isArray(this.opTableData) && this.opTableData.forEach((item, index) => {
              item.index = index + 1
            })
          })
        }
      })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        if (this.activeName === '1') {
          this.formInline.orgId = val.id
          this.formInline.orgName = val.name
        } else if (this.activeName === '2') {
          this.eventForm.orgId = val.id
          this.eventForm.orgName = val.name
        } else if (this.activeName === '3') {
          this.operationForm.orgId = String(val.id)
        }
      } else if (type === 'kp') {
        if (this.activeName === '1') {
          this.formInline.locationId = val.id
          this.locationName = val.name
        }
        if (this.activeName === '2') {
          this.eventForm.keyPartId = val.id
          this.keyPartName = val.name
        }
      }
    },
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? (this.activeName === '1' ? this.formInline.orgId : (this.activeName === '3' ?  this.operationForm.orgId : '')) : undefined
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
    getisUpgrade(id) { // 通过重点部位id，得到设备型号的名称
      let name = ''
      this.upgradeList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    getEventType(id) {
      let name = ''
      this.eventTypeList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    getAlarmTypeLable(id) {
      let name = ''
      this.alarmTypeList.forEach((item) => {
        if (item.value === id) {
          name = item.label
        }
      })
      return name
    },
    timeCommon() {
      let startTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
      let endTime = new Date()
      this.timeRanges.occurTime.push(startTime, endTime) // 发生时间
      this.timeRanges.endTime.push(startTime, endTime) // 结束时间
      this.timeRanges.receiveTime.push(startTime, endTime) // 接警时间
      this.timeRanges.dealTime.push(startTime, endTime) // 处警时间
    },
    // 折叠面板
    collapseClick(key) {
      this.collapseStatus[key] = !this.collapseStatus[key]
      if (this.collapseStatus[key]) {
        Object.keys(this.collapseStatus).forEach(item => {
          if (item !== key) {
            this.collapseStatus[item] = false
          }
        })
      }
    },
    // 查询按钮
    inquireClick() {
      this.$refs.alarmForm.validate(valid => {
        if (valid) {
          this.formInline.occurStartTime = this.timeRanges.occurTime[0]!== undefined ? this.$moment(this.timeRanges.occurTime[0]).unix() : ''
          this.formInline.occurEndTime = this.timeRanges.occurTime[1]!== undefined ?  this.$moment(this.timeRanges.occurTime[1]).unix() : ''
          this.formInline.finishStartTime = this.timeRanges.endTime[0]!== undefined ? this.$moment(this.timeRanges.endTime[0]).unix() : ''
          this.formInline.finishEndTime = this.timeRanges.endTime[1]!== undefined ? this.$moment(this.timeRanges.endTime[1]).unix() : ''
          this.formInline.receiveStartTime = this.timeRanges.receiveTime[0]!== undefined ? this.timeRanges.receiveTime[0] : ''
          this.formInline.receiveEndTime = this.timeRanges.receiveTime[1]!== undefined ? this.$moment(this.timeRanges.receiveTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''
          this.formInline.dealStartTime = this.timeRanges.dealTime[0]!== undefined ? this.timeRanges.dealTime[0] : ''
          this.formInline.dealEndTime = this.timeRanges.dealTime[1]!== undefined ? this.$moment(this.timeRanges.dealTime[1]).format('YYYY-MM-DD HH:mm:ss') : ''
          this.formInline.pageSize = this.pageSize
          this.formInline.pageNum = this.page
          this.getAlarmLogList(this.formInline).then(res => {
            const temp = res.data.results
            Array.isArray(temp) && temp.forEach((item, index) => {
              item.index = index + 1
              if (item.isUpgrade !== undefined) {
                item.isUpgrade = this.getisUpgrade(item.isUpgrade)
              }
              if (item.eventType !== undefined) {
                item.eventType = this.getEventType(item.eventType)
              }
              if (item.alarmType !== undefined) {
                item.alarmType = this.getAlarmTypeLable(item.alarmType)
              }
              if (item.startTime !== undefined) {
                item.startTime = this.$moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              }
              if (item.endTime !== undefined) {
                item.endTime = this.$moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              }
            })
            this.total = res.data.page.length
            this.tableData = temp
          })
        }
      })
    },
    // 重置
    resetClick() {
      this.formInline.orgName = ''
      this.formInline.locationId = ''
      this.formInline.deviceName = ''
      this.formInline.channelName = ''
      this.formInline.alarmType = ''
      this.formInline.eventType = ''
      this.formInline.subsystem = ''
      this.formInline.level = ''
      this.timeRanges.occurTime = []
      this.timeRanges.endTime = []
      this.timeRanges.receiveTime = []
      this.timeRanges.dealTime = []
      this.formInline.dealType = ''
      this.formInline.dealOpinion = ''
      this.formInline.isUpgrade = ''
      // this.timeCommon()
    },
    // 导出
    exportFile() {
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = []
      // 字段名
      const filterVal = []
      for (let i = 0; i < this.tableColumn.length; i++) {
        tHeader.push(this.tableColumn[i].label)
        filterVal.push(this.tableColumn[i].prop)
      }
      let list = []
      // 导出全部或导出选中
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        list = this.multipleSelection
      } else {
        list = this.tableData
      }
      filterVal.unshift('index')
      tHeader.unshift('序号')
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    eventExport(){
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = []
      // 字段名
      const filterVal = []
      for (let i = 0; i < this.eventTableColumn.length; i++) {
        tHeader.push(this.eventTableColumn[i].label)
        filterVal.push(this.eventTableColumn[i].prop)
      }
      filterVal.unshift('index')
      tHeader.unshift('序号')
      let list = []
      // 导出全部或导出选中
      if (this.eventSelection && this.eventSelection.length > 0) {
        list = this.eventSelection
      } else {
        list = this.eventTableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    operationGetTabList(){
      const { export_json_to_excel } = require('../../../common/vendor/Export2Excel')
      // 表头
      const tHeader = []
      // 字段名
      const filterVal = []
      for (let i = 0; i < this.opTableColumn.length; i++) {
        tHeader.push(this.opTableColumn[i].label)
        filterVal.push(this.opTableColumn[i].prop)
      }
      filterVal.unshift('index')
      tHeader.unshift('序号')
      let list = []
      // 导出全部或导出选中
      if (this.optSelection && this.optSelection.length > 0) {
        list = this.optSelection
      } else {
        list = this.opTableData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, 'fileName')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 查看录像
    viewVideoBtn(index, row) {
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
    },
    // 行选中信息
    optSelectionChange(val) {
      this.optSelection = val
    },
    eventSelectionChange() {
      this.eventSelection = val
    },
    // 行点击
    rowDataClick(row) {
      this.printData = row
      this.printStatus = true
      this.printColumn = this.tableColumn.slice(1, this.tableColumn.length)
      this.printColumn.forEach(item => {
        if (item.prop !== 'subsystem') {
          item.info = row[item.prop]
        }
      })
    },
    eventChange(data) {
      this.pageSize = data.limit
      this.page = data.page
      this.inquireClick()
    },
    eventChange2(data) {
      this.pageSize2 = data.limit
      this.page2 = data.page
      this.eventQuery()
    },
    eventChange3(data) {
      this.pageSize3 = data.limit
      this.page3 = data.page
      this.optQuery()
    },
    // 报警主机列表每页显示条数
    handleSizeChange(val) {
      if (this.activeName === '1') {
        this.pageSize = val
      }
      if (this.activeName === '2') {
        this.pageSize2 = val
      }
      if (this.activeName === '3') {
        this.pageSize3 = val
      }
      this.handleCurrentPageNum(1)
    },
    // 分页码
    handleCurrentPageNum(val) {
      if (this.activeName === '1') {
        this.page = val
      }
      if (this.activeName === '2') {
        this.page2 = val
      }
      if (this.activeName === '3') {
        this.page3 = val
      }
      if (this.activeName === '1') {
        this.inquireClick()
      }
      if (this.activeName === '3') {
        this.optQuery()
      }
    },
    // 报警主机列表分页
    handleCurrentChange(val) {
    },
    // 打印
    printClick() {
      printJS('print-log', 'html')
    },
    // 关闭打印
    closePrint() {
      this.printStatus = false
    }
  }
}
</script>

<style scoped lang="less">
.alarm-log {
  padding: 20px;
  height: 100%;
  // overflow: hidden;
  .host-header {
    margin-bottom: 15px;
  }
  .query-form {
    width: 100%;
    background: rgba(245, 245, 245, 1);
    padding: 16px 16px 2px 16px;
    box-sizing: border-box;
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 23px;
        display: inline-block;
        width: 19.23%;
        .el-form-item__label {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          width: 96px;
        }
        .el-form-item__content {
          display: inline-block;
          width: calc(~'100% - 96px');
          .el-select {
            width: 100%;
            .el-input__inner {
              width: 100%;
              height: 35px;
              border-radius: 0px;
            }
          }
          .el-autocomplete {
            width: 100%;
            .el-input__inner {
              width: 100%;
              height: 35px;
              border-radius: 0px;
            }
          }
          .el-range-editor--mini.el-input__inner {
            width: 100%;
          }
          .el-date-editor .el-range-separator {
            padding: 0 12px;
            line-height: 26px;
          }
          .el-input {
            width: 100%;
            .el-input__inner {
              width: 100%;
              height: 35px;
              border-radius: 0px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(51, 51, 51, 1);
            }
          }
        }
      }
      .el-form-item:first-child {
        width: 17.27%;
        .el-form-item__label {
          width: 60px;
        }
        .el-form-item__content {
          width: calc(~'100% - 60px');
        }
      }
      .el-form-item:nth-child(5n) {
        margin-right: 0px;
      }
      .el-form-item:nth-child(5n + 1) {
        width: 17.27%;
        .el-form-item__label {
          width: 60px;
        }
        .el-form-item__content {
          width: calc(~'100% - 60px');
        }
      }
    }
  }
  .from-button {
    width: 100%;
    text-align: center;
    margin: 22px 0 44px;
  }
  .alarm-log-inquire {
    margin: 10px 0;
    .alarm-log-select {
      width: 1438px;
      overflow: hidden;
      background:rgba(245,245,245,1);
      // border: 1px solid #bcbcbc;
      ul {
        overflow: hidden;
      
        margin: 10px;
        li {
          float: left;
          width: 470px;
          margin: 0 2px 14px 0;
          // padding: 4px 0;
          // height: 38px;
          i {
            float: left;
            width: 136px;
            line-height: 32px;
            text-align: right;
            // background: #f2f2f2;
            margin-right: 4px;
          }
          .el-input {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-date-editor--datetimerange.el-input,
          .el-date-editor--datetimerange.el-input__inner {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-select {
            width: 330px !important;
            margin-top: 2px;
          }
          .el-autocomplete {
            width: 330px !important;
          }
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
    height: calc(100% - 300px);
    .alarm-log-result {
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
        width: 800px;
        overflow: hidden;
        border: 1px solid #bcbcbc;
        ul {
          padding: 10px;
          overflow: hidden;
          li{
            width: 50%;
            float: left;
            height: 36px;
            line-height: 36px;
            background: #f2f2f2;
            span {
              float: left;
              width: 120px;
              border-right: 1px solid #fff;
              padding-left: 10px;
            }
            .info {
              float: left;
              overflow: hidden;
              padding-left: 20px;
            }
          }
          li:nth-child(4n+3){
            background: #fff;
          }
          li:nth-child(4n+4){
            background: #fff;
          }
        }
      }
    }
  }
  .zone-header {
    overflow: hidden;
    line-height: 20px;
    margin-bottom: 10px;
    span {
      float: left;
      width: 4%;
      font-size: 14px;
    }
    .zone-header-line {
      float: right;
      width: 96%;
      border-top: 1px solid #bcbcbc;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less">
.alarm-log .el-form--inline .el-form-item__label {
  width: 100px !important;
}
.alarm-log .el-form--inline .el-form-item__content {
  width: 200px !important;
}
.alarm-log .el-input--mini .el-input__inner {
  height: 35px;
}
.alarm-log .el-range-editor--mini.el-input__inner {
  height: 35px;
}
</style>
