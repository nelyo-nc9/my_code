<!--  -->
<template>
  <div class="audio-log-query-box">
    <div class="breadcrumb-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>智慧安防</el-breadcrumb-item>
        <el-breadcrumb-item>音频管理</el-breadcrumb-item>
        <el-breadcrumb-item>日志查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabs-container">
      <el-tabs type="border-card" v-model="editableTabsValue">
        <el-tab-pane label="事件日志" name="event"></el-tab-pane>
        <el-tab-pane label="操作日志" name="operation"></el-tab-pane>
      </el-tabs>
      <div class="shrink-container">
        <div :class="showSearchBox ? 'iconfont icon-arrow-down shrink-div' : 'iconfont icon-arrow-up shrink-div'" @click="showSearchBox = !showSearchBox"></div>
      </div>
    </div>
    <el-collapse-transition>
      <div class="search-container" v-show="showSearchBox">
          <div class="search-box" v-show="editableTabsValue === 'operation' || !isShowDetail">
            <!-- 事件查询框 -->
            <div class="search-border" v-show="editableTabsValue === 'event'">
              <el-form  ref="addForm"
                        size="mini"
                        :model="formData"
                        label-position="right"
                        label-width="140px"
                        :rules="rules">
                <el-form-item label="发起者所属机构" prop="orgName" class="form-item-div">
                  <el-autocomplete
                    class="inline-input inline-input"
                    size="mini"
                    v-model="formData.orgName"
                    value-key="name"
                    :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                    placeholder="请输入机构"
                    @blur="bulrChange('org')"
                    :trigger-on-focus="false"
                    @select="val=>{selectTreeItem('org', val)}"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="发起者所属重点部位" prop="keyPartName" class="form-item-div">
                  <el-autocomplete
                    class="inline-input"
                    size="mini"
                    v-model="formData.keyPartName"
                    value-key="name"
                    :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                    placeholder="请输入重点部位"
                    :trigger-on-focus="false"
                    @blur="bulrChange('kp')"
                    @select="val=>{selectTreeItem('kp', val)}"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label='发起者所属设备' class="form-item-div" prop="deviceId">
                  <el-input v-model="formData.deviceId" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="发起者名称" prop='sponsor' class="form-item-div">
                  <el-input v-model="formData.sponsor" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="接听者所属机构" prop="recvOrgName" class="form-item-div">
                  <el-autocomplete
                    class="inline-input inline-input"
                    size="mini"
                    v-model="formData.recvOrgName"
                    value-key="name"
                    :fetch-suggestions="(val, callback)=>{querySearch('org', val,callback)}"
                    placeholder="请输入机构"
                    @blur="bulrChange('accorg')"
                    :trigger-on-focus="false"
                    @select="val=>{selectTreeItem('accorg', val)}"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="接听者所属重点部位" prop="recvKeyPartName" class="form-item-div">
                  <el-autocomplete
                    class="inline-input"
                    size="mini"
                    v-model="formData.recvKeyPartName"
                    value-key="name"
                    :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                    placeholder="请输入重点部位"
                    :trigger-on-focus="false"
                    @blur="bulrChange('acckp')"
                    @select="val=>{selectTreeItem('acckp', val)}"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label='接听者所属设备' class="form-item-div" prop="recvDeviceId">
                  <el-input v-model="formData.recvDeviceId" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="接听者名称" prop='participant' class="form-item-div">
                  <el-input v-model="formData.participant" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="对讲时长" class="form-item-div">
                  <el-select v-model="formData.duration" class="inline-input">
                    <el-option v-for="item in duration" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="开始时间" class="form-item-div">
                  <el-date-picker
                  class="inline-input"
                    v-model="formData.startTimeList"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd hh:mm:ss"   
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" class="form-item-div">
                  <el-date-picker
                    class="inline-input"
                    v-model="formData.endTimeList"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    value-format="yyyy-MM-dd hh:mm:ss"   
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>

            <!-- 操作查询框 -->
            <div class="search-border" v-show="editableTabsValue === 'operation'">
              <el-form  
                ref="formData2"
                size="mini"
                :model="formData2"
                label-position="right"
                label-width="90px"
                :rules='rules'>
                <el-form-item label='姓名' class="form-item-div" prop="name">
                  <el-input v-model="formData2.name" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label='用户' class="form-item-div" prop="userName">
                  <el-input v-model="formData2.userName" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="所属机构" class="form-item-div">
                  <el-autocomplete
                    class="inline-input inline-input"
                    size="mini"
                    v-model="logOrgName"
                    value-key="name"
                    :fetch-suggestions="(val, callback)=>{querySearch1('org', val,callback)}"
                    placeholder="请输入机构"
                    @blur="bulrChange('org')"
                    :trigger-on-focus="false"
                    @select="val=>{selectTreeItem1('org', val)}"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="客户端类型" class="form-item-div" prop="clientName">
                  <el-select v-model="formData2.clientName" class="inline-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="B/S" value="B/S"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='IP地址' class="form-item-div" prop="ip">
                  <el-input v-model="formData2.ip" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="操作类型" class="form-item-div" prop="operateType">
                  <el-select v-model="formData2.operateType" class="inline-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in operateType_list" :key="item.key" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='操作对象' class="form-item-div" prop="object">
                  <el-input v-model="formData2.object" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="操作描述" class="form-item-div" prop="description">
                  <el-input v-model="formData2.description" class="inline-input"></el-input>
                </el-form-item>
                <el-form-item label="操作时间" class="form-item-div" prop="dateTime">
                  <el-date-picker
                    class="inline-input"
                    v-model="formData2.dateTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    value-format="yyyy-MM-dd hh:mm:ss"   
                    end-placeholder="结束时间">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="button-container" v-show="editableTabsValue === 'operation' || !isShowDetail">
            <div class="button-box">
              <el-button size="mini" @click="onSearch">查询</el-button>
              <el-button size="mini" @click="resetCondition('formData2')">重置</el-button>
              <el-button size="mini" @click="exportList">导出</el-button>
            </div>
          </div>
      </div>
    </el-collapse-transition>

    <!-- 事件日志表格 -->
    <div class="table-container" v-if="editableTabsValue === 'event' && !isShowDetail">
      <el-table 
        stripe
        height="100%"
        size="mini"
        style="width: 100%"
        @row-dblclick="lookDetail"
        @select="selectChange"
        :data="tableData">
        <el-table-column type="selection" min-width="5%" align="center"></el-table-column>
        <el-table-column label="序号" type="index" min-width="7%" align="center"> </el-table-column>
        <el-table-column :row-style="{height:'10px'}"
          :cell-style="{padding:'0px'}"
          style="font-size: 10px"
            v-for="(column, index) in columns" :key="index"
            :prop="column.prop"
            :label="column.label"
            :min-width="column.width"
            :sortable="column.sortable"
            show-overflow-tooltip
            align="center">
        </el-table-column>
        <el-table-column label="音视频文件" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="showVideoModal(scope.row)">{{ scope.row.voicePath }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 操作日志表格 -->
    <div class="table-container" v-if="editableTabsValue === 'operation'">
      <el-table 
        stripe
        size="mini"
        height="100%"
        style="width: 100%"
        @selection-change="selectChange2"
        :data="tableData2">
        <el-table-column type="selection" min-width="5%" align="center"></el-table-column>
        <el-table-column label="序号" type="index" min-width="7%" align="center"> </el-table-column>
        <el-table-column 
          :row-style="{height:'10px'}"
          :cell-style="{padding:'0px'}"
          style="font-size: 10px"
          v-for="(column, index) in columns2" :key="index"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :sortable="column.sortable"
          show-overflow-tooltip
          align="center">
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-box" v-show="editableTabsValue === 'operation' || !isShowDetail">
      <audio-Paination v-show="editableTabsValue === 'event'" ref="listPagination" class="pagination" :total="total" @paginationConfChange="paginationConfChange1"></audio-Paination>
      <audio-Paination v-show="editableTabsValue !== 'event'" ref="listPagination2" class="pagination" :total="total2" @paginationConfChange="paginationConfChange2"></audio-Paination>
    </div>
    <logDetail @lookVideo="lookVideo" @backLog="backLog" v-show="isShowDetail"></logDetail>
    <!-- 查看音视频文件 弹窗 -->
    <el-dialog title="录像回放" :visible.sync="videoModalVisible"
                                width="1200px"
                                :close-on-click-modal="false"
                                :append-to-body="true"
                                :modal-append-to-body="true">
      <div class="videoFile-container">
          <div class="videoFile-wrap">
            <preview-plugin :defaultPane="1"
                            :iconShow="iconShowParams"
                            :moduleType="4"
                            :isNeedModal="false"
                            :configuration="configuration"
                            ref="preview"></preview-plugin>
          </div>
          <div class="videoFile-des-main">
            <p class="title">对讲详情</p>
            <div class="videoFile-des-content">
              <p>发起者： {{talkDetail.sponsor}}</p>
              <p>接收者： {{talkDetail.participant}}</p>
              <p>形式： {{talkDetail.participant}}</p>
              <p>开始时间： {{talkDetail.startTime}}</p>
              <p>对讲时长： {{talkDetail.duration}}</p>
              <p>备注：</p>
              <p>{{talkDetail.remakes}}</p>
            </div>
          </div>
      </div>
    </el-dialog>
  
  </div>
</template>
<script>
  import previewPlugin from '@src/view/videoManage/playback/playBackPlugin/playBackPlugin'
  import {mapState,mapMutations,mapActions} from "vuex"
  import AudioPaination from "../components/AudioPagination"
  import { audioOperatelogListApi, audioOperateTypeApi  } from "@src/http/audioManage/audiolog.api.js"
  import { getIntercomTreeApi } from "@src/http/protectiveCabin/channe.api.js"
  import { download } from '@src/common/download.js'
  import { export_json_to_excel } from '@src/common/vendor/Export2Excel'
  import { getTreeApi } from '@src/http/access/accessMan'
  import audioRules from 'assets/rules/validation/security/audio'
  import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
  import logDetail from './logDetail.vue'
  export default {
    name: '',
    components: {
      treeBox: () => import('@src/components/tree/treeBox'),
      AudioPaination,
      previewPlugin,
      logDetail
    },
    data() {
      return {
        configuration: {
          progressBar: {
            show: false
          },
          timeline: {
            show: true,
            passageName: true,
            // passageName: false, // 是否配置通道名称功能
            step: 7, // 当前时间周期
            isNeedCenterTime: true,
            calcHeight: '20px', // 时间轴高度差
          },
          eventType: []
        },
        talkDetail: { // 对讲详情数据
          sponsor:'123',   // 发起者名称
          participant:'1123',  // 接收者名称
          startTime:"11:00:20",  //开始时间
          duration:'36s', // 对讲时长
          remakes: '备注', // 备注
          action: '对讲' // 形式
        },
        iconShowParams: [
          {
            type: 'left',
            index: 4,
            name: 'PlaySpeed'
          },
          {
            type: 'left',
            index: 3,
            name: 'ZhuZhen'
          },
          { type: 'left', index: 6, name: 'Attention' },
          {
            type: 'left',
            index: 0,
            name: 'Play'
          },
          {
            type: 'left',
            index: 7,
            name: 'CheckRecode'
          },
          {
            type: 'left',
            index: 8,
            name: 'Volume'
          },
          {
            type: 'left',
            index: 1,
            name: 'Stop'
          },
          {
            type: 'left',
            index: 2,
            name: 'StopAll'
          },
          // {
          //   type: 'left',
          //   index: 0,
          //   slotName: 'Screen01',
          //   width: 0
          // },
          {
            type: 'right',
            index: 7,
            name: 'SplitMode'
          },
          {
            type: 'right',
            index: 6,
            name: 'CutDownload'
          },
          {
            type: 'right',
            index: 4,
            name: 'NiaoKan'
          },
          {
            type: 'right',
            index: 3,
            name: 'TVWall'
          },
          {
            type: 'right',
            index: 5,
            name: 'ScreenShot'
          },
          // {
          //   type: 'right',
          //   index: 5,
          //   name: 'Download'
          // },
          // {
          //   type: 'right',
          //   slotName: 'Screen01',
          //   width: 0,
          //   index: 3
          // },
          {
            type: 'right',
            name: 'ScreenMode',
            index: 2
          },
          {
            type: 'right',
            name: 'MultiScreen',
            index: 1
          },
          {
            type: 'right',
            index: 0,
            name: 'FullScreen'
          },
          {
            type: 'left',
            index: 5,
            name: 'Rewind'
          }
        ], // 需要配置的底部按钮数组
        showSearchBox: true, // 展开收起条件
        logOrgName: '', // 日志设备名
        keyParts:[],  // 重点部位 列表
        treeType: 3,  // 机构树 treeType
        deviceList: [], // 设备列表
        isShowDetail: false,
        //对讲时长  下拉框列表
        duration:[
          { label: '全部', value: '' },
          { label: '<1分钟', value: '1分钟' },
          { label: '1分钟-10分钟', value: '1分钟-10分钟' },
          { label: '10分钟-1小时', value: '10分钟-1小时' },
          { label: '>1小时', value: '>1小时' },
        ],

        // 操作类型
        operateType_list:[],
        // 操作类型key value形式做映射用
        operateType_obj: {},
        // 事件日志 
        // status: '全部',
        editableTabsValue: 'event', // 选项卡当前选中项
        
        // 查询条件
        formData: {
          orgId:"", // 发起者所属机构
          keyPartId:"",  // 发起者所属重点部位
          sponsor:'',   // 发起者名称
          deviceName:"", // 发起者设备
          recvOrgId:"", // 接收者所属机构
          recvKeyPartId:"",  // 接收者所属重点部位
          recvDeviceName:"", // 接收者设备
          participant:'',  // 接收者名称
          startTime:"",  //开始时间
          endTime:"",  //结束时间
          duration:'',
          startTimeList: [],
          endTimeList: [],
          recvOrgName: '', // 复制接收选择机构名称
          recvKeyPartName: '', // 复制接收选择重点部位名称
          keyPartName: '', // 复制选择重点部位名称
          orgName: '', // 复制选择机构名称
        },
        dropdownStatus: {
          detector: true
        },  // 事件日志 控制 查询表单 显示隐藏
        columns: [
          { prop: 'orgName', sortable: false, label: '所属机构', width: ''},
          { prop: 'keyPartName', sortable: false, label: '所属重点部位', width: ''},
          { prop: 'deviceName', sortable: false, label: '所属设备', width: ''},
          { prop: 'sponsor', sortable: false, label: '发起者', width: ''},
          { prop: 'recvOrgName', sortable: false, label: '所属机构', width: ''},
          { prop: 'recvKeyPartName', sortable: false, label: '所属重点部位', width: ''},
          { prop: 'recvDeviceName', sortable: false, label: '所属设备', width: ''},
          { prop: 'participant', sortable: false, label: '接收者', width: ''},
          { prop: 'startTime', sortable: false, label: '开始时间', width: ''},
          { prop: 'endTime', sortable: false, label: '结束时间', width: ''},
          { prop: 'duration', sortable: false, label: '对讲时长', width: '' }
        ],  // 事件日志列表 表格字段
        rules: audioRules.audioLogRules,
        currentPage:1, //初始页
        pageSize: 25,
        page: 1,
        total:0,
        videoModalVisible:false,   // 音视频文件弹窗 显示隐藏
        mock_list:[],
        tableData:[
          {
            orgName:"123", // 发起者所属机构
            keyPartName:"123",  // 发起者所属重点部位
            sponsor:'123',   // 发起者名称
            deviceName:"123", // 发起者设备
            recvOrgName:"123", // 接收者所属机构
            recvKeyPartName:"123",  // 接收者所属重点部位
            recvDeviceName:"123", // 接收者设备
            participant:'123',  // 接收者名称
            startTime: '1234',  //开始时间
            endTime:"123",  //结束时间
            duration:'123',
            voicePath: '音视频文件123',
            channel: 2,
            devPort: 37777,
            streamType: 'main',
            vstartTime: 1598328000,
            vendTime: 1598425156,
            newStartTime: 1598371200,
            devType: 1
          }
        ],  // 事件日志列表
        serchDerive:[],
        // 操作日志
        formData2: {
          name:'',  // 姓名
          userName:'',  // 用户
          orgId:"",  // 所属机构
          clientName:'',  // 客户端类型
          ip:'',  // IP地址
          operateType:'',  // 操作类型
          object:'',  // 操作对象
          // startTime:'', // 查询开始时间
          // endTime:'', // 查询结束时间
          description: '', // 操作描述
          orgName: '',
          dateTime: []
        },
        dropdownStatus2: {
          detector: true
        },
        columns2: [
          { prop: 'name', sortable: false, label: '姓名', width: ''},
          { prop: 'userName', sortable: false, label: '用户名', width: ''},
          { prop: 'createdAt', sortable: false, label: '时间', width: ''},
          { prop: 'orgName', sortable: false, label: '所属机构', width: ''},
          { prop: 'clientName', sortable: false, label: '客户端类型', width: ''},
          { prop: 'ip', sortable: false, label: 'IP地址', width: ''},
          { prop: 'operateType', sortable: false, label: '操作类型', width: ''},
          { prop: 'action', sortable: false, label: '动作', width: '' },
          { prop: 'object', sortable: false, label: '操作对象', width: ''},
          { prop: 'result', sortable: false, label: '操作结果', width: ''},
          { prop: 'description', sortable: false, label: '操作描述', width: '300'},
        ],  // 操作日志列表 表格字段
        currentPage2 : 1, //初始页
        pageSize2 :  25,
        page2 : 1,
        total2 : 0,
        tableData2 : [],  // 事件日志列表
        serchDerive2 : [],
        copyRecvOrgName: '', // 复制接收选择机构名称
        copyRecvKeyPartName: '', // 复制接收选择重点部位名称
        copyKeyPartName: '', // 复制选择重点部位名称
        copyOrgName: '', // 复制选择机构名称
        copyKeyPartName1: '', // 复制日志选择重点部位名称
        copyOrgName1: '', // 复制日志选择机构名称
      }
    },
    methods: {
      // 返回详情
      backLog () {
        this.isShowDetail = false
      },
      // 查看详情
      lookDetail () {
        this.isShowDetail = true
      },
      // 机构部位失焦判断是否为空 清空对应id
      bulrChange (val) {
        if (val === 'org') {
          if (!this.formData.orgName) {
            this.formData.orgId = ''
          } else if (this.formData.orgName !== this.copyOrgName) {
            this.formData.orgName = ''
            this.formData.orgId = ''
          }
        } else if (val === 'kp') {
          if (!this.formData.keyPartName) {
            this.formData.keyPartId = ''
          } else if (this.formData.keyPartName !== this.copyKeyPartName) {
            this.formData.keyPartName = ''
            this.formData.keyPartId = ''
          }
        } else if (val === 'accorg') {
          if (!this.formData.recvOrgName) {
            this.formData.recvOrgId = ''
          } else if (this.formData.recvOrgName !== this.copyRecvOrgName) {
            this.formData.recvOrgId = ''
            this.formData.recvOrgName = ''
          }
        } else if (val === 'acckp') {
          if (!this.formData.recvKeyPartName) {
            this.formData.recvKeyPartId = ''
          } else if (this.formData.recvKeyPartName !== this.copyRecvKeyPartName) {
            this.formData.recvKeyPartId = ''
            this.formData.recvKeyPartName = ''
          }
        }
      },
      // 操作日志机构失去焦点
      bulrChange1 () {
        if (val === 'org') {
          if (!this.logOrgName) {
            this.formData2.orgId = ''
          } else if (this.logOrgName !== this.copyOrgName1) {
            this.logOrgName = ''
            this.formData2.orgId = ''
          }
        }
      },
      // 事件远程搜索机构部位
      querySearch(type, value, callback) {
        const params = {
          type: type === 'org' ? 1 : 2,
          name: value,
          oId: type === 'kp' ? this.formData.orgId : undefined,
        }
        getSearchOrgApi(params)
          .then((res) => {
            if (!res.data.data.code) {
              callback(res.data.data.orgList || [])
            } else {
              throw res.data.data.message
            }
          })
          .catch((err) => {
            console.log(err)
            callback([])
          })
      },
      // 远程搜索机构部位
      querySearch1(type, value, callback) {
        const params = {
          type: type === 'org' ? 1 : 2,
          name: value,
          oId: type === 'kp' ? this.formData.orgId : undefined,
        }
        getSearchOrgApi(params)
          .then((res) => {
            if (!res.data.data.code) {
              callback(res.data.data.orgList || [])
            } else {
              throw res.data.data.message
            }
          })
          .catch((err) => {
            console.log(err)
            callback([])
          })
      },
      // 操作日志选择机构部位赋对应值
      selectTreeItem1(type, val) {
        if (type === 'org') {
          this.formData2.orgId = val.serial
          this.logOrgName = val.name
          this.copyOrgName1 = val.name
        }
      },
      // 选择机构部位赋对应值
      selectTreeItem(type, val) {
        if (type === 'org') {
          this.formData.orgId = val.id
          this.formData.orgName = val.name
          this.copyOrgName = val.name
        } else if (type === 'kp') {
          this.formData.keyPartId = val.id
          this.formData.keyPartName = val.name
          this.copyKeyPartName = val.name
        } else if (type === 'accorg') {
          this.formData.recvOrgId = val.id
          this.formData.recvOrgName = val.name
          this.copyRecvOrgName = val.name
        } else if (type === 'acckp') {
          this.formData.recvKeyPartId = val.id
          this.formData.recvKeyPartName = val.name
          this.copyRecvKeyPartName = val.name
        }
      },
      // 重点部位切换 获取设备
      keyPartChange (val) {
        console.log(val);
        let params = { type: 1, kpId: val }
        getIntercomTreeApi(params).then(res=>{
          this.deviceList = res.data.data.nodes
          console.log(res, 8888)
        }) 
      },

      // 获取 机构树 api
      getTree(params) {
        return getTreeApi(params)
      },
      // 操作日志分页事件联动
      paginationConfChange2(obj) {
        this.pageSize2 = obj.limit
        this.getaudiologList2(obj.page)
      },
    
      paginationConfChange1(obj) {
        console.log(obj);
        this.pageSize = obj.limit
        this.page = obj.page
        this.getaudiologList()
      },

      // 操作日志机构树点击
      playBackGetData2 (node) {
        console.log(node);
        this.logOrgName = node.name;
        if (node.tierType == 'org') {
          this.formData2.orgId = node.serial;
        }
      },

      // 机构树 点击获取
      playBackGetData(node) {
        console.log(node)
        this.formData.orgName = node.name;
        if (node.tierType == 'org') {
          this.formData.orgId = node.serial;
        }
        let obj = {
          type: 2,
          oId: node.serial,
        }
        this.keyParts = [];  // 重点部位 集合
        this.formData.keyPartId = '';
        getTreeApi(obj).then((res) => {
          if (res.data.data.nodes) {
            res.data.data.nodes.forEach((item) => {
              if (item.tierType === 'loc') {
                this.keyParts.push(item)
              }
            })
          }
        })
      },

      ...mapActions("audioLog",{
        audiologList:"audiologList",
        audiologExport:"audiologExport",
        audioOperatelogList:'audioOperatelogList',
        audioOperatelogExplode:'audioOperatelogExplode',
      }),

      // 事件日志 获取列表
      getaudiologList(){
        let params = { limit: this.pageSize, page: this.page };
        Object.assign(params, this.formData);
        console.log(params);
        params.startTimeBegin = params.startTimeList[0] || ''
        params.startTimeEnd = params.startTimeList[1] || ''
        params.endTimeBegin = params.endTimeList[0] || ''
        params.endTimeEnd = params.endTimeList[1] || ''
        delete params.endTimeList
        delete params.startTimeList
        this.audiologList(params).then(res=>{
          console.log(res.data.data.list,"2020")
          let {list}=res.data.data;
          let {page}=res.data.data;
          console.log(list,"222")
          console.log(page,"111")
          // for(let val of list){
          //   val.duration=this.formatSeconds( parseInt(val.duration))
          // }
          this.tableData=list || [];
          this.total=page.totalNumber || 0;
          this.pageSize = page.pageSize;
        },
        rej=>{
          console.log(res,2)
        })      
      },

      // 事件日志 查询
      onSearch(){
        // 将分页子组件置为第一页
        this.$refs.listPagination.page = 1
        if (this.editableTabsValue === 'event') {
          this.page = 1
          this.$refs.listPagination.page = 1
          this.getaudiologList()
        } else {
          this.$refs.listPagination2.page = 1
          this.getaudiologList2(1)
        }
      },
      lookVideo () {
        this.showVideoModal(this.tableData[0])
      },

      // 查看 音视频文件
      showVideoModal(data){
        let param = {
          channel: 2,
          devPort: data.devPort,
          streamType: data.streamType,
          startTime: data.vstartTime,
          endTime: data.vendTime,
          newStartTime: data.newStartTime,
          devType: data.devType,
          devIp: '10.1.2.20',
        }
        this.videoModalVisible = true;
        this.$nextTick(() => {
          this.$refs.preview.openBackVideo(param)//进行回放录像
        })
      },

      // 重置条件
      resetCondition (formName) {
        if (this.editableTabsValue === 'event') {
          this.$refs.listPagination.page = 1
          this.formData = { ...this.obj }
          this.tableData = []
          this.total=0
        } else {
          this.$refs.listPagination2.page = 1
          this.$refs[formName].resetFields();
          console.log(123);
          this.logOrgName = '' // 重置机构名称
          this.tableData2 = []
          this.total2=0
          // for (let item in this.formData2) {
          //   this.formData2[item] = ''
          // }
        }
      },

      // 事件日志 选中
      selectChange(select, row) {
        this.serchDerive=select
      },
      // 导出列表
      exportList () {
        if (this.editableTabsValue === 'event') {
          this.exportFile()
        } else {
          this.exportFile2()
        }
      },

      // 事件日志 导出日志
      exportFile(){
        if (this.serchDerive && this.serchDerive.length > 0) {
          const tHeader = ['序号','所属机构','所属重点部位','所属设备','发起者','接听者','开始时间','结束时间','对讲时长','音视频文件']
          const filterVal = ['index','keyPartName','keyPartName','deviceName','sponsor','participant','startTime','endTime','duration','voicePath']
          let list = []
          list = this.$lodash.cloneDeep(this.serchDerive)
          
          list.forEach((item,index) => {
            item.index = index+1;

            if (item.status == 1) {
              item.status = '在线'
            } else if (item.status == 2) {
              item.status = '离线'
            }else{
              item.status = '未知'
            }

            // runStatus  1 离线  2 空闲  3 呼出  4 响铃  5 对讲中 6 广播中
            if (item.runStatus == 1) {
              item.runStatus = '离线'
            } else if (item.runStatus == 2) {
              item.runStatus = '空闲'
            }else if (item.runStatus == 3) {
              item.runStatus = '呼出'
            }else if (item.runStatus == 4) {
              item.runStatus = '响铃'
            }else if (item.runStatus == 5) {
              item.runStatus = '对讲中'
            }else if (item.runStatus == 6) {
              item.runStatus = '广播中'
            }else{
              item.runStatus = '未知'
            }

            item.isVideoLink = item.isVideoLink == 1 ? '未关联' : '已关联';
            item.isGuardLink = item.isGuardLink == 1 ? '未关联' : '已关联';
            item.isOutputLink = item.isOutputLink == 1 ? '未关联' : '已关联';

          })
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '音频事件日志')
        } else {
          let params = { pageSize: this.pageSize, page: this.page };
          Object.assign(params, this.formData);
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/audio/v1/record/explode`
          let title = `音频事件日志${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          let newUrl = this.concatUrl(url, params)
          download(
            newUrl,
            title,
            () => {},
            () => {
              this.$message({ type: 'info', message: '导出文件下载失败！' })
            },
            () => {},
            'get',
            params
          )
        }

      },

      concatUrl (url, obj) {
        let newUrl = url + '?'
        for (let item in obj) {
          if (obj[item]) {
            newUrl += `${item}=${obj[item]}&`
          } else {
            newUrl += `${item}=&`
          }
        }
        return newUrl.substring(0, newUrl.length-1)
      },

      // 操作日志 获取列表
      getaudiologList2(val){
        let params = { limit: this.pageSize2, page: val || this.page2 };
        Object.assign(params, this.formData2);
        delete params.orgName
        console.log(params)
        if (val) {
          this.page2 = val
        }
        if (params.dateTime.length) {
          params.startTime = params.dateTime[0]
          params.endTime = params.dateTime[1]
          delete params.dateTime
        }
        audioOperatelogListApi(params).then(res=>{
          console.log(res)
          let list = res.data.data.logs;
          let page = res.data.data.page;
          if (list) {
            list.forEach(item => {
              item.operateType = this.operateType_obj[item.operateType] || ''
            })
          }
          this.tableData2=list;
          this.total2=page.totalNumber || 0;
          this.pageSize2 = page.limit;
        })
      },

      // 操作日志 选中
      selectChange2(select, row) {
          this.serchDerive2=select
          console.log(this.serchDerive2)
      },

      // 操作日志 导出日志
      exportFile2(){
        if (this.serchDerive2 && this.serchDerive2.length > 0) {
          const tHeader = ['序号','姓名','用户名','时间','所属机构','客户端类型','IP地址','操作类型','动作','操作对象','操作结果','操作描述']
          const filterVal = ['index','name','userName','createdAt','orgName','clientName','ip','operateType','action','object','result','description']
          let list = []
          list = this.$lodash.cloneDeep(this.serchDerive2)
          
          list.forEach((item,index) => {
            item.index = index+1;
          })
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '音频操作日志')
        } else {
          let params = { limit: this.pageSize2, page: this.page2 };
          Object.assign(params, this.formData2);
          let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/audio/v1/operatelog/explode`
          let title = `音频操作日志${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
          let newUrl = this.concatUrl(url, params)
          download(
            newUrl,
            title,
            () => {},
            () => {
              this.$message({ type: 'info', message: '导出文件下载失败！' })
            },
            () => {},
            'get',
            params
          )
        }

      },

      // 导出 功能函数
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },

      // 收缩查询条件
      // 事件日志
      toggleOpen(type) {
        this.dropdownStatus[type] = !this.dropdownStatus[type]
      },
      // 操作日志
      toggleOpen2(type) {
        this.dropdownStatus2[type] = !this.dropdownStatus2[type]
      },

      // 时间戳转时间字符串
      formatSeconds(value) {
        let result = parseInt(value)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
    
        let res = '';
        if(h !== '00') res += `${h}:`;
        if(m !== '00') res += `${m}:`;
        res += `${s}`;
        return res;
      },

      // 下边这俩方法（dateChangebirthday1，handleForm）暂时未找到 何处调用
      dateChangebirthday1(val){
          this.startTime = val;
          console.log(this.startTime);
      },
      
      handleForm(form) {
        let arr = Object.entries(form)
        let flag = arr.every(item => item[1] === '')
        if (!flag) {
          arr.forEach(item => {
            if (item[0] === 'startTime') {
              item[1] = this.$moment(item[1]).format('YYYY-MM-DD')
            }
            if (item[0] === 'endTime') {
              item[1] = this.$moment(item[1]).format('YYYY-MM-DD')
            }
          })
          return Object.fromEntries(arr)
        } else {
          return form
        }
      },
      // 获取设备类型
      getOprateType () {
        audioOperateTypeApi().then(res=>{
          this.operateType_list = res.data.data
          // 处理对象key: value 形式
          let obj = {}
          this.operateType_list.forEach(item => {
            obj[item.key] = item.value
          })
          this.operateType_obj = obj
        })
      }
    },
    watch: {
      showSearchBox(val) {
        if (val) {
          document.querySelector('.table-container').style.height = 'calc(100% - 438px)'
        } else {
          this.$nextTick(() => {
            document.querySelector('.table-container').style.height = 'calc(100% - 194px)'
          })
        }
      }
    },
    created() {
      this.obj = { ...this.formData }
      this.getOprateType()
    },
    mounted () {
      this.$refs.listPagination.limit = this.pageSize
      this.$refs.listPagination2.limit = this.pageSize2
    },
  }
