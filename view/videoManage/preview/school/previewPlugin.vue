<template>
  <div class="video-plugin" :class="[isFullScreen ? 'isFullScreen' : '']">
    <!-- 插件提示 -->
    <div class="no-plugin" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <!-- <span type="help-circled" style="color:#57A3F3;margin:10px" title="安装后仍然提示?" @click.native="showHelp"></span> -->
    </div>
    <div v-show="isFullScreen" style="height: 100%;width: 100%;border: 0 none;">
      <iframe v-if="isFullScreen" style="height: 100%;width: 100%;border: 0 none;"></iframe>
    </div>
    <!-- 窗口组件 -->
    <div :class="['single-video-plugin', isFullScreen ? 'full-video-plugin' : '']" ref="singleVideo" :style="{ height: isButton && !isFullScreen  ? 'calc(100% - 56px)' : '100%' }" v-if="!showDownload">
      <plugin ref="plugin" style="padding: 1px" v-for="(item, index) in defaultTotalPane" :key="index" :topEndSlot="topEndSlot" :pluginIconShow="pluginIconShow" :paneMark="index" :isMaximize="isMaximize" :defaultPane="defaultPane" :style="[returnStyleIndex(index), active(index), hidden(index), dbClickStyle(index)]" :singleStatus="videoStatusArr[index]" @changeScreen="changeScreen" @clickEvent="clickEvent" :isNeedModal="isNeedModal" @updateStatus="updateStatus" @openPreview="openPreview" @pluginEscCall="pluginEscCall" @stopPreview="stopPreview" :appendTopButtons="appendTopButtonsFun(index)">
        <template v-slot:topEnd="{paneMark, paneMarkInfo}">
          <slot name="topEnd" :paneMark="paneMark" :paneMarkInfo="paneMarkInfo" v-slot:topEnd></slot>
        </template>
        <template v-slot:bottomEnd="{paneMark, paneMarkInfo}">
          <slot name="bottomEnd" :paneMark="paneMark" :paneMarkInfo="paneMarkInfo" v-slot:bottomEnd></slot>
        </template>
      </plugin>
      <plugin style="background: #888" :style="[pluginSize[(item + defaultTotalPane - 1) % checkedWmode]]" v-for="item in nullDiv" :key="item + defaultTotalPane"></plugin>
    </div>
    <!-- 按钮 -->
    <!-- <div class="video-bottom" v-if="isButton" :class="[isBottonToggle ? 'bottonShow' : 'bottonHide']"> -->
    <div class="video-bottom" v-if="isButton">
      <div v-for="(icon,index) in iconShow" :key="icon.name + '_' + index" :style="icon.type == 'left' ? {position:'absolute',left:icon.normalPx+ 'px'}:{position:'absolute',right:icon.normalPx+ 'px'}">
        <component v-if="!icon.slotName" :is="icon.name" :selectedObj="selectedObj" :panesArr="panesArr" :useSubStream="useSubStream" :checkedWmode="checkedWmode" :videoPageData="videoPageData" :videoStatusArr="videoStatusArr" :curPage="curPage" :totalPage=" totalPage" :iconPosition="icon.type" :isActiveEqu="isActiveEqu" :isPolling="!!pollingTimer" :isNeedModal="isNeedModal" @iconClick="iconClick"></component>
        <slot v-else :name="icon.slotName" :style="{width: icon.width}"></slot>
      </div>
    </div>
    <!-- 快速上墙 -->
    <el-dialog  class="quickTowall" title="快速上墙" :visible.sync="showWall" width="350px"
      :modal="isNeedModal"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <iframe v-if="showWall" style="z-index:-1;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
      <QuickToWall v-if="showWall" style="position:relative;" :camera="selectedObj.source" @comfirm="comfirm"></QuickToWall>
      <div slot="footer" style="position:relative">
        <el-button size="small" type="primary" @click='addToWall'>确定</el-button>
        <el-button size="small" @click='showWall=false' type="ghost">取消</el-button>
      </div>
    </el-dialog>
    <!-- 对讲 -->
    <el-dialog  class="speech" title="对讲面板" :visible.sync="showSpeech" width="300px"
      :modal="isNeedModal"
      :close-on-click-modal="false"
      :modal-append-to-body="false">
      <iframe v-if="showSpeech" style="z-index:-1;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
      <el-radio-group v-model="selectAudio">
        <el-radio v-for="item in audioData" :key="item.rcId" :label="item.rcId" :title="item.name">{{item.name}}</el-radio>
      </el-radio-group>
      <div slot="footer" style="position:relative">
        <el-button type="mini" @click="startSpeech">确定</el-button>
        <el-button type="mini" @click="showSpeech=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import plugin from './plugin'
