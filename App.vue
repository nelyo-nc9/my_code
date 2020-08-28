<template>
  <div id="app-main"
       @click="mouseClick">
    <div class="app-wrapper">
      <div class="app-container">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
    </div>
    <object type="application/x-webplayercontrol"
            style="position:fixed;top:-9999px;width:10px;height:10px"
            id="global-plugin"></object>
    <object ref="objectTalk"
            style="position:fixed;top:-9998px;width:10px;height:10px"
            type="application/x-webplayercontrol"></object>
    <el-dialog title="防瞌睡"
               :visible.sync="preventDialogVisible"
               width="20%"
               :close-on-click-modal="false"
               :show-close="false">
      <div class="code-countdown">{{'倒计时:'+ ' ' + codeCountdown + '秒'}}</div>
      <div class="prevent-title">请在60秒内输入以下数字并点击确定,否则将记录瞌事件！</div>
      <div class="prevent-model">
        <div class="code">{{code}}</div>
        <el-input size="small"
                  v-model="inputCode"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="submitCode">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示"
               :visible="dutyVisible"
               width="20%">
      <span>是否前往接班页面</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="refuseDuty">取 消</el-button>
        <el-button type="primary"
                   @click="startDuty">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { getWebSocket } from '@src/socket/regular.js'
