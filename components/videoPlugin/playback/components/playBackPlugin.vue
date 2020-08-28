<template>
  <div @mousedown="clickVideoHierarchy($event)" style="width: 100%; height: 100%">
    <VideoHierarchy ref="rootVideoHierarchy" hierachyWidth="100%" hierachyHeight="100%" :class="[isFullScreen ? 'fs' : '']">
      <div id="videoBox" class="video-plugin" :class="[isFullScreen ? 'fs' : '', buttonFreedom && !isFullScreen ? 'buttonFreedom' : '']">
        <div class="single-video-plugin" ref="singleVideo" :style="{ height: isButton ? `calc(100% - ${singleVideoHeight}px)` : '100%' }">
          <plugin ref="plugin" v-for="(item, index) in panesArr[panesArr.length-1].value" :key="index" :paneMark="index" :style="{
              width: (isMaximize&&index===checkedPane) ? '100%' : wd,
              height: (isMaximize&&index===checkedPane) ? '100%' : ht,
            }" :class="className(index)" :appendTopButtons="appendTopButtonsFun(index)" :singleStatus="videoStatusArr[index]" @middlePlay="middlePlay" @clickEvent="clickEventP" @updateStatus="updateStatus" @pluginEscCall="pluginEscCall" @changeScreen="changeScreen"></plugin>
        </div>
        <div class="master-control" :style="{ bottom: isBottonToggle ? '0px' : `${singleVideoHeight}px` }">
          <div class="progress-bar-parent" v-if="configuration.progressBar.show">
            <div class="progress-bar">
              <span class="play-time" v-if="configuration.progressBar.type == ''">{{$moment(playTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
              <span class="occurrence-time" v-show="false" :style="{'left': occurrenceTimeLeft + '%'}"></span>
              <div class="total-time" v-if="configuration.progressBar.type == ''">
                <span>{{progressNow}} / {{progressTotalTime}}</span>
              </div>
              <div class="slide-mon-f">
                <!-- <Slider
                  class="slide-mon"
                  :value="progress"
                  @on-change="sliderChange"
                  :tip-format="sliderFormat"
                ></Slider>-->
              </div>
            </div>
          </div>
          <div class="video-bottom" v-if="isButton" :class="[isBottonToggle ? 'bottonShow' : 'bottonHide']">
            <div v-for="(icon,index) in iconShow" :key="icon.name + '_' + index" :style="icon.type == 'left' ? {position:'absolute',left:icon.normalPx+ 'px'}:{position:'absolute',right:icon.normalPx+ 'px'}">
              <component v-if="!icon.slotName" :is="icon.name" :selectedObj="selectedObj" :panesArr="panesArr" :useSubStream="useSubStream" :checkedWmode="checkedWmode" :checkedScreenMode="checkedScreenMode" :videoStatusArr="videoStatusArr" :iconPosition="icon.type" :iconPlay="iconPlay" :shearDownload="shearDownload" :isSyncF="isSync" @iconClick="iconClick"></component>
              <slot v-else :name="icon.slotName" :style="{width: icon.width}"></slot>
            </div>
          </div>
        </div>
        <TimeProgress ref="mychild" v-if="configuration.timeline.show" :deScreen="checkedWmode" @ondrag="getTimeFromChild" @changeParentIndex="getIndexFromChild" @changeSync="getSyncFromChild" :isSyncT="isSync" :isCenter="isCenterP" :checkedPaneP="checkedPane"></TimeProgress>
      </div>
    </VideoHierarchy>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import { vodCtrl, AV_RECORD_LIST } from '@http/video/videoPlayback.api.js'
import VideoHierarchy from './videoHierarchy'
import plugin from './index'
import TimeProgress from './timeProgress'
import FullScreen from './iconComponents/FullScreen'
import MultiScreen from './iconComponents/MultiScreen'
import NiaoKan from './iconComponents/NiaoKan'
import ScreenShot from './iconComponents/ScreenShot'
import SplitMode from './iconComponents/SplitMode'
import Stop from './iconComponents/Stop'
import StopAll from './iconComponents/StopAll'
import TVWall from './iconComponents/TVWall'
import Volume from './iconComponents/Volume'
import ScreenMode from './iconComponents/ScreenMode'
import Download from './iconComponents/Download'
import CutDownload from './iconComponents/CutDownload'
import Play from './iconComponents/Play'
import ZhuZhen from './iconComponents/ZhuZhen'
import PlaySpeed from './iconComponents/PlaySpeed'
import Rewind from './iconComponents/Rewind'
import Attention from './iconComponents/Attention'
import {
  openPlaybackList,
  stopRecordPlay,
  downloadVideoSegments,
  checkVideoList,
  videoFilter,
  setRecordPlayerRate,
  setRecordPlayerMode,
  getPicture,
  openSound,
  closeSound,
  setVolume,
  getVolume,
  setScale,
  formatSpendTime,
  byteConversion,
  formatRecordType,
  downloadDev
} from '../common/playback.js'

export default {
  components: {
    VideoHierarchy,
    plugin,
    TimeProgress,
    FullScreen,
    MultiScreen,
    NiaoKan,
    Stop,
    StopAll,
    SplitMode,
    ScreenShot,
    Volume,
    TVWall,
    ScreenMode,
    Download,
    CutDownload,
    Play,
    ZhuZhen,
    PlaySpeed,
    Rewind,
    Attention
  },
  props: {
    type: {
      // 为某些模块定制使用
      type: String,
      default: 'back' // relayTracking 接力追踪， map 地图
    },
    panesArr: {
      // 画面分割配置
      type: Array,
      default: () => [
        { value: 1, label: '单画面' },
        { value: 4, label: '4画面' },
        { value: 9, label: '9画面' },
        { value: 16, label: '16画面' }
      ]
    },
    modeArr: {
      // 画面分割配置
      type: Array,
      default: () => [
        { value: 1, label: '原比例' },
        { value: 2, label: '自适应' }
      ]
    },
    isButton: {
      // 视频窗下方总按钮条 是否显示
      type: Boolean,
      default: true
    },
    buttonFreedom: {
      // 是否使主按钮栏通过点击显隐
      type: Boolean,
      default: false
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 4
    },
    configuration: {
      // 配置项
      type: Object,
      default: () => {
        return {
          progressBar: {
            show: false, // 是否配置进度条
            type: '' // curtime代表显示当前播放时间 //totaltime：代表显示当时时间/总时间,""：代表只显示进度条不显示任何配置
          },
          timeline: {
            show: true, // 是否配置时间轴
            syncTypeFlag: true, // 是否配置同步异步功能
            periodFlag: true, // 是否配置周期切换功能
            SliceFlag: true, // 是否配置切片功能
            passageName: true // 是否配置通道名称功能
          },
          buttos: []
        }
      }
    },
    iconShow: {
      // 对应图标是否显示
      type: Array,
      default: () => {
        return []
      }
    },
    appendTopButtons: {
      // 视频窗口上方的按钮
      type: Object,
      default: () => {
        return {
          toggle: false, // 是否显示
          buttons: [] // 显示那些按钮 change: 交换
        }
      }
    },
    windowAdapter: {
      // 窗口适配参数
      type: Array,
      default: () => []
    },
    isCenterP: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    wd() {
      const wd = (100 / Math.sqrt(this.checkedWmode)).toFixed(2)
      return `calc(${wd}% - 4px)`
    },
    ht() {
      return this.wd
    },
    selectedObj() {
      // 选中项状态值
      return this.videoStatusArr[this.checkedPane]
    },
    iconPlay() {
      let icon = ''
      if (this.isSync) {
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.isPlay) {
            icon = 'icon-pause'
            break
          }
          if (index === this.videoStatusArr.length - 1) {
            icon = 'icon-play'
          }
        }
      } else {
        icon = this.selectedObj.isPlay ? 'icon-pause' : 'icon-play'
      }
      return icon
    },
    // 视频窗格高度
    singleVideoHeight() {
      // 要减去的按钮及操作栏高度
      let height = 0
      if (this.configuration.timeline.show) {
        // 时间轴 + 按钮
        return 200 + 60
      } else if (this.configuration.progressBar.show) {
        // 进度条 + 按钮
        return 24 + 56 + height
      }
      // 按钮
      return 56 + height
    }
  },
  created() {
    this.initBtn()
    for (let i = 0; i < 25; i++) {
      this.screenIndex[i] = i
    }
    this.initializeArr()
  },
  data() {
    return {
      screenIndex: {}, // 窗口下标
      originalState: {
        isPlugin: true, // 是否使用插件 千万别删
        playStatus: false, // 插件是否加载
        isButton: false, // 小窗格上是否需要按钮条
        isPlay: false, // 是否播放
        result: {}, // 回放录像段信息
        dumpHandle: '', // 录像下载句柄 有就正在下载，页面切换后无效
        isSyncPlay: false, // 同步播放用来遮罩视频框的 显示黑色
        showVolume: false, // 是否显示音量滑块
        volumeValue: 50, // 音量值
        img: '', // 遮盖图片 Base64
        isMiddlePlay: false, // 画面中间播放按钮
        pitchSpeed: { value: { nRate: 1, nScale: 1 }, label: '1', icon: 'icon-speed', control: 3 }, // 倍速选中项
        lookDown: false // 鸟瞰状态
      }, // 状态数组中每项最初的值 用来恢复初始值使用
      isFullScreen: false, // 是否使用全屏
      checkedPane: 0, // 当前选中视频框的index
      showmodeShow: false, // 窗格配置显示
      showSpeed: false, // 倍速调节配置显示
      shearDownload: false, // 剪辑下载确认弹窗是否显示
      shearStatusObj: {
        // 剪辑相关数据对象
        startEditing: false, // 鼠标是否按下
        clientX: 0, // 鼠标按下位置
        direction: '', // 操作的是左还是右
        shearSectionStartEditing: false // 点击录像段
      },
      shearSectionConfiguration: {
        width: 200,
        left: 50,
        startTime: '00:00:00',
        endTime: '00:00:00',
        timestampStartTime: 0,
        timestampEndTime: 0
      }, // 剪切段div的显示信息
      speedIcon: 'icon-speed', // 当前选中倍速图标
      speedList: [
        // 新加流控协议字段 1：暂停，2：停止，3 一倍速 4 二倍速 5 四倍速 6 八倍速 7 16倍速 8 1/2倍速 9 1/4倍速  10 1/8倍速 11 1/16倍速
        { value: { nRate: 1, nScale: 16 }, label: '1/16', icon: 'icon-1-16', control: 11 },
        { value: { nRate: 1, nScale: 8 }, label: '1/8', icon: 'icon-1-8', control: 10 },
        { value: { nRate: 1, nScale: 4 }, label: '1/4', icon: 'icon-1-4', control: 9 },
        { value: { nRate: 1, nScale: 2 }, label: '1/2', icon: 'icon-1-2', control: 8 },
        { value: { nRate: 1, nScale: 1 }, label: '1', icon: 'icon-speed', control: 3 },
        { value: { nRate: 2, nScale: 1 }, label: '2', icon: 'icon-2', control: 4 },
        { value: { nRate: 4, nScale: 1 }, label: '4', icon: 'icon-4', control: 5 },
        { value: { nRate: 8, nScale: 1 }, label: '8', icon: 'icon-8', control: 6 },
        { value: { nRate: 16, nScale: 1 }, label: '16', icon: 'icon-16', control: 7 }
      ], // 倍速
      checkedWmode: this.defaultPane, // 当前窗格数量
      checkedScreenMode: 1,
      isMaximize: false, // 单画面
      videoStatusArr: [], // 视频窗格状态数组
      showWall: false, // 上墙弹窗状态
      wallStatus: {}, // 电视墙上墙状态
      //  进度条变量 start
      progress: 0, // 进度条进度
      progressTimer: null, // 进度条定时器
      isOperation: false, // 进度条是否被操作
      playTime: new Date().getTime() / 1000, // 回放视频当前时间
      occurrenceTimeLeft: 0, // 进度条标记时间
      progressTotalTime: '00:00:00',
      progressNow: '00:00:00',
      // 进度条变量end
      middlePlayFatherStatus: false, // 停止后 是否需要窗格中间播放按钮
      playOverCallback: () => { }, // 窗格播放完毕的回调
      signVideoSegment: [], // 传来的要标记的录像段 暂时 单轴使用
      isBottonToggle: false, // 是否显示按钮栏
      changeScreenFunArr: [], // 窗格顺序暂存
      useSubStream: true, // 是否子码流预览
      isSync: false, // 同步异步
      splitOpenFlag: false, // 是否是分段回放
      clickSplit: false
    }
  },
  methods: {
    // 点击检索时候获取同步异步状态
    getSyncStatus(isSyncP) {
      this.isSync = isSyncP
    },
    sliderFormat() {
      return null
    },
    // 请求全屏
    requestFull() {
      screenfull.request(document.getElementById('videoBox'))
    },
    // 关闭全屏
    escScreenFull() {
      screenfull.exit()
    },
    // 计算底部按钮的位置
    initBtn() {
      var leftArr = []
      var rightArr = []
      var lastNum = 0
      var lastNumR = 0
      this.iconShow.forEach((v, i) => {
        v.normalPx = 0
        v.type === 'left' ? (leftArr[v.index] = v) : (rightArr[v.index] = v)
      })
      leftArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          v.normalPx = lastNum + (Number(v.width) || 36)
          lastNum = v.normalPx
        }
      })
      rightArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          v.normalPx = lastNumR + (Number(v.width) || 36)
          lastNumR = v.normalPx
        }
      })
    },
    // 页面大小发生变化，重新渲染时间轴
    clickResize() {
      this.$refs.mychild.resizefun()
    },
    // 接受点击事件
    iconClick(funcName, value) {
      value ? this[funcName](value) : this[funcName]()
    },
    // 分段点击
    splitOpen(flag) {
      if (flag) {
        this.splitOpenFlag = true
      } else {
        this.splitOpenFlag = false
        if (this.clickSplit) {
          this.stopBackALL()
          this.clickSplit = false
        }
      }
    },
    // 分段回放点击时间分段
    splitSegTime(data) {
      this.stopBackALL()
      let arr = []
      if (this.isCenterP) {
        data.dataArr.forEach((v, i) => {
          var obj = {}
          obj.name = data.selectedObj.name
          obj.channel = data.selectedObj.channel
          obj.devIp = data.selectedObj.devIp
          obj.devPort = data.selectedObj.devPort
          obj.eventType = data.selectedObj.eventType
          obj.dPort = data.selectedObj.dPort
          obj.streamType = data.selectedObj.streamType
          obj.page = data.selectedObj.page
          obj.rows = data.selectedObj.rows
          obj.isCenter = data.selectedObj.isCenter
          obj.startTime = v.startTime
          obj.endTime = v.endTime
          arr.push(obj)
        })
      } else {
        data.dataArr.forEach((v, i) => {
          var obj = {}
          obj.name = data.selectedObj.fileName
          obj.channel = data.selectedObj.channel
          obj.devIp = data.selectedObj.devIp
          obj.devPort = data.selectedObj.devPort
          obj.recordType = data.selectedObj.recordType
          obj.dPort = data.selectedObj.dPort
          obj.sTime = v.startTime
          obj.eTime = v.endTime
          obj.isCenter = data.selectedObj.isCenter
          arr.push(obj)
        })
      }
      var mode = { value: data.curNum }
      this.clickCheckedWmode(mode)
      this.$refs.mychild.changeFn({
        screenNum: data.curNum,
        index: 0,
        type: ''
      })
      this.checkedPane = 0
      this.openPlayback(arr)
      this.clickSplit = true
    },
    // 点击画面模式
    clickScreenMode(v) {
      setScale(this.pluginDom(this.checkedPane), v.label)
    },
    // 关闭全部按钮调用事件
    stopBackALL() {
      this.stop()
      this.$refs.mychild.closeT()
    },
    // 停止按钮调用事件
    stopBack() {
      this.stop(this.checkedPane, false)
      this.updateStatus()
    },
    // 剪切打开
    cutDownload() {
      if (this.selectedObj.playStatus) {
        this.shearDownload = true
        this.$refs.mychild.initCut()
        this.$refs.mychild.JQ()
      }
    },
    // 剪切保存按钮调用事件
    async cutDownloadSave() {
      let result = JSON.parse(JSON.stringify(this.selectedObj.result))
      var row = {
        dPort: result.dPort || result.dsPort,
        endTime: this.$moment(this.$refs.mychild.shearSectionConfiguration.timestampEndTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        fileName: result.fileName || result.name,
        fileSize: byteConversion(result.filesize || result.eventList[0].evtTblInfo.size),
        fileType: formatRecordType(result.recordType || result.fileType),
        startTime: this.$moment(this.$refs.mychild.shearSectionConfiguration.timestampStartTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        timeLang: formatSpendTime(this.$refs.mychild.shearSectionConfiguration.timestampStartTime, this.$refs.mychild.shearSectionConfiguration.timestampEndTime),
        result: result
      }
      row.isCenter = this.isCenterP
      downloadDev(row, new Date().getTime() + this.defaultPane)
      // result.startTime = this.$refs.mychild.shearSectionConfiguration.timestampStartTime
      // result.endTime = this.$refs.mychild.shearSectionConfiguration.timestampEndTime
      // result.fileName = 'C:Download'
      // let res = await downloadVideoSegments(this.pluginDom(this.checkedPane), result, true)
      // if (res.success) {
      //   this.$message(`录像开始下载, 下载路径为: ${result.fileName}`)
      // } else {
      //   this.$message.error(`剪辑下载失败！`)
      // }
      this.$refs.mychild.closeCut()
      this.shearDownload = false
    },
    // 取消剪切的调用事件
    cutDownloadCancel() {
      this.$refs.mychild.closeCut()
      this.shearDownload = false
    },
    // 打开下载按钮调用事件
    openDownload() {
      if (this.selectedObj.dumpHandle) {
        return
      }
      this.downloadVideo([this.selectedObj.result], false, this.downloadCallback)
        .then(res => {
          res = JSON.parse(JSON.stringify(res))
          let err = ''
          res.forEach(item => {
            if (!item.success) {
              err += `${this.selectedObj.result.name}_`
            } else {
              this.selectedObj.dumpHandle = item.DumpHandle
            }
          })
          if (err !== '') {
            this.$message.error(`${err}下载失败！`)
          } else {
            this.$message.error(`录像开始下载, 下载路径为: ${this.selectedObj.result.fileName}`)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下载回调
    downloadCallback(val) {
      for (const iterator of this.videoStatusArr) {
        if (Number(iterator.dumpHandle) === Number(val)) {
          iterator.dumpHandle = ''
        }
      }
    },
    // 下载视频方法
    downloadVideo(data = [], isQuery = false, callback = () => { }) {
      let download = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        element.fileName = '123'
        download.push(downloadVideoSegments(this.pluginDom(this.checkedPane), element, isQuery, callback))
      }
      return Promise.all(download)
    },

    // 截图调用事件
    getPic() {
      var param = {
        // path: 'C:BC8100Capture',
        path: `D:\\BC8100\\Capture\\${this.videoStatusArr[this.checkedPane].result.fileName}-${this.$moment().format('YYYYMMDDHHmmss')}.jpg`,
        type: 1 // 0-bmp 1-jpg
      }
      var tt = getPicture(this.pluginDom(this.checkedPane), param)
      // console.log(tt, 'T')
    },
    // 鸟瞰调用事件
    clickLookDown() {
      this.pluginDom(this.checkedPane).SetPlayLocalBoost()
      this.updateStatus(this.checkedPane, { lookDown: !this.videoStatusArr[this.checkedPane].lookDown })
    },
    // 声音开关调用事件
    volumeSwitch() {
      // 音量开关
      if (!this.selectedObj.isPlay) {
        return
      }
      if (this.selectedObj.showVolume) {
        closeSound(this.pluginDom(this.checkedPane))
        this.updateStatus(this.checkedPane, { showVolume: false })
      } else {
        for (let index = 0; index < this.defaultPane; index++) {
          // 关闭所有音量
          if (this.videoStatusArr[index].showVolume) {
            closeSound(this.pluginDom(index))
          }
        }
        openSound(this.pluginDom(this.checkedPane))
        setVolume(this.pluginDom(this.checkedPane), 50)
        let soundStatue = getVolume(this.pluginDom(this.checkedPane))
        if (soundStatue.success) {
          let objVolumeValue = { volumeValue: soundStatue.Volume }
          this.updateStatus(this.checkedPane, { showVolume: true })
          this.updateStatus(this.checkedPane, objVolumeValue)
        } else {
          this.$Notice.warning({ title: '警告', desc: '音量获取失败！' })
        }
      }
    },
    // 声音改变调用事件
    changeVolume(v) {
      // 设置音量大小
      if (!this.selectedObj.isPlay) {
        return
      }
      setVolume(this.pluginDom(this.checkedPane), v)
    },
    // 倍速切换调用事件
    clickSpeed(speed) {
      if (this.isSync) { // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { pitchSpeed: speed })
            setRecordPlayerRate(this.pluginDom(index), speed.value)
            this.controlProtocol(speed.control, index)
          }
        }
      } else { // 异步
        this.updateStatus(this.checkedPane, { pitchSpeed: speed })
        setRecordPlayerRate(this.pluginDom(this.checkedPane), speed.value)
        this.controlProtocol(speed.control)
      }
    },
    // 逐帧进调用事件
    clickByFrame() {
      if (this.isSync) { // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { isPlay: false })
            setRecordPlayerMode(this.pluginDom(index), 1)
          }
        }
      } else { // 异步
        setRecordPlayerMode(this.pluginDom(this.checkedPane), 1)
        this.updateStatus(this.checkedPane, { isPlay: false })
      }
    },
    // 点击停止处理函数
    playStop() {
      // 播放暂停
      if (!this.selectedObj.playStatus) { // 未开启画面的不予许点击
        return
      }
      // let recordPlayerCurTime = checkedResult.dsServerId ? JSON.parse(this.pluginDom(this.checkedPane).GetSpeechPlayerCurTime()) : JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
      setRecordPlayerMode(this.pluginDom(this.checkedPane), 0) // 切回正常播放模式
      let playStatus = false
      let checkedResult = this.videoStatusArr[this.checkedPane].result
      // 不是获取数据自动开流，而是通过点击播放按钮开流时 code
      try {
        let recordTime = {}
        if (checkedResult.dsServerId) {
          recordTime = JSON.parse(this.pluginDom(this.checkedPane).GetSpeechPlayerCurTime())
        } else {
          recordTime = JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
        }
        if (recordTime.success) {
          playStatus = false
        } else {
          playStatus = true
        }
      } catch (err) {
        playStatus = false
      }

      // 判断当前状态，是 播放/暂停 || 停止 状态
      let status = this.iconPlay === 'icon-play' // 暂停状态为true， 播放状态为false
      if (
        !this.selectedObj.isPlay &&
        this.selectedObj.playStatus &&
        Object.keys(this.selectedObj.result).length !== 0 &&
        playStatus
      ) {
        // 状态（未播放状态 || 已播放完成状态）
        if (this.isSync) { // 同步状态
          if (status) { // 同步关闭时要关闭定时器
            this.syncTime()
            let data = []
            for (const iterator of this.videoStatusArr) {
              if (Object.keys(iterator.result).length !== 0) {
                data.push(JSON.parse(JSON.stringify(iterator.result)))
              }
            }
            this.openSyncPlayback(data)
          } else {
            window.clearInterval(this.progressTimer)
          }
        } else {
          this.$refs.mychild.queryBackVideo(this.videoStatusArr[this.checkedPane].result, this.checkedPane)
          // 异步状态
          // 该录像为放完了， 当点击播放时 重头开始放
          this.$emit('playStatus', 3) // 3是播放
          this.anewOpenPlayback('', true)
          this.timer()
        }
      } else { // 正在播放中 || 暂停中
        if (!this.isSync) { // 异步
          if (this.selectedObj.isPlay) {
            // 发出暂停事件
            this.$refs.mychild.pauseT(this.checkedPane)
            this.$emit('playStatus', 1) // 1是暂停，2是停止
            // this.controlProtocol(1)
          } else {
            if (Object.keys(this.videoStatusArr[this.checkedPane].result).length == 0) {
            } else {
              this.$refs.mychild.startT(this.checkedPane)
            }
            this.$emit('playStatus', 3) // 3是播放
            // this.controlProtocol(3)
          }
          this.updateStatus(this.checkedPane, { isPlay: !this.selectedObj.isPlay })
          stopRecordPlay(this.pluginDom(this.checkedPane), this.selectedObj.isPlay)
        }
      }
      if (this.isSync) { // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { isPlay: status })
            stopRecordPlay(this.pluginDom(index), status) // false 时暂停
            this.controlProtocol(status ? 3 : 1, index)
            if (!status) {
              window.clearInterval(this.progressTimer)
            } else {
            }
          }
        }
        this.$emit('playStatus', status ? 1 : 3)
      }
    },
    // 异步回放请求
    async openSyncPlayback(data, isQuery = true, isAppend = true) {
      /*
       * isAppend : 是否是添加新播放画面
       */
      // this.matchingPane(data.length)
      data = JSON.parse(JSON.stringify(data)) // 拷贝数据防止更改数据报错
      this.isSync = true
      if (isAppend) {
        // 新加视频播放
        let videoList = []
        for (let index = 0; index < data.length; index++) {
          videoList.push(checkVideoList(data[index]))
        }
        let res = await Promise.all(videoList)
        let channelSum = 0
        for (let index = 0; index < res.length; index++) {
          const element = res[index]
          if (typeof element.data !== 'object' || element.data.result.eventList.length === 0) {
            channelSum += 1
            continue
          }
          let filterList = JSON.parse(JSON.stringify(videoFilter(element.data.result, data[index])))
          // 新增的按之前播放时间播放
          filterList.newStartTime = this.playTime
          filterList = Object.assign(JSON.parse(JSON.stringify(data[index])), filterList)
          let checkedPane = this.findFreePane()
          this.updateStatus(checkedPane, { result: filterList })

          this.updateStatus(checkedPane, { isPlugin: true, playStatus: true, isButton: false, isPlay: false }) // 提前加载插件 同步回放
          this.$nextTick(async () => {
            let [status, result] = await openPlaybackList(
              this.pluginDom(checkedPane),
              this.videoStatusArr[checkedPane].result,
              false,
              true
            )
            if (status instanceof Object) {
              this.$message.error(status.msg)
              return
            }
            if (status !== 0) {
              this.$message.error('开流失败！')
              return
            }
            this.updateStatus(checkedPane, { isPlay: true, result: result })
            if (!this.progressTimer) {
              // 如果当前没开定时器就打开
              this.syncTime(data[index].startTime)
            }
          })
        }
        if (channelSum !== 0) {
          this.$message.error(`${channelSum}个通道查询无录像`)
        }
        return
      }
      this.stop(undefined, false, true, false, false)
      // 同步回放
      let playbackNumber = data.length
      if (data.length > this.checkedWmode) {
        this.$message('无空闲窗口显示更多通道！')
        playbackNumber = this.checkedWmode
      }
      let videoList = []
      for (let index = 0; index < playbackNumber; index++) {
        videoList.push(checkVideoList(data[index])) // 查询
      }
      Promise.all(videoList)
        .then(res => {
          for (let index = 0; index < res.length; index++) {
            const element = res[index]
            if (typeof element.data !== 'object' || element.data.result.eventList.length === 0) {
              continue
            }
            this.updateStatus(index, { isPlugin: true, playStatus: true, isButton: false, isPlay: false }) // 提前加载插件 同步回放
            let filterList = JSON.parse(JSON.stringify(videoFilter(element.data.result, data[index])))
            filterList.newStartTime = data[index].time ? data[index].time : filterList.eventList[0].evtTblInfo.startTime
            filterList = Object.assign(JSON.parse(JSON.stringify(data[index])), filterList)
            this.updateStatus(index, { result: filterList })
          }
          // 找一个时间最早的
          let oneIndex = ''
          // 找一个结束时间最晚的
          let lateTime = ''
          for (let index = 0; index < this.videoStatusArr.length; index++) {
            let result = this.videoStatusArr[index].result
            if (Object.keys(result).length === 0 || result.eventList.length === 0) {
              continue
            }
            if (oneIndex === '') {
              oneIndex = index
              lateTime = result.endTime
              continue
            }
            if (
              result.eventList[0].evtTblInfo.startTime <
              this.videoStatusArr[oneIndex].result.eventList[0].evtTblInfo.startTime
            ) {
              oneIndex = index
            }
            if (result.endTime > lateTime) {
              lateTime = result.endTime
            }
          }
          this.openPlayback([this.videoStatusArr[oneIndex].result], false, oneIndex, false)
        })
        .catch(err => {
          this.$message.error('录像查询失败！')
          console.log(err)
        })
    },
    // 从时间轴插件获取到的的时间
    getTimeFromChild(time) {
      console.log(this.$moment(time).format('HH:mm:ss'), '拖动收到的时间')
      if (this.isSync) {
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          if (this.videoStatusArr[i].isPlay) {
            this.anewOpenPlayback(time / 1000, true, i)
          }
        }
      } else {
        this.anewOpenPlayback(time / 1000)
      }
    },
    // 从时间轴插件获取到的当前选中项
    getIndexFromChild(index) {
      this.clickEventP(index, 1, index)
    },
    // 时间轴插件同步异步切换响应函数
    getSyncFromChild(bool) {
      this.isSync = bool
      // 只存在中心回放
      if (bool) {
        // 同步
        var minOne = ''
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          let result = this.videoStatusArr[i].result
          if (Object.keys(result).length === 0 || result.eventList.length === 0) {
            continue
          }
          if (minOne === '') {
            minOne = result.eventList[0].evtTblInfo.startTime
            continue
          }
          if (minOne > result.eventList[0].evtTblInfo.startTime) {
            minOne = result.eventList[0].evtTblInfo.startTime
          }
        }
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          if (this.videoStatusArr[i].isPlay) {
            this.anewOpenPlayback(minOne, false, i)
          }
        }
      } else {
        // 异步
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          if (this.videoStatusArr[i].isPlay) {
            this.anewOpenPlayback(this.videoStatusArr[i].result.startTime, false, i)
          }
        }
      }
    },
    // 通过某一个key排序数组
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]
        var y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    // 过滤超出录像
    filterBeyond(record, { startTime, endTime }) {
      const list = []
      record.eventList.forEach(item => {
        const info = item.evtTblInfo
        if (info.startTime > endTime || info.endTime < startTime || info.startTime === info.endTime) {
          // 此录像不处理
        } else {
          info.startTime = info.startTime < startTime ? startTime : info.startTime
          info.endTime = info.endTime > endTime ? endTime : info.endTime
          list.push(item)
        }
      })
      return {
        ...record,
        eventList: list
      }
    },
    // 回放开流
    async openPlayback(data, isQuery = true, womod, isClear = false) {
      let noPowerCount = 0
      // this.stop(undefined, false, isClear, false, false)
      window.clearInterval(this.progressTimer)
      data = JSON.parse(JSON.stringify(data)) // 拷贝数据防止更改报错
      // 异步回放
      // isQuery 为 true 需要查询录像段， false 不需要查询录像段 直接调用插件
      // data = [{
      // "devIp": “设备IP,127.0.0.1”, // VMR通道
      // “devPort”:int//设备端口，
      // “channel”:int//设备通道
      //  eventType:['all']
      // "startTime": int,//开始时间
      // "endTime": int,//结束时间
      // "streamType":"",//码流类型（main,sub,）
      // "page": int,//当前第几页
      // "rows": int, //一页多少行,rows只能按1000的整数倍(由vmfs限制)
      // }]
      let playbackNumber = data.length
      if (data.length > this.checkedWmode) {
        this.$message.error('无空闲窗口显示更多通道！')
        playbackNumber = this.checkedWmode
      }
      for (let i = 0; i < playbackNumber; i++) {
        if (!data[i].appName) {
          // 如果有appName字段，则不判断权限，否则根据resId判断权限
          // let power = await this.getCameraPower(data[i].resId)
          // let hasPower = true
          // if (!power || !power.includes('playback')) {
          //   noPowerCount++
          //   hasPower = false
          // }
          // if (!hasPower) {
          //   continue
          // }
        }
        if (this.splitOpenFlag) {
          this.checkedPane = i
          this.updateStatus(i, {
            isPlugin: true,
            playStatus: true,
            isButton: false,
            isPlay: false,
            isSyncPlay: false
          })
          this.$nextTick(async () => {
            let [status, result] = await openPlaybackList(this.pluginDom(i), data[i], isQuery)

            var sendR = ''
            if (result) {
              sendR = result
            } else {
              sendR = data[i]
              sendR.eventList = []
            }
            if (status instanceof Object) {
              this.$message.error(status.msg)
              return
            }
            if (status !== 0) {
              this.$message.error('开流失败！')
              return
            }
            this.$refs.mychild.queryBackVideo(sendR, i, this.checkedPane)
            if (this.windowAdapter.length !== 0) {
              let timeId = setInterval(() => {
                let flag = this.pluginDom(index).SetPlayStretchBlt(...this.windowAdapter)
                if (flag === 1) {
                  clearInterval(timeId)
                }
              }, 100)
            }
            this.pluginDom(i).SetStateCallback(() => {
              // this.$refs.mychild.closeT(this.checkedPane)
              // 插件播放完成后的 回调
              this.updateStatus(index, { isPlay: false })
              this.pluginDom(index).CloseRecordPlay()
              this.playOverCallback(index)
              if (i === this.checkedPane) {
                // 关闭的是当前选中窗格
                this.progress = 0
                this.progressNow = this.formatTime(0)
                this.$emit('playStatus', 2) // 1是暂停，2是停止, 3是播放
              }
            })
            this.updateStatus(i, { isPlay: true, result: result })
            this.$emit('playStatus', 3) // 1是暂停，2是停止, 3是播放
            if (this.configuration.progressBar) {
              // 调用插件播放时间 更改 进度条
              // if (result.occurrenceTime > result.startTime && result.occurrenceTime < result.endTime) {
              if (result.occurrenceTime) {
                this.occurrenceTimeLeft =
                  ((result.occurrenceTime - result.startTime) / (result.endTime - result.startTime)) * 100 // 计算标记段位置
              }
              // }
            }
            if (this.isSync) {
              let syncSetInterval = setInterval(() => {
                let recordPlayerCurTime = JSON.parse(this.pluginDom(index).GetRecordPlayerCurTime())
                let time = parseInt(recordPlayerCurTime.msCur / 1000)
                if (recordPlayerCurTime.success && time !== 0) {
                  this.syncTime(time)
                  window.clearInterval(syncSetInterval)
                } else if (recordPlayerCurTime.success === false) {
                  window.clearInterval(syncSetInterval)
                }
              }, 1000)
            } else {
              this.timer()
            }
            // }, 100)
          })
        } else {
          let index = womod === undefined ? this.findFreePane() : womod
          this.checkedPane = index
          this.updateStatus(index, {
            isPlugin: true,
            playStatus: true,
            isButton: false,
            isPlay: false,
            isSyncPlay: false
          })
          this.$nextTick(async () => {
            let [status, result] = await openPlaybackList(this.pluginDom(index), data[i], isQuery)
            this.$refs.mychild.queryBackVideo(result || { eventList: [] }, index, this.checkedPane)

            if (status instanceof Object) {
              this.$message.error(status.msg)
              return
            }
            if (status !== 0) {
              this.$message.error('开流失败！')
              return
            }
            if (this.windowAdapter.length !== 0) {
              let timeId = setInterval(() => {
                let flag = this.pluginDom(index).SetPlayStretchBlt(...this.windowAdapter)
                if (flag === 1) {
                  clearInterval(timeId)
                }
              }, 100)
            }
            this.pluginDom(index).SetStateCallback(() => {
              // this.$refs.mychild.closeT(this.checkedPane)
              // // 插件播放完成后的 回调
              // this.updateStatus(index, { isPlay: false })
              // this.pluginDom(index).CloseRecordPlay()
              // this.playOverCallback(index)
              // if (index === this.checkedPane) {
              //   // 关闭的是当前选中窗格
              //   this.progress = 0
              //   this.progressNow = this.formatTime(0)
              //   this.$emit('playStatus', 2) // 1是暂停，2是停止, 3是播放
              // }
            })
            this.updateStatus(index, { isPlay: true, result: result })

            this.$emit('playStatus', 3) // 1是暂停，2是停止, 3是播放
            if (this.configuration.progressBar) {
              // 调用插件播放时间 更改 进度条
              // if (result.occurrenceTime > result.startTime && result.occurrenceTime < result.endTime) {
              if (result.occurrenceTime) {
                this.occurrenceTimeLeft =
                  ((result.occurrenceTime - result.startTime) / (result.endTime - result.startTime)) * 100 // 计算标记段位置
              }
              // }
            }
            // if (this.isSync) {
            //   let syncSetInterval = setInterval(() => {
            //     let recordPlayerCurTime = JSON.parse(this.pluginDom(index).GetRecordPlayerCurTime())
            //     let time = parseInt(recordPlayerCurTime.msCur / 1000)
            //     if (recordPlayerCurTime.success && time !== 0) {
            //       this.syncTime(time)
            //       window.clearInterval(syncSetInterval)
            //     } else if (recordPlayerCurTime.success === false) {
            //       window.clearInterval(syncSetInterval)
            //     }
            //   }, 1000)
            // } else {
            this.timer()
            // }
            // }, 100)
          })
        }
      }
      if (noPowerCount > 0) {
        this.$Notice.warning({ desc: `${noPowerCount || ''}个通道没有权限！`, title: '警告' })
      }
    },
    // 查找空余窗格
    findFreePane() {
      // 找出空闲窗格返回窗格索引
      for (let index = 0; index < this.checkedWmode; index++) {
        if (!this.videoStatusArr[index].playStatus) {
          return index
        }
      }
      return this.checkedPane
    },
    // 返回plugin的dom对象
    pluginDom(index) {
      // 返回指定窗格的 object dom
      return index === undefined
        ? this.$refs.plugin[this.findFreePane()].$refs.object
        : this.$refs.plugin[index].$refs.object
    },
    // 格式化时间
    formatTime(time) {
      let h = Math.floor(time / 3600)
      let m = Math.floor((time % 3600) / 60)
      let s = Math.floor((time % 3600) % 60)
      return `${h < 10 ? String(0) + String(h) : h}:${m < 10 ? String(0) + String(m) : m}:${
        s < 10 ? String(0) + String(s) : s
        }`
    },
    // 进度条 start
    timer() {
      // 进度条定时器
      if (this.progressTimer) {
        // 新建定时器时先清除掉之前的定时器
        window.clearInterval(this.progressTimer)
      }
      this.progressTimer = setInterval(() => {
        if (this.isOperation) {
          return
        } // 鼠标再操作时不对进度条赋值操作
        let checkedResult = this.videoStatusArr[this.checkedPane].result
        if (this.pluginDom(this.checkedPane)) {
          let recordPlayerCurTime = checkedResult.dsServerId
            ? JSON.parse(this.pluginDom(this.checkedPane).GetSpeechPlayerCurTime())
            : JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
          let recordTime = parseInt(recordPlayerCurTime.msCur / 1000)
          // 若播放完了就将播放时间改为开始时间
          this.playTime = recordPlayerCurTime.success ? recordTime || this.playTime : checkedResult.startTime || 0
          this.$refs.mychild.getCurTime(this.playTime)
          if (this.configuration.progressBar.totalTime) {
            let result = this.selectedObj.result
            let time = result.endTime - result.startTime
            if (!isNaN(time)) {
              this.progressTotalTime = this.formatTime(time)
              let nowTime = this.playTime - result.startTime
              nowTime = nowTime < 0 ? 0 : nowTime
              this.progressNow = this.formatTime(nowTime)
            }
          }
          this.progress =
            ((this.playTime - checkedResult.startTime) / (checkedResult.endTime - checkedResult.startTime)) * 100
        }
      }, 1000)
    },
    // 停止的处理函数
    stop(index, playStatus = false, isClear = true, syncStopOne = false, isInform = true) {
      // syncStopOne 同步用来关闭一个画面
      // isInform 是否触发 $emit('playStatus')

      try {
        // 没有index 就关闭全部
        if (index !== undefined) {
          // if (this.isSync && !playStatus && !syncStopOne) {
          //   // 同步回放时停止全部
          //   this.stop()
          //   this.isSync = false
          //   return
          // }
          this.videoStatusArr[index].playStatus && this.pluginDom(index).CloseRecordPlay()
          if (index === this.checkedPane) {
            // 停止后播放时间改为0
            this.$refs.mychild.closeT(index)
            this.progressNow = this.formatTime(0)
          }
          if (isInform) {
            this.$emit('playStatus', 2, this.videoStatusArr[index].result.resId) // 1是暂停，2是停止
          }
          if (isClear) {
            let originalState = JSON.parse(JSON.stringify(this.originalState))
            this.updateStatus(
              index,
              Object.assign(originalState, { isPlay: false, playStatus: playStatus, result: {} })
            )
          }
          this.controlProtocol(2, index)
          if (this.middlePlayFatherStatus) {
            // 显示窗格中间按钮
            this.updateStatus(index, { isSyncPlay: true, isMiddlePlay: true })
          }
          if (!this.isSync) {
            // 不是同步回放再停止定时器
            window.clearInterval(this.progressTimer)
            this.progress = 0
          }
          return
        }
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          let element = this.videoStatusArr[i]
          if (!element.isPlay && Object.keys(element.result).length === 0) {
            continue
          }
          if (i === this.checkedPane) {
            // 停止后播放时间改为0
            this.progressNow = this.formatTime(0)
          }

          this.videoStatusArr[i].playStatus && this.pluginDom(i).CloseRecordPlay()
          if (isClear) {
            let originalState = JSON.parse(JSON.stringify(this.originalState))
            this.updateStatus(
              i,
              Object.assign(originalState, { isPlay: false, playStatus: playStatus, result: {}, isSyncPlay: false })
            )
          }
          this.controlProtocol(2, index)
        }
        if (this.configuration.timeline) {
          // 有时间轴把时间轴清除掉
          // this.initSingleStage()
        }
        if (isInform) {
          this.$emit('playStatus', 2, 'all') // 1是暂停，2是停止
        }
        window.clearInterval(this.progressTimer)
        this.progressTimer = null
        this.progress = 0
      } catch (err) {
        console.log(err, '回放组件报错捕捉')
      }
    },
    // 点击外侧
    clickVideoHierarchy(e) {
      if (this.isFullScreen) {
        // 如果是全屏就要阻止冒泡
        e.stopPropagation()
      }
    },
    syncTime(time = this.playTime) {
      if (this.progressTimer) {
        // 新建定时器时先清除掉之前的定时器
        window.clearInterval(this.progressTimer)
      }
      this.playTime = time
      // 初始化时间 同步
      this.progressTimer = setInterval(() => {
        if (this.isOperation) {
          return
        } // 鼠标再操作时不对进度条赋值操作

        let stopSum = 0
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (Object.keys(element.result).length === 0) {
            stopSum++
          }
        }
        if (stopSum === this.videoStatusArr.length) {
          // 没有播放的窗格了 清除定时器
          window.clearInterval(this.progressTimer)
          this.progressTimer = null
          return
        }
        let checkedPane = 0
        for (let i in this.screenIndex) {
          if (this.screenIndex[i] === 0) {
            checkedPane = i
            break
          }
        }

        let recordPlayerCurTime = JSON.parse(this.pluginDom(checkedPane).GetRecordPlayerCurTime())
        let curTime
        if (!recordPlayerCurTime.success) {
          curTime = 0
        } else {
          curTime = parseInt(recordPlayerCurTime.msCur / 1000)
        }
        if (this.playTime > curTime) {
          this.playTime++
        } else {
          this.playTime = curTime
        }
        this.syncPlaybackMaintain()
      }, 1000)
    },
    async anewSyncOpenPlayback(newTime, index, isQuery = false) {
      if (index === undefined) {
        // 不传index 就全部重新开流 不能全部重开 只能开开过的 这是同步
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          // if (!this.videoStatusArr[i].isPlay) {
          //   continue
          // }
          const element = this.videoStatusArr[i].result
          if (Object.keys(element).length === 0) {
            continue
          }
          element.newStartTime = newTime
          let [status] = await openPlaybackList(this.pluginDom(i), element, isQuery)
          if (status instanceof Object) {
            this.$message.error(status.msg)
            return
          }
          if (status !== 0) {
            this.$message.error('开流失败！')
            return
          }
        }
      } else {
        // 传了 只开一个
        let element = this.videoStatusArr[index].result
        element.newStartTime = newTime
        let [status] = await openPlaybackList(this.pluginDom(index), element, isQuery)
        if (status instanceof Object) {
          this.$message.error(status.msg)
          return
        }
        if (status !== 0) {
          this.$message.error('开流失败！')
        }
        this.updateStatus(index, { isPlay: true })
      }
      // 同步重新开流
      this.syncTime(this.playTime)
    },
    controlProtocol(control, index = this.checkedPane) {
      // 上墙流控协议
      if (!this.wallStatus[this.checkedPane]) {
        return
      }
      let obj = {
        devInfo: this.wallStatus[this.checkedPane].devInfo,
        devCtl: {
          control: control,
          monitor: this.wallStatus[this.checkedPane].devCtl.monitor,
          pane: this.wallStatus[this.checkedPane].devCtl.pane
        }
      }
      vodCtrl(obj)
    },
    className(index) {
      // plugin 类名逻辑
      let obj = {}
      obj.hide = this.isMaximize ? index !== this.checkedPane : index + 1 > this.checkedWmode
      obj.active = this.checkedPane === index
      return obj
    },
    // 初始化li元素
    initializeArr() {
      // 初始化窗格状态数组
      let arr = []
      for (let index = 0; index < 16; index++) {
        arr.push(JSON.parse(JSON.stringify(this.originalState)))
      }
      this.videoStatusArr = arr
    },
    // 单个时间轴 end
    appendTopButtonsFun(index) {
      return {
        ...this.appendTopButtons,
        toggle: !this.isMaximize && this.screenIndex[index] !== 0 && this.checkedPane === index
      }
    },
    async anewOpenPlayback(newTime, isQuery = false, paneMark) {
      /*
       *newTime  重新开流的播放时间
       *arr 重新开流的数组
       paneMark  重新开流窗格号
       */
      // 重新开溜  如果是停止或放完 就重新查录像段吧
      if (paneMark !== undefined) {
        this.checkedPane = paneMark
      }
      if (this.middlePlayFatherStatus) {
        this.updateStatus(this.checkedPane, { isSyncPlay: false, isMiddlePlay: false })
      }
      let result = this.videoStatusArr[this.checkedPane].result
      // result 是选中窗口上次查询录像段信息
      result.newStartTime = newTime
      let [status] = await openPlaybackList(this.pluginDom(this.checkedPane), result, isQuery)
      if (status instanceof Object) {
        this.$message.error(status.msg)
        return
      }
      if (status !== 0) {
        this.$message.error('开流失败！')
      }
      if (this.wallStatus[this.checkedPane]) {
        this.checkWall(this.wallStatus[this.checkedPane].i, this.checkedPane, true)
      }
      let pitchSpeed = this.videoStatusArr[this.checkedPane].pitchSpeed
      if (pitchSpeed.label !== '1') {
        // 不是1倍速需要设置倍数
        this.clickSpeed(pitchSpeed) // 同步倍速
      }
      this.updateStatus(this.checkedPane, { isPlay: true })
    },
    async sliderChange(value) {
      window.clearInterval(this.progressTimer)
      // 进度条快进触发
      // result 是选中窗口上次查询录像段信息
      let result = this.videoStatusArr[this.checkedPane].result
      let newTime = parseInt((result.endTime - result.startTime) * (value / 100) + result.startTime)
      await this.anewOpenPlayback(newTime)
      this.timer()
    },
    middlePlay(paneMark) {
      // 窗格中间播放按钮回调
      // paneMark 窗格号
      if (this.middlePlayFatherStatus) {
        this.updateStatus(paneMark, { isSyncPlay: false, isMiddlePlay: false })
        this.anewOpenPlayback('', true, paneMark)
      }
      this.$emit('middlePlay', paneMark)
    },
    // 点击交换窗口时
    changeScreen(i) {
      let j = 0
      for (let k in this.screenIndex) {
        if (this.screenIndex[k] === 0) {
          j = k
          let para = { ...this.screenIndex }
          para[i] = this.screenIndex[j]
          para[j] = this.screenIndex[i]
          this.screenIndex = { ...para }
          break
        }
      }
      this.$emit('changeScreen', this.videoStatusArr[i].result.resId, this.videoStatusArr[j].result.resId)
    },
    // 更新li对象状态处理函数
    updateStatus(index, obj, type) {
      // 跟新视频窗格上的功能条  回放不需要窗格下的小进度条
      // if (type === 'isButton') {
      //   this.videoStatusArr.forEach(element => {
      //     element.isButton = false
      //   })
      // }
      // 子组件更新状态数组
      for (const key in obj) {
        if (key === 'isButton') {
          continue
        }
        this.videoStatusArr[index][key] = JSON.parse(JSON.stringify(obj[key]))
      }
    },
    clickCheckedWmode(mode) {
      // 画面切换将选中项及是否单画面置为初始值
      let obj = document.querySelector('.single-video-plugin')
      this.checkedWmode = mode.value
      if (this.selectedObj.isPlay) {
        this.$refs.mychild.changeFn({
          screenNum: mode.value,
          index: 0,
          type: ''
        })
      }
      this.isMaximize = false
      this.checkedPane = 0
    },
    syncPlaybackMaintain() {
      let judgeScope = (eventList, time) => {
        // 判断当前时间是否在录像段中
        for (let index = 0; index < eventList.length; index++) {
          const element = eventList[index]
          if (element.evtTblInfo.startTime <= time && time <= element.evtTblInfo.endTime) {
            return 1
          }
        }
        return 0
      }
      // 同步回放维持播放状态 在定时器触发过程中， 若有当前窗格时间段就开是播放
      this.$nextTick(() => {
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (Object.keys(element.result).length === 0 || element.result.eventList.length === 0) {
            continue
          }
          if (judgeScope(element.result.eventList, this.playTime) && !element.isPlay) {
            // 录像段在当前时间且没有播放 则开始播放
            this.updateStatus(index, { isSyncPlay: false, playStatus: true }) // 去掉黑色遮罩
            this.anewSyncOpenPlayback(this.playTime, index)
          }
          // 加上黑色遮罩
          if (!judgeScope(element.result.eventList, this.playTime) && element.playStatus && element.isPlay) {
            // 当前时间没在录像段 则关闭录像并遮盖
            this.updateStatus(index, { isSyncPlay: true, isPlay: false })
            // 停止传 true 让不要销毁object标签
            this.stop(index, true, false, false, false)
          }
        }
      })
    },
    // 窗格的点击事件
    clickEventP(index, clickType, paneMark) {
      this.$emit('clickEventP', 1, paneMark)
      // 返回参数 index：插件窗格号 clicktype：单机还是双击
      // 点击事件
      // if (this.buttonFreedom) {
      //   this.isBottonToggle = !this.isBottonToggle
      //   if (this.type === 'map') {
      //     if (this.isBottonToggle) {
      //       // 显示按钮组
      //       this.$parent.$parent.sethierachySize('800px', `${490 + this.singleVideoHeight}px`)
      //     } else {
      //       this.$parent.$parent.sethierachySize('800px', '490px')
      //     }
      //   }
      // }
      this.checkedPane = paneMark
      if (clickType === 2) {
        if (this.checkedWmode === 1) {
        } else {
          let obj = document.querySelector('.single-video-plugin')
          this.isMaximize = this.checkedWmode !== 1 && !this.isMaximize // 单窗格不允许切换单画面
          if (this.videoStatusArr[this.checkedPane].isPlay) {
            if (this.isMaximize) {
              this.$refs.mychild.changeFn({
                screenNum: 1,
                index: this.checkedPane,
                type: 'scaleD'
              })
            } else {
              this.$refs.mychild.changeFn({
                screenNum: this.defaultPane,
                index: this.checkedPane,
                type: 'scaleX'
              })
            }
          }
        }
      }
      if (this.videoStatusArr[paneMark].isPlay) {
        this.$refs.mychild.setCurTime(this.playTime, paneMark)
        this.timer()
      }
      this.$emit('clickEventP', clickType, paneMark)
    },
    pluginEscCall(index, type, keyCode) {
      // 插件监听键盘事件回调
      if (Number(keyCode) === 27) {
      }
    }
  },
  beforeDestroy() {
    this.checkedPane = 0
  }
}
</script>