import { openFlow } from './previewReq'
import Slider from '../yuntai/Slider'
import QuickToWall from '../QuickToWall'
import ScreenShot from '../iconComponents/ScreenShot'
import Videotape from '../iconComponents/Videotape'
import Speech from '../iconComponents/Speech'
import NiaoKan from '../iconComponents/NiaoKan'
import Lunxun from '../iconComponents/Lunxun'
import Attention from '../iconComponents/Attention'
import Collect from '../iconComponents/Collect'
import Volume from '../iconComponents/Volume'
import StopAll from '../iconComponents/StopAll'
import Stop from '../iconComponents/Stop'
import CheckRecode from '../iconComponents/CheckRecode'
import Stream from '../iconComponents/Stream'
import ViewPattern from '../iconComponents/ViewPattern'
import MultiScreen from '../iconComponents/MultiScreen'
import FullScreen from '../iconComponents/FullScreen'
import Page from '../iconComponents/Page'

import previewJs from './previewCom'
import pluginVersionCheck from './pluginVersionCheck'
import socket from '@src/socket/alarm'
import { addToWall } from '@src/http/video/videoPreview.api.js'


export default {
  name: 'previewPlugin',
  inheritAttrs: false,
  components: {
    plugin,
    Slider,
    QuickToWall,
    ScreenShot, // 截图
    Videotape, // 录像
    Speech, // 对讲
    NiaoKan, // 鸟瞰
    Lunxun, // 轮巡
    Attention, // 重点关注
    Collect, // 收藏
    Volume, // 声音
    Stop, // 停止焦点窗口的预览
    StopAll, // 停止全部预览
    CheckRecode, // 检查记录
    Stream, // 码流切换
    ViewPattern, // 画面模式
    MultiScreen, // 画面分割
    FullScreen, // 全屏
    Page // 分页
  },
  props: {
    moduleType: {
      type: Number, // 记录日志需要的字段
      default: 1,
      required: true
    },
    isNeedModal: { // 判断二级弹窗是否需要遮罩
      type: Boolean,
      default: true
    },
    panesArr: {
      // 窗格配置选项
      type: Array
    },
    isButton: {
      // 视频窗下方总按钮条
      type: Boolean,
      default: true
    },
    isDbClickEmit: {
      // 视频窗口双击不放大，只是返回双击事件dbClickEmit(报警模式使用)
      type: Boolean,
      default: false
    },
    topEndSlot: {
      // 视频窗上方按钮插槽是否显示
      type: Boolean,
      default: false
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 4
    },
    defaultTotalPane: {
      // 默认总窗格数量
      type: Number,
      default: 25
    },
    iconShow: {
      // 对应图标是否显示
      type: Array,
      default: () => {
        return []
      }
    },
    appendTopButtons: { // 视频窗口上方的按钮
      type: Object,
      default: () => {
        return {
          toggle: false, // 是否显示
          buttons: [] // 显示那些按钮 change: 交换
        }
      }
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
    },
    isActiveEqu: {
      type: Boolean
    }
  },
  mixins: [previewJs, pluginVersionCheck],
  computed: {
    selectedObj() {
      return this.videoStatusArr[this.checkedPane]
    },
    totalPage() {
      // 总页数
      return Math.ceil(this.videoPageData.length / this.checkedWmode) < 1
        ? 1
        : Math.ceil(this.videoPageData.length / this.checkedWmode)
    },
    nullDiv() {
      // 最后一页补窗格数
      return this.curPage * this.checkedWmode - this.defaultTotalPane > 0
        ? this.curPage * this.checkedWmode - this.defaultTotalPane
        : 0
    },
    isPlayPluginInfo() {
      // 正在播放的预览信息
      let sourceList = this.videoStatusArr.filter(item => item.isPlay)
      return sourceList
    }
  },
  data() {
    return {
      checkedPane: 0, // 当前选中视频框的index
      checkedWmode: this.defaultPane, // 当前窗格数量
      isMaximize: false, // 单画面(双击)
      videoStatusArr: [],
      curPage: 1, // 当前页
      videoPageData: [], // 分页播放数据
      showWall: false, // 显示快速上墙弹窗
      isBottonToggle: false, // 是否显示按钮栏
      isFullScreen: false, // 组件全屏状态
      screenIndex: {}, // 窗口对应下标，用于5布局窗口大小间样式切换
      savePreviewData: {}, // 保存预览的数据，用于单窗口重新打开
      useSubStream: true, // 是否子码流预览
      onresizeTimer: null, // 控制窗口大小改变时候的定时器
      callerInfo: null, // 获取台麦信息
      showSpeech: false, // 是否显示对讲
      selectAudio: '', // 选中的对讲面板
      audioData: [], // 关联对讲数据
      toWallInfo: ''
    }
  },
  created() {
    this.initStyleIndex()
    this.initializeArr()
    this.initBtn()
    this.videoPage()
    this.getuseSubStream()
    this.setuseSubStream(true)
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode === 27 && this.isFullScreen) {
        this.escFn()
      }
    }
    window.onresize = (e) => {
      if (this.onresizeTimer !== null) { return }
      let isFull = document.msFullscreenElement || document.mozIsFullScreen || document.webkitIsFullScreen
      if (!isFull) {
        // 退出全屏后要执行的动作
        // console.log('退出全屏的')
        this.onresizeTimer = setTimeout(() => {
          this.escFn()
          window.clearTimeout(this.onresizeTimer)
          this.onresizeTimer = null
        }, 100)
      }
    }
  },
  methods: {
    iconClick(funcName, value1, value2) {
      if (value1 !== undefined || value2 !== undefined) {
        this[funcName](value1, value2)
      } else {
        this[funcName]()
      }
      // value ? this[funcName](value) : this[funcName]()
    },
    initStyleIndex() { // 初始化screenIndex
      this.screenIndex = {}
      for (let i = 0; i < this.defaultTotalPane; i++) {
        this.screenIndex[i] = i
      }
    },
    initializeArr() { // 初始化窗格状态数组
      let arr = []
      for (let index = 0; index < this.defaultTotalPane; index++) {
        let obj = {
          playStatus: false, // 是否加载插件
          isButton: false, // 底部按钮
          isPlay: false, // 是否播放
          isBoost: false, // 是否鸟瞰
          isSpeech: false, // 是否对讲
          isRecording: false, // 本地录像
          isCentreRecording: false, // 中心录像
          scale: '自适应', // 显示模式
          fullScreen: false, // 全屏 内部判断全屏标识
          showVolume: false, // 音量
          isPolling: false, // 是否轮巡
          volumeValue: 50, // 音量值
          isPlayback: false, // 是否是回放
          source: '', // 播放的信息
          kk: index // 对应窗口的索引
        }
        arr.push(obj)
      }
      this.videoStatusArr = arr
    },
    getuseSubStream() { // 获取子码流预览状态
      let useSubObj = window.localStorage.getItem('useSubStreamObj')
      if (useSubObj) {
        let skey = this.$route.fullPath
        let sObj = JSON.parse(useSubObj)
        if (sObj.hasOwnProperty(skey)) {
          this.useSubStream = sObj[skey]
        } else {
          this.useSubStream = true
        }
      } else {
        this.useSubStream = true
      }
      return this.useSubStream
    },
    setuseSubStream(flag) { // 设置子码流预览状态 画面分割选择时候触发
      let useSubObj = window.localStorage.getItem('useSubStreamObj')
      let skey = this.$route.fullPath
      let sObj = useSubObj ? JSON.parse(useSubObj) : {}
      sObj[skey] = flag
      window.localStorage.setItem('useSubStreamObj', JSON.stringify(sObj))
    },
    savePreviewInfo(data) { // 保存预览原始数据，用于单窗口重新打开预览
      this.savePreviewData = data
    },
    changeScreen(i) { // 点击交换窗口时
      let j = 0
      for (let k = (this.checkedWmode * (this.curPage - 1)); k < (this.checkedWmode * this.curPage); k++) {
        if (this.screenIndex[k] % this.checkedWmode === 0) {
          j = k
          let para = { ...this.screenIndex }
          para[i] = this.screenIndex[j]
          para[j] = this.screenIndex[i]
          this.screenIndex = { ...para }
          this.changeStream('sub1', k)
          this.changeStream('main', i)
          break
        }
      }
    },
    alarmSortFuc(sortArr, targetArr) {
      let result = []
      sortArr.forEach((item,index) => {
        let it = targetArr.find(i => i.source.eid === item.eid)
        if (it) {
          result[index] = {
            kk: it.kk,
            source: it.source
          }
        }
      })
      return result
    },
    async sortArrIndex(arr, data) { // 根据报警传过来的排序数组，然后调整窗口顺序
      // arr 是报警处理好的数据,data是新增数据,
      let indexArr = []
      // console.log("新增数据：",data.id, data)
      let startIndex = (this.curPage - 1) * this.checkedWmode
      let curArrData = arr.slice(startIndex, this.checkedWmode) // 获取当前页的数据

      this.videoPageData = this.$lodash.cloneDeep(arr)
      // 先判断是否在当前页，在开流，不在，只需要存数据
      let outIndex = curArrData.findIndex(item => item.eid === data.eid)
      if (outIndex === -1) { // 保存数据 todo videoStatusArr中数据和videoPageData数据不是对应的
        return
      }

      if(arr.length > this.checkedWmode) {
        let copyVideoStatusArr = this.$lodash.cloneDeep(this.videoStatusArr)
        copyVideoStatusArr = copyVideoStatusArr.slice(0, this.checkedWmode)
        copyVideoStatusArr[this.checkedWmode - 1].source = data
        let afterSort = this.alarmSortFuc(curArrData, copyVideoStatusArr)
        indexArr = afterSort.map(i => i.kk)
      } else {
        for (let i = 0; i < this.defaultTotalPane; i++) {
          if (!this.videoStatusArr[i].source) {
            this.videoStatusArr[i].source = data
            // console.log('替换的位置', this.videoStatusArr[i].kk)
            break
          }
        }
        let afterSort = this.alarmSortFuc(curArrData, this.videoStatusArr)
        indexArr = afterSort.map(i => i.kk)
      }

      this.orderScreen(indexArr)

      await this.alarmPreview(data, outIndex)
      return indexArr
    },
    test() {
      var a = [0,1,2,3,4,5,6,7,8];
      for(var i=a.length-1; i>=0; i--){
        var j = Math.floor(Math.random()*a.length);
        var newa = a[i];
        a[i] = a[j];
        a[j] = newa;
      }
      this.orderScreen(a)
    },
    orderScreen(arr) { // 窗口排序, arr是对应窗口的索引, arr的长度不能超过defaultTotalPane（默认总窗口数）
      // console.log(arr, '++++++++++++++++++')
      let para = { ...this.screenIndex }
      arr.forEach((item, index) => {
        if (typeof (item) === 'number') {
          para[item] = index
        }
      })
      this.screenIndex = { ...para }
      // console.log(this.screenIndex)
    },
    appendTopButtonsFun(index) { // 计算窗口内切换窗口按钮是否显示
      return { ...this.appendTopButtons, toggle: !this.isMaximize && (this.screenIndex[index] % this.checkedWmode !== 0) && (this.checkedPane === index) && this.appendTopButtons.toggle }
    },
    returnStyleIndex(index) { // 计算窗口对应样式
      let rIndex = this.screenIndex[index] % this.checkedWmode
      // if (index < this.checkedWmode) {
      //   console.log(index, rIndex, this.pluginSize[rIndex])
      // }
      return this.pluginSize[rIndex]
    },
    active(index) { // 选中窗格样式
      if (this.checkedPane === index) {
        // return { 'border-color': '#4699f9', 'border-width': '2px' }
        return { 'border-color': '#4699f9'}
      }
    },
    hidden(index) { // 隐藏窗格
      if (
        this.isMaximize
          ? index !== this.checkedPane
          : index > this.checkedWmode * this.curPage - 1 || index < this.checkedWmode * (this.curPage - 1)
      ) {
        return { position: 'absolute', left: '-9999px', top: '-9999px' }
      }
    },
    dbClickStyle(index) { // 窗格双击后的样式
      if (this.isMaximize && index === this.checkedPane) {
        return { 'width': '100%', 'height': '100%', 'position': 'absolute', 'top': 0, 'left': 0 }
      }
    },
    pageChange(val) { // 当前屏改变
      let oldCurPage = this.curPage
      this.curPage = val
      this.isMaximize = false
      this.checkedPane = (this.curPage - 1) * this.checkedWmode
      let maxWodineNum = (this.curPage * this.checkedWmode > this.defaultTotalPane) ? this.defaultTotalPane : (this.curPage * this.checkedWmode)
      for (let index = this.checkedPane; index < maxWodineNum; index++) {
        // 打开当前屏预览
        if (this.videoPageData[index]) {
          this.openPreview(this.videoPageData[index], index)
        }
      }
      for (let index = (oldCurPage - 1) * this.checkedWmode; index < oldCurPage * this.checkedWmode; index++) { // 关闭之前屏的预览
        if (this.videoStatusArr[index] && this.videoStatusArr[index].isPlay) {
          this.stopPreview(index)
        }
      }
    },
    pluginEscCall(index, type, keyCode) { // 插件监听键盘事件回调
      if (Number(keyCode) === 27) {
        this.isFullScreen && this.fullScreen()
      }
    },
    pluginDom(index) { // 返回指定窗格的 object dom
      return index === undefined
        ? this.$refs.plugin[this.findFreePane()].$refs.object
        : this.$refs.plugin[index].$refs.object
    },
    playStop() {
      let arr = [
        {
          devIp: '192.168.20.36',
          devPort: 3721,
          channel: 1,
          streamType: 'main',
          resId: '5c26d593cc13923fd8aa59e4',
          cameraName: '镜头名称'
        },
        {
          devIp: '192.168.20.36',
          devPort: 3721,
          channel: 1,
          streamType: 'main',
          resId: '5c26d593cc13923fd8aa59e4',
          cameraName: '镜头名称'
        }
      ]
      this.openAll(arr)
    },
    clickEvent(index, clickType, paneMark) {
      // 返回参数 index：插件窗格号 clicktype：单机还是双击
      // 点击事件
      console.log('clikEvent recive', index, clickType, paneMark)
      this.checkedPane = paneMark
      // 需要判断当前选中窗格是否有视频播放
      if (this.videoStatusArr[paneMark].isPlay) {
        let data = this.videoStatusArr[paneMark].source
        let datas = this.videoPageData.map(i => i)
        if (clickType === 1) {
          this.$emit('alarmData', data, clickType)
        } else {
          this.$emit('alarmData', data, clickType, datas)
        }
      }
      if (clickType === 2) {
        if (this.isDbClickEmit) {
          this.$emit('dbClickEmit', paneMark)
          return
        }
        let obj = document.querySelector('.single-video-plugin')
        obj.style.opacity = '0'
        this.isMaximize = this.checkedWmode !== 1 && !this.isMaximize // 单窗格不允许切换单画面，5窗口双击是大小窗口切换
        setTimeout(() => {
          obj.style.opacity = '1'
        }, 0)
      }
    },
    updateStatus(index, obj, type) { // 更新维护的窗格的属性
      // 跟新视频窗格上的功能条
      if (type === 'isButton') {
        this.videoStatusArr.forEach((element,i) => {
          if (i !== index) {
            element.isButton = false
          }
        })
      }
      // 子组件更新状态数组
      for (const key in obj) {
        this.videoStatusArr[index][key] = obj[key]
      }
    },
    findFreePane() { // 找出空闲窗格返回窗格索引，报警和预览的规则不一样
      for (let index = (this.curPage - 1) * this.checkedWmode; index < this.curPage * this.checkedWmode; index++) {
        let pIndex = this.screenIndex[index]
        if (!this.videoStatusArr[pIndex].isPlay) {
          return pIndex
        }
      }
      return this.checkedPane
    },
    changeCheckedPane() { // 自动切换焦点窗口
      let startIndex = (this.curPage - 1) * this.checkedWmode
      let endIndex = this.curPage * this.checkedWmode
      if (this.checkedPane === endIndex - 1) {
        this.checkedPane = startIndex
      } else {
        this.checkedPane += 1
      }
    },
    /**
     * params nImgType 需要抓取的图片类型 1:jpg 0:bmp
     * params nJpgQuality 当抓取为jpg时的图片质量 1-100
     */
    getRealPicturebyBase64(nImgType = 1, nJpgQuality = 100) { // 抓图保存成Base64数据
      let arr = []
      for (let index = 0; index < this.checkedWmode; index++) {
        let dom = this.pluginDom(index)
        dom ? arr.push(dom.GetRealPicturebyBase64(nImgType, nJpgQuality)) : arr.push('')
      }
      return arr
    },
    fullScreen(type) {
      if (type) {
        // console.log('自组件触发的全屏操作', this.selectedObj.fullScreen)
        if (this.selectedObj.fullScreen) {
          this.escFn()
        } else {
          this.isFullScreen = true
          this.$nextTick(() => {
            this.requestFullscreen()
          })
          this.$emit('changeFullscreen', true)
        }
      } else {
        if (this.isFullScreen) { // 退出全屏
          this.escFn()
          this.isFullScreen = false
        } else { // 全屏
          // if (this.checkedWmode !== 1 && !this.isMaximize) {
          //   this.isMaximize = true
          // }
          this.isFullScreen = true
          this.$nextTick(() => {
            this.requestFullscreen()
          })
          this.$emit('changeFullscreen', true)
          // this.updateStatus(this.checkedPane, { fullScreen: true }, 'isButton')
        }
      }
    },
    escFn() {
      if (!this.isFullScreen) { return }
      this.isFullScreen = false
      this.$nextTick(() => {
        this.exitFullscreen()
      })
      // this.updateStatus(this.checkedPane, { fullScreen: false }, 'isButton')
      this.$emit('changeFullscreen', false)
      // if (this.checkedWmode !== 1 && this.isMaximize) {
      //   this.isMaximize = false
      // }
    },
    toWallBtn() { // 上墙
      if (!this.selectedObj.isPlay) {
        return
      }
      this.showWall = true
    },
    comfirm(obj) {
      this.toWallInfo = obj
    },
    addToWall() {
      if (!this.toWallInfo) {
        this.$messageWarning('请选择上墙位置！')
        return
      }
      addToWall(this.toWallInfo).then(res => {
        if (res.data.code === 0) {
          this.$messageSuccess('上墙成功')
          this.showWall = false
          this.$emit('isToWall', true)
        } else {
          this.$messageError(res.data.message || '上墙失败')
          this.$emit('isToWall', false)
        }
        this.toWallInfo = ''
      }).catch(err => {
        this.$emit('isToWall', false)
      })
    },
    changeToBack() {
      this.stopPreviewALL()
      this.$emit('update:toggle', 'playBack')
    },
    isMain(index) { // 判断是不是主码流预览
      // todo 拓展其它画面的码流类型
      if (this.checkedWmode >= 9) {
        let status = !this.useSubStream
        return status
      } else if (this.checkedWmode <= 4) {
        return true
      } else {
        return true
      }
    },
    onlyOpenPlugin(item, pIndex) { // 仅占用插件，不开流。用于报警对讲。item对讲信息，pIndex窗口索引（可不传）
      let index = pIndex
      if (typeof (index) !== 'number') {
        index = this.findFreePane()
        this.checkedPane = index
      }
      this.updateStatus(index, { playStatus: true, source: item, isPlay: true })
    },
    async alarmPreview(data, pIndex) { // 报警单独开流方法
      // 不管是否成功，需要把插件初始化，数据需要保存
      let videoData = JSON.parse(JSON.stringify(data))
     
      // 因为开流和机构的streamType类型不同
      if (videoData.streamType === 'main') {
        videoData.streamType = 1
      } else if (videoData.streamType === 'sub1') {
        videoData.streamType = 2
      } else if (videoData.streamType === 'sub2') {
        videoData.streamType = 3
      }
      let index = this.findFreePane()
      this.checkedPane = index
      if (this.videoPageData.length > this.checkedWmode) { // 判断是否数据够一页
        if (this.videoStatusArr[index].isPlay) { // 判断当前窗格是否播放，播放就先关再开
          this.stopPreview(index, true)
        }
      }
      // 校园平台插件预览
      this.getuseSubStream()
      if (this.isMain(index)) { // 判断码流类型
        if (this.checkedPane < 9) {
          let streams = ['main', 'sub1', 'sub2']
          videoData.streamType = streams[videoData.streamType - 1] || ''
        } else {
          videoData.streamType = 'main'
        }
      } else {
        videoData.streamType = 'sub1'
      }
      this.updateStatus(index, { playStatus: true, isButton: false, isPlay: false })
      this.$nextTick(async() => {
        this.updateStatus(index, { source: videoData, isPlay: true })
        let status = await openFlow(this.pluginDom(index), videoData)
        if (status !== 0) {
          this.$notify({ title: '失败', message: '开流失败！', type: 'error', position: 'bottom-right' })
        }
        this.$refs.plugin[index].clearTOpen()
        this.$emit('openBack', videoData, index)
      })
      this.updateStatus(index, { isPlay: true }) // $nextTick 是异步 先改成播放状态
    },
    async openAll(data) {
      await this.stopPreviewALL(true)
      this.curPage = 1
      this.checkedPane = 0
      // if (data.length > this.defaultTotalPane) { // 分页显示
      //   this.$Notice.warning({ title: '警告', desc: '无空闲窗口显示更多通道！' })
      // }
      this.videoPageData = this.videoPageData.concat(data)
      for (let index = 0; index < this.checkedWmode; index++) {
        if (data[index]) {
          await this.openPreview(data[index], null, 'openAll')
        }
      }
    },
    /*
      预览方式： 1.单个设备预览
                  1.1 焦点窗格播放
                  1.2 如果当前没有空闲的窗格播放，则会覆盖在焦点窗格
                2. 一键展开 根据开流的设备数量和当前窗格确定是否分页
                3. 轮巡 不会翻页，只会在当前窗格中进行画面切换
     */
    async openPreview(data, pIndex, flag) {
      let streams = ['main', 'sub1', 'sub2']
      // 因为开流和机构的streamType类型不同
      if (data.streamType === 1) {
        data.streamType = 'main'
      } else if (data.streamType === 2) {
        data.streamType = 'sub1'
      } else if (data.streamType === 3) {
        data.streamType = 'sub2'
      }
      // 为了快速回放字段重命名
      data.devPort = data.devPort || data.devCport
      // 为了码流切换，需要记录传递进来的码流信息
      data.sourceStream = data.sourceStream ||　data.streamType
      let videoData = JSON.parse(JSON.stringify(data))
      let index = pIndex
      if (typeof (index) !== 'number') {
        index = this.checkedPane
        if (this.selectedObj.isPlay) {
          index = this.findFreePane()
          if (index === this.checkedPane) {
            this.stopPreview(index)
          } else {
            this.checkedPane = index
          }
        }
      }

      // 1-9是用传进来的码流播放，9-25是默认是子码流，如果画面分割没有勾选，则使用传进来的码流播放
      // 码流切换是直接用切换的码流来播放
      if (this.checkedWmode < 9) {
        videoData.streamType = videoData.sourceStream
      } else {
        videoData.streamType = this.getuseSubStream() ? 'sub1' : videoData.sourceStream
      }
      this.updateStatus(index, { playStatus: true, isButton: false, isPlay: false })
      this.$nextTick(async() => {
        let status = await openFlow(this.pluginDom(index), videoData)
        if (status !== 0) {
          this.$notify({ title: '失败', message: '开流失败！', type: 'error', position: 'bottom-right' })
          this.updateStatus(index, { isPlay: false })
          return
        }
        this.$refs.plugin[index].clearTOpen()
        this.updateStatus(index, { source: videoData, isPlay: true })
        this.videoPageData[index] = videoData
        this.$emit('openBack', videoData, index)
      })
      this.updateStatus(index, { isPlay: true }) // $nextTick 是异步 先改成播放状态
    },
    async openIndexPreview(data, index, flag) { // 指定窗口预览
      index = index !== undefined ? index : this.checkedPane
      data.devPort = data.devPort || data.devCport
      // 判断是否播放，播放先关闭
      if (this.videoStatusArr[index].isPlay) {
        this.stopPreview(index, true)
      }
      
      let videoData = JSON.parse(JSON.stringify(data))
      // 1-9是用传进来的码流播放，9-25是默认是子码流，如果画面分割没有勾选，则使用传进来的码流播放
      // 码流切换是直接用切换的码流来播放
      if (!flag) {
        if (this.checkedWmode < 9) {
          videoData.streamType = videoData.sourceStream
        } else {
          videoData.streamType = this.getuseSubStream() ? 'sub1' : videoData.sourceStream
        }
      }
      this.updateStatus(index, { playStatus: true, isPlay: false })
      await this.$nextTick()
      let status = await openFlow(this.pluginDom(index), videoData)
      if (status !== 0) {
        this.$notify({ title: '失败', message: '开流失败！', type: 'error', position: 'bottom-right' })
        this.updateStatus(index, { isPlay: false })
        return status
      }
      this.$refs.plugin[index].clearTOpen()
      this.updateStatus(index, { isPlay: true, source: videoData })
      this.videoPageData[index] = videoData
      this.$emit('openBack', videoData, index)
      return status
    },
    async alarmStopPreview(alarmData) { // 报警数据批量处理
      if (Array.isArray(alarmData)) {
        alarmData.forEach(async(item) => {
          let index = this.videoPageData.findIndex(kk => kk.detail.id === item.id)
          if (index !== -1) {
            await this.stopPreview(index, true)
            this.$refs.plugin[index].clearTOpen()
          }
        })
      }
    },
    GetPlayerPicParam(param) {
      return this.$refs.plugin[this.checkedPane].GetPlayerPicParam(param)
    },
    SetPlayerPicParam(param) {
      return this.$refs.plugin[this.checkedPane].SetPlayerPicParam(param)
    },
    syncChangeCheckedPane(data) { // 为了报警做联动高亮
      let key = data && data.id
      if (!key) { return false }
      // todo 只在当前布局上查找，暂不考虑分页
      this.videoPageData.forEach((item, index) => {
        if (item.detail && item.detail.id === key) {
          this.checkedPane = index
        }
      })
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.escFn, false)
    window.onresize = null
  }
}
</script>

