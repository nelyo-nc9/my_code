<template>
  <div class="host-back-conrtol">
    <div class="alarm-host-info">
      <div class="host-info-header">
        <span>振动光千报警主机信息</span>
        <p>当前状态：{{hostStatus}}</p>
        <div class="host-armed-btn">
          <el-button type="primary"
                     size="small"
                     @click="setAreaClick('arm')"
                     :disabled="hostBtnDisabled">布防</el-button>
          <el-button size="small"
                     @click="setAreaClick('disarm')"
                     :disabled="!hostBtnDisabled">撤防</el-button>
          <el-button type="danger"
                     size="small"
                     @click="statusCheck('clear')">消警</el-button>
          <el-button class="part-info-btn"
                     size="small"
                     @click="statusCheck('check')">布撤防状态监测</el-button>
          <el-button size="small">故障报修</el-button>
          <el-button type="primary"
                     size="small"
                     @click="selectModeClick">切换面板模式</el-button>
        </div>
      </div>
      <div class="host-info-content">
        <ul>
          <li v-for="(item, index) in hostInfoList"
              :key="index">{{item.name}}
            <span>{{item.info}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="alarm-detector-info">
      <div class="host-info-header">
        <span>振动光纤防区分割器信息</span>
        <!-- <div class="host-armed-btn"></div> -->
      </div>
      <div class="detector-info-content">
        <div class="host-subsystem-btn">
          <p>防区数：{{backData.detectorNo}}</p>
        </div>
        <div class="detector-info-detail">
          <ul>
            <li v-for="(item,index) in detailList"
                :key="index"
                :class="{'detector-info-odd': index%2 !== 0, 'detector-info-even': index%2 === 0}">
              <span style="width: 180px">{{item.name}}</span>
              <span><i class="el-icon-circle-check"></i>{{item.status}}</span>
              <span><i class="el-icon-bell"></i>{{item.bypass}}</span>
              <span>
                <el-button size="mini"
                           @click="bypassClick(item, index)"
                           type="primary">{{item.bypassTitle}}</el-button>
              </span>
              <span style="width: 180px">当前状态：{{item.currentStatus}}</span>
              <span>
                <el-button type="primary"
                           size="small"
                           @click="setAreaClick('arm')"
                           :disabled="item.currentStatus === '布防'">布防</el-button>
              </span>
              <span>
                <el-button size="small"
                           @click="setAreaClick('disarm')"
                           :disabled="item.currentStatus === '撤防'">撤防</el-button>
              </span>
              <span style="width: 180px">
                <el-button class="part-info-btn"
                           size="small"
                           @click="statusCheck('check')">布撤防状态监测</el-button>
              </span>
              <span>
                <el-button size="mini"
                           @click="handleLinkBtn(item, index)">关联控制</el-button>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="host-back-bialog">
        <!-- 旁路设置弹出框 -->
        <el-dialog title='旁路恢复原因'
                   :visible.sync="bypassDialog"
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
        <el-dialog :title='chenkInfo.checkTitle'
                   :visible.sync="clearAlarm"
                   width="20%">
          <div class="arm-dialog">{{chenkInfo.dialogInfo}}</div>
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
        <el-dialog title='布撤防原因'
                   :visible.sync="setArea"
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
                       @click="setAreaSure"
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
        <p>
          <i class="el-icon-camera-solid"></i>
          <span>O1报警灯</span>
        </p>
        <p>
          <i class="el-icon-camera-solid"></i>
          <span>O1报警灯</span>
        </p>
      </div>
    </div>
    <div v-if="linkStatus">
      <LinkControl :linkControl="linkStatus"
                   :associatedControlData="associatedControlData"
                   @sureClick="sureLinkClick"></LinkControl>
    </div>
  </div>
</template>

<script>
import LinkControl from '../linkControl/LinkControl'
import { mapActions } from 'vuex'
export default {
  components: {
    LinkControl
  },
  props: {
    backData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      linkStatus: false,
      hostStatus: '布防',
      hostBtnDisabled: true,
      armStatus: '',
      associatedControlData: {},
      hostInfoList: [
        {
          name: '设备名称：',
          mark: 'deviceName',
          info: ''
        },
        {
          name: '设备类型：',
          mark: 'deviceType',
          info: ''
        },
        {
          name: '设备型号：',
          mark: 'deviceModel',
          info: ''
        },
        {
          name: '设备品牌：',
          mark: 'brand',
          info: ''
        },
        {
          name: '网络模块品牌：',
          mark: 'netModuleBrand',
          info: ''
        },
        {
          name: '网络模块ID：',
          mark: 'netModuleID',
          info: ''
        },
        {
          name: '探测器数量：',
          mark: 'detectorNo',
          info: ''
        },
        {
          name: '输出通道数量：',
          mark: 'outputNo',
          info: ''
        },
        {
          name: '子系统数量：',
          mark: 'subsystemNo',
          info: ''
        },
        {
          name: 'IP地址：',
          mark: 'ip',
          info: ''
        }
      ],
      detailList: [
        {
          name: 'Z1吸顶双鉴探测器-展示区',
          status: '正常',
          bypass: '旁路',
          currentStatus: '布防',
          bypassTitle: '旁路'
        },
        {
          name: 'Z1吸顶双鉴探测器-展示区',
          status: '正常',
          bypass: '旁路',
          currentStatus: '撤防',
          bypassTitle: '旁路'
        },
        {
          name: 'Z1吸顶双鉴探测器-展示区',
          status: '正常',
          bypass: '旁路',
          currentStatus: '撤防',
          bypassTitle: '旁路'
        }
      ],
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
      setNum: '',
      clearAlarm: false,
      chenkInfo: {
        checkTitle: '布撤防状态检测',
        dialogInfo: '布撤防状态检测发送成功！'
      },
      setArea: false,
      setAreaFrom: {
        reason: '临时检查',
        detail: ''
      }
    }
  },
  watch: {},
  computed: {},
  created() {
    this.hostInfoList.forEach(item => {
      for (let i in this.backData) {
        if (item.mark === i) {
          item.info = this.backData[i]
        }
      }
    })
    this.getDetector(this.backData.id)
  },
  mounted() {},
  methods: {
    ...mapActions([
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
    getDetector(id) {
      this.getDetectorList({ hostId: id, isMain: 'T' })
        .then(res => {
          let arryData = res.data.results
          this.detailList = arryData
        })
        .catch(err => {
          console.log(err)
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
    /**
     * 切换面板模式
     * @method selectModeClick
     */
    selectModeClick() {
      this.$emit('selectMode', true)
    },
    /**
     * 布撤防
     * @method setAreaClick
     */
    setAreaClick(data) {
      this.setArea = true
      this.armStatus = data
    },
    /**
     * 布撤防确认
     * @method setAreaSure
     */
    setAreaSure() {
      this.setArea = false
      let subsysArr = []
      for (let i = 0; i < this.backData.subsystemNo; i++) {
        subsysArr.push(i)
      }
      if (this.armStatus === 'arm') {
        this.changeDefendn({ devIp: this.backData.id, devPort: this.backData.port, subSystem: subsysArr }).then(res => {
          console.log(res)
          this.hostStatus = '布防'
          this.hostBtnDisabled = true
        })
      } else {
        this.changeUndefendn({ devIp: this.backData.id, devPort: this.backData.port, subSystem: subsysArr }).then(res => {
          console.log(res)
          this.hostStatus = '撤防'
          this.hostBtnDisabled = false
        })
      }
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
      } else {
        this.clearAlarm = true
        this.chenkInfo.checkTitle = '清除报警提示'
        this.chenkInfo.dialogInfo = '清除报警发送成功！'
      }
    },
    /**
     * 旁路按钮
     * @method bypassClick
     */
    bypassClick(data, num) {
      if (data.bypassTitle === '旁路') {
        data.bypassTitle = '旁路恢复'
        data.bypass = '旁路'
      } else {
        // this.detailList[num].bypass = '旁路恢复'
        this.bypassDialog = true
        this.setNum = num
      }
    },
    /**
     * 确认旁路恢复
     * @method restoreSure
     */
    restoreSure() {
      this.bypassDialog = false
      this.detailList[this.setNum].bypassTitle = '旁路恢复'
      this.detailList[this.setNum].bypass = '旁路恢复'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.host-info-header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #bcbcbc;
  span {
    float: left;
    width: 180px;
    text-align: center;
    background: #f2f2f2;
  }
}
.host-armed-btn {
  float: left;
  margin-left: 20px;
}
.alarm-host-info {
  p {
    float: left;
    margin: 0 20px;
  }
  .host-info-content {
    overflow: hidden;
    ul {
      margin-top: 20px;
      li {
        float: left;
        width: 220px;
        margin: 0 20px 20px 0;
      }
    }
  }
}
.detector-info-content {
  overflow: hidden;
  margin: 15px;
  .host-subsystem-btn {
    height: 40px;
    line-height: 40px;
    margin-bottom: 15px;
    border-bottom: 1px solid #bcbcbc;
    p {
      float: left;
      margin-right: 20px;
    }
  }
  .detector-info-detail {
    width: 100%;
    float: left;
    height: 280px;
    border: 1px solid #bcbcbc;
    ul {
      overflow: hidden;
      margin: 10px;
      li {
        height: 36px;
        line-height: 29px;
        span {
          float: left;
          width: 120px;
          i {
            font-size: 18px;
          }
        }
      }
      .detector-info-odd {
        background: #d7d7d7;
      }
      .detector-info-even {
        background: #f2f2f2;
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
  box-sizing: border-box;
  p {
    height: 60px;
    width: 80px;
    display: inline-block;
    i {
      font-size: 28px;
      width: 100%;
      text-align: center;
    }
    span {
      width: 100%;
      text-align: center;
      display: inline-block;
    }
  }
}
</style>