<style lang="less">
.video-plugin {
  padding: 0px 0px 0px 10px;
  position: relative;
  z-index: 999999;
  // min-width: 1190px;
  background-color: #fff;
  .disabled {
    color: #ccc !important;
    cursor: not-allowed !important;
  }
  .quickTowall {
    width: 400px;
    height: 300px;
    position: absolute;
    left: calc(~'50% - 200px');
    top: calc(~'50% - 150px');
    z-index: 999;
    background-color: #1b3153;
    .quickTowall-center {
      width: 100%;
      height: 250px;
    }
    .quickTowall-close {
      float: right;
      margin: 8px 8px;
    }
  }
  .master-control {
    width: 100%;
  }
  width: 100%;
  height: 100%;
  .single-video-plugin {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    font-size: 0px;

    .shade-iframe {
      width: 100%;
      height: 100%;
      background-color: rgba(102, 102, 102, 1);
      border: 0px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
    }
    .hide {
      position: absolute;
      left: 9999px;
      top: -9999px;
      z-index: 999;
    }
    .maximize {
      width: 100% !important;
      height: 100%;
    }
    .active {
      border-color: #4699f9;
    }
    &::after {
      content: '';
      clear: both;
    }
  }
  .progress-bar-parent {
    /deep/ .ivu-slider-wrap {
      margin: 0;
    }
    position: relative;
    width: 100%;
    height: 24px;
    background-color: #1b3153;
    .progress-bar {
      width: ~'calc(100% - 150px)';
      height: 100%;
      position: relative;
      // bottom: 16px;
      // transform: translate(0, -50%);
      z-index: 999;
      .play-time {
        position: absolute;
        right: -125px;
        bottom: 4px;
      }
      .occurrence-time {
        position: absolute;
        width: 10%;
        height: 4px;
        bottom: 8px;
        border-radius: 2px;
        display: inline-block;
        background-color: red;
        transform: translate(-50%, -50%);
        z-index: 1;
      }
      .slide-mon-f {
        width: 100%;
        position: relative;
        bottom: -10px;
        z-index: 999;
        opacity: 0.5;
      }
      .total-time {
        position: absolute;
        right: -25px;
        bottom: 4px;
        width: 20px;
        white-space: nowrap;
      }
    }
  }
  .video-bottom {
    background-color: #fff;
    width: 100%;
    height: 56px;
    border-bottom: 1px solid #e1e1e1;
    display: flex;
    justify-content: flex-end;
    line-height: 56px;
    .nodiv {
      display: flex;
      flex: 1;
    }
    .iconfont {
      padding: 0 8px;
      cursor: pointer;
      font-size: 20px;
      color: #333333;
    }
    .right {
      ul {
        right: 38px;
        i {
          right: -7px;
        }
      }
    }
    .left {
      ul {
        left: 38px;
        i {
          left: -7px;
        }
      }
    }
    .dp-con {
      position: relative;
      display: inline-block;
      ul {
        position: absolute;
        background-color: #2d72d3;
        list-style: none;
        color: snow;
        text-align: center;
        line-height: 40px;
        padding: 0 6px;
        border-radius: 4px;
        top: 7px;
        .rotate {
          display: block;
          position: absolute;
          background: #2d72d3;
          width: 14px;
          height: 14px;
          transform: rotate(45deg);
          top: 13px;
        }
        li {
          display: inline-block;
          white-space: nowrap;
          line-height: 40px;
          padding: 0 8px;
          border-right: 1px solid hsla(0, 0%, 100%, 0.1);
          .sub-stream-check {
            position: absolute;
            left: -100px;
            width: 100px;
            height: 40px;
            line-height: 40px;
          }
        }
        .active {
          color: #fda54b;
        }
      }
      li:hover {
        color: #fda54b;
        cursor: pointer;
      }
    }
    .disable,
    .disable:hover {
      color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