<style lang="less" scoped>
.video-plugin {
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  .no-plugin {
    font-size: 24px;
    text-align: center;
    padding: 20% 40%;
    height: calc(~'100% - 56px');
  }
  .single-video-plugin {
    position: relative;
    overflow: hidden;
    width: 100%;
    font-size: 0px;
    background: #404040;
    z-index: 10;
    .shade-iframe {
      width: 100%;
      height: 100%;
      background-color: #404040;
      border: 0px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
    }
    // .hide {
    //   position: absolute;
    //   left: 9999px;
    //   top: -9999px;
    //   z-index: 999;
    // }
    .maximize {
      width: 100% !important;
      height: 100%;
    }
    // .active {
    //   border-color: #4699f9;
    // }
  }
  .full-video-plugin {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 16;
  }
  .video-bottom {
    position: relative;
    width: 100%;
    height: 56px;
    line-height: 56px;
    background-color: #fff;
    // overflow: hidden;
    z-index: 15;
    .nodiv {
      display: flex;
      flex: 1;
    }
    i {
      padding: 0 8px;
      cursor: pointer;
      font-size: 20px;
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
        background-color: #335589;
        list-style: none;
        color: snow;
        text-align: center;
        line-height: 40px;
        padding: 0 6px;
        border-radius: 4px;
        top: 7px;
        i {
          display: block;
          position: absolute;
          background: #335589;
          width: 14px;
          height: 14px;
          transform: rotate(45deg);
          top: 13px;
        }
        li {
          display: inline;
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
        margin: 2px 0;
      }
    }
    .disable,
    .disable:hover {
      color: #878282;
      cursor: not-allowed;
    }
  }
  .speech {
    /deep/ .el-radio {
      margin-bottom: 10px;
      width: calc(~'50% - 30px');
      height: 20px;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.isFullScreen {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
}
// 点击窗口，主按钮栏显隐性
// .buttonFreedom {
//   position: relative;
//   .single-video-plugin {
//     background: #404040;
//     z-index: 10;
//   }
//   .video-bottom {
//     position: absolute;
//     width: 100%;
//     padding: 0 10px;
//     border-bottom-left-radius: 5px;
//     border-bottom-right-radius: 5px;
//     transform: translateY(100%);
//     bottom: 56px;
//     transition: bottom 1s;
//   }
//   .bottonShow {
//     bottom: 0px;
//   }
//   .bottonHide {
//     bottom: 56px;
//   }
// }
.quickTowall {
  height: 520px;
  /deep/ .el-dialog__body {
    width: 100%;
    height: 240px;
  }
}
</style>