import { connectAlarm } from './socket/alarm.js'
import { closeWebSocket, getNoticeWebSocket } from './socket/socket.js'
import { getTreeApi } from '@src/http/systemOperationManage/serverManagement.api'
import {
  insertPreventSleepyMsg,
  getPreventSleepyConfigApi,
  getFilePathApi,
} from '../src/http/systemOperationManage/preventDrowsy.api'
export default {
  data() {
    return {
      preventDialogVisible: false,
      preventTime: '', // 防瞌睡提醒定时器
      startTime: new Date().getTime(), // 防瞌睡提醒定记录开始时间
      endTime: new Date().getTime(), // 防瞌睡提醒定记录结束时间
      status: true, // 控制防瞌睡触发
      code: '', // 防瞌睡验证码
      inputCode: '', // 用户输入的验证码
      codeTime: '', // 验证码输入倒数定时器
      codeCountdown: '', // 验证码输入计时
      allowErrorNum: '', // 验证码允许输入错误次数
      userIp: '', // 当前登录用户的ip
      timeInterval: '', // 防瞌睡提醒时间间隔（分钟）
      orgId: '', // 机构ID
      orgName: '', // 机构名称
      audioTimer: null, // 防瞌睡本地声音定时器
      localAudio: false, // 是否开启本地声音提醒
    }
  },
  computed: {
    ...mapGetters([]),
    ...mapState({
      dutyVisible: ({ dutyManagement }) => dutyManagement.dutyVisible,
    }),
  },
  components: {},
  methods: {
    ...mapActions([]),
    ...mapActions('login', ['userOut']),
    ...mapMutations(['SET_PLUGIN']),
    ...mapMutations('dutyManagement', ['SET_KEY_CONCERNS_SHOW', 'SET_DUTY_MODEL_SHOW', 'SET_DUTY_STATUS']),
    connectLogout() {
      // 接收Logout socket
      const websocket = getNoticeWebSocket()
      websocket.onmessage = (res) => {
        let { type, body } = res.data
        console.log(type, body) // unescape(str.replace(/\\u/gi, '%u'))
        if (type === 'forceLogout') {
          this.$notify({
            title: '3秒后退出',
            message: `${'下线原因： ' + unescape(body.message.replace(/\\u/gi, '%u'))}`,
            duration: 3000,
          })
          setTimeout(() => {
            this.userOut()
            this.$router.push({ path: '/login' })
          }, 3000)
        }
      }
    },
    startDuty() {
      this.SET_KEY_CONCERNS_SHOW(true)
      this.SET_DUTY_MODEL_SHOW(false)
      this.SET_DUTY_STATUS(true)
      this.$router.push({ path: '/centerDutyManagement/dutyManagement/dutyManagementUser' })
    },
    refuseDuty() {
      this.$confirm('确认取消接班吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.SET_DUTY_MODEL_SHOW(false)
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },
    // 监听用户操作
    mouseClick() {
      if (!this.preventDialogVisible) {
        this.status = true
        this.endTime = new Date().getTime()
        this.startTime = new Date().getTime()
      }
    },
    // 防瞌睡提醒定时器
    times() {
      if (this.preventTime) {
        clearInterval(this.preventTime)
        this.preventTime = null
      }
      this.preventTime = setInterval(() => {
        this.endTime = new Date().getTime()
        if (this.status) {
          if (this.endTime - this.startTime > this.timeInterval * 60000) {
            if (this.localAudio) {
              this.audioTimerFuc()
            }
            this.inputCode = ''
            this.preventDialogVisible = true
            this.errorNum = JSON.parse(JSON.stringify(this.allowErrorNum))
            this.code = Math.round(Math.random() * 10000)
            this.codeCountdown = 60
            this.codeCountdownTime()
            this.status = !this.status
          }
        }
      }, 1000)
    },
    codeCountdownTime() {
      if (this.codeTime) {
        clearInterval(this.codeTime)
        this.codeTime = null
      }
      this.codeTime = setInterval(() => {
        this.codeCountdown--
        if (this.codeCountdown === 0) {
          clearInterval(this.codeTime)
          this.codeTime = null
          this.preventDialogVisible = false
          this.insertPreventSleepyMsgFuc('noInput')
          this.status = true
          this.times()
        }
      }, 1000)
    },
    submitCode() {
      if (Number(this.inputCode) === this.code && this.codeCountdown !== 0) {
        console.log('验证通过')
        clearInterval(this.codeTime)
        this.status = true
        this.times()
        this.preventDialogVisible = false
      } else if (Number(this.inputCode) !== this.code && this.codeCountdown !== 0) {
        if (this.errorNum !== 0) {
          this.$messageError('输入错误，还有' + this.errorNum + '次')
          this.errorNum--
        }
        if (this.errorNum === 0) {
          this.preventDialogVisible = false
          this.$messageError('输入错误，已被记录防瞌睡日志')
          this.insertPreventSleepyMsgFuc('moreErrorNum')
          clearInterval(this.codeTime)
          this.status = true
          this.times()
        }
      }
    },
    // 发送防瞌睡日志记录
    insertPreventSleepyMsgFuc(type) {
      let param = {
        orgId: this.orgId,
        orgName: this.orgName,
        ip: this.userIp,
        name: JSON.parse(sessionStorage.user).name,
        time: new Date().getTime(),
        reason: type === 'noInput' ? '1' : '2',
      }
      insertPreventSleepyMsg(param)
        .then((res) => {
          if (res.data.code === 0) {
            this.$messageWarn('您已被记录防瞌睡日志!')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取平台防瞌睡配置
    getPreventSleepyConfigApiFuc() {
      let param = {
        orgId: this.orgId,
      }
      // 判断当前用户ip是否被绑定防瞌睡
      let markId = JSON.parse(sessionStorage.getItem('macAddress'))
      this.userIp = markId && markId.adaptors && markId.adaptors[0].ip
      getPreventSleepyConfigApi(param)
        .then((res) => {
          if (res.data.code === 0) {
            this.timeInterval = res.data.data.timeInterval
            this.allowErrorNum = res.data.data.errorTimes
            if (
              this.userIp &&
              res.data.data.ipAddr &&
              res.data.data.ipAddr.includes(this.userIp) &&
              res.data.data.start === 1
            ) {
              this.times() // 如果当前用户ip存在于防瞌睡配置中，开启防瞌睡
              if (res.data.data.localAudio === 1) {
                // 1开启本地声音提醒
                this.localAudio = true
              } else {
                this.localAudio = false
              }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    audioTimerFuc() {
      console.log('进入声音播放')
      let param = {
        type: 1,
      }
      getFilePathApi(param).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          let audio = new Audio() // 前端播放本地声音
          audio.controls = true
          audio.src = res.data.data // 声音文件路径
          if (typeof this.audioTimer === 'object') {
            let playPromise = audio.play()
            if (playPromise) {
              console.log('开始播放，时长为' + this.timeInterval * 60 + 'S')
              let second = this.timeInterval * 60
              this.audioTimer = setInterval(() => {
                second--
                if (second <= 0) {
                  audio.pause()
                  console.log('暂停')
                  clearInterval(this.audioTimer)
                  this.audioTimer = null
                }
              }, 1000)
            }
          }
        }
      })
    },
    // 获取当前登录用户的机构信息
    getTreeApiFuc() {
      let param = {
        type: 0,
      }
      getTreeApi(param)
        .then((res) => {
          if (res.data.code === 0) {
            this.orgName = res.data.data && res.data.data.nodes[0].name
            this.orgId = res.data.data && String(res.data.data.nodes[0].id)
            this.getPreventSleepyConfigApiFuc()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  mounted() {
    this.SET_PLUGIN(this.$el.querySelector('#global-plugin'))
    // 获取本级mack 地址
    const talk =
      this.$refs.objectTalk &&
      typeof this.$refs.objectTalk.GetIpAdapterInfo === 'function' &&
      this.$refs.objectTalk.GetIpAdapterInfo()
    sessionStorage.setItem('macAddress', talk)
    // 获取
    // sessionStorage.getItem('macAddress')
    // getWebSocket() // 定时提醒socket推送
  },
  beforeDestroy() {
    this.SET_PLUGIN(null)
    // closeWebSocket()
  },
  created() {
    connectAlarm()
    this.connectLogout()
  },
}
</script>
<style>
/* @import url('./assets/common.less'); */
@import 'assets/fonts/iconfont.css';
@import 'assets/ccb_iconfonts/iconfont.css';
body .el-table th.gutter {
  display: table-cell !important;
}
html,
body,
#app-main {
  margin: 0px;
  padding: 0px;
  min-height: 100%;
}
.v-modal {
  z-index: 90 !important;
}
.el-dialog__wrapper {
  z-index: 100 !important;
}
.ol-popup:after {
  border-top-color: rgba(0, 0, 0, 0.3) !important;
}
.code-countdown {
  text-align: center;
  padding-bottom: 15px;
}
.prevent-model {
  display: flex;
  margin-top: 20px;
}
.code {
  width: 85px;
  color: #fff;
  margin-right: 5px;
  text-align: center;
  height: 31px;
  line-height: 31px;
  background: rgba(0, 153, 255, 1);
}
.prevent-title {
  margin: 0 auto;
  text-align: center;
  width: 80%;
}
</style>
