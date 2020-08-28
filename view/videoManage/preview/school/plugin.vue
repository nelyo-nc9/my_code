<template>
  <div class="single-most-outer" @click.stop="clickEvent(null,1)" @dblclick="clickEvent(null,2)">
    <div class="single-outer">
      <!-- 插件 -->
      <div class="plugin-video" :class="{'small-button': paneMark!==0 && defaultPane===5 && !isMaximize, 'top': appendTopButtons.toggle}" :style="singleStatus.isSyncPlay ? 'position: fixed;top: -9999px;': ''" v-if="singleStatus.playStatus">
        <object ref="object" type="application/x-webplayercontrol"></object>
        <iframe v-if="singleStatus.isPlay && (singleStatus.isButton && (pluginIconShow.showBottomIcon || singleStatus.fullScreen) || appendTopButtons.toggle)" allowTransparency="true"></iframe>
        <div v-if="!singleStatus.isPlayback">
          <div class="plugin-button" v-if="(singleStatus.isButton && singleStatus.isPlay) || singleStatus.fullScreen" @dblclick.stop>
            <div class="plugin-button-box">
              <i class="icon iconfont icon-screenshot" :class="{'disable': !singleStatus.isPlay}" title="抓图" @click="getBase64Capture" v-if="pluginIconShow.screenshot || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.isCentreRecording? 'icon-recplayback' : 'icon-videotape-stop', !singleStatus.isPlay ? 'disable': '']" :title="centrePlayer" @click="singleStatus.isCentreRecording ? stopCentreRecord() : openCentreRecord()" v-if="pluginIconShow.centreRecordIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.isSpeech? 'icon-shipinlei-duijiang': 'icon-shipinleiduijiangjinyong', !singleStatus.isPlay? 'disable': '']" :title="[singleStatus.isSpeech?'关闭对讲':'对讲']" @click="clickSpeech()" v-if="pluginIconShow.speechIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.isBoost? 'icon-nk-close' : 'icon-niaokan']" :title="[singleStatus.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()" v-if="pluginIconShow.niaokanIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont-ccb ccbkuaisushangqiang" title="快速上墙" @click="toWallBtn()" v-if="pluginIconShow.tvwallIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont-ccb ccbkuaisuhuifang" title="快速回放" @click="quickRecode()" v-if="pluginIconShow.quickRecodeIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont-ccb ccbshipinfuhe" title="视频复核" v-if="pluginIconShow.videoCheckIcon || singleStatus.fullScreen" @click="checkVideo"></i>
              <i class="icon iconfont-ccb ccbyuntaikongzhi" :class="{disable: !(singleStatus.source.subType === 3)}" title="云台" @click="PTZClick()" v-if="pluginIconShow.yuntaiIcon || singleStatus.fullScreen"></i>
              <!-- <i class="icon iconfont-ccb ccbguanliankongzhi" title="关联配置" @click="showRelevance = true"></i> -->
              <i class="icon iconfont-ccb ccbmaliuxinxi" title="码流信息" @click="setDetail" v-if="pluginIconShow.detailsIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.showVolume&&singleStatus.isPlay? 'icon-volume': 'icon-mute']" title="伴音" @click="changeSound()" v-if="pluginIconShow.muteIcon || singleStatus.fullScreen"></i>
              <div class="div-null"></div>
              <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()" v-if="pluginIconShow.previewStopIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.fullScreen&&singleStatus.isPlay? 'icon-exit-full-screen': 'icon-quanpingfangda']" :title="[singleStatus.fullScreen?'退出全屏':'全屏']" @click="fullScreen" v-if="pluginIconShow.quanpingfangdaIcon || singleStatus.fullScreen"></i>
              <div class="slot-bottomEnd">
                <!-- 报警管理-事件提醒中窗口下方异常、误报按钮插槽 -->
                <slot name="bottomEnd" :paneMarkInfo="singleStatus" :paneMark="paneMark"></slot>
              </div>
            </div>
          </div>
          <!-- 上方的按钮条 -->
          <div class="plugin-button top" v-if="appendTopButtons.toggle && singleStatus.isPlay" @dblclick.stop>
            <div class="plugin-button-box">
              <i class="iconfont icon-pingtaihulian" title="窗口切换" @click.stop="changeScreen" v-if="appendTopButtons.buttons.includes('change')"></i>
            </div>
          </div>
          <!-- 报警管理-事件提醒中窗口上方自定义按钮插槽 -->
          <div class="top-slot-box" v-if="topEndSlot">
            <iframe class="slot-iframe" v-if="singleStatus.playStatus"></iframe>
            <div class="slot-button">
              <slot name="topEnd" :paneMarkInfo="singleStatus" :paneMark="paneMark"></slot>
            </div>
          </div>
        </div>
        <play-back-button ref="playbackbtn" v-if="singleStatus.isPlayback" :selectedObj="singleStatus" :playBackObj="playBackObj"
          @getCapture="getBase64Capture"
          @goBack="goBack"
          @boost="boost"
          @stopPlayback="stopPlayback"
          @sliderChange="sliderChange"
          @playStop="stopRecordPlay"></play-back-button>
        <!-- 云台控制 -->
        <PTZ v-show="(showPTZ&&singleStatus.isPlay)" :singleStatus="singleStatus"></PTZ>
      </div>
      <!-- 视频遮盖 -->
      <div class="sync-play-shade" v-if="singleStatus.isSyncPlay && !singleStatus.img"></div>
      <img class="sync-play-img" v-if="singleStatus.isSyncPlay && singleStatus.img" :src="singleStatus.img">
      <div class="sync-play-shade" v-if="singleStatus.isSyncPlay && singleStatus.isMiddlePlay"><span @click="$emit('middlePlay', paneMark)" class="icon iconfont icon-play"></span></div>
    </div>
    <!-- 视频复核 -->
    <check-video v-if="showCheckVideo" :showCheck="showCheckVideo" :videoInfo="singleStatus" :isNeedModal="isNeedModal" @cancel="showCheckVideo = false"></check-video>
    <!-- 关联控制 -->
    <!-- <video-relevance v-if="showRelevance"></video-relevance> -->
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import CheckVideo from './checkVideo.vue'
import PlayBackButton from '../iconComponents/playbackButton.vue'
import { OPEN_CENTRERECORD, STOP_CENTRERECORD, recordUserLog, TALK_STREAM_START, manualrecordApi } from '@src/http/video/videoPreview.api.js'
import PTZ from './ptz.vue'
import playback from './playback.js'
// import VideoRelevance from './videoRelevance.vue'
export default {
  components: {
    CheckVideo,
    PTZ,
    PlayBackButton // 快速回放的工具栏
    // VideoRelevance // 关联控制
  },
  props: {
    isNeedModal: { // 二级弹窗是否需要遮罩层
      type: Boolean,
      default: true
    },
    topEndSlot: {
      // 视频窗上方按钮插槽是否显示
      type: Boolean,
      default: false
    },
    singleStatus: {
      type: Object,
      default: () => {
        return {
          playStatus: false, // 画面是否在使用
          isButton: false, // 是否显示插件悬浮条
          isPlay: false, // 是否播放
          img: '' // 图片遮盖的base64
        }
      }
    },
    appendTopButtons: { // 视频窗口上方的按钮
      type: Object,
      default: () => {
        return {
          toggle: false, // 是否显示
          buttons: [] // 显示那些按钮 change
        }
      }
    },
    paneMark: {
      // 当前窗格号
      type: Number,
      default: 0
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 4
    },
    isMaximize: {
      // 单画面(双击)
      type: Boolean,
      default: false
    },
    pluginIconShow: {
      // 单个插件内图标是否显示
      type: Object,
      default: () => {
        return {
          showBottomIcon: true, // 图标按钮条
          hidemenuIcon: true, // 隐藏
          previewStopIcon: true, // 关闭预览
          centreRecordIcon: true, // 紧急录像
          isRecordingIcon: true, // 录像类型
          streamChangeIcon: true, // 码流切换
          screenshot: true, // 截图
          muteIcon: true, // 开启伴音
          yuntaiIcon: true, // 云台
          speechIcon: true, // 对讲
          niaokanIcon: true, // 开启鸟瞰
          tvwallIcon: true, // 快速上墙
          quickRecodeIcon: true, // 快速回放
          videoCheckIcon: true, // 视频复核
          detailsIcon: true, // 详情
          quanpingfangdaIcon: true // 全屏
        }
      }
    }
  },
  mixins: [playback],
  data() {
    return {
      player: null,
      showPTZ: false, // 窗口内显示云台
      tOpen: '', // 预览断线重连开流定时器（仅在插件模式)
      showVideotape: false, // 鼠标移入显示录像类型
      showSetStream: false, // 鼠标移入显示码流切换
      streamArr: [
        { value: 'main', label: '主码流' },
        { value: 'sub1', label: '子码流' }
      ],
      showRelevance: false, // 控制关联配置弹窗
      recordpath: '', // 本地录像存放路径，
      manualrecordLogId: '', // 紧急录像返回的logId(停止时需要传回去)
      showCheckVideo: false
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    }),
    videotapeList() {
      return [
        { value: '本地录像', label: this.localPlayer },
        { value: '中心录像', label: this.centrePlayer }
      ]
    },
    localPlayer() {
      return this.singleStatus.isRecording ? '关闭本地录像' : '本地录像'
    },
    centrePlayer() {
      return this.singleStatus.isCentreRecording ? '关闭紧急录像' : '紧急录像'
    }
  },
  mounted() {
    this.$nextTick(function () {
      setTimeout(() => {
        if (this.$refs.object) {
          this.$refs.object.SetMouseStatusCallback(this.clickEvent)
          this.$refs.object.SetKeyboardCallback(this.pluginEscCall)
          this.$refs.object.SetNotifyCallback(this.notifyCallback)
        }
      }, 100)
    })
  },
  watch: {
    'singleStatus.playStatus': {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (this.singleStatus.isPlayback) { return }            
            if (this.$refs.object) {
              this.$refs.object.SetMouseStatusCallback(this.clickEvent)
              this.$refs.object.SetKeyboardCallback(this.pluginEscCall)
              this.$refs.object.SetNotifyCallback(this.notifyCallback)
            }
          })
        } else {
          this.$nextTick(() => {
            if (this.$refs.object) {
              this.$refs.object.SetMouseStatusCallback(null)
              this.$refs.object.SetKeyboardCallback(null)
              this.$refs.object.SetNotifyCallback(null)
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getVideoConf', 'getMonitorList', 'getTVList']),
    ...mapMutations(['SET_CENTER_VIDEO_ID']),
    checkVideo() {
      this.showCheckVideo = true
    },
    setDetail() { // 设置详情信息
      let isShow = this.$refs.object.IsVideoStreamInfoShow() // 当前码流显示状态
      let streamTypeObj = {
        'main': 0,
        'sub1': 1,
        'sub2': 2
      }
      let sTypeVal = streamTypeObj[this.singleStatus.source.streamType] || 0
      let ipVal = this.singleStatus.source.devIp
      // console.log(isShow, this.singleStatus, 'isShow-----singleStatus++++++++++++')
      if (isShow) {
        this.$refs.object.ShowVideoStreamInfo(sTypeVal, ipVal, !isShow)
      } else {
        this.$refs.object.ShowVideoStreamInfo(sTypeVal, ipVal, !isShow)
      }
    },
    // 返回参数 index：插件窗格号 clicktype：单机还是双击
    clickEvent(index, clickType) {
      console.log('clickEvent touch', index, clickType)
      if (clickType === 1) {
        if (index) {
          console.log('按钮的显示隐藏')
          this.$emit('updateStatus', this.paneMark, { isButton: !this.singleStatus.isButton }, 'isButton')
        }
      }
      this.$emit('clickEvent', index, clickType, this.paneMark)
    },
    toolbarShow() {
      this.$emit('updateStatus', this.paneMark, { isButton: false })
    },
    changeStream(val) {
      this.$parent.changeStream(val)
    },
    openRecording(val) {
      this.$parent.openRecording(val)
    },
    clickRecord() { // 本地录像
      if (!this.singleStatus.isPlay) {
        return
      }
      if (!this.singleStatus.isRecording) {
        this.getVideoConf() // 同步localStorage数据到本地配置
        const type = this.parameters.videotape === 'BSR' ? 'bsr' : 'avi'
        let fileName =
          this.singleStatus.source.cameraName + '-' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
        this.recordpath = this.parameters.localVideoPath + '\\' + fileName.toString()
        const param = {
          path: this.recordpath,
          type: this.parameters.videotape === 'BSR' ? 4 : 6,
          mode: 0
        }
        const pathState = this.$refs.object.RealStartSaveAs(param.path, param.type, param.mode)
        if (pathState) {
          this.$Notice.error({ title: '失败', desc: '录像保存位置出错！' })
        } else {
          this.$emit('updateStatus', this.paneMark, { isRecording: true })
        }
      } else {
        this.closeRecord()
      }
    },
    closeRecord() { // 停止本地录像
      if (!this.singleStatus.isPlay || !this.singleStatus.isRecording) {
        return
      }
      this.$refs.object.CloseRealSaveAs()
      this.$emit('updateStatus', this.paneMark, { isRecording: false })
      this.$Notice.success({ title: '成功', desc: '录像已保存到' + this.recordpath })
      this.recordpath = ''
    },
    openCentreRecord() { // 紧急录像
      if (!this.singleStatus.isPlay || !this.singleStatus.source) {
        return
      }
      let param = {
        isStartOrEnd: 1,
        channelId: this.singleStatus.source.id
      }
      let name = this.centrePlayer
      manualrecordApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(`${name}开启！`, '成功')
          this.manualrecordLogId = res.data.data.logId
          this.$emit('updateStatus', this.paneMark, { isCentreRecording: true })
        } else {
          this.$messageError(`${name}失败，请稍后重试！`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError(`${name}失败，请稍后重试！`, '错误')
      })
    },
    // 关闭紧急录像
    stopCentreRecord() {
      if (!this.singleStatus.isPlay || !this.singleStatus.isCentreRecording) {
        return
      }
      let param = {
        isStartOrEnd: 2,
        logId: this.manualrecordLogId,
        channelId: this.singleStatus.source.id
      }
      let name = this.centrePlayer
      manualrecordApi(param).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess(`${name}成功！`, '成功')
          this.manualrecordLogId = ''
          this.$emit('updateStatus', this.paneMark, { isCentreRecording: false })
        } else {
          this.$messageError(`${name}失败，请稍后重试！`, '错误')
        }
      }).catch(err => {
        console.log(err, 'err')
        this.$messageError(`${name}失败，请稍后重试！`, '错误')
      })
    },
    getCapture() {
      // 截图
      this.getVideoConf() // 同步localStorage数据到本地配置
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let cameraName = this.singleStatus.source ? this.singleStatus.source.cameraName : this.singleStatus.result.name // 回放预览公用 数据兼荣
      let picName = cameraName + '_' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      const state = this.$refs.object.GetPlayerPicture(path, picType)
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      }
    },
    volumechange() {
      // video标签改变音量
      if (this.player.volume() === 0) {
        this.$emit('updateStatus', this.paneMark, { volumeValue: 50, showVolume: false })
      } else {
        this.$emit('updateStatus', this.paneMark, { volumeValue: this.player.volume() * 100, showVolume: true })
      }
    },
    quickStop() {
      let obj = { isPlay: false, playStatus: false, isBoost: false, source: '' }
      if (this.singleStatus.isPlay) {
        this.clearTOpen()
        this.stopCentreRecord()
        this.stopSpeech()
        this.closeSpeech()
        this.closeRecord()
        this.$refs.object.CloseRealStream()
        this.showPTZ = false
      }
      let elementSource = JSON.parse(JSON.stringify(this.singleStatus.source))
      if (elementSource) {
        this.$parent.$emit('stopBack', elementSource)
      }
      this.$emit('updateStatus', this.paneMark, obj)
      this.$parent.videoPageData[this.paneMark] = ''
    },
    notifyCallback() { // 预览断线回调
      // console.log('预览断线回调')
      let inParam = JSON.parse(JSON.stringify(this.singleStatus.source))
      this.$parent.stopPreview(this.paneMark)
      // this.timerOpen(inParam)
    },
    timerOpen(inParam) {
      // 断线后定时重新开流
      this.tOpen = setInterval(() => {
        this.$parent.openIndexPreview(inParam, this.paneMark)
      }, 10000)
    },
    clearTOpen() {
      // 清除断线重新开流定时器
      clearInterval(this.tOpen)
      this.tOpen = null
    },
    boost() {
      // 鸟瞰
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$refs.object.SetPlayLocalBoost()
      this.$emit('updateStatus', this.paneMark, { isBoost: !this.singleStatus.isBoost })
    },
    fullScreen() {
      // 全屏
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$parent.fullScreen('children')
      this.$nextTick(() => {
        // console.log('组件内的变量', this.singleStatus.fullScreen)
        if (this.singleStatus.fullScreen) {
          // this.$parent.isFullScreen = false
          this.$emit('updateStatus', this.paneMark, { fullScreen: false })
        } else {
          // this.$parent.isFullScreen = true
          this.$parent.isMaximize = true
          this.$emit('updateStatus', this.paneMark, { fullScreen: true })
        }
      })
    },
    toWallBtn() { // 上墙
      this.$parent.toWallBtn()
    },
    PTZClick() { // 云台开关 todo 通道类型是球机的才有
      if (!(this.singleStatus.source.subType === 3)) {
        return
      }
      this.showPTZ = !this.showPTZ
    },
    pluginEscCall(index, type, keyCode) {
      // 监听键盘Esc
      if (this.singleStatus.fullScreen && +keyCode === 27) {
        // this.exitFullScreen()
      }
      this.$emit('pluginEscCall', index, type, keyCode)
    },
    // exitFullScreen() {
    //   // 退出全屏
    //   console.log(this.singleStatus, 'this.singleStatus')
    //   this.$refs.object.SetPlayNormalScreen()
    //   this.$emit('updateStatus', this.paneMark, { fullScreen: false })
    // },
    clickSpeech() { // 点击对讲
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$parent.clickSpeech()
    },
    openSpeechEx() { // 对讲
      console.log(this.singleStatus, 'this.singleStatus++')
      const params = {}
      params.devList = []
      params.devList[0] = {
        devIp: this.singleStatus.source.devIp,
        port: this.singleStatus.source.devPort,
        channel: this.singleStatus.source.channel,
        istalk: 'talk'
      }
      // 请求对讲接口
      TALK_STREAM_START(params)
        .then(res => {
          res = JSON.parse(JSON.stringify(res))
          const cmd = {
            params: {
              args: {
                token: access_token, // eslint-disable-line
                devList: [
                  {
                    ip: params.devList[0].devIp,
                    port: params.devList[0].port,
                    channel: params.devList[0].channel,
                    isTalk: 'talk'
                  }
                ]
              }
            }
          }
          const openState = this.$refs.object.OpenSpeechEx(
            JSON.stringify({
              ip: res.data.taIp,
              port: res.data.taPort + '',
              cmdStr: JSON.stringify(cmd)
            })
          )
          let startState = 1
          if (!openState) {
            startState = this.startSpeech()
          }
          if (!openState && !startState) {
            this.$emit('updateStatus', this.paneMark, { isSpeech: true })
            this.$Notice.success({ desc: '开启对讲成功！', title: '提示' })
          } else {
            this.$Notice.error({ title: '失败', desc: '开启对讲失败！' })
          }
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '对讲请求失败！' })
          console.log(err, '对讲请求失败！')
        })
    },
    startSpeech() { // 插件开始对讲
      this.$refs.object.StartSpeech(false)
    },
    stopSpeech() { // 插件暂停对讲
      this.$refs.object.StopSpeech()
    },
    closeSpeech() { // 插件关闭对讲
      if (this.singleStatus.isSpeech && !this.$refs.object.CloseSpeech()) {
        this.$emit('updateStatus', this.paneMark, { isSpeech: false })
      }
    },
    changeSound() {
      // 音量开关
      if (!this.singleStatus.isPlay) {
        return
      }
      if (this.singleStatus.showVolume) {
        this.closeSound()
      } else {
        this.openSound()
        this.setSoundValue(50)
      }
    },
    openSound() {
      // 打开伴音
      this.$refs.object.OpenPlayerSound()
      this.$emit('updateStatus', this.paneMark, { showVolume: true })
    },
    closeSound() {
      // 关闭伴音
      this.$refs.object.StopPlayerSound()
      this.$emit('updateStatus', this.paneMark, { showVolume: false, volumeValue: 50 })
    },
    setSoundValue(value) {
      // 设置伴音大小
      this.$refs.object.SetPlayerVolume(value)
      this.$emit('updateStatus', this.paneMark, { volumeValue: value })
    },
    getSoundValue() {
      // 获取伴音大小
      if (!this.singleStatus.isPlay) {
        return
      }
      return JSON.parse(this.$refs.object.GetPlayerVolume())
    },
    setStreamPlayerToolStringEx(strTools, bShowStream) {
      // 设置码流提示字符串
      // strTools:需要追加的提示字符串
      // bShowStream:是否显示码流信息
      if (!this.singleStatus.isPlay) {
        return
      }
      return this.$refs.object.SetStreamPlayerToolStringEx(strTools, true)
    },
    async caseProcessCover() { // 遮盖
      const src = await this.getCoverPic()
      if (src) {
        this.$parent.videoStatusArr[0].isMiddlePlay = true
        this.$parent.videoStatusArr[0].img = src
        this.$parent.videoStatusArr[0].isSyncPlay = true
        this.closeSound()
      }
    },
    caseProcessShow() { // 恢复显示
      if (
        this.$parent.videoStatusArr[0].img ||
        this.$parent.videoStatusArr[0].isSyncPlay ||
        this.$parent.videoStatusArr[0].isMiddlePlay
      ) {
        this.$parent.videoStatusArr[0].img = ''
        this.$parent.videoStatusArr[0].isSyncPlay = false
        this.$parent.videoStatusArr[0].isMiddlePlay = false
      }
    },
    changeScreen() { // 大小窗口切换
      this.$emit('changeScreen', this.paneMark)
    },
    // 修改图像调节
    async SetPlayerPicParam(param) {
      return this.$refs.object.SetPlayerPicParam(param)
    },
    // 获取图像调节
    async GetPlayerPicParam(param) {
      this.$refs.object.SetPlayerPicEnable(true) // 图像调节先要调用这个方法
      return this.$refs.object.GetPlayerPicParam(JSON.stringify(param))
    },
    // 快速回放
    quickRecode() {
      let data = this.$lodash.cloneDeep(this.singleStatus.source)
      this.$emit('stopPreview', this.paneMark, true)
      this.$emit('updateStatus', this.paneMark, { playStatus: false, isPlay: false, isPlayback: true })
      this.$nextTick(() => {
        this.openPlayback(data)
      })
    },
    // 画面模式
    setScale(type) {
      return this.$refs.object.SetPlayStretchBlt(type.w, type.h, type.auto)
    }
  },
  beforeDestroy() {
    this.clearTOpen()
    if (this.player) {
      this.player.dispose()
    }
    // this.stopCentreRecord()
    this.closeRecord()
    if (this.singleStatus.isSpeech) {
      this.stopSpeech()
      this.closeSpeech()
    }
  }
}
</script>

