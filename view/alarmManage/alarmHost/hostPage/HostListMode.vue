<template>
  <div class="host-list-mode">
    <div class="host-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>智慧安防</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机管理</el-breadcrumb-item>
        <el-breadcrumb-item>报警控制主机</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="host-content-main"
         v-if="controlStatus">
      <div class="host-num">
        <ul>
          <li class="first_li"></li>
          <li>
            报警控制主机：<i @click="hostNumClick"
               style="color:#F71919">{{ hostNo }}</i>
          </li>
          <li>
            布防：<i @click="armClick"
               style="color:#E1B10A">{{ armed }}</i>
          </li>
          <li>
            撤防：<i @click="disarmClick"
               style="color:#E1B10A">{{ disarm }}</i>
          </li>
          <li>
            离线：<i @click="offlineClick"
               style="color:#0ABBE1">{{ offline }}</i>
          </li>
          <li style="margin-right:20px">
            <el-button type="primary"
                       size="small"
                       @click="armSetClick('arm')"
                       icon="el-icon-plus">布防</el-button>
          </li>
          <li style="margin-right:20px">
            <el-button size="small"
                       @click="armSetClick('disarm')"><span class="iconfont-ccb">&#xe653;</span>撤防</el-button>
          </li>
          <li>
            <el-button class="part-info-btn"
                       size="small"
                       @click="importInfoDialogBtn"
                       :disabled="this.multipleSelection.length !== 1"><span class="iconfont-ccb">&#xe682;</span>重点部位信息</el-button>
          </li>
          <!-- <li>
            <el-button size="small"
                       @click="troubleAddDialog = true"
                       :disabled="this.multipleSelection.length!==1"><span class="iconfont-ccb">&#xe600;</span>故障报修</el-button>
          </li> -->
          <li style="float:right">
            <el-button type="primary"
                       @click="modeSelectClick(modeInfo.index)"
                       size="small"><span class="iconfont">&#xe746;</span>{{ modeInfo.info }}</el-button>
          </li>
        </ul>
      </div>

      <div class="host-table">
        <div class="table-select">
          <ul>
            <li>
              重点部位
              <el-autocomplete class="inline-input"
                               size="mini"
                               v-model="partValue"
                               value-key="name"
                               :fetch-suggestions="(val, callback)=>{querySearch('kp', val,callback)}"
                               placeholder='请输入重点部位'
                               :trigger-on-focus="false"
                               @select="val=>{selectItem('kp', val)}"></el-autocomplete>
            </li>
            <li>
              设备名称
              <el-input v-model="devName"
                        class="input_size_small"
                        placeholder="请输入内容"
                        style="width: 150px"
                        size="mini"></el-input>
            </li>
            <li>
              布撤防状态
              <el-select v-model="armValue"
                         class="select_size_small"
                         size="mini">
                <el-option v-for="item in armStatusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li>
              在线状态
              <el-select v-model="onlineValue"
                         class="select_size_small"
                         size="mini">
                <el-option v-for="item in onlineStatusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li v-if="listMode">
              市电状态
              <el-select v-model="mainValue"
                         class="select_size_small"
                         size="mini">
                <el-option v-for="item in mainStatusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li class="table-select-btn">
              <el-button type="primary"
                         size="small"
                         @click="queryHostList"
                         icon="el-icon-search">查询</el-button>
              <el-button size="small"
                         @click="resetClick"><span class="iconfont-ccb">&#xe653;</span>重置</el-button>
              <el-button size="small"
                         @click="refreshClick(listMode)"
                         icon="el-icon-refresh-right">刷新</el-button>
            </li>
          </ul>
        </div>
        <div class="host-armed-btn">
          <el-checkbox v-model="orgChecked"
                       @change="checkedSubOrg">显示子机构资源</el-checkbox>
        </div>
        <div v-if="listMode"
             class="table-content">
          <el-table ref="multipleTable"
                    resizable="false"
                    border
                    stripe
                    :data="tableData"
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                    height="332"
                    @selection-change="hostSelectionChange"
                    @row-click="tableRowClick">
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column prop="orgName"
                             :sortable="true"
                             label="所属机构"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="locName"
                             :sortable="true"
                             label="所属部位"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="name"
                             :sortable="true"
                             label="设备名称"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip"
                             :sortable="true"
                             label="设备IP"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="subsystemNo"
                             :sortable="true"
                             label="子系统数"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="detectorNo"
                             :sortable="true"
                             label="防区数"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="defenseState"
                             :sortable="true"
                             label="布撤防状态"
                             width=""
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.defenseState === '布防'"
                      style="color:red">{{scope.row.defenseState}}</span>
                <span v-else>{{scope.row.defenseState}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="onlineState"
                             :sortable="true"
                             label="在线状态"
                             width=""
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status == '离线'"
                      style="color:red">{{scope.row.status}}</span>
                <span v-else>{{scope.row.status}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="electricState"
                             :sortable="true"
                             label="市电状态"
                             width=""
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.electricState == '异常'"
                      style="color:red">{{scope.row.electricState}}</span>
                <span v-else>{{scope.row.electricState}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :page-sizes="[10, 25, 50, 100]"
                         :page-size="pageSize"
                         :current-page="page"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
        <div v-if="!listMode">
          <HostPanelMode :alarmHostList="tableData"
                         ref="HostPanelModeRef"
                         @backControlStatus="backControlStatus"
                         @hostSelectionChange="hostSelectionChange"
                         @handleLinkBtn="handleLinkBtn"
                         v-if="tableData.length"></HostPanelMode>
          <div v-else
               class="prompt-info">暂无数据</div>
        </div>
      </div>
      <div class="host-zone-info"
           v-if="listMode">
        <div class="zone-header"
             v-show="zoneInfoStatus">
          <i>防区类型</i>
          <div class="zone-header-line"></div>
        </div>
        <div class="zone-header"
             v-show="!zoneInfoStatus">
          <el-menu :default-active="activeIndex"
                   class="el-menu-demo"
                   mode="horizontal"
                   @select="subSystemSelect">
            <el-menu-item :index="(index + 1).toString()"
                          v-for="(item, index) in subsystemNum"
                          :key="index">{{
              item.name
            }}</el-menu-item>
          </el-menu>
        </div>
        <div class="zone-set">
          <ul>
            <li class="first_li"></li>
            <li>
              防区数：<i>{{ zoneNum }}</i>
            </li>
            <li v-if="!zoneInfoStatus">
              当前状态：<i>{{ hostStatus }}</i>
            </li>
            <!-- <li v-if="!zoneInfoStatus">
              <el-button type="primary"
                         size="small"
                         :disabled="hostBtnDisabled"
                         @click="setAreaClick('arm')">布防</el-button>
            </li>
            <li v-if="!zoneInfoStatus">
              <el-button size="small"
                         @click="setAreaClick('disarm')"
                         :disabled="!hostBtnDisabled">撤防</el-button>
            </li> -->
            <li v-if="!zoneInfoStatus">
              <el-button :type="this.hostStatus==='布防'?'info':'primary'"
                         size="small"
                         @click="setAreaClick('arm')"
                         :disabled="this.hostStatus==='布防'"
                         icon="el-icon-plus">布防</el-button>
            </li>
            <li v-if="!zoneInfoStatus">
              <el-button size="small"
                         :type="this.hostStatus==='撤防'?'info':''"
                         :disabled="this.hostStatus==='撤防'"
                         @click="setAreaClick('disarm')"><span class="iconfont-ccb">&#xe653;</span>撤防</el-button>
            </li>
            <li>
              <el-button size="small"
                         type="primary"
                         @click="armSetClick('bypass')"><span class="iconfont-ccb">&#xe68b;</span>旁路</el-button>
            </li>
            <li>
              <el-button size="small"
                         @click="bypassClick"
                         icon="el-icon-refresh-right">旁路恢复</el-button>
            </li>
            <li>
              <el-button size="small"
                         type="danger"
                         @click="clearAlarmBtn"><span class="iconfont-ccb">&#xe73b;
                </span>消警</el-button>
            </li>
          </ul>
        </div>
        <div class="zone-table">
          <el-table ref="multipleTable"
                    border
                    stripe
                    highlight-current-row
                    :data="zoneInfoList"
                    style="width: 100%"
                    height="185"
                    @selection-change="zoneSelectionChange">
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column type="index"
                             label="序号"
                             width="55"></el-table-column>
            <el-table-column prop="name"
                             :sortable="true"
                             label="探测器名称"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="serialNumber"
                             :sortable="true"
                             label="防区序号"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceType"
                             :sortable="true"
                             label="设备类型"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="count"
                             :sortable="true"
                             label="数量"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <el-table-column :sortable="true"
                             label="状态"
                             width=""
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status == '报警'"
                      style="color:red">{{scope.row.status}}</span>
                <span v-if="scope.row.status == '正常'"
                      style="color:#33D48E">{{scope.row.status}}</span>
                <span v-if="scope.row.status == '故障'"
                      style="color:#7E7E7E">{{scope.row.status}}</span>
                <span v-if="scope.row.status == '未知'">{{scope.row.status}}</span>
              </template></el-table-column>
            <el-table-column prop="bypassState"
                             :sortable="true"
                             label="旁路状态"
                             width=""
                             show-overflow-tooltip></el-table-column>
            <!-- <el-table-column v-for="(item, index) in zoneInfoColumn"
                             :prop="item.mark"
                             :label="item.label"
                             show-overflow-tooltip
                             :key="index">
            </el-table-column> -->
            <el-table-column prop="link"
                             label="关联控制">
              <template slot-scope="scope">
                <el-button @click.native.prevent="handleLinkBtn(scope.$index, scope.row)"
                           size="mini">关联控制</el-button>
              </template>
              <!-- <el-button @click="detectorRela = true" size="mini">关联控制</el-button> -->
            </el-table-column>
          </el-table>

        </div>
      </div>
    </div>
    <div class="host-content-main"
         v-if="!controlStatus">
      <HostBackControl :backData="backControlData"
                       @selectMode="selectMode"></HostBackControl>
    </div>
    <div class="dialog bcf_dialog">
      <!-- 布撤防提示框 -->
      <el-dialog :title="dialogTitle"
                 :visible.sync="armDialog"
                 :close-on-click-modal='false'
                 width="20%">
        <div class="arm-dialog">
          <i class="el-icon-warning"></i>
          <ul>
            <li>
              <span>{{ armNum.successTitle }}：</span>{{ armNum.armSuccess }}
            </li>
            <li>
              <span>{{ armNum.errorTitle }}：</span>{{ armNum.armError }}
            </li>
          </ul>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="armDialog = false"
                     size="small">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 重点部位信息 -->
      <el-dialog title="重点部位信息"
                 :visible.sync="importInfoDialog"
                 :close-on-click-modal='false'
                 width="52%">
        <div class="import-info">
          <ul>
            <li v-for="(item, index) in importInfoList"
                :key="index">
              <span>{{ item.name }}</span>
              <span style="border:none">{{ item.info }}</span>
            </li>
          </ul>
        </div>
      </el-dialog>
      <!-- 故障报修 -->
      <el-dialog :visible.sync="troubleAddDialog"
                 :close-on-click-modal='false'
                 width="46%">
        <div class="form-box">
          <div class="form-top">新建故障申报单</div>
          <div class="form-content">
            <div class="left-form">
              <el-form size="mini"
                       :model="formData"
                       label-position="right"
                       label-width="120px">
                <el-form-item label="故障设备">
                  <el-input disabled
                            v-model="formData.FaultyEquipment"></el-input>
                </el-form-item>
                <el-form-item label="所属机构">
                  <el-input v-model="formData.oid"></el-input>
                </el-form-item>
                <el-form-item label="所属平台">
                  <el-input v-model="formData.platform"></el-input>
                </el-form-item>
                <el-form-item label="发现人">
                  <el-input v-model="formData.discoverer"></el-input>
                </el-form-item>
                <el-form-item label="申报类型">
                  <el-select v-model="formData.declareType">
                    <el-option v-for="item in declareTypeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="right-form">
              <el-form size="mini"
                       :model="formData"
                       label-position="right"
                       label-width="120px">
                <el-form-item label="故障单号">
                  <el-input v-model="formData.odd"></el-input>
                </el-form-item>
                <el-form-item label="所属重点部位">
                  <el-input v-model="formData.keyPart"></el-input>
                </el-form-item>
                <el-form-item label="所属设备">
                  <el-input v-model="formData.equipment"></el-input>
                </el-form-item>
                <el-form-item label="发现时间">
                  <el-input v-model="formData.disTime"></el-input>
                </el-form-item>
                <el-form-item label="申报原因">
                  <el-input v-model="formData.reason"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="form-footer">
            <el-button type="primary"
                       size="mini"
                       @click="troubleAddDialog = false">添加</el-button>
            <el-button size="mini"
                       style="margin:0 24px">重置</el-button>
            <el-button size="mini"
                       @click="troubleAddDialog = false">关闭</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 布撤防和旁路设置弹出框 -->
      <el-dialog :title="setTitleInfo"
                 :visible.sync="bypassDialog"
                 :close-on-click-modal='false'
                 width="20%">
        <el-form :model="bypassForm">
          <el-form-item :label="setTitleInfo">
            <el-select v-model="bypassForm.reason"
                       style="width: 100%">
              <el-option v-for="item in reasonList"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="具体内容">
            <el-input v-model="bypassForm.detail"
                      type="textarea"
                      :rows="2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <span>操作员：张三</span>
          <el-button @click="bypassDialog = false"
                     size="small">关闭</el-button>
          <el-button type="primary"
                     @click="restoreSure"
                     size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 清除报警提示框 -->
      <el-dialog title="清除报警提示"
                 :visible.sync="clearAlarm"
                 :close-on-click-modal='false'
                 width="20%">
        <div class="arm-dialog">清除报警发送成功！</div>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="clearAlarm = false"
                     size="small">关闭</el-button>
          <el-button @click="clearAlarm = false"
                     size="small">确定</el-button>
        </div>
      </el-dialog>
      <!-- 关联控制提示框 -->
      <div v-if="linkStatus">
        <LinkControl :linkControl="linkStatus"
                     :ishostZone='ishostZone'
                     :thisRela='thisRela'
                     :listMode='listMode'
                     :controlStatus='controlStatus'
                     :associatedControlData="associatedControlData"
                     @sureClick="sureLinkClick"></LinkControl>
      </div>
    </div>
  </div>
</template>

<script>
import publicData from '../publicData'
import HostPanelMode from './HostPanelMode'
import HostBackControl from './HostBackControl'
import LinkControl from '../linkControl/LinkControl'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import treeBox from '@src/components/tree/treeBox'
import { getHostTreeApi, defendnApi } from '../../../../http/alarm/alarmHostManage.api'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
export default {
  components: {
    HostPanelMode,
    HostBackControl,
    LinkControl,
    treeBox,
  },
  props: {
    initId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      treeType: 2,
      ishostZone: '',
      activeNames: ['1'],
      name: '',
      linkStatus: false,
      listMode: true,
      modeInfo: {
        info: '切换面板模式',
        index: 0,
      },
      tableData: [],
      hostCurrentPage: 1,
      total: 0,
      // 报警主机选中
      multipleSelection: [],
      // 探测器选中
      zoneSelectionList: [],
      menuList: ['报警控制主机', '电子围栏总线报警主机', '振动光纤报警主机'],
      isCollapse: true,
      naveMenu: true,
      menuWidth: '20%',
      alarmHostNum: 0,
      armed: 0,
      disarm: 0,
      offline: 0,
      orgChecked: false,
      formData: {}, // 故障报修
      pageSize: 25,
      page: 1,
      hostNo: 0, // 报警主机总数
      declareTypeList: [
        {
          value: '全部',
          label: '全部',
        },
      ],
      partList: [
        {
          value: '全部',
          label: '全部',
        },
      ],
      partValue: '',
      devName: '',
      armStatusList: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '3',
          label: '布防',
        },
        {
          value: '1',
          label: '撤防',
        },
        {
          value: '2',
          label: '未知',
        },
      ],
      armValue: '',
      onlineStatusList: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '2',
          label: '在线',
        },
        {
          value: '1',
          label: '离线',
        },
      ],
      onlineValue: '',
      mainStatusList: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '3',
          label: '正常',
        },
        {
          value: '1',
          label: '异常',
        },
      ],
      mainValue: '',
      controlStatus: true, // 回控状态
      backControlData: {}, // 回控数据
      zoneNum: 0,
      zoneInfoList: [],
      zoneCurrentPage: 1,
      zoneTotal: 0,
      armDialog: false,
      armNum: {
        successTitle: '布防正确',
        errorTitle: '布防错误',
        armSuccess: 0,
        armError: 0,
      },
      dialogTitle: '布防提示',
      importInfoDialog: false,
      troubleAddDialog: false,
      bypassDialog: false,
      bypassForm: {
        reason: '临时检查',
        detail: '',
      },
      reasonList: [
        {
          value: '临时检查',
          label: '临时检查',
        },
        {
          value: '发生误报再确认',
          label: '发生误报再确认',
        },
        {
          value: '网点忘记布防',
          label: '网点忘记布防',
        },
        {
          value: '异常故障',
          label: '异常故障',
        },
      ],
      associatedControlData: {},
      subsystemNum: [],
      // detectorRela: false,
      clearAlarm: false,
      zoneInfoStatus: true,
      activeIndex: '1',
      hostStatus: '',
      hostBtnDisabled: '',
      armStatus: '',
      setTitleInfo: '布撤防原因',
      setArea: false,
      setAreaFrom: {
        reason: '临时检查',
        detail: '',
      },
      // 报警主机选中数据收集
      selectHostArr: [],
      // 探测器选中数据收集
      selectZoneArr: [],
      // 子系统选中数据收集
      selectSubsystemArr: {},
      // 获取状态参数的数组
      getStatusArr: [],
      // 登录参数
      getLoginObj: {},
      keyId: 0,
      // 列表点击
      listClick: false,
      clickData: {},
      zoneArr: [],
      zoneObj: {
        devIp: '',
        devPort: '',
        subSystem: '',
        zoneList: [],
      },
      saveSubSystems: [],
      tData: [],
      styleObject: {
        color: 'red',
      },
      thisRela: {},
      orgId: '',
      queryTreeId: '',
      // disOrg: true, // 重点部位搜索框
      statusNewArr: [], // 数据库存状态
      getStatusParmarArr: [], // 多个主机的状态
      getStatusParmarObj: {
        id: '',
        powerState: '',
        subSystemList: [],
      },
      // 单个主机的状态
      ajaxAs: [],
      timer: null,
      clickOrg:false
    }
  },
  mixins: [publicData],
  computed: {
    ...mapState({
      alarmHostList: ({ alarm }) => alarm.alarmHostList,
    }),
    ...mapGetters([]),
  },
  created() {
    this.stateNum()
    // 获取报警主机列表
    this.getAlarmHostManageList({
      deviceType: '电话报警主机,网络报警主机',
      pageSize: this.pageSize,
      pageNum: this.page,
      isRecursion: 0,
    })
  },
  mounted() {
    // 定时刷新状态——-不刷新列表——————————————————————————暂用定时器————————————————————start
    this.timer = setInterval(() => {
      if (this.listMode) {
        let obj = {}
        if (this.clickOrg) {
          obj = {
            deviceType: '电话报警主机,网络报警主机',
            pageSize: 25,
            pageNum: 1,
            locationId: this.queryTreeId,
          }
        } else {
          obj = {
            deviceType: '电话报警主机,网络报警主机',
            pageSize: this.pageSize,
            pageNum: this.page,
            locationId: this.orgId,
            name: this.devName,
            defenseState: this.armValue,
            status: this.onlineValue,
            electricState: this.mainValue,
          }
        }
        this.getalrmHostListQuery(obj).then((res) => {
          // this.tableData = res.data.data.results
          let arryData = res.data && res.data.results
          // this.tableData=arryData
          if (arryData && arryData.length == 0) return
          if (arryData && arryData.length > 0) {
            arryData.map((item, index) => {
              this.tableData[index].status = item.status === 2 ? '在线' : '离线'
              this.tableData[index].defenseState =
                item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
              this.tableData[index].electricState =
                item.electricState === 1 ? '异常' : item.electricState === 3 ? '正常' : '未知'
              this.tableData[index].subsystemNo = item.subSystemList ? item.subSystemList.length : 0
            })
            if (arryData[0].subSystemList && arryData[0].subSystemList.length > 0) {
              let paramsId = ''
              if ((this.clickData && this.clickData.id) || this.multipleSelection.length > 0) {
                paramsId = this.clickData.id || this.multipleSelection[0].id
              } else {
                paramsId = arryData[0].id
              }
              this.getHostSubsystem({ hostId: paramsId }).then((res) => {
                if (res.data.results && res.data.results.length > 0) {
                  let subsystemData = res.data.results
                  // 子系统的布撤防状态显示
                  this.hostStatus =
                    subsystemData[0].defenseState === 1 ? '撤防' : subsystemData[0].defenseState === 3 ? '布防' : '未知'
                  // 防区状态显示
                  subsystemData[0].detectors &&
                    subsystemData[0].detectors.map((item, index) => {
                      this.zoneInfoList[index].bypassState =
                        item.bypassState === 3 ? '旁路' : item.bypassState === 2 ? '旁路恢复' : '未知'
                      this.zoneInfoList[index].status =
                        item.status === 2 ? '正常' : item.status === 3 ? '故障' : item.status === 4 ? '报警' : '未知'
                    })
                }
              })
            } else {
              this.getDetectorList({ hostId: arryData[0].id, isMain: 'T' }).then((res) => {
                if (res.data.results && res.data.results.length > 0) {
                  let zoneData = res.data.results
                  if (zoneData && zoneData.length > 0) {
                    this.zoneInfoStatus = true
                    zoneData &&
                      zoneData.map((item) => {
                        this.zoneInfoList[index].bypassState =
                          item.bypassState === 3 ? '旁路' : item.bypassState === 2 ? '旁路恢复' : '未知'
                        this.zoneInfoList[index].status =
                          item.status === 2 ? '正常' : item.status === 3 ? '故障' : item.status === 4 ? '报警' : '未知'
                      })
                  }
                }
              })
            }
          }
        })   
      } else if (!this.listMode && this.controlStatus) {
        this.$refs.HostPanelModeRef.realTimeDel({
          deviceType: '电话报警主机,网络报警主机',
          pageSize: this.pageSize,
          pageNum: this.page,
          locationId: this.orgId,
          name: this.devName,
          defenseState: this.armValue,
          status: this.onlineValue,
          electricState: this.mainValue,
        })
      }
    }, 6000)
    // ------------------------------定时器结束--------------------------------------------------------
  },
  watch: {
    listMode: {
      deep: true,
      handler(newValue) {
        this.getAlarmHostManageList({
          deviceType: '电话报警主机,网络报警主机',
          pageSize: this.pageSize,
          pageNum: this.page,
          isRecursion: 0,
        })
      },
    },
    linkStatus: {
      handler(newValue) {
        if (newValue) {
          clearInterval(this.timer)
          this.timer = null
        }
      },
    },
    initId: {
      deep: true,
      handler(newValue) {
        this.initId = newValue
      },
    },
    // tableData: {
    //   deep: true,
    //   handler(newValue) {
    //     if (newValue && newValue.length > 0) {
    //       if (newValue[0].subSystemList && newValue[0].subSystemList.length > 0) {
    //         this.getHostSubsystemList(newValue[0].id)
    //       } else {
    //         this.getDetector(newValue[0].id)
    //       }
    //     } else {
    //       this.zoneInfoList = []
    //     }
    //   },
    // },
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'getAlarmHostManage',
      'getHostSubsystem',
      'getDetectorList',
      'changeDefendn',
      'login',
      'changeBypass',
      'changePass',
      'changeUndefendn',
      'clearAlarmFn',
      'getStatus',
      'getHostBind',
      'getLocationList',
      'getOnlinelist',
      'getalrmHostListQuery',
      'setHostZoneStatus',
      'getalrmHostListState',
    ]),

    // 侧边栏伸缩
    naveMenuClick() {
      this.naveMenu = !this.naveMenu
    },
    // 登录getLoginObj
    // loginLine(obj) {
    //   this.login(obj).then((res) => {})
    // },
    // 获取登录参数
    //   let loginObj = {
    //     devIp: arryData[index].ip,
    //     devPort: arryData[index].port,
    //     username: arryData[index].userName,
    //     // passwd: String(arryData[0].password),
    //     passwd: 'test-123',
    //     vendor: 'HIKVISION',
    //     devType: 'AlarmHost',
    //     devBaseType: 'AlarmHost',
    //     connMode: 'active',
    //     version: '1',
    //     daServerId: arryData[index].service,
    //   }
    //   this.loginLine(loginObj)
    // 统计状态
    stateNum() {
      this.getalrmHostListState().then((res) => {
        // this.armed = res.data.states.defense
        // this.disarm = res.data.states.unDefense
        this.armed = res.data.states.unDefense
        this.disarm = res.data.states.defense
        this.offline = res.data.states.offline
        this.total = res.data.states.total
        this.hostNo = res.data.states.total
      })
    },
    // 重点关注
    importInfoDialogBtn() {
      if (this.multipleSelection.length !== 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择一条数据',
        })
        return
      }
      this.importInfoDialog = true
      this.getLocationList({ locationId: this.multipleSelection[0].locationId }).then((res) => {
        this.importInfoList.forEach((item) => {
          for (let i in res.data) {
            if (item.mark === i) {
              item.info = res.data[i]
            }
          }
          if (item.mark === 'orgName') {
            item.info = res.data.orgData.name
          }
          if (item.mark === 'status') {
            item.info =
              res.data.status === 1
                ? '正常'
                : res.data.status === 2
                ? '已撤销'
                : res.data.status === 3
                ? '已合并'
                : '临时营业'
          }
        })
      })
    },
    // 报警主机列表获取
    getAlarmHostManageList(obj) {
      this.getAlarmHostManage(obj)
        .then((res) => {
          this.tableData = res.data.data.results
          let arryData = res.data.data.results
          arryData &&
            arryData.map((item, index) => {
              item.status = item.status === 2 ? '在线' : '离线'
              item.defenseState = item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
              item.electricState = item.electricState === 1 ? '异常' : item.electricState === 3 ? '正常' : '未知'
              item.subsystemNo = item.subSystemList ? item.subSystemList.length : 0
            })
          if (arryData && arryData.length > 0) {
            if (arryData[0].subSystemList && arryData[0].subSystemList.length > 0) {
              this.getHostSubsystemList(arryData[0].id)
            } else if (arryData[0].detector && arryData[0].detector.length > 0) {
              this.getDetector(arryData[0].id)
            } else {
              this.zoneInfoList = []
              this.zoneNum = 0
            }
          }
          this.tableData = arryData
          console.log(this.tableData, '报警主机列表')
          if (JSON.stringify(this.clickData) === '{}') {
            if (this.tableData && this.tableData.length > 0) {
              this.thisRela = this.tableData[0]
            }
          } else {
            this.thisRela = this.clickData
          }
          this.total = res.data.data.page.length
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 报警主机-子系统获取
    getHostSubsystemList(id) {
      this.getHostSubsystem({ hostId: id })
        .then(async (res) => {
          let arryData = res.data.results
          console.log(res.data, '子系统获取')
          this.subsystemNum = arryData
          this.zoneInfoStatus = false
          // 子系统的布撤防状态显示
          this.hostStatus = arryData[0].defenseState === 1 ? '撤防' : arryData[0].defenseState === 3 ? '布防' : '未知'
          // 防区状态显示
          arryData[0].detectors &&
            arryData[0].detectors.map((item) => {
              item.bypassState = item.bypassState === 3 ? '旁路' : item.bypassState === 2 ? '旁路恢复' : '未知'
              item.status =
                item.status === 2 ? '正常' : item.status === 3 ? '故障' : item.status === 4 ? '报警' : '未知'
            })
          this.zoneInfoList = arryData[0].detectors
          if (arryData && arryData.length > 0) {
            if (arryData[0].detectors) {
              this.zoneNum = arryData[0].detectors.length
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 报警主机-探测器获取
    getDetector(id) {
      this.getDetectorList({ hostId: id, isMain: 'T' })
        .then((res) => {
          console.log(res, '探测器获取')
          let arryData = res.data.results
          if (arryData && arryData.length > 0) {
            this.zoneNum = arryData.length
            this.zoneInfoStatus = true
            arryData &&
              arryData.map((item) => {
                item.bypassState = item.bypassState === 3 ? '旁路' : item.bypassState === 2 ? '旁路恢复' : '未知'
                item.status =
                  item.status === 2 ? '正常' : item.status === 3 ? '故障' : item.status === 4 ? '报警' : '未知'
              })
          }
          this.zoneInfoList = arryData
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 报警控制主机筛选
    hostNumClick() {
      this.selectList({
        deviceType: '电话报警主机,网络报警主机',
        pageNum: this.page,
        pageSize: this.pageSize,
      })
    },
    // 布防数量筛选
    armClick() {
      this.selectList({
        deviceType: '电话报警主机,网络报警主机',
        pageNum: this.page,
        pageSize: this.pageSize,
        defenseState: 3,
      })
    },
    // 撤防数量筛选
    disarmClick() {
      this.selectList({
        deviceType: '电话报警主机,网络报警主机',
        pageNum: this.page,
        pageSize: this.pageSize,
        defenseState: 1,
      })
    },
    // 离线数量筛选
    offlineClick() {
      this.selectList({
        deviceType: '电话报警主机,网络报警主机',
        pageNum: this.page,
        pageSize: this.pageSize,
        status: 1,
      })
    },
    selectList(obj) {
      this.getalrmHostListQuery(obj).then((res) => {
        if (res.code === 0) {
          this.$messageSuccess('查询成功!')
        } else {
          this.$messageError('查询失败')
        }
        this.tableData = res.data.results
        // this.total = this.tableData.length
        this.tableData &&
          this.tableData.map((item) => {
            item.status = item.status === 2 ? '在线' : '离线'
            item.defenseState = item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
            item.electricState = item.electricState === 1 ? '异常' : item.electricState === 3 ? '正常' : '未知'
          })
      })
    },
    // 刷新
    refreshClick(val) {
      if (val) {
        this.getAlarmHostManageList({
          deviceType: '电话报警主机,网络报警主机',
          pageSize: this.pageSize,
          pageNum: this.page,
        })
      } else {
        this.$refs.HostPanelModeRef.handleCurrentChange(1)
      }
      this.resetClick()
    },
    // 机构树刷新列表
    orgChange(obj) {
      this.queryTreeId = obj.locationId
      this.clickOrg = true
      obj.deviceType = '电话报警主机,网络报警主机'
      obj.pageSize = this.pageSize
      obj.pageNum = 1
      this.getAlarmHostManageList(obj)
    },
    // 报警主机列表行点击事件
    tableRowClick(row) {
      console.log(row)
      this.listClick = true
      this.clickData = row
      this.thisRela = row
      if (row.subSystemList && row.subSystemList.length > 0) {
        // 有子系统
        this.zoneInfoStatus = false
        this.getHostSubsystemList(row.id)
        this.subsystemNum = row.subSystemList // 子系统
        // I don't know what I wrote, but I dare not delete it----start
        // this.selectSubsystemArr.devIp = row.ip
        // this.selectSubsystemArr.devPort = row.port
        // // this.selectSubsystemArr.subSystems = this.getserialNumber(row)
        // this.saveSubSystems = this.getserialNumber(row)
        // this.selectSubsystemArr.subSystem = [this.saveSubSystems[0].subSystem]
        // ---------------end
      } else {
        // 没有子系统
        this.zoneInfoStatus = true
        // this.zoneNum = row.detectorNo // 防区数
        this.getDetector(row.id)
      }
    },
    // 获取子系统和探测器序列号
    getserialNumber(row) {
      let arr = []
      if (row.subSystemList && row.subSystemList.length > 0) {
        row.subSystemList.map((item) => {
          let obj = {
            subSystem: item.serialNumber,
            zoneList: [],
          }
          if (item.detector && item.detector.length > 0) {
            item.detector.map((itemDet) => {
              obj.zoneList.push(itemDet.serialNumber)
            })
          }
          arr.push(obj)
        })
      }
      return arr
    },
    // 报警主机列表复选框选中
    hostSelectionChange(val) {
      console.log(val, '****')
      this.multipleSelection = val
      this.clickData = val[val.length - 1]
      if (val && val.length > 0) {
        if (val[val.length - 1].subSystemList && val[val.length - 1].subSystemList.length > 0) {
          // 有子系统
          this.zoneInfoStatus = false
          this.getHostSubsystemList(val[val.length - 1].id)
          this.subsystemNum = val[val.length - 1].subSystemList // 子系统
        } else {
          // 没有子系统
          this.zoneInfoStatus = true
          this.zoneNum = val[val.length - 1].detectorNo // 防区数
          this.getDetector(val[val.length - 1].id)
        }
      }
      this.selectHostArr.splice(0, this.selectHostArr.length)
      val.map((item) => {
        // idArr.push(item.id)
        let subsysArr = []
        if (item.subSystemList && item.subSystemList.length > 0) {
          for (let i = 0; i < item.subSystemList.length; i++) {
            let ser = item.subSystemList[i].serialNumber
            subsysArr.push(ser)
          }
        } else if (item.detector && item.detector.length > 0) {
          //   for (let i = 0; i < item.detector.length; i++) {
          //     let ser = item.detector[i].serialNumber
          //     subsysArr.push(ser)
          //   }
          subsysArr = [1]
        } else {
          subsysArr = [1]
        }
        this.selectHostArr.push({ devIp: item.ip, devPort: parseInt(item.port), subSystem: subsysArr })
      })
      // 报警主机关联配置查询
      //   console.log(idArr, 'id')
      //   this.getHostBind({ hostId: idArr })
      //     .then(res => {
      //       console.log(res.data, '报警主机关联配置查询')
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
    },
    //  显示子系统的判断
    checkedSubOrg(val) {
      this.getAlarmHostManageList({
        deviceType: '电话报警主机,网络报警主机',
        pageSize: this.pageSize,
        pageNum: this.page,
        isRecursion: val ? 1 : 0,
      })
    },
    // 防区复选框选择
    zoneSelectionChange(val) {
      console.log(val, '探测器选中')
      this.zoneSelectionList = val
    },
    // 切换面板或者列表模式
    modeSelectClick(data) {
      console.log(data, '切换列表~面板模式')
      if (data) {
        this.modeInfo = {
          info: '切换面板模式',
          index: 0,
        }
        this.listMode = true
      } else {
        this.modeInfo = {
          info: '切换列表模式',
          index: 1,
        }
        this.listMode = false
      }
      this.resetClick()
    },
    // 封装获取状态参数的方法
    getStatusParmar() {
      let hostLists = [] // 状态参数
      this.ajaxAs = []
      this.getStatusParmarArr = []
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.multipleSelection.forEach((item, index) => {
          // this.getStatusParmarObj.id = this.multipleSelection[index].id
          let hostObj = {
            devIp: item.ip,
            devPort: item.port,
            subSystems: [],
          }
          if (item.subSystemList && item.subSystemList.length > 0) {
            item.subSystemList &&
              item.subSystemList.map((itemSub) => {
                let subObj = {
                  zoneList: [],
                  subSystem: itemSub.serialNumber,
                }
                itemSub.detector &&
                  itemSub.detector.map((itemDet) => {
                    subObj.zoneList.push(itemDet.serialNumber)
                  })
                hostObj.subSystems.push(subObj)
              })
          } else if (item.detector && item.detector.length) {
            let subObj = {
              zoneList: [],
              subSystem: 1,
            }
            item.detector &&
              item.detector.map((itemDet) => {
                subObj.zoneList.push(itemDet.serialNumber)
              })
            hostObj.subSystems.push(subObj)
          } else {
            let subObj = {
              zoneList: [],
              subSystem: 1,
            }
            item.detector &&
              item.detector.map((itemDet) => {
                subObj.zoneList.push(itemDet.serialNumber)
              })
            hostObj.subSystems.push(subObj)
          }
          this.ajaxAs.push(this.getStatus(hostObj))
          hostLists.push(hostObj)
          // this.getHostSubsystemList(this.multipleSelection[0].id)
        })
      } else {
        if (!this.clickData.id) {
          this.getStatusParmarObj.id = this.tableData[0].id
          let hostObj = {
            devIp: this.tableData[0].ip,
            devPort: this.tableData[0].port,
            subSystems: [],
          }
          if (this.tableData[0].subSystemList && this.tableData[0].subSystemList.length > 0) {
            this.tableData[0].subSystemList &&
              this.tableData[0].subSystemList.map((itemSub) => {
                let subObj = {
                  zoneList: [],
                  subSystem: itemSub.serialNumber,
                }
                itemSub.detector &&
                  itemSub.detector.map((itemDet) => {
                    subObj.zoneList.push(itemDet.serialNumber)
                  })
                hostObj.subSystems.push(subObj)
              })
          }
          if (this.tableData[0].detector && this.tableData[0].detector.length) {
            this.tableData[0].detector &&
              this.tableData[0].detector.map((itemDet) => {
                let subObj = {
                  zoneList: [],
                  subSystem: 1,
                }
                subObj.zoneList.push(itemDet.serialNumber)
                hostObj.subSystems.push(subObj)
              })
          }
          this.ajaxAs.push(this.getStatus(hostObj))
          hostLists.push(hostObj)
          //  this.getHostSubsystemList(this.tableData[0].id)
        } else {
          this.getStatusParmarObj.id = this.clickData.id
          let hostObj = {
            devIp: this.clickData.ip,
            devPort: this.clickData.port,
            subSystems: [],
          }
          if (this.clickData.subSystemList && this.clickData.subSystemList.length > 0) {
            this.clickData.subSystemList &&
              this.clickData.subSystemList.map((itemSub) => {
                let subObj = {
                  zoneList: [],
                  subSystem: itemSub.serialNumber,
                }
                itemSub.detector &&
                  itemSub.detector.map((itemDet) => {
                    subObj.zoneList.push(itemDet.serialNumber)
                  })
                hostObj.subSystems.push(subObj)
              })
          }
          if (this.clickData.detector && this.clickData.detector.length) {
            this.clickData.detector &&
              this.clickData.detector.map((itemDet) => {
                let subObj = {
                  zoneList: [],
                  subSystem: 1,
                }
                subObj.zoneList.push(itemDet.serialNumber)
                hostObj.subSystems.push(subObj)
              })
          }
          this.ajaxAs.push(this.getStatus(hostObj))
          hostLists.push(hostObj)
          // this.getHostSubsystemList(this.clickData.id)
        }
      }
    },
    // 报警主机布撤防
    armSetClick(data) {
      if (data === 'arm') {
        if (this.multipleSelection.length < 1) {
          this.$notify.warning({
            title: '警告',
            message: '请至少选择一条',
          })
          return
        }
        this.changeDefendn(this.selectHostArr)
          .then(async (res) => {
            let arr = []
            this.getStatusParmar()
            let resa = await Promise.all(this.ajaxAs)
            resa.map((item, index) => {
              if (item.code == 0) {
                if (this.multipleSelection && this.multipleSelection.length > 0) {
                  this.getStatusParmarObj.id = this.multipleSelection[index].id
                }
                if (item.data && item.data.results) {
                  this.getStatusParmarObj.powerState = item.data.results.powerState
                  this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
                }
              }
              arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
              let data = item.data && item.data.results && item.data.results.subSystemList
              // data = JSON.parse(JSON.stringify(data))
              if (data && data.length > 0) {
                // --子系统状态
                data.map((item, index) => {
                  this.hostStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
                  this.hostBtnDisabled = this.hostStatus === '布防'
                })
                // --主机状态
                let stat = data.every((xx) => {
                  return xx.subStatus === 'arm'
                })
                this.multipleSelection[index]['defenseState'] = stat ? '布防' : '撤防'
                // this.multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
                // --防区状态
                if (this.multipleSelection && this.multipleSelection.length === 1) {
                  if (data[0].zoneList && data[0].zoneList.length > 0) {
                    for (var i = 0; i < data[0].zoneList.length; i++) {
                      this.$set(
                        this.zoneInfoList[i],
                        'status',
                        data[0].zoneList[i].working === 'normal'
                          ? '正常'
                          : data[0].zoneList[i].working === 'warm'
                          ? '报警'
                          : data[0].zoneList[i].working === 'fault'
                          ? '故障'
                          : '未知'
                      )
                      this.$set(
                        this.zoneInfoList[i],
                        'bypassState',
                        data[0].zoneList[i].status === 'bypass'
                          ? '旁路'
                          : data[0].zoneList[i].status === 'pass'
                          ? '旁路恢复'
                          : '未知'
                      )
                    }
                  }
                }
              }
            })
            let b = await this.setHostZoneStatus(arr)
            this.armDialog = true
            this.armNum.armSuccess = res.data.successMount
            this.armNum.armError = res.data.errorMount
            this.armNum.successTitle = '布防正确'
            this.armNum.errorTitle = '布防错误'
            this.dialogTitle = '布防提示'
            let d = await this.stateNum()
            // let c = await this.getAlarmHostManageList({
            //   deviceType: '电话报警主机,网络报警主机',
            //   pageSize: this.pageSize,
            //   pageNum: this.page,
            //   isRecursion: 0,
            // })
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '设备异常',
            })
          })
      } else if (data === 'disarm') {
        if (this.multipleSelection.length < 1) {
          this.$notify.warning({
            title: '警告',
            message: '请至少选择一条',
          })
          return
        }
        // if (!this.listMode) {
        //   this.$refs.HostPanelModeRef.getAlarmHostManageList({
        //     deviceType: '电话报警主机,网络报警主机',
        //     pageSize: this.pageSize,
        //     pageNum: this.page,
        //   })
        // }
        this.changeUndefendn(this.selectHostArr)
          .then(async (res) => {
            let arr = []
            this.getStatusParmar()
            let resa = await Promise.all(this.ajaxAs)
            resa.map((item, index) => {
              if (item.code == 0) {
                if (this.multipleSelection && this.multipleSelection.length > 0) {
                  this.getStatusParmarObj.id = this.multipleSelection[index].id
                }
                if (item.data && item.data.results) {
                  this.getStatusParmarObj.powerState = item.data.results.powerState
                  this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
                }
              }
              arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
              let data = item.data && item.data.results && item.data.results.subSystemList
              //  data = JSON.parse(JSON.stringify(data))
              if (data && data.length > 0) {
                // --子系统状态
                data.map((item, index) => {
                  this.hostStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
                  this.hostBtnDisabled = this.hostStatus === '布防'
                })
                // --主机状态
                let stat = data.every((xx) => {
                  return xx.subStatus === 'arm'
                })
                this.multipleSelection[index]['defenseState'] = stat ? '布防' : '撤防'
                // this.multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
                // --防区状态
                if (this.multipleSelection && this.multipleSelection.length === 1) {
                  if (data[0].zoneList && data[0].zoneList.length > 0) {
                    for (var i = 0; i < data[0].zoneList.length; i++) {
                      this.$set(
                        this.zoneInfoList[i],
                        'status',
                        data[0].zoneList[i].working === 'normal'
                          ? '正常'
                          : data[0].zoneList[i].working === 'warm'
                          ? '报警'
                          : data[0].zoneList[i].working === 'fault'
                          ? '故障'
                          : '未知'
                      )
                      this.$set(
                        this.zoneInfoList[i],
                        'bypassState',
                        data[0].zoneList[i].status === 'bypass'
                          ? '旁路'
                          : data[0].zoneList[i].status === 'pass'
                          ? '旁路恢复'
                          : '未知'
                      )
                    }
                  }
                }
              }
            })
            let b = await this.setHostZoneStatus(arr)
            this.armDialog = true
            this.armNum.armSuccess = res.data.successMount
            this.armNum.armError = res.data.errorMount
            this.armNum.successTitle = '撤防正确'
            this.armNum.errorTitle = '撤防错误'
            this.dialogTitle = '撤防提示'
            let d = await this.stateNum()
            // let c = await this.getAlarmHostManageList({
            //   deviceType: '电话报警主机,网络报警主机',
            //   pageSize: this.pageSize,
            //   pageNum: this.page,
            //   isRecursion: 0,
            // })
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '设备异常',
            })
          })
      } else {
        // 旁路
        if (this.zoneSelectionList.length < 1) {
          this.$notify.warning({
            title: '警告',
            message: '请至少选择一条',
          })
          return
        }
        this.zoneObj.zoneList = []
        // 点击报警主机旁路/撤旁
        if (this.clickData.id) {
          if (this.clickData.subSystemList && this.clickData.subSystemList.length > 0) {
            this.zoneObj.subSystem = this.clickData.subSystemList[0].serialNumber
            if (this.clickData.subSystemList[0].detector && this.clickData.subSystemList[0].detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          } else {
            this.zoneObj.subSystem = 1
            if (this.clickData.detector && this.clickData.detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
          this.zoneObj.devIp = this.clickData.ip
          this.zoneObj.devPort = Number(this.clickData.port)
          this.zoneArr.push(this.zoneObj)
        } else {
          // 初始化第一条的旁路/撤旁
          this.zoneObj.devIp = this.tableData[0].ip
          this.zoneObj.devPort = Number(this.tableData[0].port)
          // 有子系统
          if (this.tableData[0].subSystemList && this.tableData[0].subSystemList.length > 0) {
            this.zoneObj.subSystem = this.tableData[0].subSystemList[0].serialNumber
            if (this.tableData[0].subSystemList[0].detector && this.tableData[0].subSystemList[0].detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          } else {
            // 没有子系统
            this.zoneObj.subSystem = 1
            if (this.tableData[0].detector && this.tableData[0].detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
          this.zoneArr.push(this.zoneObj)
        }
        // this.changeBypass({
        //   devIp: '10.1.7.10',
        //   devPort: 8000,
        //   subSystem: 1,
        //   zoneList: [1, 2, 3]
        // })
        this.changeBypass(this.zoneObj)
          .then(async (res) => {
            let arr = []
            this.getStatusParmar()
            let resa = await Promise.all(this.ajaxAs)
            resa.map((item, index) => {
              if (item.data.code === '0') {
                // this.getStatusParmarObj.id = this.multipleSelection[index].id
                this.getStatusParmarObj.powerState = item.data.results.powerState
                this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
              }
              arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
              let data = item.data && item.data.results && item.data.results.subSystemList
              data = JSON.parse(JSON.stringify(data))
              if (data && data.length > 0) {
                // --子系统状态
                // data.map((item, index) => {
                //   this.hostStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
                //   this.hostBtnDisabled = this.hostStatus === '布防'
                // })
                // // --主机状态
                // let stat = data.every((xx) => {
                //   return xx.subStatus === 'arm'
                // })
                // this.multipleSelection[index]['defenseState'] = stat ? '布防' : '撤防'
                // this.multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
                // --防区状态
                if (data[0].zoneList && data[0].zoneList.length > 0) {
                  for (var i = 0; i < data[0].zoneList.length; i++) {
                    this.$set(
                      this.zoneInfoList[i],
                      'status',
                      data[0].zoneList[i].working === 'normal'
                        ? '正常'
                        : data[0].zoneList[i].working === 'warm'
                        ? '报警'
                        : data[0].zoneList[i].working === 'fault'
                        ? '故障'
                        : '未知'
                    )
                    this.$set(
                      this.zoneInfoList[i],
                      'bypassState',
                      data[0].zoneList[i].status === 'bypass'
                        ? '旁路'
                        : data[0].zoneList[i].status === 'pass'
                        ? '旁路恢复'
                        : '未知'
                    )
                  }
                }
              }
            })
            let b = await this.setHostZoneStatus(arr)
            let successNo = 0
            let failNo = 0
            res.data.data.map((item) => {
              if (item.status === 'failed') {
                failNo += 1
              } else {
                successNo += 1
              }
            })
            this.armDialog = true
            this.armNum.armSuccess = successNo
            this.armNum.armError = failNo
            this.armNum.successTitle = '旁路正确'
            this.armNum.errorTitle = '旁路错误'
            this.dialogTitle = '旁路提示'
            // this.getAlarmHostManageList({
            //   deviceType: '电话报警主机,网络报警主机',
            //   pageSize: this.pageSize,
            //   pageNum: this.page,
            //   isRecursion: 0,
            // })
            this.clickData = {}
          })
          .catch((err) => {
            console.log(err)
          })
      }

      if (!this.listMode) {
        this.$refs.HostPanelModeRef.clearCheck()
        this.$refs.HostPanelModeRef.getAlarmHostManageList({
          deviceType: '电话报警主机,网络报警主机',
          pageSize: this.pageSize,
          pageNum: this.page,
        })
      }
    },
    // 消警
    clearAlarmBtn() {
      this.zoneObj.zoneList = []
      // 点击报警主机
      if (JSON.stringify(this.clickData) !== '{}') {
        if (this.clickData.subSystemList && this.clickData.subSystemList.length > 0) {
          this.zoneObj.subSystem = this.clickData.subSystemList[0].serialNumber
          if (this.clickData.subSystemList[0].detector && this.clickData.subSystemList[0].detector.length > 0) {
            if (this.zoneSelectionList.length === 0) {
              this.tableData[0].subSystemList[0].detector.map((item) => {
                this.zoneObj.zoneList.push(item.serialNumber)
              })
            } else {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
        } else {
          this.zoneObj.subSystem = 1
          if (this.clickData.detector && this.clickData.detector.length > 0) {
            if (this.zoneSelectionList.length === 0) {
              this.tableData[0].subSystemList[0].detector.map((item) => {
                this.zoneObj.zoneList.push(item.serialNumber)
              })
            } else {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
        }
        this.zoneObj.devIp = this.clickData.ip
        this.zoneObj.devPort = Number(this.clickData.port)
        this.zoneArr.push(this.zoneObj)
      } else {
        // 初始化第一条的旁路/撤旁
        this.zoneObj.devIp = this.tableData[0].ip
        this.zoneObj.devPort = Number(this.tableData[0].port)
        if (this.tableData[0].subSystemList && this.tableData[0].subSystemList.length > 0) {
          this.zoneObj.subSystem = this.tableData[0].subSystemList[0].serialNumber
          if (this.tableData[0].subSystemList[0].detector && this.tableData[0].subSystemList[0].detector.length > 0) {
            if (this.zoneSelectionList.length === 0) {
              this.tableData[0].subSystemList[0].detector.map((item) => {
                this.zoneObj.zoneList.push(item.serialNumber)
              })
            } else {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
        } else {
          this.zoneObj.subSystem = 1
          if (this.tableData[0].detector && this.tableData[0].detector.length > 0) {
            if (this.zoneSelectionList.length === 0) {
              this.tableData[0].subSystemList[0].detector.map((item) => {
                this.zoneObj.zoneList.push(item.serialNumber)
              })
            } else {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
        }
        this.zoneArr.push(this.zoneObj)
      }

      this.clearAlarm = true
      //   this.clearAlarmFn({
      //     devIp: '10.1.7.10',
      //     devPort: 8000,
      //     subSystem: 1,
      //     zoneList: [1, 2, 3]
      //   })
      this.clearAlarmFn(this.zoneObj)
        .then( async(res) => {
          console.log(res)
           let arr = []
            this.getStatusParmar()
            let resa = await Promise.all(this.ajaxAs)
            resa.map((item, index) => {
              if (item.code == 0) {
                if (this.multipleSelection && this.multipleSelection.length > 0) {
                  this.getStatusParmarObj.id = this.multipleSelection[index].id
                }
                if (item.data && item.data.results) {
                  this.getStatusParmarObj.powerState = item.data.results.powerState
                  this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
                }
              }
              arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
              let data = item.data && item.data.results && item.data.results.subSystemList
              // data = JSON.parse(JSON.stringify(data))
              if (data && data.length > 0) {
                // --防区状态
                if (this.multipleSelection && this.multipleSelection.length === 1) {
                  if (data[0].zoneList && data[0].zoneList.length > 0) {
                    for (var i = 0; i < data[0].zoneList.length; i++) {
                      this.$set(
                        this.zoneInfoList[i],
                        'status',
                        data[0].zoneList[i].working === 'normal'
                          ? '正常'
                          : data[0].zoneList[i].working === 'warm'
                          ? '报警'
                          : data[0].zoneList[i].working === 'fault'
                          ? '故障'
                          : '未知'
                      )
                      this.$set(
                        this.zoneInfoList[i],
                        'bypassState',
                        data[0].zoneList[i].status === 'bypass'
                          ? '旁路'
                          : data[0].zoneList[i].status === 'pass'
                          ? '旁路恢复'
                          : '未知'
                      )
                    }
                  }
                }
              }
            })
            let b = await this.setHostZoneStatus(arr)
          this.clickData = {}
        })
        .catch((err) => {
          console.log(err)
        })
    },
    resetClick() {
      this.orgId = ''
      this.partValue = ''
      this.devName = ''
      this.locationId = ''
      this.mainValue = ''
      this.onlineValue = ''
      this.armValue = ''
      // this.disOrg = true
      this.clickOrg = false
    },
    // 回控
    backControlStatus(status, data) {
      if (status) {
        console.log(data, 'data状态')
        if (!data.hasSubSystem) {
          this.backControlData = data
        } else {
          this.getAlarmHostManage({ hostId: data.id }).then((res) => {
            console.log(res.data.data.results[0], 'res.data.data.results[0]')
            this.backControlData = res.data.data.results[0]
          })
        }
        this.controlStatus = false
        this.TrueHostId = data.id
      } else {
        this.controlStatus = true
      }
    },
    // 回控切回面板模式
    selectMode(ststus) {
      if (ststus) {
        this.modeInfo = {
          info: '切换列表模式',
          index: 1,
        }
        this.listMode = false
        this.controlStatus = true
      }
    },
    treeFn(obj) {
      //   if (obj.orgId || obj.locationId) {
      //     this.disOrg = false
      //   } else {
      //     this.disOrg = true
      //   }
      this.controlStatus = true
    },
    // 防区关联控制按钮
    handleLinkBtn(index, row) {
      this.ishostZone = index
      this.linkStatus = true
      this.associatedControlData = row
    },
    // 报警主机列表每页显示条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.handleCurrentChange(1)
    },
    // 报警主机列表分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.zoneArr = []
      this.getAlarmHostManageList({
        deviceType: '电话报警主机,网络报警主机',
        pageSize: this.pageSize,
        pageNum: val,
        locationId: this.orgId,
        name: this.devName,
        defenseState: this.armValue,
        status: this.onlineValue,
        electricState: this.mainValue,
      })
    },
    // 旁路恢复按钮
    bypassClick() {
      this.armStatus = ''
      if (this.zoneSelectionList.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请至少选择一条',
        })
        return
      }
      this.setTitleInfo = '旁路恢复原因'
      this.bypassDialog = true
    },
    // 布撤防
    setAreaClick(data) {
      this.bypassDialog = true
      this.armStatus = data
    },
    // 子系统确认布撤防和旁路恢复
    async restoreSure() {
      this.bypassDialog = false
      if (!this.clickData.id) {
        this.selectSubsystemArr.devIp = this.tableData[0].ip
        this.selectSubsystemArr.devPort = this.tableData[0].port
        this.saveSubSystems = this.getserialNumber(this.tableData[0])
        this.selectSubsystemArr.subSystem = [this.saveSubSystems[0].subSystem]
      } else {
        this.selectSubsystemArr.devIp = this.clickData.ip
        this.selectSubsystemArr.devPort = this.clickData.port
        this.saveSubSystems = this.getserialNumber(this.clickData)
        this.selectSubsystemArr.subSystem = [this.saveSubSystems[0].subSystem]
      }
      if (this.armStatus === 'arm') {
        let zonede = await this.changeDefendn(this.selectSubsystemArr)
        //   .then(async (res) => {
        await this.getStatusParmar()
        let arr = []
        let resa = await Promise.all(this.ajaxAs)
        resa.map((item, index) => {
          if (item.code == 0) {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
              this.getStatusParmarObj.id = this.multipleSelection[index].id
            }
            if (item.data && item.data.results) {
              this.getStatusParmarObj.powerState = item.data.results.powerState
              this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
            }
          }
          arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
          let data = item.data && item.data.results && item.data.results.subSystemList
          if (data && data.length > 0) {
            // --子系统状态
            data.map((item, index) => {
              this.hostStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
              this.hostBtnDisabled = this.hostStatus === '布防'
            })

            // --主机状态
            let stat = data.every((xx) => {
              return xx.subStatus === 'arm'
            })
            if (this.clickData.id) {
              this.clickData['defenseState'] = stat ? '布防' : '撤防'
            } else {
              this.tableData[0]['defenseState'] = stat ? '布防' : '撤防'
            }
            // --防区状态
            if (data[0].zoneList && data[0].zoneList.length > 0) {
              for (var i = 0; i < data[0].zoneList.length; i++) {
                this.$set(
                  this.zoneInfoList[i],
                  'status',
                  data[0].zoneList[i].working === 'normal'
                    ? '正常'
                    : data[0].zoneList[i].working === 'warm'
                    ? '报警'
                    : data[0].zoneList[i].working === 'fault'
                    ? '故障'
                    : '未知'
                )
                this.$set(
                  this.zoneInfoList[i],
                  'bypassState',
                  data[0].zoneList[i].status === 'bypass'
                    ? '旁路'
                    : data[0].zoneList[i].status === 'pass'
                    ? '旁路恢复'
                    : '未知'
                )
              }
            }
          }
        })
        let b = await this.setHostZoneStatus(arr)
        let d = await this.stateNum()
        // let c = await this.getAlarmHostManageList({
        //   deviceType: '电话报警主机,网络报警主机',
        //   pageSize: this.pageSize,
        //   pageNum: this.page,
        //   isRecursion: 0,
        // })
        if (zonede.data && zonede.data.code === '0' && zonede.data.results[0].status === 'succeed') {
          this.hostBtnDisabled = true
          this.$message({
            type: 'success',
            message: '布防成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: '布防失败',
          })
        }
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      } else if (this.armStatus === 'disarm') {
        let zoneun = await this.changeUndefendn(this.selectSubsystemArr)
        //   .then(async (res) => {
        await this.getStatusParmar()
        let arr = []
        let resa = await Promise.all(this.ajaxAs)
        resa.map((item, index) => {
          if (item.code == 0) {
            if (this.multipleSelection && this.multipleSelection.length > 0) {
              this.getStatusParmarObj.id = this.multipleSelection[index].id
            }
            if (item.data && item.data.results) {
              this.getStatusParmarObj.powerState = item.data.results.powerState
              this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
            }
          }
          arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
          let data = item.data && item.data.results && item.data.results.subSystemList
          if (data && data.length > 0) {
            // --子系统状态
            data.map((item, index) => {
              this.hostStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
              this.hostBtnDisabled = this.hostStatus === '布防'
            })
            // --主机状态
            let stat = data.every((xx) => {
              return xx.subStatus === 'arm'
            })
            if (this.clickData.id) {
              this.clickData['defenseState'] = stat ? '布防' : '撤防'
            } else {
              this.tableData[0]['defenseState'] = stat ? '布防' : '撤防'
            }
            // this.multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
            // --防区状态
            if (data[0].zoneList && data[0].zoneList.length > 0) {
              for (var i = 0; i < data[0].zoneList.length; i++) {
                this.$set(
                  this.zoneInfoList[i],
                  'status',
                  data[0].zoneList[i].working === 'normal'
                    ? '正常'
                    : data[0].zoneList[i].working === 'warm'
                    ? '报警'
                    : data[0].zoneList[i].working === 'fault'
                    ? '故障'
                    : '未知'
                )
                this.$set(
                  this.zoneInfoList[i],
                  'bypassState',
                  data[0].zoneList[i].status === 'bypass'
                    ? '旁路'
                    : data[0].zoneList[i].status === 'pass'
                    ? '旁路恢复'
                    : '未知'
                )
              }
            }
          }
        })
        let b = await this.setHostZoneStatus(arr)
        let d = await this.stateNum()
        if (zoneun.data && zoneun.data.code === '0' && zoneun.data.results[0].status === 'succeed') {
          this.hostBtnDisabled = false
          this.$message({
            type: 'success',
            message: '撤防成功',
          })
        } else {
          this.$message({
            type: 'error',
            message: '撤防失败',
          })
        }
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
        // this.getAlarmHostManageList({
        //   deviceType: '电话报警主机,网络报警主机',
        //   pageSize: this.pageSize,
        //   pageNum: this.page,
        //   isRecursion: 0,
        // })
      } else {
        // this.changePass({
        //   devIp: '10.1.7.10',
        //   devPort: 8000,
        //   subSystem: 1,
        //   zoneList: [1, 2, 3]
        // })
        this.zoneObj.zoneList = []
        // 点击报警主机旁路/撤旁
        if (this.clickData.id) {
          if (this.clickData.subSystemList && this.clickData.subSystemList.length > 0) {
            this.zoneObj.subSystem = this.clickData.subSystemList[0].serialNumber
            if (this.clickData.subSystemList[0].detector && this.clickData.subSystemList[0].detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          } else {
            this.zoneObj.subSystem = 1
            if (this.clickData.detector && this.clickData.detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
          this.zoneObj.devIp = this.clickData.ip
          this.zoneObj.devPort = Number(this.clickData.port)
          this.zoneArr.push(this.zoneObj)
        } else {
          // 初始化第一条的旁路/撤旁
          this.zoneObj.devIp = this.tableData[0].ip
          this.zoneObj.devPort = Number(this.tableData[0].port)
          if (this.tableData[0].subSystemList && this.tableData[0].subSystemList.length > 0) {
            this.zoneObj.subSystem = this.tableData[0].subSystemList[0].serialNumber
            if (this.tableData[0].subSystemList[0].detector && this.tableData[0].subSystemList[0].detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          } else {
            this.zoneObj.subSystem = 1
            if (this.tableData[0].detector && this.tableData[0].detector.length > 0) {
              let temp
              this.zoneSelectionList &&
                this.zoneSelectionList.map((item, index) => {
                  temp = this.zoneSelectionList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
          this.zoneArr.push(this.zoneObj)
        }
        this.changePass(this.zoneObj)
          .then(async (res) => {
            let arr = []
            this.getStatusParmar()
            let resa = await Promise.all(this.ajaxAs)
            resa.map((item, index) => {
              if (item.data.code === '0') {
                // this.getStatusParmarObj.id = this.multipleSelection[index].id
                this.getStatusParmarObj.powerState = item.data.results.powerState
                this.getStatusParmarObj.subSystemList = item.data.results.subSystemList
              }
              arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
              let data = item.data && item.data.results && item.data.results.subSystemList
              if (data && data.length > 0) {
                // --子系统状态
                // this.hostStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
                // this.hostBtnDisabled = this.hostStatus === '布防'
                // // --主机状态
                // let stat = data.every((xx) => {
                //   return xx.subStatus === 'arm'
                // })
                // this.multipleSelection[index]['defenseState'] = stat ? '布防' : '撤防'
                // this.multipleSelection = JSON.parse(JSON.stringify(this.multipleSelection))
                // --防区状态
                if (data[0].zoneList && data[0].zoneList.length > 0) {
                  for (var i = 0; i < data[0].zoneList.length; i++) {
                    this.$set(
                      this.zoneInfoList[i],
                      'status',
                      data[0].zoneList[i].working === 'normal'
                        ? '正常'
                        : data[0].zoneList[i].working === 'warm'
                        ? '报警'
                        : data[0].zoneList[i].working === 'fault'
                        ? '故障'
                        : '未知'
                    )
                    this.$set(
                      this.zoneInfoList[i],
                      'bypassState',
                      data[0].zoneList[i].status === 'bypass'
                        ? '旁路'
                        : data[0].zoneList[i].status === 'pass'
                        ? '旁路恢复'
                        : '未知'
                    )
                  }
                }
              }
            })
            let b = await this.setHostZoneStatus(arr)
            let successNo = 0
            let failNo = 0
            res.data.data.map((item) => {
              if (item.status === 'failed') {
                failNo += 1
              } else {
                successNo += 1
              }
            })
            this.armDialog = true
            this.armNum.armSuccess = successNo
            this.armNum.armError = failNo
            this.armNum.successTitle = '旁路恢复正确'
            this.armNum.errorTitle = '旁路恢复错误'
            this.dialogTitle = '旁路恢复提示'
            // this.handleCurrentChange(1)
            // this.getAlarmHostManageList({
            //   deviceType: '电话报警主机,网络报警主机',
            //   pageSize: this.pageSize,
            //   pageNum: this.page,
            //   isRecursion: 0,
            // })
            this.clickData = {}
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    // 子系统切换
    subSystemSelect(key, keyPath) {
      this.keyId = Number(key - 1)
      if (!this.clickData.id) {
        this.saveSubSystems = this.getserialNumber(this.tableData[0])
      } else {
        this.saveSubSystems = this.getserialNumber(this.clickData)
      }
      this.selectSubsystemArr.subSystem = [this.saveSubSystems[this.keyId].subSystem]
      this.zoneNum = this.subsystemNum[this.keyId].detectors.length
      this.zoneInfoList = this.subsystemNum[this.keyId].detectors
      this.hostStatus =
        this.subsystemNum[this.keyId].defenseState === 1
          ? '撤防'
          : this.subsystemNum[this.keyId] === 3
          ? '布防'
          : '未知'
      // 防区状态显示
      this.subsystemNum[this.keyId].detectors &&
        this.subsystemNum[this.keyId].detectors.map((item) => {
          item.bypassState = item.bypassState === 3 ? '旁路' : item.bypassState === 2 ? '旁路恢复' : '未知'
          item.status = item.status === 2 ? '正常' : item.status === 3 ? '故障' : item.status === 4 ? '报警' : '未知'
        })
    },
    // 关联控制关闭
    sureLinkClick(data) {
      this.linkStatus = data
    },
    // 重点部位机构树
    querySearch(type, value, callback) {
      const params = {
        type: 2,
        name: value,
        oId: this.queryTreeId ? this.queryTreeId : this.initId,
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
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      this.orgId = String(val.id)
      this.partValue = val.name
      this.name = val.name
    },
    // 查询
    queryHostList() {
        this.clickOrg = false
      let obj = {
        deviceType: '电话报警主机,网络报警主机',
        pageNum: this.page,
        pageSize: this.pageSize,
        locationId: this.orgId,
        name: this.devName,
        defenseState: this.armValue,
        status: this.onlineValue,
        electricState: this.mainValue,
      }
      console.log(obj, '查询的参数')
      if (!this.listMode) {
        this.$refs.HostPanelModeRef.query(obj)
        return
      }
      this.tableData = []
      this.getalrmHostListQuery(obj).then((res) => {
        if (JSON.stringify(res.data) !== '{}') {
          this.total = res.data.page.length
          this.tableData = res.data.results
          let arryData = res.data && res.data.results
          if (arryData && arryData.length > 0) {
            if (arryData[0].subSystemList && arryData[0].subSystemList.length > 0) {
              this.getHostSubsystemList(arryData[0].id)
            } else if (arryData[0].detector && arryData[0].detector.length > 0) {
              this.getDetector(arryData[0].id)
            } else {
              this.zoneInfoList = []
              this.zoneNum = 0
            }
          }
          arryData &&
            arryData.map((item, index) => {
              item.status = item.status === 2 ? '在线' : '离线'
              item.defenseState = item.defenseState === 1 ? '撤防' : item.defenseState === 3 ? '布防' : '未知'
              item.electricState = item.electricState === 1 ? '异常' : item.electricState === 3 ? '正常' : '未知'
              item.subsystemNo = item.subSystemList ? item.subSystemList.length : 0
            })
        } else {
          this.tableData = []
          this.zoneInfoList = []
          this.total = 0
        }
      })
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>

<style scoped lang="less">
@import '../../../../assets/elementModify.less';
.host-list-mode {
  height: 100%;
  font-size: 12px;
  .host-tree {
    height: 100%;
    margin-right: 10px;
  }
  .first_li {
    width: 2px;
    height: 12px;
    margin-top: 10px;
    background: rgba(45, 114, 211, 1);
    margin-right: 7px;
  }
  .host-header {
    margin-bottom: 10px;
    font-size: 18px;
  }
  .host-num {
    height: 45px;
    line-height: 32px;
    border-bottom: 1px solid #bcbcbc;
    .iconfont-ccb {
      font-size: 12px;
      margin-right: 5px;
    }
    li {
      float: left;
      font-size: 12px;
      font-family: Microsoft YaHei;
      margin-right: 6px;
      i {
        display: inline-block;
        width: 20px;
        cursor: pointer;
      }
    }
  }
  .host-table {
    height: 100%;
    margin-top: 10px;
    li {
      float: left;
      margin-right: 10px;
    }
    .table-select {
      margin-bottom: 10px;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      /deep/.el-input--mini .el-input__inner {
        height: 35px;
        line-height: 35px;
      }
      .select_size_small {
        width: 87px;
        height: 35px;
        background: rgba(51, 51, 51, 0);

        border-radius: 2px;
      }
      .input_size_small {
        width: 151px;
        height: 35px;
        background: rgba(51, 51, 51, 0);

        border-radius: 2px;
      }
      .table-select-btn {
        margin-left: 20px;
        button.el-button.el-button--primary.el-button--smalln {
          margin-right: 10px;
        }
      }
      .el-select,
      .el-input {
        margin-left: 10px;
      }
    }
    .host-armed-btn {
      margin-bottom: 19px;
    }
    .table-content {
      height: 350px;
      .el-pagination {
        margin-top: 10px;
        float: right;
      }
    }
    .prompt-info {
      text-align: center;
    }
  }
  .host-zone-info {
    margin-top: 30px;
    .zone-header {
      height: 20px;
      line-height: 20px;
      i {
        float: left;
        width: 5%;
      }
      .zone-header-line {
        float: right;
        width: 95%;
        border-top: 1px solid #bcbcbc;
        margin-top: 10px;
      }
    }
    .zone-set {
      line-height: 30px;
      ul {
        margin: 10px 0;
        overflow: hidden;
        li {
          float: left;
          margin-right: 6px;
        }
      }
    }
    .zone-table {
      height: 280px;
      .el-pagination {
        margin-top: 10px;
        float: right;
      }
    }
  }

  .dialog {
    .detector_dialog {
      /deep/.el-dialog__header {
        position: relative;
        background-color: #eee;
        padding: 8px 10px 8px;
        /deep/.el-dialog__headerbtn .el-dialog__close {
          position: absolute;
          top: -6px;
          right: 0px;
        }
      }
      /deep/.el-dialog__body {
        padding: 4px;
      }
    }
    .detector_main {
      display: flex;
      border: 1px solid #bcbcbc;

      .left-video {
        flex: 2;
        height: 500px;
        background-color: #bcbcbc;
      }
      .right-oper {
        flex: 1;
        border: 1px solid #bcbcbc;
        height: 500px;
        li {
          width: 95%;
          margin: 8px;
          height: 100px;
          border: 1px solid #bcbcbc;
          .icon {
            width: 18%;
            height: 100%;
            text-align: center;
            float: left;
            .iconfont-ccb {
              font-size: 40px;
              display: block;
              margin-top: 20px;
            }
          }
          .t1_btn {
            width: 80%;
            height: 100%;
            float: left;
            font-size: 12px;
            p {
              margin-top: 20px;
            }
            .btn {
              margin-top: 20px;
              /deep/.el-button {
                width: 50px;
                height: 28px;
              }
            }
          }
          /* 门禁关闭状态 */
          .close-door {
            float: left;
            width: 44px;
            height: 60px;
            margin: 19px 9px;
            border: 4px solid #666666;
            position: relative;
            .handle {
              height: 20px;
              border: 2px solid #666666;
              position: absolute;
              top: 50%;
              left: 26px;
              transform: translateY(-10px);
            }
          }
          /* 门禁异常状态 */
          .unusual-door {
            width: 30px;
            height: 30px;
            position: absolute;
            left: 0;
            bottom: 0;
            .icon {
              width: 30px;
              height: 30px;
              fill: currentColor;
              overflow: hidden;
            }
          }
        }
      }
    }
    .arm-dialog {
      text-align: center;
      i {
        font-size: 22px;
        float: left;
      }
      ul {
        float: left;
        li {
          float: left;
          margin: 0 20px;
        }
      }
    }
    .link-dialog {
      overflow: hidden;
      .link-left {
        float: left;
        width: 70%;
        .link-video {
          height: 500px;
          border: 1px solid #bcbcbc;
        }
        .link-info {
          margin-top: 15px;
          overflow: hidden;
          border: 1px solid #bcbcbc;
          p {
            padding: 20px 0 0 20px;
            font-weight: bold;
          }
          ul {
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
            li {
              float: left;
              width: 50%;
              margin-bottom: 10px;
              i {
                float: left;
                width: 200px;
              }
            }
          }
        }
      }
      .link-right {
        float: right;
        width: 30%;
        padding-left: 15px;
        .link-right-info {
          // height: 30px;
          // line-height: 30px;
          overflow: hidden;
          padding: 2px 0;
          border-bottom: 2px solid #bcbcbc;
          i {
            float: left;
            font-size: 22px;
            margin-right: 10px;
          }
          span {
            display: block;
            margin-bottom: 10px;
          }
        }
      }
    }
    .dialog-footer {
      span {
        float: left;
        line-height: 32px;
      }
    }
    .form-box {
      .form-top {
        width: 100%;
        text-align: center;
        margin-top: -20px;
        margin-bottom: 20px;
      }
      .form-content {
        // display: flex;
        width: 846px;
        height: 200px;
        padding: 10px;
        font-size: 12px;
        border: 9px solid #f7f2f1;
        /deep/.el-select > .el-input {
          width: 270px;
        }
        .left-form {
          float: left;
          width: 390px;
          margin-right: 14px;
        }
        .right-form {
          float: left;
          width: 390px;
        }
      }
      .form-footer {
        margin-top: 70px;
        text-align: center;
      }
    }
    .import-info {
      ul {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid #bcbcbc;
        border-left: 1px solid #bcbcbc;
        li {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 50%;
          float: left;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #bcbcbc;
          border-right: 1px solid #bcbcbc;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 226px;
            border-right: 1px solid #bcbcbc;
            padding: 0 8px;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.iconfont {
  font-size: 12px;
  margin-right: 2px;
}
.form-box {
  .left-form,
  .right-form {
    .el-form-item--mini.el-form-item {
      margin-bottom: 0;
    }
    label.el-form-item__label {
      // padding: 2px 0;
    }
    .el-form-item__label {
      // border: 1px solid #fff;
      // background: #f7f2f1;
    }
  }
}
.zone-header .el-menu {
  background-color: rgba(253, 253, 253, 1) !important;
}
.zone-header .el-menu--horizontal > .el-menu-item {
  height: 20px;
  line-height: 20px;
  background: #f2f2f2;
}
.zone-header .el-menu--horizontal > .el-menu-item.is-active {
  background-color: rgba(253, 253, 253, 1) !important;
}
.link-right .el-collapse-item__header {
  height: 24px;
  line-height: 24px;
  background: #f2f2f2;
}
.bcf_dialog .el-dialog__header {
  background: #f0efef;
}
.bcf_dialog .el-dialog__body {
  padding: 50px 40px;
  font-size: 16px;
}
.bcf_dialog .el-dialog__footer {
  padding: 20px;
}
</style>
