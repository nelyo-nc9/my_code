<template>
  <div
    @mousedown="clickVideoHierarchy($event)"
    style="width: 100%; height: 100%"
    :class="[isFullScreen ? 'fs' : '']"
  >
    <VideoHierarchy
      ref="rootVideoHierarchy"
      hierachyWidth="100%"
      hierachyHeight="100%"
      :class="[isFullScreen ? 'fs' : '']"
    >
      <div
        id="videoBox"
        class="back-video-plugin"
        :class="[isFullScreen ? 'fs' : '', buttonFreedom && !isFullScreen ? 'buttonFreedom' : '']"
      >
        <div
          class="single-video-plugin"
          ref="singleVideo"
          :style="{ height: isButton ? `calc(100% - ${singleVideoHeight}px)` : '100%' }"
        >
          <plugin
            ref="plugin"
            v-for="(item, index) in panesArr[panesArr.length-1].value"
            :key="index"
            :paneMark="index"
            :style="{
				width: (isMaximize&&index===checkedPane) ? '100%' : wd,
				height: (isMaximize&&index===checkedPane) ? '100%' : ht,
			  }"
            :class="className(index)"
            :appendTopButtons="appendTopButtonsFun(index)"
            :singleStatus="videoStatusArr[index]"
            @middlePlay="middlePlay"
            @clickEvent="clickEventP"
            @updateStatus="updateStatus"
            @pluginEscCall="pluginEscCall"
            @changeScreen="changeScreen"
            @mouseleave="singleClick=false"
            @mouseout="singleClick=false"
            :selectedObj="selectedObj"
            :flag="index===checkedPane&&singleClick"
          >
            <!-- <SuspenClose slot="close" ref="SuspenClose" @iconClose="iconClick"></SuspenClose> -->
            <!-- <template slot="close" slot-scope="scope">
				<SuspenClose ref="SuspenClose" :checkedPane="checkedPane" :paneMark="scope.paneMark" :selectedObj="selectedObj"></SuspenClose>
            </template>-->
            <template v-slot:close="{paneMark}">
              <slot name="close" :paneMark="paneMark" v-slot:close></slot>
            </template>
          </plugin>
        </div>
        <div
          class="master-control"
          :style="{ bottom: isBottonToggle ? '0px' : `${singleVideoHeight}px` }"
        >
          <!-- <button @click="kk">ceshi</button> -->
          <div
            class="video-bottom"
            v-if="isButton"
            :class="[isBottonToggle ? 'bottonShow' : 'bottonHide']"
          >
            <div
              v-for="(icon,index) in iconShow"
              :key="icon.name + '_' + index"
              :style="icon.type == 'left' ? {position:'absolute',left:icon.normalPx+ 'px'}:{position:'absolute',right:icon.normalPx+ 'px'}"
            >
              <component
                v-if="!icon.slotName"
                :is="icon.name"
                :selectedObj="selectedObj"
                :panesArr="panesArr"
                :useSubStream="useSubStream"
                :checkedWmode="checkedWmode"
                :checkedScreenMode="checkedScreenMode"
                :videoStatusArr="videoStatusArr"
                :iconPosition="icon.type"
                :iconPlay="iconPlay"
                :shearDownload="shearDownload"
                :isSyncF="isSync"
                @iconClick="iconClick"
              ></component>
              <slot v-else :name="icon.slotName" :style="{width: icon.width}"></slot>
            </div>
          </div>
          <div class="progress-bar-parent" v-if="configuration.progressBar.show">
            <div
              class="progress-bar"
              :style="{'width': configuration.progressBar.type == '' ? '100%' : ''}"
            >
              <span
                class="play-time"
                v-if="configuration.progressBar.type == 'curtime'"
              >{{$moment(playTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
              <div class="total-time" v-if="configuration.progressBar.type == 'totaltime'">
                <span>{{progressNow}} / {{progressTotalTime}}</span>
              </div>
              <div class="slide-mon-f">
                <el-slider
                  class="slide-mon"
                  v-model="progress"
                  @change="sliderChange"
                  :show-tooltip="false"
                ></el-slider>
              </div>
            </div>
          </div>
        </div>
        <TimeProgress
          ref="mychild"
          v-if="configuration.timeline.show"
          :deScreen="checkedWmode"
          :configuration="configuration.timeline"
          :eventType="configuration.eventType"
          :simplenessMode="simplenessMode"
          @ondrag="getTimeFromChild"
          @changeParentIndex="getIndexFromChild"
          @changeSync="getSyncFromChild"
          :isSyncT="isSync"
          :isCenter="isCenterP"
          :checkedPaneP="checkedPane"
          :channelName="channelName"
        ></TimeProgress>
      </div>
    </VideoHierarchy>
  </div>
</template>
  <script>
// import screenfull from 'screenfull'
import { queryData } from '@src/components/videoPlugin/playback/common/requestFunction.js'
import { vodCtrl, newVodCtrl, newVodOpen, newFrontVod } from '../../../../http/video/videoPlayback.api.js'
import VideoHierarchy from './videoHierarchy'
import plugin from './plugin'
import TimeProgress from './timeProgress'
import FullScreen from '../iconComponents/FullScreen'
import MultiScreen from '../iconComponents/MultiScreen'
import NiaoKan from '../iconComponents/NiaoKan'
import ScreenShot from '../iconComponents/ScreenShot'
import SplitMode from '../iconComponents/SplitMode'
import Stop from '../iconComponents/Stop'
import StopAll from '../iconComponents/StopAll'
import TVWall from '../iconComponents/TVWall'
import Volume from '../iconComponents/Volume'
import ScreenMode from '../iconComponents/ScreenMode'
import Download from '../iconComponents/Download'
import CutDownload from '../iconComponents/CutDownload'
import Play from '../iconComponents/Play'
import ZhuZhen from '../iconComponents/ZhuZhen'
import PlaySpeed from '../iconComponents/PlaySpeed'
import Rewind from '../iconComponents/Rewind'
import Attention from '../iconComponents/Attention'
import CheckRecode from '../../preview/iconComponents/CheckRecode'
// import SuspenClose from '../iconComponents/SuspenClose'
import { pluginPlayBackOpen } from '../../../../components/videoPlugin/playback/common/plginInMethod'
import { newDownloadDev } from '@src/components/videoPlugin/playback/common/plginInMethod'
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
  downloadDev,
} from './playback.js'
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
    Attention,
    CheckRecode,
    // SuspenClose
  },
  props: {
    simplenessMode: {
      // 简洁模式(视频复核定制)
      type: Boolean,
      default: false,
    },
    channelName: {
      type: String,
      default: '',
    },
    type: {
      // 为某些模块定制使用
      type: String,
      default: 'back', // relayTracking 接力追踪， map 地图
    },
    panesArr: {
      // 画面分割配置
      type: Array,
      default: () => [
        { value: 1, label: '单画面' },
        { value: 4, label: '4画面' },
        { value: 9, label: '9画面' },
        { value: 16, label: '16画面' },
      ],
    },
    modeArr: {
      // 画面分割配置
      type: Array,
      default: () => [
        { value: 1, label: '原比例' },
        { value: 2, label: '自适应' },
      ],
    },
    isButton: {
      // 视频窗下方总按钮条 是否显示
      type: Boolean,
      default: true,
    },
    buttonFreedom: {
      // 是否使主按钮栏通过点击显隐
      type: Boolean,
      default: false,
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 4,
    },
    configuration: {
      // 配置项
      type: Object,
      default: () => {
        return {
          progressBar: {
            show: false, // 是否配置进度条
            type: '', // curtime代表显示当前播放时间 //totaltime：代表显示当时时间/总时间,""：代表只显示进度条不显示任何配置
          },
          timeline: {
            show: true, // 是否配置时间轴
            syncTypeFlag: true, // 是否配置同步异步功能
            isNeedCenterTime: true, // 中心时间
            periodFlag: true, // 是否配置周期切换功能
            SliceFlag: true, // 是否配置切片功能
            passageName: true, // 是否配置通道名称功能
            step: 7, // 当前时间周期
            calcHeight: '0px', // 时间轴高度差
          },
          eventType: [
            {
              name: '事件录像',
              color: '#FF0000',
            },
            {
              name: '定时录像',
              color: '#32E285',
            },
            {
              name: '手工录像',
              color: '#FF6C00',
            },
            {
              name: '智能录像',
              color: '#0088FF',
            },
          ],
          buttos: [],
        }
      },
    },
    iconShow: {
      // 对应图标是否显示
      type: Array,
      default: () => {
        return []
      },
    },
    appendTopButtons: {
      // 视频窗口上方的按钮
      type: Object,
      default: () => {
        return {
          toggle: false, // 是否显示
          buttons: [], // 显示那些按钮 change: 交换
        }
      },
    },
    windowAdapter: {
      // 窗口适配参数
      type: Array,
      default: () => [],
    },
    isCenterP: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    wd() {
      const wd = (100 / Math.sqrt(this.checkedWmode)).toFixed(2)
      return `${wd}%`
    },
    ht() {
      return this.wd
    },
    selectedObj() {
      // 选中项状态值
      console.log(this.videoStatusArr[this.checkedPane], '======selectedObj')
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
      if (this.simplenessMode) {
        return 200
      } else if (this.configuration.timeline.show) {
        // 时间轴 + 按钮
        return 200 + 60
      } else if (this.configuration.progressBar.show) {
        // 进度条 + 按钮
        return 24 + 56 + height
      }
      // 按钮
      return 56 + height
    },
  },
  created() {
    this.initBtn()
    for (let i = 0; i < 25; i++) {
      this.screenIndex[i] = i
    }
    this.initializeArr()
    // this.kk()
  },
  watch: {},
  data() {
    return {
      screenIndex: {}, // 窗口下标
      singleClick: false,
      originalState: {
        screenModeStatus: 2, // 画面模式 1:原画面 2:自适应
        isPlugin: true, // 是否使用插件 千万别删
        playStatus: false, // 插件是否加载
        isButton: false, // 小窗格上是否需要按钮条
        isPlay: false, // 是否播放
        result: {}, // 回放录像段信息
        queryInformation: {}, // 录像通道信息， 暂时只同步回放使用
        dumpHandle: '', // 录像下载句柄 有就正在下载，页面切换后无效
        isSyncPlay: false, // 同步播放用来遮罩视频框的 显示黑色
        showVolume: false, // 是否显示音量滑块
        volumeValue: 50, // 音量值
        img: '', // 遮盖图片 Base64
        isMiddlePlay: false, // 画面中间播放按钮
        pitchSpeed: { value: { nRate: 1, nScale: 1 }, label: '1', icon: 'icon-speed', control: 3 }, // 倍速选中项
        lookDown: false, // 鸟瞰状态
        fullScreen: false,
        tvWall: {}, // 上墙窗口的信息
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
        shearSectionStartEditing: false, // 点击录像段
      },
      shearSectionConfiguration: {
        width: 200,
        left: 50,
        startTime: '00:00:00',
        endTime: '00:00:00',
        timestampStartTime: 0,
        timestampEndTime: 0,
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
        { value: { nRate: 16, nScale: 1 }, label: '16', icon: 'icon-16', control: 7 },
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
      playOverCallback: () => {}, // 窗格播放完毕的回调
      signVideoSegment: [], // 传来的要标记的录像段 暂时 单轴使用
      isBottonToggle: false, // 是否显示按钮栏
      changeScreenFunArr: [], // 窗格顺序暂存
      useSubStream: true, // 是否子码流预览
      isSync: false, // 同步异步
      splitOpenFlag: false, // 是否是分段回放
      clickSplit: false,
      volumeflag: false, // 音量slider是否正在显示
      chanName: '',
      onresizeTimer: null, // 控制窗口大小改变时候的定时器
      isFrame: false, // 用于同步时判断是不是逐帧
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode === 27 && this.isFullScreen) {
        this.escScreenFull()
      }
    }
    window.onresize = (e) => {
      if (this.onresizeTimer !== null) {
        return
      }
      let isFull = document.msFullscreenElement || document.mozIsFullScreen || document.webkitIsFullScreen
      if (!isFull) {
        // 退出全屏后要执行的动作
        this.onresizeTimer = setTimeout(() => {
          this.escScreenFull()
          window.clearTimeout(this.onresizeTimer)
          this.onresizeTimer = null
        }, 100)
      }
    }
  },
  methods: {
    // 暴露给父组件设置通道名称
    setChannelName(channelName) {
      // this.channelName = channelName
      this.chanName = channelName
    },
    // 点击检索时候获取同步异步状态
    getSyncStatus(isSyncP) {
      this.isSync = isSyncP
    },
    sliderFormat() {
      return null
    },
    // 请求全屏
    requestFull() {
      // console.log(document.getElementById('videoBox'),'element')
      // screenfull.request(document.getElementById('videoBox'))
      if (this.isFullScreen) {
        // 退出全屏
        this.isFullScreen = false
        this.escScreenFull()
      } else {
        // 全屏
        if (this.checkedWmode !== 1 && !this.isMaximize) {
          this.isMaximize = true
        }
        this.requestFullscreen()
        this.isFullScreen = true
        this.updateStatus(this.checkedPane, { fullScreen: true }, 'isButton')
        this.$refs.mychild.setDisplay()
        this.$emit('transforFull', true)
      }
    },
    // 关闭全屏
    escScreenFull() {
      // screenfull.exit()
      if (!this.isFullScreen) {
        return
      }
      this.isFullScreen = false
      this.exitFullscreen()
      this.updateStatus(this.checkedPane, { fullScreen: false }, 'isButton')
      if (this.checkedWmode !== 1 && this.isMaximize) {
        this.isMaximize = false
      }
      this.$refs.mychild.setDisplay()
      this.$emit('transforFull', false)
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
      console.log(funcName, '-----------------------------funcName')
      value ? this[funcName](value) : this[funcName]()
    },
    // 分段点击 弃用
    splitOpen(flag) {
      console.log('分段回放========>>>>>>>>>>>', flag)
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
    async splitSegTime(data) {
      console.log('=============', data)
      this.stopBackALL()
      // 如果是同步视频需要切换成异步
      if (this.isSync) {
        // 关闭全部录像
        this.isSync = false
        // 父级的选中取消
        this.$parent.isSync = false
        // this.$parent
      }
      await this.$nextTick()
      let arr = []
      // 获取开始时间与结束时间
      console.log(this.$refs.mychild.initTime)
      let playTime = this.$refs.mychild.initTime
      let stY = new Date(playTime).getFullYear()
      let stM = new Date(playTime).getMonth()
      let stD = new Date(playTime).getDate()
      console.log(stY, stM, stD)
      data.dataArr.forEach((v, i) => {
        let obj = {}
        let splitTime = {
          startTime: new Date(v.startTime * 1000).getHours() * 3600 + new Date(v.startTime * 1000).getMinutes() * 60,
          endTime: new Date(v.endTime * 1000).getHours() * 3600 + new Date(v.endTime * 1000).getMinutes() * 60,
        }
        obj.name = data.selectedObj.fileName || data.selectedObj.name
        obj.deviceType = data.selectedObj.deviceType
        obj.devType = data.selectedObj.devType
        obj.channel = data.selectedObj.channel
        obj.devIp = data.selectedObj.devIp
        obj.streamType = data.selectedObj.streamType
        obj.devPort = data.selectedObj.devPort
        obj.recordType = data.selectedObj.recordType
        obj.dPort = data.selectedObj.dPort
        obj.startTime = new Date(stY, stM, stD, 0, 0).getTime() / 1000 + splitTime.startTime
        obj.endTime = new Date(stY, stM, stD, 0, 0).getTime() / 1000 + splitTime.endTime
        // obj.isCenter = data.selectedObj.isCenter
        arr.push(obj)
      })
      var mode = { value: data.curNum }
      this.clickCheckedWmode(mode)
      this.$refs.mychild.changeFn({
        screenNum: data.curNum,
        index: 0,
        type: '',
      })
      this.checkedPane = 0
      // 替换
      this.openBackVideoArr(arr) // 新方法开流
      // this.openPlayback(arr)//弃用
      this.clickSplit = true
    },
    // 点击画面模式
    clickScreenMode(v) {
      setScale(this.pluginDom(this.checkedPane), v.label)
      this.updateStatus(this.checkedPane, { screenModeStatus: v.value })
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
      console.log(result, 'result==================')
      var row = {
        dPort: result.dPort || result.dsPort,
        endTime: this.$moment(this.$refs.mychild.shearSectionConfiguration.timestampEndTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        fileName: result.name || result.fileName,
        // fileSize: byteConversion(result.result[0].filesize),
        channelName: this.chanName,
        fileSize: 0,
        fileType: formatRecordType(result.recordType || result.fileType),
        startTime: this.$moment(this.$refs.mychild.shearSectionConfiguration.timestampStartTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
        timeLang: formatSpendTime(
          this.$refs.mychild.shearSectionConfiguration.timestampStartTime,
          this.$refs.mychild.shearSectionConfiguration.timestampEndTime
        ),
        result: result,
      }
      row.isCenter = this.isCenterP
      newDownloadDev(
        row,
        new Date().getTime() + this.defaultPane,
        this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download'
      )
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
    openDownload(timeObj) {
      console.log('打开下载按钮调用事件--------------', this.selectedObj, timeObj, this.videoStatusArr)
      let select = JSON.parse(JSON.stringify(this.selectedObj))
      let downPath = this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100\\Download'
      let strFileDir = downPath + '\\' + 'download.txt'
      let creatDir = document.getElementById('global-plugin').SaveFileInfo(strFileDir, 'name')
      if (creatDir) {
        this.$message({
          message: '创建目录文件失败',
          type: 'warning',
        })
        return
      }
      this.$message({
        message: `录像开始下载,下载路径为${downPath}`,
        type: 'warning',
      })
      const time = new Date().getTime()
      let selectResult = select.result
      let result = {
        devIp: selectResult.devIp, // 设备ip,
        devPort: selectResult.devPort, // 设备端口,
        channel: selectResult.channel, // 通道号,
        recordType: selectResult.recordType, // 录像请求类型,
        startTime: this.$moment(timeObj.startTime).format('YYYY-MM-DD HH:mm:ss'), // 开始时间,
        endTime: this.$moment(timeObj.endTime).format('YYYY-MM-DD HH:mm:ss'), // 结束时间,
        streamType: selectResult.streamType, // 码流类型,
        devType: this.getDevType(selectResult),
      }
      let record = {
        result: result,
        startTime: this.$moment(timeObj.startTime).format('YYYY-MM-DD HH:mm:ss'), // 开始时间,
        endTime: this.$moment(timeObj.endTime).format('YYYY-MM-DD HH:mm:ss'), // 结束时间,
        fileName: selectResult.name,
        fileSize: 0,
        // fileType: selectResult.operType,
        path: downPath,
      }
      console.log('==下载传参==')
      // console.log('这是预览选中的流吗----------', record)
      newDownloadDev(record, time, downPath)
    },
    getDevType(data) {
      // 获取镜头类型
      if (data.sipCode) {
        if (data.deviceType > 3) {
          return 4
        } else {
          return 2
        }
      } else {
        if (data.deviceType > 3) {
          return 3
        } else {
          return 1
        }
      }
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
    downloadVideo(data = [], isQuery = false, callback = () => {}) {
      let download = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        element.fileName = '123'
        download.push(downloadVideoSegments(this.pluginDom(this.checkedPane), element, isQuery, callback))
      }
      return Promise.all(download)
    },
    getBase64Capture() {
      // Base64截图
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].getBase64Capture()
    },
    // 截图调用事件
    getPic() {
      let downPath = this.$store.state.sysParametersCof.downLoadVideoPath || 'D:\\BC8100'
      var param = {
        // path: 'C:BC8100Capture',
        // path: `D:\\BC8100\\Capture\\${this.videoStatusArr[this.checkedPane].result.fileName}-${this.$moment().format('YYYYMMDDHHmmss')}.jpg`,
        path: `${downPath}\\Capture\\${this.videoStatusArr[this.checkedPane].result.fileName}-${this.$moment().format(
          'YYYYMMDDHHmmss'
        )}.jpg`,
        type: 1, // 0-bmp 1-jpg
      }
      getPicture(this.pluginDom(this.checkedPane), param)
    },
    // 鸟瞰调用事件
    clickLookDown() {
      this.pluginDom(this.checkedPane).SetPlayLocalBoost()
      this.updateStatus(this.checkedPane, { lookDown: !this.videoStatusArr[this.checkedPane].lookDown })
    },
    // 声音开关调用hover事件
    // volumeSwitchHover() {
    //   // 音量开关
    //   if (!this.selectedObj.isPlay) {
    //     return
    //   }
    //   //没显示音量开关滑块时，hove出现
    //   if(!this.selectedObj.showVolume){
    //     console.log('!this.selectedObj.showVolume')
    //     for (let index = 0; index < this.defaultPane; index++) {
    //       // 关闭所有音量
    //       if (this.videoStatusArr[index].showVolume) {
    //         closeSound(this.pluginDom(index))
    //       }
    //     }
    //     openSound(this.pluginDom(this.checkedPane))
    //     setVolume(this.pluginDom(this.checkedPane), 50)
    //     let soundStatue = getVolume(this.pluginDom(this.checkedPane))
    //     if (soundStatue.success) {
    //       let objVolumeValue = { volumeValue: soundStatue.Volume }
    //       this.updateStatus(this.checkedPane, { showVolume: true })
    //       this.updateStatus(this.checkedPane, objVolumeValue)
    //     } else {
    //       this.$Notice.warning({ title: '警告', desc: '音量获取失败！' })
    //     }
    //   }
    // },
    // 声音开关调用click事件
    // 声音开关调用事件
    volumeSwitch(isDrag) {
      // 音量开关
      if (!this.selectedObj.isPlay) {
        return
      }
      console.log(this.selectedObj.showVolume)
      if (this.selectedObj.showVolume) {
        console.log('关闭')
        if (isDrag) {
          // 再拖动 需要保持声音的开启或者关闭
          openSound(this.pluginDom(this.checkedPane))
        } else {
          closeSound(this.pluginDom(this.checkedPane))
          this.updateStatus(this.checkedPane, { showVolume: false })
          this.wallControlProtocol(8) // 上墙交互
        }
      } else {
        for (let index = 0; index < this.defaultPane; index++) {
          // 关闭所有音量
          if (this.videoStatusArr[index].showVolume) {
            closeSound(this.pluginDom(index))
          }
        }
        console.log('打开') // 上墙交互
        if (!isDrag) {
          this.wallControlProtocol(7)
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
      }
    },
    // 声音改变调用事件,flag标志音量slider是否显示
    changeVolume(v) {
      // 设置音量大小
      if (!this.selectedObj.isPlay) {
        return
      }
      setVolume(this.pluginDom(this.checkedPane), v)
    },
    // 倍速切换列表显示事件
    showPlayspeed(showSpeed) {
      this.showSpeed = showSpeed
      // 都显示时会有遮挡bug
      // console.log(this.showSpeed,'速度||音量',this.volumeflag, this.selectedObj.showVolume)
      if (this.showSpeed && this.selectedObj.showVolume) {
        // 都显示时将音量滑块隐藏
        this.volumeflag = true
        this.selectedObj.showVolume = !this.selectedObj.showVolume
      }
    },
    // 倍速切换列表隐藏事件
    hidePlayspeed(showSpeed) {
      this.showSpeed = showSpeed
      if (!this.showSpeed && this.volumeflag) {
        // 将音量滑块隐藏
        this.volumeflag = !this.volumeflag
        this.selectedObj.showVolume = !this.selectedObj.showVolume
      }
    },
    // 倍速切换调用事件
    clickSpeed(speed) {
      let num = 5 //  3、快速  4、慢速   5、正常
      let { value } = speed
      if (value.nRate > 1 && value.nScale == 1) {
        num = 3
      } else if (value.nRate == 1 && value.nScale > 1) {
        num = 4
      }
      // console.log(num)
      if (this.isSync) {
        // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { pitchSpeed: speed })
            setRecordPlayerRate(this.pluginDom(index), speed.value)
            this.controlProtocol(speed.control, index)
            this.wallControlProtocol(num, index)
          }
        }
      } else {
        // 异步
        this.updateStatus(this.checkedPane, { pitchSpeed: speed })
        console.log(this.pluginDom(this.checkedPane), 'plugin')
        setRecordPlayerRate(this.pluginDom(this.checkedPane), speed.value)
        this.controlProtocol(speed.control)
        this.wallControlProtocol(num)
      }
    },
    // 逐帧进调用事件
    clickByFrame() {
      if (this.isSync) {
        // 同步
        this.isFrame = true
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            setRecordPlayerMode(this.pluginDom(index), 1)
            this.updateStatus(index, { isPlay: false })
            // this.wallControlProtocol(6, index)
          }
        }
        // setRecordPlayerMode(this.pluginDom(this.checkedPane), 1)
        // this.updateStatus(this.checkedPane, { isPlay: false })
      } else {
        // 异步
        setRecordPlayerMode(this.pluginDom(this.checkedPane), 1)
        this.updateStatus(this.checkedPane, { isPlay: false })
        // this.wallControlProtocol(6)
      }
    },
    // 上墙时需要的参数
    wallInformation(obj) {
      // 在父级页面 使用tvWall 传入进来
      if (obj.deviceType > 3) {
        // 中心回放
        newVodOpen(obj).then((res) => {
          console.log('中心回放', res)
          if (res.data.code === 0) {
            this.$messageSuccess('中心回放上墙成功')
            // 存入数据
            this.updateStatus(this.checkedPane, { tvWall: obj })
          } else {
            this.$notify.error({
              title: '失败',
              message: '中心回放上墙失败',
              position: 'bottom-right',
            })
          }
        })
      } else if (obj.deviceType <= 3) {
        newFrontVod(obj).then((res) => {
          console.log('上墙的回调--------', res)
          if (res.data.code === 0) {
            console.log('上墙成功')
            this.$messageSuccess('前端回放上墙成功')
            // 存入数据
            this.updateStatus(this.checkedPane, { tvWall: obj })
          } else {
            this.$notify.error({
              title: '失败',
              message: '前端回放上墙失败',
              position: 'bottom-right',
            })
          }
        })
      }
    },
    // 电视墙和电脑同步操作
    wallControlProtocol(control, index = this.checkedPane) {
      let { tvWall } = this.videoStatusArr[index]
      console.log('电视墙存起来的数组====================', control, index, !$.isEmptyObject(tvWall))
      if (!$.isEmptyObject(tvWall)) {
        // 有上墙信息调用接口
        let obj = {
          control, // 1-暂停,2-恢复,3-快速,4-慢速,5-正常,6-单帧播放,7-音频开启,8-音频关闭, 9-清空缓冲区
          windowsRect: tvWall.windowsRect,
          wallId: tvWall.wallId, // 电视墙id
        }
        console.log('-------', obj)
        newVodCtrl(obj)
      }
    },
    // 点击停止处理函数
    playStop() {
      // 播放暂停
      if (!this.selectedObj.playStatus) {
        return
      } // 未开启画面的不予许点击
      // let recordPlayerCurTime = checkedResult.dsServerId ? JSON.parse(this.pluginDom(this.checkedPane).GetSpeechPlayerCurTime()) : JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
      this.isFrame = false // 逐帧关闭
      if (this.isSync) {
        // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            setRecordPlayerMode(this.pluginDom(index), 0) // 切回正常播放模式
          }
        }
      } else {
        setRecordPlayerMode(this.pluginDom(this.checkedPane), 0) // 切回正常播放模式
      }
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
        if (this.isSync) {
          // 同步状态
          if (status) {
            // 同步关闭时要关闭定时器
            this.syncTime()
            let data = []
            for (const iterator of this.videoStatusArr) {
              if (Object.keys(iterator.result).length !== 0) {
                data.push(JSON.parse(JSON.stringify(iterator.result)))
              }
            }
          } else {
            window.clearInterval(this.progressTimer)
          }
        } else {
          console.log(this.videoStatusArr[this.checkedPane].result, '选中流的result')
          this.$refs.mychild.queryBackVideo(this.videoStatusArr[this.checkedPane].result, this.checkedPane)
          // 异步状态
          // 该录像为放完了， 当点击播放时 重头开始放
          this.$emit('playStatus', 3) // 3是播放
          this.wallControlProtocol(2) // 控制上墙的2是播放
          this.anewOpenPlayback('', true)
          this.timer()
        }
      } else {
        console.log(1)
        // 正在播放中 || 暂停中
        if (!this.isSync) {
          console.log('异步')
          // 异步
          if (this.selectedObj.isPlay) {
            // 发出暂停事件
            this.$refs.mychild.pauseT(this.checkedPane)
            this.$emit('playStatus', 1) // 1是暂停，2是停止
            // this.controlProtocol(1)
            this.wallControlProtocol(1)
          } else {
            if (Object.keys(this.videoStatusArr[this.checkedPane].result).length === 0) {
            } else {
              this.$refs.mychild.startT(this.checkedPane)
            }
            this.$emit('playStatus', 3) // 3是播放
            // this.controlProtocol(3)
            this.wallControlProtocol(2)
          }
          this.updateStatus(this.checkedPane, { isPlay: !this.selectedObj.isPlay })
          stopRecordPlay(this.pluginDom(this.checkedPane), this.selectedObj.isPlay)
        }
      }
      if (this.isSync) {
        // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { isPlay: status })
            stopRecordPlay(this.pluginDom(index), status) // false 时暂停
            this.controlProtocol(status ? 3 : 1, index)
            this.wallControlProtocol(status ? 2 : 1, index)
            if (!status) {
              window.clearInterval(this.progressTimer)
            } else {
              this.timer() //打开进度条
            }
          }
        }
        this.$emit('playStatus', status ? 1 : 3)
        // this.wallControlProtocol(status ? 1 : 2)
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
              console.log('hi')
              this.$message.error('开流失败！')
              // 开流失败释放窗口
              this.stopBack()
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
      console.log('关闭通道原因02')
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
        .then((res) => {
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
        .catch((err) => {
          console.log(err)
          this.$message.error('录像查询失败！')
        })
    },
    // 从时间轴插件获取到的的时间
    async getTimeFromChild(time) {
      console.log(time, this.$moment(time).format('HH:mm:ss'), '拖动收到的时间')
      // this.timer()
      window.clearInterval(this.progressTimer)
      if (this.isSync) {
        //同步
        this.playTime = time / 1000
        for (let i = 0; i < this.videoStatusArr.length; i++) {
          if (this.videoStatusArr[i].isPlay || this.videoStatusArr[i].isSyncPlay) {
            const queryObj = JSON.parse(JSON.stringify(this.videoStatusArr[i].queryInformation))
            queryObj.startTime = time / 1000
            queryObj.newStartTime = time / 1000
            let status = await pluginPlayBackOpen(this.pluginDom(i), queryObj, null, queryObj.newStartTime)
            // if (status === 0) {
            // this.updateStatus(i, { isPlay: true, })
            // }
          }
        }
      } else {
        await this.anewOpenPlayback(time / 1000)
      }
      this.volumeSwitch(true) // 调用音量事件
      // 调用比例事件
      let screenModeLabel = this.selectedObj.screenModeStatus == 1 ? '原比例' : '自适应'
      setScale(this.pluginDom(this.checkedPane), screenModeLabel)
      this.isFrame = false
      this.timer()
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
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    // 模拟开流方法
    kk() {
      console.log(this.videoStatusArr, 'videoStatusArr++++++++++++++++++++++++++++')
      let arr = [
        // {
        //   name: '711',
        //   channel: 1,
        //   devIp: '192.168.7.111',
        //   devPort: 34567,
        //   endTime: 1591804800,
        //   eventType: ['all'],
        //   page: 1,
        //   rows: 1000,
        //   startTime: 1591718400,
        //   streamType: 'main',
        //   typeContent: '',
        //   typeName: '',
        //   resId: '5dea182cb915d23760ca9a26'
        //   // videoSegmentsIndex: 0 // 指定播放录像段索引
        // },
        // {
        //   name: '711',
        //   channel: 1,
        //   devIp: '192.168.7.111',
        //   devPort: 34567,
        //   endTime: 1591804800,
        //   eventType: ['all'],
        //   page: 1,
        //   rows: 1000,
        //   startTime: 1591718400,
        //   streamType: 'main',
        //   typeContent: '',
        //   typeName: '',
        //   resId: '5dea182cb915d23760ca9a26'
        //   // videoSegmentsIndex: 0 // 指定播放录像段索引
        // },
        // {
        //   name: '711',
        //   channel: 1,
        //   devIp: '192.168.7.111',
        //   devPort: 34567,
        //   endTime: 1591804800,
        //   eventType: ['all'],
        //   page: 1,
        //   rows: 1000,
        //   startTime: 1591718400,
        //   streamType: 'main',
        //   typeContent: '',
        //   typeName: '',
        //   resId: '5dea182cb915d23760ca9a26'
        //   // videoSegmentsIndex: 0 // 指定播放录像段索引
        // },
        // {
        //   name: '711',
        //   channel: 1,
        //   devIp: '192.168.7.111',
        //   devPort: 34567,
        //   // endTime: 1591804800,
        //   endTime: 1591804800,
        //   eventType: ['all'],
        //   page: 1,
        //   rows: 1000,
        //   // startTime: 1591718400,
        //   startTime: 1591718400,
        //   streamType: 'main',
        //   typeContent: '',
        //   typeName: '',
        //   resId: '5dea182cb915d23760ca9a26'
        //   // videoSegmentsIndex: 0 // 指定播放录像段索引
        // }
        // { // 中心回放-非国标
        //   isCenter: true,
        //   devType: 3,
        //   channel: 1,
        //   eventType: 512, // 手动录像
        //   devIp: '192.168.14.147',
        //   devPort: 8000,
        //   streamType: 'main',
        //   name: 'CH1枪机-值守区域1电视墙显示区',
        //   channelName: 'CH1枪机-值守区域1电视墙显示区',
        //   startTime: 1597127380,
        //   endTime: 1597154508
        // }
        // { // 中心回放-国标
        //   isCenter: true,
        //   devType: 4,
        //   channel: 1,
        //   eventType: 512, // 手动录像
        //   devIp: '192.168.14.147',
        //   devPort: 8000,
        //   streamType: 'main',
        //   name: 'CH1枪机-值守区域1电视墙显示区',
        //   channelName: 'CH1枪机-值守区域1电视墙显示区',
        //   startTime: 1597127380,
        //   endTime: 1597154508
        // }
        // { // 前端回放-国标
        //   devType: 2,
        //   brand: 'Bstar',
        //   channel: '19',
        //   dId: '30',
        //   devCport: 3721,
        //   devDport: 3720,
        //   devIp: '192.168.8.112',
        //   deviceName: 'nvr112',
        //   deviceType: 1,
        //   gbDevId: '12010000001180000052',
        //   gbPlaNvrId: '12010000002000000001',
        //   icon: '',
        //   id: '52',
        //   isRoot: false,
        //   keyPartId: '13',
        //   keyPartName: '芜湖营业网点',
        //   name: 'chn19',
        //   nodeKey: 'res52',
        //   order: '',
        //   orgId: '7',
        //   orgName: '建行芜湖市分行（汇总）',
        //   password: 'admin123',
        //   sipCode: '1201000000',
        //   status: 'offline',
        //   streamType: 'main',
        //   subType: 1,
        //   tierType: 'res',
        //   type: 1,
        //   username: 'admin',
        //   startTime: 1597127380,
        //   endTime: 1597154508
        // }
      ]
      // this.openPlayback(arr, '', '', true)
      // 下载示例
      // this.getVideoConf()
      // this.openBackVideo(arr[0])
    },
    openBackVideoArr(arr) {
      // 回放多个录像
      let playbackNumber = arr.length
      if (arr.length > this.checkedWmode) {
        this.$message.error('无空闲窗口显示更多通道！')
        playbackNumber = this.checkedWmode
      }
      for (let i = 0; i < playbackNumber; i++) {
        this.openBackVideo(arr[i], i)
      }
    },
    async openBackVideo(data, idx) {
      // 回放录像
      let params = JSON.parse(JSON.stringify(data))
      let pIndex
      if (idx) {
        pIndex = idx
      } else {
        pIndex = this.findFreePane() // 查找空闲的窗格
      }
      let res = await queryData(params)
      console.log(res, pIndex, params, '先查询有没有录像')
      if (typeof res === 'string') {
        this.$messageError('查询录像失败！')
        return
      }
      if (!res.length) {
        this.$messageWarn('查询无录像！')
        return
      }
      if (data.devType === 3) {
        params.dsIp = res[0].dsIp
        params.dsPort = res[0].dsPort
      }
      this.updateStatus(pIndex, { isPlugin: true, playStatus: true, isButton: false, isPlay: false, isSyncPlay: false })
      await this.$nextTick()
      // let vType = data.devType > 2 ? 'center' : 'frontEnd'
      // let status = await pluginPlayBackOpen(this.pluginDom(pIndex), params, vType)
      let status = await pluginPlayBackOpen(this.pluginDom(pIndex), params, null, params.newStartTime) //判断有没有newStartTime从而获取制定开始播放事件
      console.log(status, params, 'status++++,获取对应的录像')
      if (status !== 0) {
        this.$messageError('开流失败！')
        this.stopBack()
      } else {
        params.result = res
        if (this.configuration.timeline.show) {
          if (pIndex === this.checkedPane) {
            if (params.newStartTime) {
              this.$refs.mychild.getCurTime(params.newStartTime)
            } else {
              this.$refs.mychild.getCurTime(params.startTime)
            }
          }
          //判断设备是否为NVR类型
          console.log(data, !this.isSync, 'Sync')
          if (data.deviceType === 1 && !this.isSync) {
            //如果为1则隐藏回放同步按钮修改父元素的props
            params.isShowSyncBtn = 1 //隐藏
          } else {
            params.isShowSyncBtn = 2 //显示
          }
          this.$refs.mychild.queryBackVideo(params, pIndex, this.checkedPane)
        }

        this.updateStatus(pIndex, { isPlay: true, result: params })
        this.timer()
      }
    },
    async openBackInfoVideo(pIndex, data, isNewTime) {
      // 打开查询到的回放录像
      let vType = data.devType > 2 ? 'center' : 'frontEnd'
      let status = await pluginPlayBackOpen(this.pluginDom(pIndex), data, vType, isNewTime)
      return status
    },
    // 过滤超出录像
    filterBeyond(record, { startTime, endTime }) {
      const list = []
      record.eventList.forEach((item) => {
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
        eventList: list,
      }
    },
    /**
     * @description: 同步回放开流
     * @param {Array} data 开流数据及录像段
     * @param {number} minTime 最小时间
     * @param {minTimeIndex} 最小录像段镜头索引
     * @return:
     * @author: dfk
     */
    async syncPlayback(data, minTime, minTimeIndex, videoList) {
      //先关闭所有的窗口
      this.stop()
      console.log('检测执行01')
      let playbackNumber = data.length
      if (data.length > this.checkedWmode) {
        this.$message.error('无空闲窗口显示更多通道！')
        playbackNumber = this.checkedWmode
      }
      let videoShaftObj = []
      for (let index = 0; index < playbackNumber; index++) {
        let params = {
          ...data[index],
          result: videoList[index],
        }
        this.updateStatus(index, { isPlugin: true, playStatus: true, result: params, queryInformation: data[index] })
        videoShaftObj.push({
          index,
          isShow: true,
          videoList: videoList[index],
          channelName: data[index].name || '',
          newStartTime: data[index].newStartTime,
        })
      }
      console.log('检测执行02')
      this.$refs.mychild.getCurTime(minTime)
      this.$refs.mychild.createdVideoShaft(videoShaftObj)
      this.checkedPane = minTimeIndex
      this.$nextTick(async () => {
        let status = await pluginPlayBackOpen(this.pluginDom(minTimeIndex), data[minTimeIndex])
        console.log(status, '同步开流01')
        if (status !== 0) {
          this.$message.error('开流失败！')
          // 新增开流失败释放窗口8/23
          this.stopBack()
        } else {
          this.updateStatus(minTimeIndex, { isPlay: true })
        }
        console.log('timer01')
        this.timer()
      })
    },
    drawTimeLine(data, index = 0) {
      let tempListobj = {
        eventList: [],
        index: index,
        channelName: data.name,
      }
      tempListobj.eventList = [data]
      this.$refs.mychild.openLine(tempListobj)
    },
    async openPlugin(data, ind) {
      let index = ind === undefined ? this.findFreePane() : ind
      this.checkedPane = index
      this.updateStatus(index, {
        isPlugin: true,
        playStatus: true,
        isButton: false,
        isPlay: false,
        isSyncPlay: false,
      })
      await this.$nextTick()
      await pluginPlayBackOpen(this.pluginDom(index), data)
    },
    // 异步回放开流
    async openPlayback(data, isQuery = true, womod, isClear = false) {
      //作废
      console.log(data, '开流data')
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
        if (this.splitOpenFlag) {
          this.checkedPane = i
          this.updateStatus(i, {
            isPlugin: true,
            playStatus: true,
            isButton: false,
            isPlay: false,
            isSyncPlay: false,
          })
          this.$nextTick(async () => {
            let [status, result] = await openPlaybackList(this.pluginDom(i), data[i], isQuery)
            console.log(status, '--openPlaybackList--', result)
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
              console.log('hi')
              this.$message.error('开流失败！')
              // 开流失败释放窗口
              this.stopBack()
              return
            }
            console.log(sendR, '--sendR--')
            this.$refs.mychild.queryBackVideo(sendR, i, this.checkedPane)
            if (this.windowAdapter.length !== 0) {
              let timeId = setInterval(() => {
                let flag = this.pluginDom(i).SetPlayStretchBlt(...this.windowAdapter)
                if (flag === 1) {
                  clearInterval(timeId)
                }
              }, 100)
            }
            this.pluginDom(i).SetStateCallback(() => {
              // this.$refs.mychild.closeT(this.checkedPane)
              // 插件播放完成后的 回调
              this.updateStatus(i, { isPlay: false })
              this.pluginDom(i).CloseRecordPlay()
              this.playOverCallback(i)
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
              //同步
              let syncSetInterval = setInterval(() => {
                let recordPlayerCurTime = JSON.parse(this.pluginDom(i).GetRecordPlayerCurTime())
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
            isSyncPlay: false,
          })
          this.$nextTick(async () => {
            let [status, result] = await openPlaybackList(this.pluginDom(index), data[i], isQuery)
            console.log(result, '--result--', status)
            result.name = data[i].channelName || this.channelName

            // this.$refs.mychild.queryBackVideo(result || { eventList: [] }, index, this.checkedPane)
            if (this.configuration.timeline.show) {
              this.$refs.mychild.queryBackVideo(result || data[i], index, this.checkedPane)
            }
            if (status instanceof Object) {
              this.$message.error(status.msg)
              return
            }
            if (status !== 0) {
              console.log('hi')
              this.$message.error('开流失败！')
              // 开流失败释放窗口
              this.stopBack()
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
            console.log('timer02')
            this.timer()
            // }
            // }, 100)
          })
        }
      }
      if (noPowerCount > 0) {
        this.$Notice.warning({ desc: `${noPowerCount || ''}个通道没有权限！`, title: '警告' })
      }
      console.log('开流结束')
    },
    // 查找空余窗格
    findFreePane() {
      // 找出空闲窗格返回窗格索引
      for (let index = 0; index < this.checkedWmode; index++) {
        if (!this.videoStatusArr[index].playStatus) {
          console.log(index, 'findFreePane')
          return index
        }
      }
      console.log(this.checkedPane, 'findFreePane this.checkedPane')
      return this.checkedPane
    },
    // 返回plugin的dom对象
    pluginDom(index) {
      // 返回指定窗格的 object dom
      // console.log(this.$refs.plugin[index],'第1个$refs')
      // console.log(this.$refs.plugin[index].$refs.object,'第2个$refs')
      // console.log(index, "index")
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
        // console.log(checkedResult, 'checkedResult+++++++++++++++')
        if (this.pluginDom(this.checkedPane) && this.videoStatusArr[this.checkedPane].isPlay) {
          let recordPlayerCurTime = JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
          // console.log(recordPlayerCurTime, 'recordPlayerCurTime')
          let recordTime = parseInt(recordPlayerCurTime.msCur / 1000)
          // 若播放完了就将播放时间改为开始时间
          this.playTime = recordPlayerCurTime.success ? recordTime || this.playTime : checkedResult.startTime || 0
          if (this.configuration.timeline.show) {
            this.$refs.mychild.getCurTime(this.playTime)
          }
          if (this.configuration.progressBar) {
            let result = this.selectedObj.result
            // console.log(result, 'result')
            let time = result.endTime - result.startTime
            if (!isNaN(time)) {
              this.progressTotalTime = this.formatTime(time)
              let nowTime = this.playTime - result.startTime
              nowTime = nowTime < 0 ? 0 : nowTime
              this.progressNow = this.formatTime(nowTime)
            }
          }
          // if (this.isSync) {
          //   this.progress = ((this.playTime - checkedResult[0].startTime) / (checkedResult[0].endTime - checkedResult[0].startTime)) * 100
          // } else {
          this.progress =
            ((this.playTime - checkedResult.startTime) / (checkedResult.endTime - checkedResult.startTime)) * 100
          // }
          // console.log(this.progress, 'this.progress')
        }
        console.log('检测执行timer', this.isSync, this.isFrame)
        // 同步回放监测函数
        if (this.isSync && !this.isFrame) {
          this.syncPlaybackMaintain()
        }
      }, 1000)
    },
    // 停止的处理函数
    stop(index, playStatus = false, isClear = true, syncStopOne = false, isInform = true) {
      // syncStopOne 同步用来关闭一个画面
      // isInform 是否触发 $emit('playStatus')
      console.log('tsopop')
      this.isFrame = false
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
            // 停止后播放时间改为0不是同步的关闭时间轴
            if (this.configuration.timeline.show && !this.isSync) {
              //关闭时间轴
              this.$refs.mychild.closeT(index)
            }
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
      console.log(this.playTime, '播放时间2', time)
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
          console.log(this.playTime, '播放时间3')
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
            console.log('hi')
            this.$message.error('开流失败！')
            // 开流失败释放窗口
            this.stopBack()
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
          console.log('hi')
          this.$message.error('开流失败！')
          // 开流失败释放窗口
          this.stopBack()
          return
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
          pane: this.wallStatus[this.checkedPane].devCtl.pane,
        },
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
        toggle: !this.isMaximize && this.screenIndex[index] !== 0 && this.checkedPane === index,
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
      let status = await this.openBackInfoVideo(this.checkedPane, result, true)
      console.log(status, 'status+++++++++++++++++++++')
      // let [status] = await openPlaybackList(this.pluginDom(this.checkedPane), result, isQuery)
      // if (status instanceof Object) {
      //   this.$message.error(status.msg)
      // }
      if (status !== 0) {
        console.log('hi')
        this.$message.error('开流失败！')
        // 开流失败释放窗口
        this.stopBack()
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
      console.log('timer03')
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
      console.log(index, obj, type, 'update')
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
      console.log(this.videoStatusArr, '子组件更新数组')
    },
    clickCheckedWmode(mode) {
      // 画面切换将选中项及是否单画面置为初始值
      this.checkedWmode = mode.value
      if (this.selectedObj.isPlay) {
        this.$refs.mychild.changeFn({
          screenNum: mode.value,
          index: 0,
          type: '',
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
          if (element.startTime <= time && time <= element.endTime) {
            return 1
          }
        }
        return 0
      }
      // 同步回放维持播放状态 在定时器触发过程中， 若有当前窗格时间段就开是播放
      this.$nextTick(async () => {
        console.log(this.playTime, '当前拖动轴时间')
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          const resultList = Object.keys(element.result).length !== 0 ? element.result.result : []
          if (resultList.length === 0) {
            continue
          }
          if (judgeScope(resultList, this.playTime) && !element.isPlay) {
            // && element.isSyncPlay
            // 录像段在当前时间且没有播放 则开始播放
            // this.pluginDom(index).CloseRecordPlay()
            this.updateStatus(index, { isPlay: true, isSyncPlay: false, playStatus: true }) // 去掉黑色遮罩
            let vType = element.result.devType > 2 ? 'center' : 'frontEnd'
            element.result.newStartTime = this.playTime
            let status = await pluginPlayBackOpen(this.pluginDom(index), element.result, vType, this.playTime)
            if (status === 0) {
              this.updateStatus(index, { isPlay: true })
            }
          }
          // 加上黑色遮罩
          if (!judgeScope(resultList, this.playTime) && element.playStatus && element.isPlay) {
            // 当前时间没在录像段 则关闭录像并遮盖
            this.updateStatus(index, { isSyncPlay: true, isPlay: false }) //定位出去
            // 停止传 true 让不要销毁object标签
            //this.stop()
            console.log('关闭通道原因01')
          }
        }
      })
    },
    // 窗格的点击事件
    clickEventP(index, clickType, paneMark) {
      // this.$emit('clickEventP', 1, paneMark)//该条无用8/23日注释
      // 返回参数 index：插件窗格号 clicktype：单击还是双击
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
        // plugin双击变成单页面单时间轴事件
        if (this.checkedWmode === 1) {
        } else {
          this.isMaximize = this.checkedWmode !== 1 && !this.isMaximize // 单窗格不允许切换单画面
          console.log(this.isMaximize, this.videoStatusArr[this.checkedPane].isPlay, '放大缩小')
          if (this.videoStatusArr[this.checkedPane].isPlay) {
            if (this.isMaximize) {
              this.$refs.mychild.changeFn({
                screenNum: 1,
                index: this.checkedPane,
                type: 'scaleD',
              })
            } else {
              this.$refs.mychild.changeFn({
                screenNum: this.defaultPane,
                index: this.checkedPane,
                type: 'scaleX',
              })
            }
          } else {
            //当前窗口放大关闭重新调用子组件时间轴显示方法
            this.$refs.mychild.changeFn({
              screenNum: this.defaultPane,
              index: this.checkedPane,
              type: '',
            })
          }
        }
      }
      this.singleClick = true
      console.log(paneMark, 'paneMark')
      if (this.videoStatusArr[paneMark].isPlay) {
        //8/23 点击窗口给子组件传入开始与结束时间与播放时间
        this.$refs.mychild.setCurTime(this.playTime, paneMark)
        console.log('timer04')
        this.timer()
      }
      this.$emit('clickEventP', clickType, paneMark)
    },
    pluginEscCall(index, type, keyCode) {
      // 插件监听键盘事件回调
      if (Number(keyCode) === 27) {
      }
    },
    setPlayType(playtype, row) {
      this.selectedObj.playType = 'file'
      this.selectedObj.result.startTime = row.startTime
      this.selectedObj.result.endTime = row.endTime
    },
  },
  beforeDestroy() {
    this.checkedPane = 0
    window.clearInterval(this.progressTimer)
  },
}
</script>
  <style lang="less" scoped>
.fs {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
}
.back-video-plugin {
  // padding: 0px 0px 0px 10px;
  position: relative;
  // z-index: 999999;
  // min-width: 1190px;
  background-color: #fff;
  .disabled {
    color: #ccc !important;
    cursor: not-allowed !important;
  }
  /deep/.icon-box {
    cursor: pointer;
    .disable {
      color: #ccc !important;
      cursor: not-allowed !important;
    }
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
    /deep/ .el-slider__runway {
      margin: 0;
    }
    position: relative;
    width: 100%;
    height: 24px;
    padding: 0px 10px;
    // background-color: #1b3153;
    .progress-bar {
      width: ~'calc(100% - 150px)';
      height: 100%;
      position: relative;
      // bottom: 16px;
      // transform: translate(0, -50%);
      z-index: 999;
      .play-time {
        position: absolute;
        right: -130px;
        bottom: 4px;
      }
      // .occurrence-time {
      //   position: absolute;
      //   width: 10%;
      //   height: 4px;
      //   bottom: 8px;
      //   border-radius: 2px;
      //   display: inline-block;
      //   background-color: red;
      //   transform: translate(-50%, -50%);
      //   z-index: 1;
      // }
      .slide-mon-f {
        width: 100%;
        position: relative;
        bottom: -10px;
        z-index: 999;
        opacity: 0.5;
      }
      .total-time {
        position: absolute;
        right: -30px;
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