<style lang="less" scoped>
.single-most-outer {
  position: relative;
  z-index: 99;
  vertical-align: middle;
  box-sizing: border-box;
  border: 1px solid #ddd;
  display: inline-block;
  font-size: 12px;
  width: 100%;
  height: 100%;
}
.single-outer {
  position: relative;
  width: 100%;
  height: 100%;
  .sync-play-shade {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #000;
    span {
      font-size: 100px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
  }
  .sync-play-img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    vertical-align: middle;
    width: 100%;
    z-index: 2;
  }
  .plugin-video,
  .label-video {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  .plugin-video {
    position: relative;
    object {
      position: absolute;
      width: 100%;
      height: 100%;
      // z-index: 999;
    }
    iframe {
      width: 100%;
      height: 32px;
      position: absolute;
      bottom: 0px;
      background: #333;
      border: 0px;
      left: 0px;
    }
    .top-slot-box {
      position: absolute;
      top: 0px;
      right: 0px;
      text-align: right;
      .slot-iframe {
        height: 100%;
        z-index: 1;
        background: transparent;
        top: 0px;
        right: 0px;
        position: absolute;
        border: none;
      }
      .slot-button {
        position: relative;
        z-index: 100;
      }
    }
    .plugin-button {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      overflow-x: auto;
      .plugin-button-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .slot-bottomEnd {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
        }
        .disable,
        .disable:hover {
          color: #878282;
        }
        .dp-con {
          position: relative;
          display: inline-block;
          ul {
            position: absolute;
            background-color: #335589;
            list-style: none;
            color: snow;
            text-align: center;
            line-height: 25px;
            padding: 0 6px;
            border-radius: 4px;
            top: 3px;
            right: 37px;
            i {
              display: block;
              position: absolute;
              background: #335589;
              width: 10px;
              height: 10px;
              transform: rotate(45deg);
              top: 7px;
              right: -13px;
            }
            li {
              display: inline;
              white-space: nowrap;
              line-height: 25px;
              padding: 0 8px;
              border-right: 1px solid hsla(0, 0%, 100%, 0.1);
            }
            .active {
              color: #fda54b;
            }
          }
          li:hover {
            color: #fda54b;
            cursor: pointer;
            margin: 2px 0;
          }
        }
        .div-null {
          display: flex;
          flex: 1;
        }
        i {
          font-size: 1.7em;
          margin: 0 8px;
          line-height: 30px;
          color: #fff;
          cursor: pointer;
        }
      }
      &.top {
        top: 0;
        .plugin-button-box {
          justify-content: flex-end;
          i:hover {
            color: #00a5e3;
          }
        }
      }
    }
  }
  .plugin-video.top {
    iframe {
      top: 0;
      height: 30px;
    }
  }
  .small-button {
    iframe {
      height: 30px;
    }
    .plugin-button {
      height: 30px;
      .plugin-button-box {
        i {
          font-size: 12px;
          margin: 0 3px;
        }
      }
    }
  }
}
.PTZbuttonBars {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  background: #ddddee;
  .buttonBar-box {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    bottom: 0;
  }
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
::-webkit-scrollbar {
  height: 4px;
  background-color: #333;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  height: 4px;
  width: 50%;
  background: #666;
}
// ::-webkit-scrollbar-thumb:horizontal:hover{
//   background-color: #999;
// }
</style>
