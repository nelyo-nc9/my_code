<template>
  <div class="host-list-mode">
    <div class="host-header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <i class="el-icon-location-outline"
           style="float:left;margin-right:6px;"></i>
        <el-breadcrumb-item>智慧安防</el-breadcrumb-item>
        <el-breadcrumb-item>报警主机管理</el-breadcrumb-item>
        <el-breadcrumb-item>电子围栏总线报警主机</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="host-content-main"
         v-if="controlStatus">
      <div class="host-num">
        <ul>
          <li>电子围栏总线报警主机：<i @click="hostNumClick">{{total}}</i></li>
          <li>布防：<i @click="armClick">{{armed}}</i></li>
          <li>撤防：<i @click="disarmClick">{{disarm}}</i></li>
          <li>离线：<i @click="offlineClick">{{offline}}</i></li>
        </ul>
      </div>
      <div class="host-armed-btn">
        <el-checkbox v-model="orgChecked" @change="checkedSubOrg">显示子机构资源</el-checkbox>
        <el-button type="primary"
                   size="small"

                   @click="armSetClick('arm')">布防</el-button>
        <el-button size="small"

                   @click="armSetClick('disarm')">撤防</el-button>
        <el-button class="part-info-btn"
                   size="small"

                   @click="importInfoDialogBtn">重点部位信息</el-button>
        <el-button size="small">故障报修</el-button>
        <el-button type="primary"
                   @click="modeSelectClick(modeInfo.index)"
                   size="small">{{modeInfo.info}}</el-button>
      </div>
      <div class="host-table">
        <div class="table-select">
          <ul>
            <li>
              重点部位
              <el-select v-model="partValue"
                         size="mini">
                <el-option v-for="item in partList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li>
              设备名称
              <el-input v-model="devName"
                        placeholder="请输入内容"
                        style="width: 150px"
                        size="mini"></el-input>
            </li>
            <li>
              布防状态
              <el-select v-model="armValue"
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
                         size="mini">
                <el-option v-for="item in onlineStatusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li>
              市电状态
              <el-select v-model="mainValue"
                         size="mini">
                <el-option v-for="item in mainStatusList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </li>
            <li class="table-select-btn">
              <el-button type="primary"
                         size="small">查询</el-button>
              <el-button size="small"
                         @click="resetClick">重置</el-button>
              <el-button size="small"
                         @click="refreshClick(listMode)">刷新</el-button>
            </li>
          </ul>
        </div>
        <div v-if="listMode"
             class="table-content">
          <el-table ref="multipleTable"
                    border
                    stripe
                    :data="tableData"
                    style="width: 100%"
                    height="260"
                    @selection-change="hostSelectionChange"
                    @row-click="tableRowClick">
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column v-for="(item,index) in tableHeader"
                             :key="index"
                             :prop="item.mark"
                             :label="item.label"></el-table-column>
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
          <ElectricPanelMode :alarmHostList="tableData"
                             @handleLinkBtn="handleLinkBtn"
                             @backControlStatus="backControlStatus"
                             v-if="tableData.length"></ElectricPanelMode>
          <div v-else
               class="prompt-info">暂无数据</div>
        </div>
      </div>
      <div class="host-zone-info"
           v-if="listMode">
        <div class="zone-header">
          <i>防区类型</i>
          <div class="zone-header-line"></div>
        </div>
        <div class="zone-set">
          <ul>
            <li>防区数：<i>{{zoneNum}}</i></li>
            <!-- <li>
              <el-button type="primary"
                         size="small"
                         @click="setAreaClick('arm')"
                         :disabled="this.multipleSelection.length!==1"
                        >布防</el-button>
            </li>
            <li>
              <el-button size="small"
                         @click="setAreaClick('disarm')"
                         :disabled="this.multipleSelection.length!==1"
                         >撤防</el-button>
            </li> -->
            <li>
              <el-button size="small"
                         type="primary"
                         @click="armSetClick('bypass')">旁路</el-button>
            </li>
            <li>
              <el-button size="small"
                         @click="bypassClick">旁路恢复</el-button>
            </li>
            <li>
              <el-button size="small"
                         type="danger"
                         @click="clearAlarm = true">清除</el-button>
            </li>
          </ul>
        </div>
        <div class="zone-table">
          <el-table ref="multipleTable"
                    border
                    stripe
                    :data="zoneInfoList"
                    style="width: 100%"
                    height="240"
                    @selection-change="hostSelectionChange">
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column prop="number"
                             label="序号"
                             width="55"></el-table-column>
            <el-table-column v-for="(item, index) in zoneInfoColumn"
                             :prop="item.mark"
                             :label="item.label"
                             :key="index"></el-table-column>
            <el-table-column prop="link"
                             label="关联控制">
              <template slot-scope="scope">
                <el-button @click.native.prevent="handleLinkBtn(scope.$index, scope.row)"
                           size="mini">关联控制</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="host-content-main"
         v-if="!controlStatus">
      <ElectrivBackControl :backData="backControlData"
                           @selectMode="selectMode"></ElectrivBackControl>
    </div>
    <div class="dialog">
      <!-- 布撤防提示框 -->
      <el-dialog :title='dialogTitle'
                 :visible.sync="armDialog"
                 width="20%">
        <div class="arm-dialog">
          <i class="el-icon-warning"></i>
          <ul>
            <li><span>{{armNum.successTitle}}：</span>{{armNum.armSuccess}}</li>
            <li><span>{{armNum.errorTitle}}：</span>{{armNum.armError}}</li>
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
                 width="40%">
        <div class="import-info">
          <ul>
            <li v-for="(item, index) in importInfoList"
                :key="index">
              <span>{{item.name}}</span>
              <span>{{item.info}}</span>
            </li>
          </ul>
        </div>
      </el-dialog>
      <!-- 布撤防和旁路设置弹出框 -->
      <el-dialog :title='setTitleInfo'
                 :visible.sync="bypassDialog"
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
      <el-dialog title='清除报警提示'
                 :visible.sync="clearAlarm"
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
                     :associatedControlData="associatedControlData"
                     @sureClick="sureLinkClick"></LinkControl>
      </div>
    </div>
  </div>
