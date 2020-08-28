<template>
  <div class="host-back-conrtol"
       v-if="childData">
    <div class="alarm-host-info">
      <div class="host-info-header"
           style="margin-top:20px">
        <span>报警控住主机信息</span>
        <p>当前状态：{{ hostStatus }}</p>
        <div class="host-armed-btn">
          <el-button type="primary"
                     size="small"
                     @click="setAreaClick('arm','host')"
                     :disabled="hostBtnDisabled"
                     icon="el-icon-plus">布防</el-button>
          <el-button size="small"
                     @click="setAreaClick('disarm','host')"
                     :disabled="!hostBtnDisabled"><span class="iconfont-ccb">&#xe653;</span>撤防</el-button>
          <el-button size="small"
                     @click="statusCheck('clearHost')"><span class="iconfont-ccb">&#xe73b;
            </span>消警</el-button>
          <el-button class="part-info-btn"
                     size="small"
                     @click="statusCheck('check')"><span class="iconfont-ccb">&#xe601;</span>布撤防状态检测</el-button>
          <!-- <el-button size="small">故障报修</el-button> -->
        </div>
        <el-button type="primary"
                   size="small"
                   style="float:right;
                     margin-right:15px"
                   @click="selectModeClick"><span class="iconfont icon-swap"
                style="background:#2D72D3;width:14px;"></span>切换面板模式</el-button>
      </div>
      <div class="host-info-content">
        <ul>
          <li v-for="(item, index) in hostInfoList"
              :key="index">
            {{ item.name }}
            <span>{{ item.info }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="alarm-detector-info">
      <div class="host-info-header"
           v-if="!backData.subSystemList">
        <span>探测器信息</span>
        <div class="host-armed-btn">
          <el-button size="small"
                     @click="statusCheck('clearZone')"> <span class="iconfont-ccb">&#xe73b;
            </span>消警</el-button>
        </div>
      </div>
      <div class="host-info-header"
           v-if="backData.subSystemList">
        <el-menu :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 @select="handleSelect">
          <el-menu-item v-for="(item, index) in subsystemNum"
                        :index="(index + 1).toString()"
                        :key="index">{{
            item.name
          }}</el-menu-item>
        </el-menu>
      </div>
      <div class="detector-info-content">
        <div class="host-subsystem-btn"
             v-if="backData.subSystemList">
          <p>防区数：{{zoneNo}}</p>
          <p>当前状态：{{ zoneStatus }}</p>
          <el-button type="primary"
                     size="small"
                     @click="setAreaClick('arm','sub')"
                     :disabled="subBtnDisabled"
                     icon="el-icon-plus">布防</el-button>
          <el-button size="small"
                     @click="setAreaClick('disarm','sub')"
                     :disabled="!subBtnDisabled"><span class="iconfont-ccb">&#xe653;</span>撤防</el-button>
          <el-button size="small"
                     @click="statusCheck('clearZone')"><span class="iconfont-ccb">&#xe73b;
            </span>消警</el-button>
          <el-button class="part-info-btn"
                     size="small"
                     @click="statusCheck('check')"><span class="iconfont-ccb">&#xe601;</span>布撤防状态检测</el-button>
        </div>
        <div class="detector-info-detail">
          <ul>
            <li v-for="(item, index) in detailList"
                :key="index">
              <span :title="item.name">{{ item.name }}</span>
              <!-- <span><i class="el-icon-circle-check"></i>{{ item.state }}</span> -->
              <span :style="{'color':(item.state==='正常'?'#33D48E':(item.state==='报警'?'#FF0000':'#7E7E7E'))}"><i
                   :class="item.state==='正常'?'el-icon-circle-check':(item.state==='报警'?'iconfont-ccb ccbbaojingshuchuchangtai':'iconfont-ccb ccbjinggao')"></i>{{ item.state }}</span>
              <span :style="{'color':((item.bypassState=='旁路' ? '#3B34D4' : ''))}"><i :class="item.bypassState==='旁路恢复'?'el-icon-bell':'el-icon-close-notification'"></i>{{ item.bypassState }}</span>
              <span>
                <el-button size="mini"
                           @click="bypassClick(index)"
                           style="width:80px;text-align:center;vertical-align:top"
                           type="primary">{{item.bypassTitle }}</el-button>
                <el-button @click="handleLinkBtn(item, index)"
                           size="mini"
                           style="width:80px;vertical-align:top">关联控制</el-button>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="host-back-bialog">
        <!-- 旁路设置弹出框 -->
        <el-dialog title="旁路恢复原因"
                   :visible.sync="bypassDialog"
                   :close-on-click-modal='false'
                   width="20%">
          <el-form :model="bypassForm">
            <el-form-item label="旁路恢复原因">
              <el-select v-model="bypassForm.reason">
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
            <el-button @click="bypassDialog = false"
                       size="small">关闭</el-button>
            <el-button type="primary"
                       @click="restoreSure">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 布撤防状态监测和清除报警提示框 -->
        <el-dialog :title="chenkInfo.checkTitle"
                   :close-on-click-modal='false'
                   :visible.sync="clearAlarm"
                   width="20%">
          <div class="arm-dialog">{{ chenkInfo.dialogInfo }}</div>
          <div slot="footer"
               class="dialog-footer">
            <el-button @click="clearAlarm = false"
                       size="small">关闭</el-button>
            <el-button @click="clearAlarm = false"
                       size="small"
                       type="primary">确定</el-button>
          </div>
        </el-dialog>
        <!-- 布撤防 -->
        <el-dialog title="布撤防原因"
                   :visible.sync="setArea"
                   :close-on-click-modal='false'
                   width="20%">
          <el-form :model="setAreaFrom">
            <el-form-item label="布撤防原因">
              <el-select v-model="setAreaFrom.reason">
                <el-option v-for="item in reasonList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="具体内容">
              <el-input v-model="setAreaFrom.detail"
                        type="textarea"
                        :rows="2"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer"
               class="dialog-footer">
            <span>操作员：张三</span>
            <el-button @click="setArea = false"
                       size="small">关闭</el-button>
            <el-button type="primary"
                       @click="setAreaSure(setAreaFrom)"
                       size="small">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="alarm-output-info">
      <div class="host-info-header">
        <span>报警输出信息</span>
      </div>
      <div class="output-info-content">
        <p @click="openoutput(item,index)"
           v-for="(item, index) in outChannelList"
           :key="index">
          <i class="iconfont-ccb"
             :style="{color: (item.status==='close'?'':'red')}">&#xe687;</i>
          <span>{{item.name}}</span>
        </p>

      </div>
    </div>
    <!-- 关联控制提示框 -->
    <div v-if="linkStatus">
      <LinkControl :linkControl="linkStatus"
                   :associatedControlData="associatedControlData"
                   :hostInfo='this.backData'
                   @sureClick="sureLinkClick"></LinkControl>
    </div>
  </div>
</template>

<script>
import LinkControl from '../linkControl/LinkControl'
import { mapMutations, mapActions } from 'vuex'
export default {
  components: {
    LinkControl,
  },
  props: {
    backData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      zoneNo: '', // 防区数
      linkStatus: false,
      zoneStatus: '',
      hostStatus: '',
      hostBtnDisabled: true,
      subBtnDisabled: true,
      armStatus: '',
      isHostStatus: '',
      subsystemNum: [],
      outChannelList: [],
      hostInfoList: [
        {
          name: '设备名称：',
          mark: 'name',
          info: '',
        },
        {
          name: '设备类型：',
          mark: 'deviceType',
          info: '',
        },
        {
          name: '设备型号：',
          mark: 'deviceModel',
          info: '',
        },
        {
          name: '设备品牌：',
          mark: 'brand',
          info: '',
        },
        {
          name: '网络模块品牌：',
          mark: 'netModuleBrand',
          info: '',
        },
        {
          name: '网络模块ID：',
          mark: 'netModuleID',
          info: '',
        },
        {
          name: '探测器数量：',
          mark: 'detectorNo',
          info: '',
        },
        {
          name: '输出通道数量：',
          mark: 'outputNo',
          info: '',
        },
        {
          name: '子系统数量：',
          mark: 'subsystemNo',
          info: '',
        },
        {
          name: 'IP地址：',
          mark: 'ip',
          info: '',
        },
      ],
      zoneInfoStatus: true,
      detailList: [],
      bypassDialog: false,
      bypassForm: {
        reason: '临时检查',
        detail: '',
      },
      associatedControlData: {},
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
      setNum: '',
      clearAlarm: false,
      chenkInfo: {
        checkTitle: '布撤防状态检测',
        dialogInfo: '布撤防状态检测发送成功！',
      },
      setArea: false,
      setAreaFrom: {
        reason: '临时检查',
        detail: '',
      },
      activeIndex: '1',
      selectSubsystemArr: [],
      passNum: 0,
      zoneArr: [],
      zoneObj: {
        devIp: '',
        devPort: '',
        subSystem: '',
        zoneList: [],
      },
      childData: true,
      statusArr: [],
      //单个主机的状态
      ajaxAs: [],
      saveSubSystems: [],
      getStatusParmarObj: {
        id: '',
        powerState: '',
        subSystemList: [],
      },
    }
  },
  watch: {
    backData: {
      handler(newValue, oldValue) {
        this.hostInfoList.forEach((item) => {
          for (let i in this.backData) {
            if (item.mark === i) {
              item.info = this.backData[i]
            }
          }
        })

        this.hostStatus = newValue.defenseState === 1 ? '撤防' : newValue.defenseState === 3 ? '布防' : '未知'
        this.hostBtnDisabled = this.hostStatus === '布防'
        this.getAlarmHostManage({ hostId: this.backData.id }).then((res) => {
          if (this.backData.hasSubSystem || (this.backData.subSystemList && this.backData.subSystemList.length > 0)) {
            this.getHostSubsystemList(this.backData.id)
          } else {
            this.getDetector(this.backData.id)
          }
          this.getHostBindFn()
        })
      },
    },
    zoneStatus: {
      handler(newValue) {
        this.subBtnDisabled = newValue === '布防'
      },
    },
  },
  created() {
    this.getHostBindFn()
  },
  computed: {},
  mounted() {
    let backDataList = JSON.parse(JSON.stringify(this.backData))
    this.hostInfoList.forEach((item) => {
      for (let i in backDataList) {
        if (item.mark === i) {
          item.info = backDataList[i]
        }
      }
    })
    console.log(this.backData, '**********')
    this.realState()
    this.timer = setInterval(() => {
      this.realState()
    }, 3000)
  },
  methods: {
    ...mapMutations([]),
    ...mapActions([
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
      'openoutputFn',
      'closeoutputFn',
      'getoutputStatus',
      'getAlarmHostManage',
      'getOutputChan', // 获取输出信息
      'setHostZoneStatus',
    ]),
    // 单机切换更新状态/时时更新状态
    realState() {
      this.getAlarmHostManage({ hostId: this.backData.id }).then((res) => {
        let data = res.data && res.data.data && res.data.data.results
        // 报警主机布撤防状态
        this.hostStatus = data[0].defenseState === 1 ? '撤防' : data[0].defenseState === 3 ? '布防' : '未知'
        this.hostBtnDisabled = this.hostStatus === '布防'
        if (this.backData.hasSubSystem || (this.backData.subSystemList && this.backData.subSystemList.length > 0)) {
          this.getHostSubsystemList(this.backData.id)
        } else {
          this.getDetector(this.backData.id)
        }
      })
    },
    // 报警主机-子系统获取
    getHostSubsystemList(id, num) {
      this.getHostSubsystem({ hostId: id })
        .then((res) => {
          let arryData = res.data.results
          this.subsystemNum = arryData
          this.zoneInfoStatus = false
          // 第一个子系统状态
          this.zoneStatus = arryData[0].defenseState =
            arryData[0].defenseState === 1 ? '撤防' : arryData[0].defenseState === 3 ? '布防' : '未知'
          this.zoneNo = arryData[0].detectors.length
          // this.subBtnDisabled
          // 探测器状态
          if (arryData[0] && arryData[0].detectors) {
            this.detailList = arryData[0].detectors
            let data = arryData[0].detectors
            for (var i = 0; i < data.length; i++) {
              this.$set(
                this.detailList[i],
                'state',
                data[i].status === 2 ? '正常' : data[i].status === 4 ? '报警' : data[i].status === 3 ? '故障' : '未知'
              )
              this.$set(
                this.detailList[i],
                'bypassState',
                data[i].bypassState === 3 ? '旁路' : data[i].bypassState === 2 ? '旁路恢复' : '未知'
              )
              this.$set(
                this.detailList[i],
                'bypassTitle',
                data[i].bypassState === '旁路' ? '旁路恢复' : data[i].bypassState === '旁路恢复' ? '旁路' : '暂无状态'
              )
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
          let arryData = res.data.results
          this.zoneInfoStatus = true
          this.detailList = arryData
          let data = res.data.results
          for (var i = 0; i < data.length; i++) {
            this.$set(
              this.detailList[i],
              'state',
              data[i].status === 2 ? '正常' : data[i].status === 4 ? '报警' : data[i].status === 3 ? '故障' : '未知'
            )
            this.$set(
              this.detailList[i],
              'bypassState',
              data[i].bypassState === 3 ? '旁路' : data[i].bypassState === 2 ? '旁路恢复' : '未知'
            )
            this.$set(
              this.detailList[i],
              'bypassTitle',
              data[i].bypassState === '旁路' ? '旁路恢复' : data[i].bypassState === '旁路恢复' ? '旁路' : '暂无状态'
            )
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * 切换面板模式
     * @method selectModeClick
     */
    selectModeClick() {
      this.$emit('selectMode', true)
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

    // 封装获取状态参数的方法
    async getStatusParmar() {
      this.ajaxAs = []
      // 获取状态参数
      let hostObj = {
        devIp: this.backData.ip,
        devPort: this.backData.port,
        subSystems: [],
      }
      if (this.backData.subSystemList && this.backData.subSystemList.length > 0) {
        this.backData.subSystemList &&
          this.backData.subSystemList.map((itemSub) => {
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
      if (this.backData.detector && this.backData.detector.length) {
        this.backData.detector &&
          this.backData.detector.map((itemDet) => {
            let subObj = {
              zoneList: [],
              subSystem: 1,
            }
            subObj.zoneList.push(itemDet.serialNumber)
            hostObj.subSystems.push(subObj)
          })
      }
      console.log(hostObj, '获取的参数')
      this.ajaxAs.push(this.getStatus(hostObj))
      let arr = []
      let resa = await Promise.all(this.ajaxAs)
      resa = JSON.parse(JSON.stringify(resa))
      console.log(JSON.parse(JSON.stringify(resa)), '获取到的知状态')
      this.getStatusParmarObj.id = this.backData.id
      if (resa[0].data.code == 0) {
        this.getStatusParmarObj.powerState = resa[0].data.results.powerState
        this.getStatusParmarObj.subSystemList = resa[0].data.results.subSystemList
      }
      arr.push(JSON.parse(JSON.stringify(this.getStatusParmarObj)))
      let data = resa[0].data && resa[0].data.results && resa[0].data.results.subSystemList
      if (data && data.length > 0) {
        data.map((item, index) => {
          // --子系统状态
          this.zoneStatus = item.subStatus === 'arm' ? '布防' : item.subStatus === 'disarm' ? '撤防' : '未知'
          this.hostBtnDisabled = this.hostStatus === '布防'
          // --主机状态
          let stat = data.every((xx) => {
            return xx.subStatus === 'arm'
          })
          console.log(stat, 'stat')
          // this.backData['defenseState'] = stat ? '布防' : '撤防'
          this.hostStatus = stat ? '布防' : '撤防'
          this.hostBtnDisabled = this.hostStatus === '布防'
          // --第一个子系统下防区状态
          if (data[0].zoneList && data[0].zoneList.length > 0) {
            for (var i = 0; i < data[0].zoneList.length; i++) {
              this.$set(
                this.detailList[i],
                'state',
                data[0].zoneList[i].working === 'normal'
                  ? '正常'
                  : data[0].zoneList[i].working === 'warm'
                  ? '报警'
                  : data[0].zoneList[i].working === 'fault'
                  ? '故障'
                  : '未知'
              )
              this.$set(
                this.detailList[i],
                'bypassState',
                data[0].zoneList[i].status === 'bypass'
                  ? '旁路'
                  : data[0].zoneList[i].status === 'pass'
                  ? '旁路恢复'
                  : '未知'
              )
              this.$set(
                this.detailList[i],
                'bypassTitle',
                data[0].zoneList[i].status === 'pass'
                  ? '旁路'
                  : data[0].zoneList[i].status === 'bypass'
                  ? '旁路恢复'
                  : '暂无状态'
              )
            }
          }
        })
      } else {
      }
      let b = await this.setHostZoneStatus(arr)
    },
    /**
     * 主机布撤防
     * @method setAreaClick
     */
    setAreaClick(data, val) {
      console.log(data, val)
      this.setArea = true
      this.armStatus = data
      this.isHostStatus = val
    },
    /**
     * 布撤防确认和旁路回复
     * @method setAreaSure
     */
    setAreaSure(val) {
      this.setArea = false
      let subsysArr = []
      if (this.backData.subSystemList && this.backData.subSystemList.length > 0) {
        for (let i = 0; i < this.backData.subSystemList.length; i++) {
          let ser = this.backData.subSystemList[i].serialNumber
          this.selectSubsystemArr = [ser]
          subsysArr.push(ser)
        }
      } else {
        subsysArr = [1]
        this.selectSubsystemArr = [1]
      }
      if (this.armStatus === 'arm' && this.isHostStatus === 'host') {
        this.changeDefendn({ devIp: this.backData.ip, devPort: this.backData.port, subSystem: subsysArr }).then(
          async (res) => {
            this.getStatusParmar()
            if (res.data && res.data.code === '0' && res.data.results[0].status === 'succeed') {
              //   this.hostBtnDisabled = true
              //   this.hostStatus = '布防'
              this.$message({
                type: 'success',
                message: '布防成功',
              })
              // this.reload()
            } else {
              this.$message({
                type: 'error',
                message: '布防失败',
              })
            }
          }
        )
      } else if (this.armStatus === 'disarm' && this.isHostStatus === 'host') {
        this.changeUndefendn({ devIp: this.backData.ip, devPort: this.backData.port, subSystem: subsysArr }).then(
          async (res) => {
            this.getStatusParmar()
            if (res.data && res.data.code === '0' && res.data.results[0].status === 'succeed') {
              //   this.hostBtnDisabled = false
              //   this.hostStatus = '撤防'
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
          }
        )
      } else if (this.armStatus === 'arm' && this.isHostStatus === 'sub') {
        this.changeDefendn({
          devIp: this.backData.ip,
          devPort: this.backData.port,
          subSystem: this.selectSubsystemArr,
        }).then(async (res) => {
          this.getStatusParmar()
          if (res.data && res.data.code === '0' && res.data.results[0].status === 'succeed') {
            // this.hostBtnDisabled = true
            // this.hostStatus = '布防'
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
        })
      } else {
        this.changeUndefendn({
          devIp: this.backData.ip,
          devPort: this.backData.port,
          subSystem: this.selectSubsystemArr,
        }).then(async (res) => {
          this.getStatusParmar()
          if (res.data && res.data.code === '0' && res.data.results[0].status === 'succeed') {
            // this.hostBtnDisabled = false
            // this.hostStatus = '撤防'
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
        })
      }
      //   this.getAlarmHostManage({ hostId: this.backData.id }).then((res) => {
      //     if (this.backData.hasSubSystem || (this.backData.subSystemList && this.backData.subSystemList.length > 0)) {
      //       this.getHostSubsystemList(this.backData.id)
      //     } else {
      //       this.getDetector(this.backData.id)
      //     }
      //     this.getStatusParmar()
      //     this.getHostBindFn()
      //   })
    },
    /**
     * 布撤防状态和清除报警
     * @method statusCheck
     */
    statusCheck(status) {
      if (status === 'check') {
        this.clearAlarm = true
        this.chenkInfo.checkTitle = '布撤防状态检测'
        this.chenkInfo.dialogInfo = '布撤防状态检测发送成功！'
        this.getAlarmHostManage({ hostId: this.backData.id }).then((res) => {
          if (this.backData.hasSubSystem || (this.backData.subSystemList && this.backData.subSystemList.length > 0)) {
            this.getHostSubsystemList(this.backData.id)
          } else {
            this.getDetector(this.backData.id)
          }
          this.getHostBindFn()
        })
      } else if (status === 'clearHost' || status === 'clearZone') {
        this.zoneObj.zoneList = []
        if (this.backData.subSystemList && this.backData.subSystemList.length > 0) {
          this.zoneObj.subSystem = this.backData.subSystemList[0].serialNumber
          if (this.backData.subSystemList[0].detector && this.backData.subSystemList[0].detector.length > 0) {
            if (this.detailList.length === 0) {
              this.tableData[0].subSystemList[0].detector.map((item) => {
                this.zoneObj.zoneList.push(item.serialNumber)
              })
            } else {
              let temp
              this.detailList &&
                this.detailList.map((item, index) => {
                  temp = this.detailList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
        } else {
          this.zoneObj.subSystem = 1
          if (this.backData.detector && this.backData.detector.length > 0) {
            if (this.detailList.length === 0) {
              this.tableData[0].subSystemList[0].detector.map((item) => {
                this.zoneObj.zoneList.push(item.serialNumber)
              })
            } else {
              let temp
              this.detailList &&
                this.detailList.map((item, index) => {
                  temp = this.detailList[index].serialNumber
                  this.zoneObj.zoneList.push(temp)
                })
            }
          }
        }
        this.zoneObj.devIp = this.backData.ip
        this.zoneObj.devPort = Number(this.backData.port)
        // this.clearAlarmFn({
        //   devIp: '10.1.7.10',
        //   devPort: 8000,
        //   subSystem: 1,
        //   zoneList: [1, 2, 3]
        // })
        this.clearAlarmFn(this.zoneObj)
          .then((res) => {
            console.log(res, '消警成功')
          })
          .catch((err) => {
            console.log(err)
          })
        this.clearAlarm = true
        this.chenkInfo.checkTitle = '清除报警提示'
        this.chenkInfo.dialogInfo = '清除报警发送成功！'
      }
      // this.getStatusFn()
    },
    /**
     * 旁路按钮
     * @method bypassClick
     */
    bypassClick(num) {
      this.passNum = num
      this.zoneObj = {
        devIp: '',
        devPort: '',
        subSystem: '',
        zoneList: [],
      }
      if (this.detailList[num].bypassTitle !== '旁路恢复') {
        this.zoneObj.devIp = this.backData.ip
        this.zoneObj.devPort = this.backData.port
        if (this.backData.subSystemList) {
          this.zoneObj.subSystem = this.backData.subSystemList[0].serialNumber
          if (this.backData.subSystemList[0].detector) {
            this.zoneObj.zoneList = [this.backData.subSystemList[0].detector[num].serialNumber]
          }
        } else {
          this.zoneObj.subSystem = 1
          if (this.backData.detector) {
            this.zoneObj.zoneList = [this.backData.detector[num].serialNumber]
          }
        }
        this.zoneArr.push(this.zoneObj)
        this.changeBypass(this.zoneObj)
          // this.changeBypass(this.zoneArr)
          .then((res) => {
            console.log(res)
            this.getStatusParmar()
            if (res.data && res.data.code == 0 && res.data.data[0].status === 'succeed') {
              // this.hostBtnDisabled = false
              // this.hostStatus = '撤防'
              this.$message({
                type: 'success',
                message: '旁路成功',
              })
            } else {
              this.$message({
                type: 'error',
                message: '旁路失败',
              })
            }
            this.detailList[num].bypassTitle = '旁路'
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        // this.detailList[num].bypass = '旁路恢复'
        this.bypassDialog = true
        this.setNum = num
      }
      //   this.getAlarmHostManage({ hostId: this.backData.id }).then((res) => {
      //     if (this.backData.hasSubSystem || (this.backData.subSystemList && this.backData.subSystemList.length > 0)) {
      //       this.getHostSubsystemList(this.backData.id)
      //     } else {
      //       this.getDetector(this.backData.id)
      //     }
      //     this.getHostBindFn()
      //   })
    },
    /**
     * 确认旁路恢复
     * @method restoreSure
     */
    restoreSure() {
      this.zoneObj = {
        devIp: '',
        devPort: '',
        subSystem: '',
        zoneList: [],
      }
      this.bypassTitle = '旁路恢复'
      this.bypassDialog = false
      this.detailList[this.setNum].bypass = '旁路'
      this.zoneObj.devIp = this.backData.ip
      this.zoneObj.devPort = this.backData.port
      if (this.backData.subSystemList) {
        this.zoneObj.subSystem = this.backData.subSystemList[0].serialNumber
        if (this.backData.subSystemList[0].detector) {
          this.zoneObj.zoneList = [this.backData.subSystemList[0].detector[this.passNum].serialNumber]
        }
      } else {
        this.zoneObj.subSystem = 1
        if (this.backData.detector) {
          this.zoneObj.zoneList = [this.backData.detector[this.passNum].serialNumber]
        }
      }
      this.changePass(this.zoneObj)
        .then((res) => {
          console.log(res)
          this.getStatusParmar()
          if (res.data && res.data.code == 0 && res.data.data[0].status === 'succeed') {
            // this.hostBtnDisabled = false
            // this.hostStatus = '撤防'
            this.$message({
              type: 'success',
              message: '旁路恢复成功',
            })
          } else {
            this.$message({
              type: 'error',
              message: '旁路恢复失败',
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 切换子系统
    handleSelect(key, keyPath) {
      this.zoneNo = this.subsystemNum[key - 1].detectors.length
      // this.zoneStatus = this.statusArr.subSystemList[Number(key) - 1].subStatus === 'arm' ? '布防' : '撤防'
      this.zoneStatus =
        this.subsystemNum[key - 1].defenseState === 1
          ? '撤防'
          : this.subsystemNum[key - 1].defenseState === 3
          ? '布防'
          : '未知'
      this.selectSubsystemArr = [key - 1]
      this.detailList = this.subsystemNum[key - 1].detectors
      // 防区状态显示
      this.subsystemNum[key - 1].detectors &&
        this.subsystemNum[key - 1].detectors.map((item) => {
          item.bypassState = item.bypassState === 3 ? '旁路' : item.bypassState === 2 ? '旁路恢复' : '未知'
          item.status = item.status === 2 ? '正常' : item.status === 3 ? '故障' : item.status === 4 ? '报警' : '未知'
        })
    },
    // 防区关联控制按钮
    handleLinkBtn(index, row) {
      console.log('~防区关联控制按钮~~', index, row)
      this.linkStatus = true
      this.associatedControlData = index
    },
    // 关联控制关闭
    sureLinkClick(data) {
      this.linkStatus = data
    },
    // 报警输出信息
    getHostBindFn() {
      this.getOutputChan({ hostId: this.backData.id }).then((res) => {
        this.outChannelList = res.results
        let obj = {
          devIp: this.backData.ip,
          devPort: this.backData.port,
          channelList: [],
        }
        this.outChannelList &&
          this.outChannelList.map((item, index) => {
            obj.channelList.push(item.serialNumber)
          })
        this.getoutputStatus(obj).then((res) => {
          if (res.data.code == 0) {
            let reslut = res.data && res.data.results && res.data.results.channelList
            console.log(reslut, '报警主机IO状态获取')
            reslut.map((val, index) => {
              this.outChannelList[index].status = val.status
            })
          }
        })
      })
    },

    openoutput(item, index) {
      if (this.outChannelList[index].status === 'close') {
        // 输出设备打开
        this.openoutputFn({
          devIp: this.backData.ip,
          devPort: this.backData.port,
          outputNo: item.serialNumber, // 端子号
        }).then((res) => {
          console.log(res, '输出设备打开')
          if (res.data.code == '0') {
            this.outChannelList[index].status = 'open'
            this.$message({
              type: 'success',
              message: '开启成功',
            })
          } else {
            this.$message({
              type: 'error',
              message: '开启失败',
            })
          }
        })
      } else {
        //  输出设备关闭
        this.closeoutputFn({
          devIp: this.backData.ip,
          devPort: this.backData.port,
          outputNo: item.serialNumber, // 端子号
        }).then((res) => {
          console.log(res, '输出设备关闭')
          if (res.data.code == '0') {
            this.outChannelList[index].status = 'close'
            this.$message({
              type: 'success',
              message: '关闭成功',
            })
          } else {
            this.$message({
              type: 'error',
              message: '开启失败',
            })
          }
        })
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.host-info-header {
  height: 40px;
  line-height: 40px;
  span {
    float: left;
    width: 120px;
    text-align: center;
    background: #f2f2f2;
  }
}
.host-armed-btn {
  float: left;
  margin-left: 20px;
  .iconfont-ccb {
    width: 20px;
    background-color: #fff;
  }
}
.alarm-host-info {
  p {
    float: left;
    margin: 0 20px;
  }
  .host-info-content {
    overflow: hidden;
    border: 1px solid #e1e1e1;
    width: 100%;
    margin-top: 15px;
    padding-left: 20px;
    ul {
      margin-top: 20px;
      li {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float: left;
        width: 200px;
        margin: 0 20px 20px 0;
      }
    }
  }
}
.detector-info-content {
  //   height: 300px;
  overflow: hidden;
  margin: 15px;
  .host-subsystem-btn {
    height: 40px;
    line-height: 40px;
    margin-bottom: 15px;
    p {
      float: left;
      margin-right: 20px;
    }
  }
  .detector-info-detail {
    width: 100%;
    // float: left;
    height: 268px;
    padding: 10px 10px;
    border: 1px solid #bcbcbc;
    overflow: auto;
    ul {
      width: 100%;
      // overflow: hidden;
      margin: 10px;
      li:nth-of-type(even) {
        margin-left: 10px;
      }
      li {
        height: 38px;
        width: 48%;
        float: left;
        line-height: 38px;
        margin-bottom: 5px;
        // border: 1px solid red;
        // overflow: hidden;
     border-top: 1px solid #e1e1e1;
        //padding-top: 6px;
        span {
          float: left;
          width: 80px;
          height: 38px;
          line-height: 38px;

          i {
            font-size: 18px;
            margin-right: 10px;
          }
        }
        span:nth-child(1) {
          width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          // margin-top: -7px;
        }
        span:nth-child(2) {
          // margin-top: -7px;
        }
        span:nth-child(3) {
          margin: 0 30px;
          // margin-top: -7px;
        }
        span:nth-child(4) {
            padding-top: 5px;
          width: 180px;
          margin-left: 40px;
        }
      }
      li:last-child {
        border-bottom: 1px solid #e1e1e1;
        height: 48px;
        line-height: 48px;
      }
      li:nth-last-child(2) {
        border-bottom: 1px solid #e1e1e1;
        height: 48px;
        line-height: 48px;
      }
    }
  }
}
.host-back-bialog {
  .el-select {
    width: 100%;
  }
  .arm-dialog {
    text-align: center;
  }
  .dialog-footer {
    span {
      float: left;
      line-height: 32px;
    }
  }
}
.output-info-content {
  // width: 100%;
  border: 1px solid #bcbcbc;
  margin: 20px;
  padding: 15px;
  height: 120px;
  box-sizing: border-box;

  p {
    height: 100px;
    width: 80px;
    float: left;
    cursor: pointer;
    .iconfont-ccb {
      height: 50px;
      font-size: 48px;
      margin-left: 15px;
    }
    span {
      height: 30px;
      width: 100%;
      text-align: center;
      display: inline-block;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="less" scoped>
.iconfont {
  font-size: 12px;
  margin-right: 2px;
}
.host-info-header .el-menu {
  background-color: rgba(253, 253, 253, 1) !important;
}
.host-info-header .el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
  background: #f2f2f2;
}
.host-info-header .el-menu--horizontal > .el-menu-item.is-active {
  background-color: rgba(253, 253, 253, 1) !important;
}
</style>
