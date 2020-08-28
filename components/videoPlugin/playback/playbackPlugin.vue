<template>
  <div class="playbackPlugin" :class="[isFullScreen ? 'fs' : '', buttonFreedom && !isFullScreen ? 'buttonFreedom' : '']">
    <!-- 校验插件版本 -->
    <div class="no-plugin" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <el-button type="text" @click.native="showHelp" title="安装后仍然提示?">安装后仍然提示?</el-button>
    </div>
    <!-- 全屏背景 -->
    <div v-show="isFullScreen" class="fullScreenBg">
      <iframe v-if="isFullScreen"></iframe>
    </div>
    <!-- 视频窗口 -->
    <div class="videobox" ref="singleVideo" :style="{ height: isButton ? `calc(100% - ${singleVideoHeight}px)` : '100%' }">
      <plugins ref="plugin" v-for="(item, index) in panesArr[panesArr.length-1].value" :key="index" :paneMark="index" :style="{
              width: (isMaximize&&index===checkedPane) ? '100%' : wd,
              height: (isMaximize&&index===checkedPane) ? '100%' : ht,
            }" :class="className(index)" :appendTopButtons="appendTopButtonsFun(index)" :singleStatus="videoStatusArr[index]" @middlePlay="middlePlay" @clickEvent="clickEventP" @updateStatus="updateStatus" @pluginEscCall="pluginEscCall" @changeScreen="changeScreen"></plugins>
    </div>
    <!-- 按钮栏 -->
    <div class="master-control" :style="{ bottom: isBottonToggle ? '0px' : `${singleVideoHeight}px` }">
      <div class="progress-bar-parent" v-if="configuration.progressBar.show">
        <div class="progress-bar">
          <span class="play-time" v-if="configuration.progressBar.type == ''">{{$moment(playTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
          <span class="occurrence-time" v-show="false" :style="{'left': occurrenceTimeLeft + '%'}"></span>
          <div class="total-time" v-if="configuration.progressBar.type == ''">
            <span>{{progressNow}} / {{progressTotalTime}}</span>
          </div>
          <div class="slide-mon-f"></div>
        </div>
      </div>
      <div class="video-bottom" v-if="isButton" :class="[isBottonToggle ? 'bottonShow' : 'bottonHide']">
        <div v-for="(icon,index) in iconShow" :key="icon.name + '_' + index" :style="icon.type == 'left' ? {position:'absolute',left:icon.normalPx+ 'px'}:{position:'absolute',right:icon.normalPx+ 'px'}">
          <component v-if="!icon.slotName" :is="icon.name" :selectedObj="selectedObj" :panesArr="panesArr" :useSubStream="useSubStream" :checkedWmode="checkedWmode" :checkedScreenMode="checkedScreenMode" :videoStatusArr="videoStatusArr" :iconPosition="icon.type" :iconPlay="iconPlay" :shearDownload="shearDownload" :isSyncF="isSync" @iconClick="iconClick"></component>
          <slot v-else :name="icon.slotName" :style="{width: icon.width}"></slot>
        </div>
      </div>
    </div>
    <!-- 时间轴 -->
    <timeProgress ref="mychild" v-if="configuration.timeline.show" :deScreen="checkedWmode" @ondrag="getTimeFromChild" @changeParentIndex="getIndexFromChild" @changeSync="getSyncFromChild" :isSyncT="isSync" :isCenter="isCenterP" :checkedPaneP="checkedPane" :channelName="channelName"></timeProgress>
  </div>
</template>

<script>
import plugins from './index'
import timeProgress from './components/timeProgress'

import FullScreen from './components/iconComponents/FullScreen'
import MultiScreen from './components/iconComponents/MultiScreen'
import NiaoKan from './components/iconComponents/NiaoKan'
import ScreenShot from './components/iconComponents/ScreenShot'
import SplitMode from './components/iconComponents/SplitMode'
import Stop from './components/iconComponents/Stop'
import StopAll from './components/iconComponents/StopAll'
import TVWall from './components/iconComponents/TVWall'
import Volume from './components/iconComponents/Volume'
import ScreenMode from './components/iconComponents/ScreenMode'
import Download from './components/iconComponents/Download'
import CutDownload from './components/iconComponents/CutDownload'
import Play from './components/iconComponents/Play'
import ZhuZhen from './components/iconComponents/ZhuZhen'
import PlaySpeed from './components/iconComponents/PlaySpeed'
import Rewind from './components/iconComponents/Rewind'
import Attention from './components/iconComponents/Attention'

import common from '../common'
import syncPlay from './sync/syncPlayback'
import asyncPlay from './async/asyncPlayback'

export default {
  name: 'playbackPlugin',
  mixins: [common, syncPlay, asyncPlay],
  components: {
    plugins,
    timeProgress,
    FullScreen,
    MultiScreen,
    NiaoKan,
    ScreenShot,
    SplitMode,
    Stop,
    StopAll,
    TVWall,
    Volume,
    ScreenMode,
    Download,
    CutDownload,
    Play,
    ZhuZhen,
    PlaySpeed,
    Rewind,
    Attention
    // SuspenClose
  },
  props: {
    videoPluginVerify: { // 使用插件版本校验
      type: Boolean,
      default: true
    },
    buttonFreedom: { // 是否使主按钮栏通过点击显隐
      type: Boolean,
      default: false
    },
    defaultPane: { // 默认显示窗格数量
      type: Number,
      default: 4
    },
    iconShow: { // 对应图标是否显示
      type: Array,
      default: () => []
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
    isCenterP: {
      type: Boolean,
      default: false
    },
    panesArr: {// 画面分割配置
      type: Array,
      default: () => [
        { value: 1, label: '单画面' },
        { value: 4, label: '4画面' },
        { value: 9, label: '9画面' },
        { value: 16, label: '16画面' }
      ]
    }
  },
  created() {
    this.initBtn()
    for (let i = 0; i < 25; i++) {
      this.screenIndex[i] = i
    }
    this.initializeArr()
  },
  mounted() { },
  data() {
    return {
      screenIndex: {}, // 窗口下标
      isFullScreen: false, // 是否使用全屏
      isBottonToggle: true, // 是否使用按钮栏
      isCenter: false, // 是否为中心回放
      isSync: true, // 是否为异步
      pluginsStatus: { // 插件状态
      },
      originalState: { // 状态数组中每项最初的值 用来恢复初始值使用
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
      },
      checkedWmode: 4, // 当前画面数量
      checkedPane: 0, // 当前选中视频框的index
      checkedScreenMode: 1,
      useSubStream: true, // 是否子码流预览
      channelName: '', // 通道名称
      videoStatusArr: [], // 视频窗格状态数组
      shearDownload: false, // 剪辑下载确认弹窗是否显示
      progressTotalTime: '00:00:00',
      progressNow: '00:00:00',
      progressTimer: null, // 进度条定时器
      progress: 0, // 进度条进度
      occurrenceTimeLeft: 0, // 进度条标记时间
      playTime: new Date().getTime() / 1000, // 回放视频当前时间
      isMaximize: false // 单画面
    }
  },
  computed: {
    isButton() { // 是否使用主按钮栏
      return !!this.iconShow.length
      // return true
    },
    iconPlay() { // 按钮状态 -播放 -暂停
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
    selectedObj() { // 选中项状态值
      return this.videoStatusArr[this.checkedPane]
    },
    singleVideoHeight() { // 视频窗格高度
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
    },
    wd() {
      const wd = (100 / Math.sqrt(this.checkedWmode)).toFixed(2)
      return `calc(${wd}% - 4px)`
    },
    ht() {
      return this.wd
    }
  },
  watch: {
  },
  methods: {
    // 初始化li元素
    initializeArr() {
      // 初始化窗格状态数组
      let arr = []
      for (let index = 0; index < 16; index++) {
        arr.push(JSON.parse(JSON.stringify(this.originalState)))
      }
      this.videoStatusArr = arr
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
        if (!i) {
          v.normalPx = 0
        } else {
          v.normalPx = lastNum + (Number(v.width) || 36)
          lastNum = v.normalPx
        }
      })
      rightArr.forEach((v, i) => {
        if (!i) {
          v.normalPx = 0
        } else {
          v.normalPx = lastNumR + (Number(v.width) || 36)
          lastNumR = v.normalPx
        }
      })
    },
    // 从时间轴插件获取到的的时间
    getTimeFromChild(time) {
      console.log(this.$moment(time).format('HH:mm:ss'), '拖动收到的时间')
      // if (this.isSync) {
      //   for (let i = 0; i < this.videoStatusArr.length; i++) {
      //     if (this.videoStatusArr[i].isPlay) {
      //       this.anewOpenPlayback(time / 1000, true, i)
      //     }
      //   }
      // } else {
      //   this.anewOpenPlayback(time / 1000)
      // }
    },
    // 从时间轴插件获取到的当前选中项
    getIndexFromChild(index) {
      // this.clickEventP(index, 1, index)
    },
    // 时间轴插件同步异步切换响应函数
    getSyncFromChild(bool) {
      // this.isSync = bool
      // // 只存在中心回放
      // if (bool) {
      //   // 同步
      //   var minOne = ''
      //   for (let i = 0; i < this.videoStatusArr.length; i++) {
      //     let result = this.videoStatusArr[i].result
      //     if (Object.keys(result).length === 0 || result.eventList.length === 0) {
      //       continue
      //     }
      //     if (minOne === '') {
      //       minOne = result.eventList[0].evtTblInfo.startTime
      //       continue
      //     }
      //     if (minOne > result.eventList[0].evtTblInfo.startTime) {
      //       minOne = result.eventList[0].evtTblInfo.startTime
      //     }
      //   }
      //   for (let i = 0; i < this.videoStatusArr.length; i++) {
      //     if (this.videoStatusArr[i].isPlay) {
      //       this.anewOpenPlayback(minOne, false, i)
      //     }
      //   }
      // } else {
      //   // 异步
      //   for (let i = 0; i < this.videoStatusArr.length; i++) {
      //     if (this.videoStatusArr[i].isPlay) {
      //       this.anewOpenPlayback(this.videoStatusArr[i].result.startTime, false, i)
      //     }
      //   }
      // }
    },
    // 接受点击事件
    iconClick(funcName, value) {
      console.log(funcName, '-----------------------------funcName')
      value ? this[funcName](value) : this[funcName]()
    },
    className(index) { // plugin 类名逻辑
      let obj = {}
      obj.hide = this.isMaximize ? index !== this.checkedPane : index + 1 > this.checkedWmode
      obj.active = this.checkedPane === index
      return obj
    },
    // 单个时间轴 end
    appendTopButtonsFun(index) {
      return {
        ...this.appendTopButtons,
        toggle: !this.isMaximize && this.screenIndex[index] !== 0 && this.checkedPane === index
      }
    },
    middlePlay(paneMark) {
      // 窗格中间播放按钮回调
      // paneMark 窗格号
      // if (this.middlePlayFatherStatus) {
      //   this.updateStatus(paneMark, { isSyncPlay: false, isMiddlePlay: false })
      //   this.anewOpenPlayback('', true, paneMark)
      // }
      this.$emit('middlePlay', paneMark)
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
    // 窗格的点击事件
    clickEventP(index, clickType, paneMark) {
      // this.$refs.SuspenClose.addEventListener('click', this.stopBack())

      this.$emit('clickEventP', 1, paneMark)
      // // 返回参数 index：插件窗格号 clicktype：单机还是双击
      // // 点击事件
      this.checkedPane = paneMark
      // if (clickType === 2) {
      //   if (this.checkedWmode === 1) {
      //   } else {
      //     let obj = document.querySelector('.single-video-plugin')
      //     this.isMaximize = this.checkedWmode !== 1 && !this.isMaximize // 单窗格不允许切换单画面
      //     if (this.videoStatusArr[this.checkedPane].isPlay) {
      //       if (this.isMaximize) {
      //         this.$refs.mychild.changeFn({
      //           screenNum: 1,
      //           index: this.checkedPane,
      //           type: 'scaleD'
      //         })
      //       } else {
      //         this.$refs.mychild.changeFn({
      //           screenNum: this.defaultPane,
      //           index: this.checkedPane,
      //           type: 'scaleX'
      //         })
      //       }
      //     }
      //   }
      // }
      // if (this.videoStatusArr[paneMark].isPlay) {
      //   this.$refs.mychild.setCurTime(this.playTime, paneMark)
      //   this.timer()
      // }
      this.$emit('clickEventP', clickType, paneMark)
    },
    pluginEscCall(index, type, keyCode) {
      // 插件监听键盘事件回调
      if (Number(keyCode) === 27) {
      }
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
    // 回放开流
    /**
     * 存在
     * 1、双击开流
     * 2、检索开流
     * 3、检索选择开流
     * 3种情况，不管实际怎么开，此处指处理过滤好的data
     *
     * 1、校验
     * 2、判定 前端-中心 同步-异步
     * 3、整理数据
     * 4、查询
     * 5、开流
     */
    async openPlayback(data, time) {
      if (!data.length) { return }
      if (!this.$store.getters.plugin.valid) {
        this.$messageWarn('请先下载插件，或当前浏览器不支持插件！')
        return
      }
      this.progressTimer && clearInterval(this.progressTimer)
      // if (data.length > this.checkedWmode) {
      //   this.$messageError('无空闲窗口显示更多通道！')
      // }
      // 校验是否为同步/异步
      if (this.isSync) {
        this.asyncPlayback(this.$lodash.cloneDeep(data), time)
      } else {

      }
    }
  },
  beforeDestroy() { }
}
</script>

<style lang="less" scope>
.playbackPlugin {
  width: 100%;
  height: 100%;
  // 校验插件
  .no-plugin {
    font-size: 24px;
    text-align: center;
    padding: 20% 40%;
    height: calc(~'100% - 56px');
    border: 1px solid #ccc;
    a,
    button {
      color: #00a5e3;
    }
    button {
      cursor: help;
    }
  }
  // 全屏背景
  .fullScreenBg,
  .fullScreenBg iframe {
    height: 100%;
    width: 100%;
    border: 0 none;
    padding: 0;
    margin: 0;
  }
  &.fs {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 1000;
  }
  // 点击窗口，主按钮栏显隐性
  &.buttonFreedom {
    position: relative;
    .single-video-plugin {
      background: #404040;
      z-index: 10;
    }
    .video-bottom {
      position: absolute;
      width: 100%;
      padding: 0 10px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      transform: translateY(100%);
      bottom: 56px;
      transition: bottom 1s;
    }
    .bottonShow {
      bottom: 0px;
    }
    .bottonHide {
      bottom: 56px;
    }
  }
  // 主按钮栏
  .video-bottom {
    position: relative;
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
    .right,
    .left {
      ul {
        right: 38px;
        i {
          right: -7px;
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
  // 视频窗口
  .videobox {
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
}
</style>