</template>

<script>
import publicData from '../publicData'
import ElectricPanelMode from './ElectricPanelMode'
import ElectrivBackControl from './ElectrivBackControl'
import LinkControl from '../linkControl/LinkControl'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  components: {
    ElectricPanelMode,
    ElectrivBackControl,
    LinkControl
  },
  data() {
    return {
      linkStatus: false,
      listMode: true,
      modeInfo: {
        info: '切换面板模式',
        index: 0
      },
      associatedControlData: {},
      tableData: [],
      total: 0,
      multipleSelection: [],
      menuList: ['报警控制主机', '电子围栏总线报警主机', '振动光纤报警主机'],
      isCollapse: true,
      naveMenu: true,
      menuWidth: '20%',
      alarmHostNum: 0,
      armed: 0,
      disarm: 0,
      offline: 0,
      orgChecked: false,
      partList: [
        {
          value: '全部',
          label: '全部'
        }
      ],
      partValue: '全部',
      devName: '',
      armStatusList: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: 'arm',
          label: '布防'
        },
        {
          value: 'disarm',
          label: '撤防'
        }
      ],
      armValue: '全部',
      onlineStatusList: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: 'online',
          label: '在线'
        },
        {
          value: 'noOnline',
          label: '不在线'
        }
      ],
      onlineValue: '全部',
      mainStatusList: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: 'normal',
          label: '正常'
        },
        {
          value: 'unusual',
          label: '异常'
        }
      ],
      mainValue: '全部',
      controlStatus: true, // 回控状态
      backControlData: {}, // 回控数据
      zoneNum: 12,
      zoneInfoList: [
        {
          number: 1,
          detector: '大厅',
          zone: 1,
          type: '探测器',
          quantity: 3,
          status: '正常',
          bypass: '旁路'
        }
      ],
      zoneCurrentPage: 1,
      armDialog: false,
      armNum: {
        successTitle: '布防正确',
        errorTitle: '布防错误',
        armSuccess: 3,
        armError: 1
      },
      dialogTitle: '布防提示',
      importInfoDialog: false,
      bypassDialog: false,
      bypassForm: {
        reason: '临时检查',
        detail: ''
      },
      reasonList: [
        {
          value: '临时检查',
          label: '临时检查'
        },
        {
          value: '发生误报再确认',
          label: '发生误报再确认'
        },
        {
          value: '网点忘记布防',
          label: '网点忘记布防'
        },
        {
          value: '异常故障',
          label: '异常故障'
        }
      ],
      clearAlarm: false,
      hostBtnDisabled: true,
      pageSize: 25,
      page: 1,
      armStatus: '',
      setTitleInfo: '布撤防原因',
      setArea: false,
      setAreaFrom: {
        reason: '临时检查',
        detail: ''
      },
      // 报警主机选中数据收集
      selectHostArr: []
    }
  },
  mixins: [publicData],
  computed: {
    ...mapState({
      alarmHostList: ({ alarm }) => alarm.alarmHostList
    }),
    ...mapGetters([])
  },
  created() {
    // this.tableData = JSON.parse(JSON.stringify(this.alarmHostList))
    this.zoneTotal = this.zoneInfoList.length
    this.getAlarmHostManageList({
      deviceType: '电子围栏总线报警主机',
      pageSize: this.pageSize,
      pageNum: this.page
    })
    this.loginLine()
  },
  watch: {
    listMode: {
      deep: true,
      handler(newValue) {
        console.log(this.listMode, '~~~~~~')
      }
    }
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
      'getAlarmHostManage',
      'getDetectorList',
      'changeDefendn',
      'login',
      'changeBypass',
      'changePass',
      'changeUndefendn',
      'clearAlarmFn',
      'getStatus',
      'getHostBind',
      'getLocationList'
    ]),
    // 登录
    loginLine() {
      this.login({
        devIp: '10.1.7.10',
        devPort: 8000,
        username: 'admin',
        passwd: 'test-123',
        vendor: 'HIKVISION',
        devType: 'AlarmHost',
        devBaseType: 'AlarmHost',
        connMode: 'active',
        version: '1',
        daServerId: 'DAPYTHON:192.168.14.10:12000:E3060500FFFBAB1F'
      }).then(res => {})
    },
    // 重点关注
    importInfoDialogBtn() {
      if (this.multipleSelection.length !== 1) {
        this.$notify.warning({
          title: '警告',
          message: '未选择数据不能操作哦'
        })
        return
      }
      console.log(this.multipleSelection[0].locationId)
      this.importInfoDialog = true
      this.getLocationList({ locationId: this.multipleSelection[0].locationId }).then(res => {
        console.log(res.data)
        this.importInfoList.forEach(item => {
          for (let i in res.data) {
            if (item.mark === i) {
              item.info = res.data[i]
            }
          }
        })
      })
    },
    // 报警主机列表复选框选中
    hostSelectionChange(val) {
      this.multipleSelection = val
      let subsysArr = []
      this.selectHostArr.splice(0, this.selectHostArr.length)
      val.map(item => {
        for (let i = 0; i < item.subsystemNo; i++) {
          subsysArr.push(i)
        }
        this.selectHostArr.push({ devId: item.id, devPort: item.ip, subSystem: subsysArr })
      })
    },
    // 报警主机列表获取
    getAlarmHostManageList(obj) {
      this.getAlarmHostManage(obj)
        .then(res => {
          // let arryData = JSON.parse(JSON.stringify(res.data.data.results))
          let arryData = res.data.data.results
          this.total = res.data.data.page.length
          console.log('报警主机列表', arryData)
          arryData.map((item, index) => {
            item.defenseState = item.defenseState ? '布防' : '撤防'
            item.onlineState = item.onlineState ? '在线' : '离线'
            item.electricState = item.electricState ? '正常' : '异常'
          })
          this.tableData = arryData
          this.getDetector(arryData[0].id)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 报警主机-探测器获取
    getDetector(id) {
      this.getDetectorList({ hostId: id, isMain: 'T' })
        .then(res => {
          let arryData = res.data.results
          this.zoneInfoList = arryData
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 报警主机列表行点击事件
    tableRowClick(row) {
      console.log(row)
      this.zoneNum = row.zoneNo // 防区数
      this.subsystemNum = row.subsystemNo // 子系统数
      this.getDetector(row.id)
    },
    // 机构树刷新列表
    orgChange(obj) {
      obj.deviceType = '电子围栏总线报警主机'
      obj.pageSize = this.pageSize
      obj.pageNum = this.page
      this.getAlarmHostManageList(obj)
    },
    //  显示子系统的判断
    checkedSubOrg(val) {
      this.getAlarmHostManageList({
        deviceType: '电话报警主机,网络报警主机',
        pageSize: this.pageSize,
        pageNum: this.page,
        isRecursion: val ? 1 : 0
      })
    },
    // 报警控制主机筛选
    hostNumClick() {},
    // 布防数量筛选
    armClick() {},
    // 撤防数量筛选
    disarmClick() {},
    // 离线数量筛选
    offlineClick() {},
    // 刷新
    refreshClick() {
      if (val) {
        this.getAlarmHostManageList({
          deviceType: '电子围栏总线报警主机',
          pageSize: this.pageSize,
          pageNum: this.page
        })
      } else {
        this.$refs.HostPanelModeRef.handleCurrentChange(1)
      }
    },
    // 侧边栏伸缩
    naveMenuClick() {
      this.naveMenu = !this.naveMenu
    },
    // 切换面板或者列表模式
    modeSelectClick(data) {
      if (data) {
        this.modeInfo = {
          info: '切换面板模式',
          index: 0
        }
        this.listMode = true
      } else {
        this.modeInfo = {
          info: '切换列表模式',
          index: 1
        }
        this.listMode = false
      }
    },
    // 报警主机布撤防
    armSetClick(data) {
      if (this.multipleSelection.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请至少选择一条'
        })
        return
      }
      if (data === 'arm') {
        this.changeDefendn(this.selectHostArr).then(res => {
          this.armNum.armSuccess = res.data.successMount
          this.armNum.armError = res.data.errorMount
          this.armDialog = true
          this.armNum.successTitle = '布防正确'
          this.armNum.errorTitle = '布防错误'
          this.dialogTitle = '布防提示'
        })
      } else if (data === 'disarm') {
        this.changeDefendn(this.selectHostArr).then(res => {
          this.armNum.armSuccess = res.data.successMount
          this.armNum.armError = res.data.errorMount
          this.armDialog = true
          this.armNum.successTitle = '撤防正确'
          this.armNum.errorTitle = '撤防错误'
          this.dialogTitle = '撤防提示'
        })
      } else {
        this.armDialog = true
        this.armNum.successTitle = '旁路正确'
        this.armNum.errorTitle = '旁路错误'
        this.dialogTitle = '旁路提示'
      }
    },
    // 重置
    resetClick() {
      this.partValue = '全部'
      this.devName = ''
      this.mainValue = '全部'
      this.onlineValue = '全部'
      this.armValue = '全部'
    },
    // 回控
    backControlStatus(status, data) {
      if (status) {
        this.backControlData = data
        this.controlStatus = false
      } else {
        this.controlStatus = true
      }
    },
    // 回控切回面板模式
    selectMode(ststus) {
      if (ststus) {
        this.modeInfo = {
          info: '切换列表模式',
          index: 1
        }
        this.listMode = false
        this.controlStatus = true
      }
    },
    // 防区关联控制按钮
    handleLinkBtn(index, row) {
      console.log('~防区关联控制按钮~~', index, row)
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
      this.getAlarmHostManageList({ deviceType: '电子围栏总线报警主机', pageSize: this.pageSize, pageNum: val })
    },
    // 旁路按钮
    bypassClick() {
      this.setTitleInfo = '旁路恢复原因'
      this.bypassDialog = true
    },
    // 确认旁路恢复
    restoreSure() {
      this.bypassDialog = false
      if (this.armStatus === 'arm') {
        this.hostStatus = '布防'
        this.hostBtnDisabled = true
      } else {
        this.hostStatus = '撤防'
        this.hostBtnDisabled = false
      }
    },
    // 布撤防
    setAreaClick(data) {
      this.bypassDialog = true
      this.armStatus = data
    },
    // 关联控制关闭
    sureLinkClick(data) {
      this.linkStatus = data
    }
  }
}
</script>

<style scoped lang='less'>
.iconfont {
  font-size: 12px;
  margin-right: 2px;
}
.host-list-mode {
  height: 100%;
  font-size: 14px;
  .host-header {
    margin-bottom: 10px;
  }
  .host-num {
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #bcbcbc;
    li {
      float: left;
      margin-right: 20px;
      i {
        display: inline-block;
        width: 40px;
        cursor: pointer;
      }
    }
  }
  .host-armed-btn {
    border-bottom: 1px solid #bcbcbc;
    padding: 10px 0;
    button {
      margin-left: 30px;
    }
    .part-info-btn {
      margin-left: 200px;
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
      overflow: hidden;
      .table-select-btn {
        float: right;
        margin-top: 10px;
      }
      .el-select,
      .el-input {
        margin-left: 10px;
      }
    }
    .table-content {
      height: 280px;
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
    margin-top: 20px;
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
          margin-right: 40px;
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
    .import-info {
      ul {
        width: 100%;
        overflow: hidden;
        border-top: 1px solid #bcbcbc;
        border-left: 1px solid #bcbcbc;
        li {
          width: 50%;
          float: left;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #bcbcbc;
          border-right: 1px solid #bcbcbc;
          box-sizing: border-box;
          span {
            display: inline-block;
            width: 160px;
            border-right: 1px solid #bcbcbc;
            padding: 0 8px;
          }
        }
      }
    }
  }
}
</style>