</script>
<style lang="less" scoped>
.audio-log-query-box {
  width: 100%;
  height: 100%;
  // 面包屑导航样式
  .breadcrumb-container {
    padding: 20px 0 20px 20px;
    position: relative;
    .icon-style {
      left: 20px;
      line-height: 14px;
      position: absolute;
    }
  }

  .tabs-container {
    padding: 0 20px;
    position: relative;
    .el-tabs--border-card {
      background: #ffffff;
      border: 0px;
      box-shadow: 0 0 0 0 #ffffff;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header {
      background-color: #ffffff;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      &::after {
        content: '';
        display: block;
        width: 98px;
        height: 2px;
        background: #409eff;
        position: absolute;
        left: 0px;
        top: 0px;
      }
    }
    /deep/ .el-tabs__content {
      padding: 0;
    }
    .shrink-container {
      width: 46px;
      height: 36px;
      padding-left: 16px;
      position: absolute;
      top: 20px;
      right: 26px;
      background: #ffffff;
      .shrink-div {
        width: 36px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        font-size: 20px;
        border: 1px solid #9EADC1;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
          border: 1px solid #3482F0;
        }
      }
    }
  }
  .search-container {
    padding: 0 20px;
    // 搜索输入框
    .search-box {
      width: 100%;
      padding: 20px 16px 4px 0;
      box-sizing: border-box;
      margin-top: 20px;
      // background: #ffffff;
      background: #F8F8F8;
      /deep/ .el-range-separator{
        width: 24px;
        line-height: 26px;
      }
      .search-border {
        padding: 5px 0 0 5px;
        /deep/ .el-form {
          .form-item-div {
            width: 430px;
            display: inline-block;
            .el-form-item {
              margin: 10px 0 16px 0;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner,
            .el-autocomplete,
            .el-select {
              width: 100%;
            }
          }
        }
      }
    }
    // 按钮框
    .button-container {
      width: 100%;
      height: 36px;
      margin-top: 20px;
      .button-box {
        width: 360px;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        .el-button{
          width: 100px;
        }
      }
    }
  }

  // 表格
  .table-container {
    width: 100%;
    margin-top: 20px;
    height: calc(~"100% - 438px");
    padding: 0 20px;
    /deep/ .el-table__row {
      height: 40px;
      font-size: 14px;
    }
  }

  // 分页
  .pagination-box {
    width: 100%;
    height: 45px;
    padding-right: 20px;
  }
}
 
//  查看音视频文件 弹窗内样式
 .videoFile-container{
   width: 100%;
   display: flex;
   display: -webkit-flex;
 }
 .videoFile-wrap{
   width: 800px;
   height: 600px;
   background-color: #efefef;
 }
  .videoFile-wrap .video{
    width: 100%;
    height: 100%;
  }
  .videoFile-des-main{
    flex: 1;
    font-size: 14px;
    color: #606266;
    line-height: 30px;
    padding:0 20px;
  }
  .videoFile-des-main .title{
    font-size: 16px;
  }
</style>