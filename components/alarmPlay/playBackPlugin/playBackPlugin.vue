<!--
 * @Author: dfk
 * @Date: 2020-08-11 20:57:49
 * @LastEditTime: 2020-08-24 21:37:49
 * @LastEditors: zhangcg
 * @Description:
-->
<template>
  <div @mousedown="clickVideoHierarchy($event)"
       style="width: 100%; height: 100%">
    <VideoHierarchy ref="rootVideoHierarchy"
                    hierachyWidth="100%"
                    hierachyHeight="100%"
                    :class="[isFullScreen ? 'fs' : '']">
      <div id="videoBox"
           class="video-plugin"
           :class="[isFullScreen ? 'fs' : '', buttonFreedom && !isFullScreen ? 'buttonFreedom' : '']">
        <div class="single-video-plugin"
             ref="singleVideo"
             :style="{ height: isButton ? `calc(100% - ${singleVideoHeight}px)` : '100%' }">
          <plugin ref="plugin"
                  v-for="(item, index) in defaultTotalPane"
                  :key="index"
                  :paneMark="index"
                  :style="[returnStyleIndex(index), active(index), hidden(index), dbClickStyle(index)]"
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
                  :flag="index===checkedPane&&singleClick">
          </plugin>
          <plugin style="background: #888"
                  :style="[pluginSize[(item + defaultTotalPane - 1) % checkedWmode]]"
                  v-for="item in nullDiv"
                  :key="item + defaultTotalPane"></plugin>
        </div>
        <div class="master-control"
             :style="{ bottom: isBottonToggle ? '0px' : `${singleVideoHeight}px` }">
          <div class="progress-bar-parent"
               v-if="configuration.progressBar.show">
            <div class="progress-bar">
              <span class="play-time"
                    v-if="configuration.progressBar.type == ''">{{$moment(playTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
              <span class="occurrence-time"
                    v-show="false"
                    :style="{'left': occurrenceTimeLeft + '%'}"></span>
              <div class="total-time"
                   v-if="configuration.progressBar.type == ''">
                <span>{{progressNow}} / {{progressTotalTime}}</span>
              </div>
              <div class="slide-mon-f">
              </div>
            </div>
          </div>
          <div class="video-bottom"
               v-if="isButton"
               :class="[isBottonToggle ? 'bottonShow' : 'bottonHide']">
            <div v-for="(icon,index) in iconShow"
                 :key="icon.name + '_' + index"
                 :style="icon.type == 'left' ? {position:'absolute',left:icon.normalPx+ 'px'}:{position:'absolute',right:icon.normalPx+ 'px'}">
              <component v-if="!icon.slotName"
                  ref="iconShowBtn"
                  :is="icon.name"
                  :selectedObj="selectedObj"
                  :panesArr="panesArr"
                  :checkedPane="checkedPane"
                  :pluginDom="pluginDom"
                  :useSubStream="useSubStream"
                  :checkedWmode="checkedWmode"
                  :checkedScreenMode="checkedScreenMode"
                  :videoStatusArr="videoStatusArr"
                  :iconPosition="icon.type"
                  :iconPlay="iconPlay"
                  :shearDownload="shearDownload"
                  :isSyncF="isSync"
                  :pagingPage="pagingPage"
                  @handleCurrentChange="handleCurrentChange"
                  @iconClick="iconClick">
                </component>
              <slot v-else
                    :name="icon.slotName"
                    :style="{width: icon.width}"></slot>
            </div>
          </div>
        </div>
        <!-- <button @click="openPreviewData">1111111111</button> -->
        <TimeProgress ref="mychild"
            v-if="configuration.timeline.show"
            :deScreen="checkedWmode"
            @ondrag="getTimeFromChild"
            @changeParentIndex="getIndexFromChild"
            :isSyncT="isSync"
            :isCenter="isCenterP"
            :checkedPaneP="checkedPane"
            :channelName="channelName">
        </TimeProgress>
      </div>
    </VideoHierarchy>
  </div>
</template>
<script>
import { queryData } from '@src/components/videoPlugin/playback/common/requestFunction.js'
import { pluginPlayBackOpen } from '@src/components/videoPlugin/playback/common/plginInMethod'
import { vodCtrl } from '@src/http/video/videoPlayback.api.js'
import {
  openPlaybackList,
  downloadVideoSegments,
  setRecordPlayerRate,
  setRecordPlayerMode,
  setScale,
  getPicture,
  formatSpendTime,
  formatRecordType,
  downloadDev,
  openFlow,
  openFlowData
} from './playback'
import VideoHierarchy from './videoHierarchy'
import plugin from './plugin'
import TimeProgress from './timeProgress'
import FullScreen from '../iconComponents/FullScreen'
import MultiScreen from '../iconComponents/MultiScreen'
import NiaoKan from '../iconComponents/NiaoKan'
import ScreenShot from '../iconComponents/ScreenShot'
import SplitMode from '../iconComponents/SplitMode'
import CheckRecode from '../iconComponents/CheckRecode'
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
import SuspenClose from '../iconComponents/SuspenClose'
import Videotape from '../iconComponents/Videotape'
import Stream from '../iconComponents/Stream'
import Speech from '../iconComponents/Speech'
import PlayBack from '../iconComponents/playBack'
import Paging from '../iconComponents/Paging'
// import Paging from '../iconComponents/VideoPagination'

export default {
  components: {
    VideoHierarchy,
    plugin,
    TimeProgress,
    FullScreen,
    MultiScreen,
    NiaoKan,
    CheckRecode,
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
    SuspenClose,
    Videotape,
    Stream,
    Speech,
    PlayBack,
    Paging
  },
  props: {
    moduleType: {
      type: Number, // 记录日志需要的字段
      default: 1,
      required: true
    },
    channelName: {
      type: String,
      default: ''
    },
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
        { value: 6, label: '6画面' },
        { value: 8, label: '8画面' },
        { value: 9, label: '9画面' },
        { value: 10, label: '10画面' },
        { value: 13, label: '13画面' },
        { value: 14, label: '14画面' },
        { value: 16, label: '16画面' },
        { value: 17, label: '17画面' },
        { value: 22, label: '22画面' },
        { value: 25, label: '25画面' }
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
    defaultTotalPane: {
      // 默认总窗格数量
      type: Number,
      default: 25
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
    },
    previewData: {
      type: Array,
      default: () => {
        return [
          {
            channel: 2,
            devIp: '10.1.2.20',
            devCport: 37777,
            devDport: 37777,
            deviceType:1,
            streamType: 'main',
            name: 'CH1枪机-值守区域1电视墙显示区',
            alarmTime: 1597212433,
            channelId: 1 // 视频通道id
          },
          {
            channel: 1,
            devIp: "10.0.2.10",
            devCport: 37777,
            devDport: 37777,
            eventType: "manualRecord",
            flag: "vm",
            deviceType:4,
            startTime: 1598360275,
            name: '1209120193',
            streamType: "main",
            channelId: 2 // 视频通道id
          },
          {
            channel: 1,
            devIp: '10.1.3.20',
            devCport: 8000,
            devDport: 8000,
            streamType: 'main',
            name: 'IPC1球机-办公区',
            deviceType:4,
            alarmTime: 1597212433,
            channelId: 1 // 视频通道id
          }
        ]
      }
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
      console.log(this.videoStatusArr[this.checkedPane],"======selectedObj")
      return this.videoStatusArr[this.checkedPane]
    },
    splitPreviewDataList() {
      return this.splitPreviewData(this.previewData,this.defaultPane)
    },
    pagingPage() {
      // console.log("=====================",this.defaultPane)
      let total = this.previewData.length
      let pageSize = this.defaultPane
      let pageNum = 1
      let pag = {
        pageSize: pageSize,
        pageNum: pageNum,
        total: total
      }
      return pag
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
    },
    // 画面模式屏幕样式
    pluginSize() {
      let panes = []
      let width3 = 100 / 3 + '%'
      let width6 = 200 / 3 + '%'
      switch (this.defaultPane) {
        case 1:
          panes = [{ left: 0, top: 0, width: '100%', height: '100%', position: 'absolute' }]
          break
        case 4:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: '50%', width: '50%', height: '50%', position: 'absolute' }
          ]
          break
        case 6:
          panes = [
            { left: 0, top: 0, width: width6, height: width6, position: 'absolute' },
            { left: width6, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: 0, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width6, width: width3, height: width3, position: 'absolute' }
          ]
          break
        case 8:
          panes = [
            { left: 0, top: 0, width: '75%', height: '75%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 9:
          panes = [
            { left: 0, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: 0, width: width3, height: width3, position: 'absolute' },
            { left: 0, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width3, width: width3, height: width3, position: 'absolute' },
            { left: 0, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width3, top: width6, width: width3, height: width3, position: 'absolute' },
            { left: width6, top: width6, width: width3, height: width3, position: 'absolute' }
          ]
          break
        case 10:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 13:
          panes = [
            { left: 0, top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '50%', height: '50%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 14:
          panes = [
            { left: 0, top: 0, width: '25%', height: '75%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 16:
          panes = [
            { left: 0, top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: 0, width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '25%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '50%', width: '25%', height: '25%', position: 'absolute' },
            { left: 0, top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '25%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '50%', top: '75%', width: '25%', height: '25%', position: 'absolute' },
            { left: '75%', top: '75%', width: '25%', height: '25%', position: 'absolute' }
          ]
          break
        case 17:
          panes = [
            { left: 0, top: 0, width: '60%', height: '40%', position: 'absolute' },
            { left: '60%', top: 0, width: '40%', height: '40%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        case 22:
          panes = [
            { left: 0, top: 0, width: '40%', height: '40%', position: 'absolute' },
            { left: '40%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        case 25:
          panes = [
            { left: 0, top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '20%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '40%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '60%', width: '20%', height: '20%', position: 'absolute' },
            { left: 0, top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '20%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '40%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '60%', top: '80%', width: '20%', height: '20%', position: 'absolute' },
            { left: '80%', top: '80%', width: '20%', height: '20%', position: 'absolute' }
          ]
          break
        default:
          panes = [
            { left: 0, top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: 0, width: '50%', height: '50%', position: 'absolute' },
            { left: 0, top: '50%', width: '50%', height: '50%', position: 'absolute' },
            { left: '50%', top: '50%', width: '50%', height: '50%', position: 'absolute' }
          ]
          break
      }
      return panes
    }
  },
  created() {
    this.initBtn()
    this.screenIndex = {}
    for (let i = 0; i < this.defaultTotalPane; i++) {
      this.screenIndex[i] = i
    }
    this.initializeArr()
  },
  watch: {},
  data() {
    return {
      screenIndex: {}, // 窗口下标
      singleClick: false,
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
        lookDown: false, // 鸟瞰状态
        fullScreen: false,
        source: '', // 预览播放的信息
        playType: 'preview', // preview- 预览， playback--回放；   当前窗口时预览还是回放
        previewData: {}, // 预览相关信息
        tempListobj: {} // 录像轴信息
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
      curPage: 1, // 当前页
      videoPageData: [],
      // splitPreviewDataList:this.splitPreviewData(this.previewData,this.defaultPane),
      currentPage: 0,
    }
  },
  mounted() {
    document.onkeydown = e => {
      if (e.keyCode === 27 && this.isFullScreen) {
        this.escScreenFull()
      }
    }
    window.onresize = e => {
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
    // this.openPreviewData()
    this.handleCurrentChange()
  },
  methods: {
    /**
     * @description: 总视频列表拆分
     * @param：list,page
     * @return:
     * @author: zhangcg
     */
    splitPreviewData(array,size){
        const length = array.length
        //判断不是数组，或者size没有设置，size小于1，就返回空数组
        if (!length || !size || size < 1) {
          return []
        }
        let index = 0 //用来表示切割元素的范围start
        let resIndex = 0 //用来递增表示输出数组的下标
        //根据length和size算出输出数组的长度，并且创建它。
        let result = new Array(Math.ceil(length / size))
        //进行循环
        while (index < length) {
          //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
          result[resIndex++] = array.slice(index, (index += size))
        }
        //输出新数组
        return result
    },
    /**
     * @description: 总视频列表分页翻页
     * @param：page
     * @return:
     * @author: zhangcg
     */
    handleCurrentChange(page){
      if(page){
        this.currentPage = page - 1
        this.$refs.iconShowBtn[this.$refs.iconShowBtn.length-1].setPaginationConfig({page:page})
      }
      // console.log(this.pluginDom(this.videoStatusArr.length))
      // console.log(this.pluginDom())
      // console.log(this.$refs.iconShowBtn[this.$refs.iconShowBtn.length-1])
      // console.log(this.currentPage)
      this.openPreviewData()
    },
    /**
     * @description: 报警预览回放一体组件
     * @param {type}
     * @return:
     * @author: dfk
     */
    async openPreviewData() {
      console.log("+++++++++",this.previewData)
      if(this.previewData.length>0){
        this.stop(undefined,true)
        // console.log(this.splitPreviewDataList)
        this.videoPageData = []
        for (let index = 0; index < this.checkedWmode; index++) {
          const data = this.splitPreviewDataList[this.currentPage][index]
          if (data) {
            await this.openPreview(this.splitPreviewDataList[this.currentPage][index], index)
            const tempListobj = {
              isShow: true,
              // dsIp: data.devIp,
              index: 0,
              channelName: data.name,
              eventVideo: [
                {
                  end: parseInt(new Date()), // 暂无传预览时间的方法，取为当前时间
                  start: data.alarmTime * 1000, // parseInt(new Date().setHours(0,0,0)/1000),  //暂定，取为当前日期的00:00
                  recordType: 4
                }
              ],
              manualVideo: [],
              timedVideo: [],
              intelVideo: []
            }
            const videObj = {
              ...this.previewData[this.checkedPane],
              startTime: data.alarmTime,
              endTime: parseInt(new Date()/1000),
              devPort: data.devCport
            }
            console.log(videObj,"videObj")
            await pluginPlayBackOpen(this.pluginDom(index), videObj)
            this.updateStatus(index, { tempListobj })
          }
        }
        // 打开一个录像调  recordType == 4 事件录像

        this.$refs.mychild.liData = [this.videoStatusArr[0].tempListobj]
        this.$refs.mychild.reRecordOptions() // 重绘时间轴
        // this.$refs.mychild.openLine(this.videoStatusArr[0].tempListobj)
      }
    },
    // 暴露给父组件设置通道名称
    setChannelName(channelName) {
      this.channelName = channelName
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
        // if (this.checkedWmode !== 1 && !this.isMaximize) {
        //   this.isMaximize = true
        // }
        this.requestFullscreen()
        this.isFullScreen = true
        this.updateStatus(this.checkedPane, { fullScreen: true }, 'isButton')
        // this.$refs.mychild.setDisplay()
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
      // this.$refs.mychild.setDisplay()
      this.$emit('transforFull', false)
    },
    // 计算底部按钮的位置
    initBtn() {
      var leftArr = []
      var rightArr = []
      // var lastNum = 0
      var lastNumR = 0
      this.iconShow.forEach((v, i) => {
        v.normalPx = 0
        v.type === 'left' ? (leftArr[v.index] = v) : (rightArr[v.index] = v)
      })
      leftArr.forEach((v, i) => {
        if (i === 0) {
          v.normalPx = 0
        } else {
          // v.normalPx = lastNum + (Number(v.width) || 36)
          // lastNum = v.normalPx
          v.normalPx = (Number(v.width) || 36) * v.index
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
    nullDiv() {
      // 最后一页补窗格数
      return this.curPage * this.checkedWmode - this.defaultTotalPane > 0
        ? this.curPage * this.checkedWmode - this.defaultTotalPane
        : 0
    },
    returnStyleIndex(index) {
      // 计算窗口对应样式
      let rIndex = this.screenIndex[index] % this.checkedWmode
      // console.log(this.pluginSize,'pluginSize')
      // console.log(this.pluginSize[rIndex],'returnStyleIndex')
      return this.pluginSize[rIndex]
      // return this.pluginSize[this.defaultPane]
    },
    active(index) {
      // 选中窗格样式
      if (this.checkedPane === index) {
        return { 'border-color': '#4699f9', 'border-width': '2px' }
      }
    },
    hidden(index) {
      // 隐藏窗格
      if (
        this.isMaximize
          ? index !== this.checkedPane
          : index > this.checkedWmode * this.curPage - 1 || index < this.checkedWmode * (this.curPage - 1)
      ) {
        return { position: 'absolute', left: '-9999px', top: '-9999px' }
      }
    },
    dbClickStyle(index) {
      // 窗格双击后的样式
      if (this.isMaximize && index === this.checkedPane) {
        return { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
      }
    },
    async clickCheckedWmode(mode) {
      // 画面切换将选中项及是否单画面置为初始值
      if (this.checkedWmode === mode.value) {
        return
      }
      // for (let index = 0; index < this.defaultPane; index++) {
      //   this.stopPreview(index, true)
      // }
      let obj = document.querySelector('.single-video-plugin')
      obj.style.opacity = '0'
      this.$parent.defaultPane = mode.value
      this.checkedWmode = mode.value
      this.isMaximize = false
      this.checkedPane = 0
      this.curPage = 1
      setTimeout(() => {
        obj.style.opacity = '1'
      }, 50)
      for (let index = 0; index < this.checkedWmode; index++) {
        console.log(this.videoPageData[index], 'this.videoPageData[index]')
        if (this.videoPageData[index]) {
          await this.openPreview(this.videoPageData[index], index)
        }
      }
    },
    stopPreview(index, isDom = true) {
      index = index === undefined ? this.checkedPane : index
      var element = this.videoStatusArr[index]
      console.log(element, 'element')
      // console.log(this.videoStatusArr[index],'item videoStatusArr')
      // if (element.source === '' || !element.source) {
      //   return
      // }
      // let elementSource = JSON.parse(JSON.stringify(element.source))
      let obj = { isPlay: false, playStatus: false, lookDown: false, source: '' }
      if (element.isPlay) {
        // 有播放在关闭
        if (element.isCentreRecording) {
          this.$refs.plugin[index].stopCentreRecord()
        }
        if (element.isSpeech) {
          // 关闭对讲
          this.$refs.plugin[index].stopSpeech()
          this.$refs.plugin[index].closeSpeech()
        }
        if (element.showVolume) {
          // 关闭伴音
          this.$refs.plugin[index].closeSound()
        }
        if (isDom) {
          obj.playStatus = true
        }
        let dom = this.pluginDom(index)
        dom && dom.CloseRealStream()
        this.$refs.plugin[index].showPTZ = false
        this.updateStatus(index, obj)
      }
      // if (elementSource) {
      //   this.$emit('stopBack', elementSource)
      // }
      if (!isDom) {
        this.videoPageData[index] = ''
      }
    },
    /*
      预览方式： 1.单个设备预览
                  1.1 焦点窗格播放
                  1.2 如果当前没有空闲的窗格播放，则会覆盖在焦点窗格
                2. 一键展开 根据开流的设备数量和当前窗格确定是否分页
                3. 轮巡 不会翻页，只会在当前窗格中进行画面切换
     */
    async openPreview(data, pIndex) {
      let videoData = JSON.parse(JSON.stringify(data))
      console.log(videoData, '我的videoData')
      let index = pIndex
      if (typeof index !== 'number') {
        index = this.findFreePane()
        this.checkedPane = index
        if (this.selectedObj.isPlay) {
          this.$notify({ title: '警告', message: '无空闲窗口显示更多通道！', type: 'warning' })
          return
        }
      }
      // 校园平台插件预览
      // this.getuseSubStream()
      if (this.isMain(index)) {
        // 判断码流类型
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
        // console.log(await openFlow(this.pluginDom(index), videoData),'返回')
        let openflowData = await openFlowData(videoData)
        let status = await openFlow(this.pluginDom(index), openflowData)
        if (status !== 0) {
          this.$notify({ title: '失败', message: '开流失败！', type: 'error', position: 'bottom-right' })
          this.updateStatus(index, { isPlay: false })
          return
        }
        this.updateStatus(index, { source: videoData, isPlay: true, playType: 'preview', previewData: videoData })
        this.timer() // 启动定时器
        this.$emit('openBack', videoData, index)
      })
      this.updateStatus(index, { isPlay: true }) // $nextTick 是异步 先改成播放状态
    },
    async openPlayBack(data, pIndex) {},
    // 接受点击事件
    iconClick(funcName, value) {
      console.log(funcName, '-----------------------------funcName')
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
      //替换
      this.openBackVideoArr(arr)//新方法开流
      // this.openPlayback(arr)
      this.clickSplit = true
    },
    // 点击画面模式
    clickScreenMode(v) {
      console.log(v, '画面模式')
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
        // fileName: result.name || result.fileName,
        // fileSize: byteConversion(result.filesize || result.eventList[0].evtTblInfo.size),
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
        result: result
      }
      row.isCenter = this.isCenterP
      downloadDev(
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
    downloadVideo(data = [], isQuery = false, callback = () => {}) {
      let download = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        element.fileName = '123'
        download.push(downloadVideoSegments(this.pluginDom(this.checkedPane), element, isQuery, callback))
      }
      return Promise.all(download)
    },
    getBase64Capture() { // Base64截图
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
        path: `${downPath}\\Capture\\${this.videoStatusArr[this.checkedPane].result.fileName}-${this.$moment().format('YYYYMMDDHHmmss')}.jpg`,
        type: 1 // 0-bmp 1-jpg
      }
      getPicture(this.pluginDom(this.checkedPane), param)
    },
    // 鸟瞰调用事件
    clickLookDown() {
      this.pluginDom(this.checkedPane).SetPlayLocalBoost()
      this.updateStatus(this.checkedPane, { lookDown: !this.videoStatusArr[this.checkedPane].lookDown })
    },
    // 声音开关调用click事件
    // 声音开关调用事件
    volumeSwitch() {
      // 音量开关
      if (!this.selectedObj.isPlay) {
        return
      }
      if (this.selectedObj.showVolume) {
        this.pluginDom(this.checkedPane).StopPlayerSound()
        this.updateStatus(this.checkedPane, { showVolume: false })
      } else {
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          // 关闭所有音量
          if (this.videoStatusArr[index].showVolume) {
            this.pluginDom(index).StopPlayerSound()
            this.updateStatus(index, { showVolume: false })
          }
        }
        this.pluginDom(this.checkedPane).OpenPlayerSound()
        this.pluginDom(this.checkedPane).SetPlayerVolume(50)
        this.updateStatus(this.checkedPane, { showVolume: true })
      }
    },
    // 声音改变调用事件,flag标志音量slider是否显示
    changeVolume(v) {
      // 设置音量大小
      if (!this.selectedObj.isPlay) {
        return
      }
      this.pluginDom(this.checkedPane).SetPlayerVolume(v)
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
      if (this.isSync) {
        // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { pitchSpeed: speed })
            setRecordPlayerRate(this.pluginDom(index), speed.value)
            this.controlProtocol(speed.control, index)
          }
        }
      } else {
        // 异步
        this.updateStatus(this.checkedPane, { pitchSpeed: speed })
        setRecordPlayerRate(this.pluginDom(this.checkedPane), speed.value)
        this.controlProtocol(speed.control)
      }
    },
    // 逐帧进调用事件
    clickByFrame() {
      if (this.isSync) {
        // 同步
        for (let index = 0; index < this.videoStatusArr.length; index++) {
          const element = this.videoStatusArr[index]
          if (element.playStatus) {
            this.updateStatus(index, { isPlay: false })
            setRecordPlayerMode(this.pluginDom(index), 1)
          }
        }
      } else {
        // 异步
        setRecordPlayerMode(this.pluginDom(this.checkedPane), 1)
        this.updateStatus(this.checkedPane, { isPlay: false })
      }
    },

    // 从时间轴插件获取到的的时间
    async getTimeFromChild(etime) {
      if (!this.selectedObj.isPlay) {
        return
      }
      console.log(this.$moment(etime).format('HH:mm:ss'), '拖动收到的时间')
      // 判断该开预览还是回放
      window.clearInterval(this.progressTimer)
      let time = etime / 1000
      this.playTime = time
      console.log(time, 'time')
      let pdata = JSON.parse(JSON.stringify(this.previewData))
      pdata = pdata[this.checkedPane]
      if (time >= this.$moment().unix()) {
        // 播放预览
        await this.openPreview(this.previewData[this.checkedPane], this.checkedPane)
        this.updateStatus(this.checkedPane, { playType: 'preview' })
      } else {
        // 回放
        let paramData = {
          ...pdata,
          startTime: time,
          newStartTime:time,
          endTime: this.$moment().unix(),
          devPort: pdata.devCport
        }
        // await pluginPlayBackOpen(this.pluginDom(this.checkedPane), paramData, 'center') // 中心录像
        let status = await pluginPlayBackOpen(this.pluginDom(this.checkedPane), paramData,null,paramData.newStartTime) // 没有中心录像，先用前端录像代替
        console.log(status,'开流状态')
        this.updateStatus(this.checkedPane, { playType: 'playback' })
      }
      this.timer()
    },
    getIndexFromChild(index) {
      this.clickEventP(index, 1, index)
    },
    // 通过某一个key排序数组
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]
        var y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    // 模拟开流方法
    kk() {
      // let arr = [
      //   {
      //     name: '711',
      //     channel: 1,
      //     devIp: '192.168.7.111',
      //     devPort: 34567,
      //     endTime: 1591804800,
      //     eventType: ['all'],
      //     page: 1,
      //     rows: 1000,
      //     startTime: 1591718400,
      //     streamType: 'main',
      //     typeContent: '',
      //     typeName: '',
      //     resId: '5dea182cb915d23760ca9a26'
      //     // videoSegmentsIndex: 0 // 指定播放录像段索引
      //   },
      //   {
      //     name: '711',
      //     channel: 1,
      //     devIp: '192.168.7.111',
      //     devPort: 34567,
      //     endTime: 1591804800,
      //     eventType: ['all'],
      //     page: 1,
      //     rows: 1000,
      //     startTime: 1591718400,
      //     streamType: 'main',
      //     typeContent: '',
      //     typeName: '',
      //     resId: '5dea182cb915d23760ca9a26'
      //     // videoSegmentsIndex: 0 // 指定播放录像段索引
      //   },
      //   {
      //     name: '711',
      //     channel: 1,
      //     devIp: '192.168.7.111',
      //     devPort: 34567,
      //     endTime: 1591804800,
      //     eventType: ['all'],
      //     page: 1,
      //     rows: 1000,
      //     startTime: 1591718400,
      //     streamType: 'main',
      //     typeContent: '',
      //     typeName: '',
      //     resId: '5dea182cb915d23760ca9a26'
      //     // videoSegmentsIndex: 0 // 指定播放录像段索引
      //   },
      //   {
      //     name: '711',
      //     channel: 1,
      //     devIp: '192.168.7.111',
      //     devPort: 34567,
      //     endTime: 1591804800,
      //     eventType: ['all'],
      //     page: 1,
      //     rows: 1000,
      //     startTime: 1591718400,
      //     streamType: 'main',
      //     typeContent: '',
      //     typeName: '',
      //     resId: '5dea182cb915d23760ca9a26'
      //     // videoSegmentsIndex: 0 // 指定播放录像段索引
      //   }
      // ]

      // this.openPlayback(arr)
      // // 下载示例
      // // this.getVideoConf()
    },


    openBackVideoArr(arr) { // 回放多个录像
      let playbackNumber = arr.length
      if (arr.length > this.checkedWmode) {
        this.$message.error('无空闲窗口显示更多通道！')
        playbackNumber = this.checkedWmode
      }
      for (let i = 0; i < playbackNumber; i++) {
        this.openBackVideo(arr[i], i)
      }
    },
    async openBackVideo(data, idx) { // 回放录像
    console.log("回放：",data)
      let params = JSON.parse(JSON.stringify(data))
      let pIndex
      if (idx) {
        pIndex = idx
      } else {
        pIndex = this.findFreePane() // 查找空闲的窗格
      }
      console.log(params,'查询录xiang！')
      let res = await queryData(params)
      console.log(res,pIndex,   '先查询有没有录像')
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
      let status = await pluginPlayBackOpen(this.pluginDom(pIndex), params,null,params.newStartTime)//判断有没有newStartTime从而获取制定开始播放事件
      console.log(status, params,'status++++,获取对应的录像')
      if (status !== 0) {
        this.$messageError('开流失败！')
        this.stopBack()
      } else {
        params.result = res
        if (this.configuration.timeline.show) {
          if (pIndex === this.checkedPane) {
            if(params.newStartTime){
              this.$refs.mychild.getCurTime(params.newStartTime)
            }else{
              this.$refs.mychild.getCurTime(params.startTime)
            }
          }
          this.$refs.mychild.queryBackVideo(params, pIndex, this.checkedPane)
        }
        this.updateStatus(pIndex, { isPlay: true, result: params })
        this.timer()
      }
    },
    async openBackInfoVideo(pIndex, data, isNewTime) { // 打开查询到的回放录像
      let vType = data.devType > 2 ? 'center' : 'frontEnd'
      let status = await pluginPlayBackOpen(this.pluginDom(pIndex), data, vType, isNewTime)
      return status
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
    /**
     * @description: 同步回放开流
     * @param {Array} data 开流数据及录像段
     * @param {number} minTime 最小时间
     * @param {minTimeIndex} 最小录像段镜头索引
     * @return:
     * @author: dfk
     */
    async syncPlayback(data, minTime, minTimeIndex, videoList) {
      this.stop()
      let playbackNumber = data.length
      if (data.length > this.checkedWmode) {
        this.$message.error('无空闲窗口显示更多通道！')
        playbackNumber = this.checkedWmode
      }
      let videoShaftObj = []
      for (let index = 0; index < playbackNumber; index++) {
        let params = {
          ...data[index],
          result: videoList[index]
        }
        this.updateStatus(index, { isPlugin: true, playStatus: true, result: params, queryInformation: data[index] })
        videoShaftObj.push({
          index,
          isShow: true,
          videoList: videoList[index],
          channelName: data[index].name || ''
        })
      }
      this.$refs.mychild.getCurTime(minTime)
      this.$refs.mychild.createdVideoShaft(videoShaftObj)
      this.checkedPane = minTimeIndex
      this.$nextTick(async() => {
        let status = await pluginPlayBackOpen(this.pluginDom(minTimeIndex), data[minTimeIndex])
        if (status !== 0) {
          this.$message.error('开流失败！')
          //新增开流失败释放窗口8/23
          this.stopBack()
        } else {
          this.updateStatus(minTimeIndex, { isPlay: true })
        }
        this.timer()
      })
    },
    drawTimeLine(data, index = 0) {
      let tempListobj = {
        eventList: [],
        index: index,
        channelName: data.name
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
        isSyncPlay: false
      })
      await this.$nextTick()
      await pluginPlayBackOpen(this.pluginDom(index), data)
    },
    // 异步回放开流
    async openPlayback(data, isQuery = true, womod, isClear = false) {
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
            isSyncPlay: false
          })
          this.$nextTick(async() => {
            console.log('openPlaybackList===02')
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
            isSyncPlay: false
          })
          this.$nextTick(async() => {
            console.log('openPlaybackList===03')
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
      return this.checkedPane
    },
    // 返回plugin的dom对象
    pluginDom(index) {
      // 返回指定窗格的 object dom
      // console.log(this.$refs.plugin[index],'第1个$refs')
      // console.log(this.$refs.plugin[index].$refs.object,'第2个$refs')
      // console.log(index,"index")

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

        if (this.pluginDom(this.checkedPane)) {
          if (this.selectedObj.playType === 'preview') {
            // 预览
            this.playTime = this.$moment().unix()
          } else {
            // 回放
            let recordPlayerCurTime = JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
            if (recordPlayerCurTime.success) {
              console.log(parseInt(recordPlayerCurTime.msCur / 1000))
              this.playTime = parseInt(recordPlayerCurTime.msCur / 1000) ? this.playTime : parseInt(recordPlayerCurTime.msCur / 1000)
              console.log(this.playTime,'this.playTime')
            }
            // let checkedResult = this.videoStatusArr[this.checkedPane].result
            // if (this.pluginDom(this.checkedPane)) {
            //   let recordPlayerCurTime = checkedResult.dsServerId
            //     ? JSON.parse(this.pluginDom(this.checkedPane).GetSpeechPlayerCurTime())
            //     : JSON.parse(this.pluginDom(this.checkedPane).GetRecordPlayerCurTime())
            //   let recordTime = parseInt(recordPlayerCurTime.msCur / 1000)
            //   // 若播放完了就将播放时间改为开始时间
            //   this.playTime = recordPlayerCurTime.success ? recordTime || this.playTime : checkedResult.startTime || 0
            //   this.$refs.mychild.getCurTime(this.playTime)
            //   if (this.configuration.progressBar.totalTime) {
            //     let result = this.selectedObj.result
            //     let time = result.endTime - result.startTime
            //     if (!isNaN(time)) {
            //       this.progressTotalTime = this.formatTime(time)
            //       let nowTime = this.playTime - result.startTime
            //       nowTime = nowTime < 0 ? 0 : nowTime
            //       this.progressNow = this.formatTime(nowTime)
            //     }
            //   }
            //   this.progress =
            //     ((this.playTime - checkedResult.startTime) / (checkedResult.endTime - checkedResult.startTime)) * 100
            // }
          }
          // 将录像条时间更新成当前时刻
          if (this.selectedObj.isPlay) {
            let tempListobj = this.selectedObj.tempListobj
            tempListobj['eventVideo'][0]['end'] = this.$moment().unix() * 1000
            this.$refs.mychild.liData = [tempListobj]
          } else {
            // 清楚掉时间轴
            this.$refs.mychild.liData = []
          }
          this.$refs.mychild.reRecordOptions() // 重绘时间轴
          this.$refs.mychild.getCurTime(this.playTime) // 让时间轴重新绘制
        }
        // 同步回放监测函数
        if (this.isSync && !this.isFrame) {
          this.syncPlaybackMaintain()
        }
      }, 1000)
    },
    // 停止的处理函数
    stop(index, playStatus = false, isClear = true, syncStopOne = false, isInform = true) {
      console.log(index, 'indexindexindex')
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
          if (this.videoStatusArr[index].playStatus) {
            this.pluginDom(index).CloseRecordPlay()
            this.pluginDom(index).CloseRealStream()
          }
          this.updateStatus(index, this.originalState) // 数据初始化
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
          // this.videoStatusArr[i].playStatus && this.pluginDom(i).CloseRecordPlay()
          if (this.videoStatusArr[i].playStatus) {
            this.pluginDom(i).CloseRecordPlay()
            this.pluginDom(i).CloseRealStream()
          }
          this.updateStatus(i, this.originalState) // 数据初始化
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
      this.videoStatusArr[this.checkedPane].isButton = false
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
      for (let index = 0; index < 25; index++) {
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
      // 重新开流  如果是停止或放完 就重新查录像段吧
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
      // let [status] = await openPlaybackList(this.pluginDom(this.checkedPane), result, isQuery)
      // if (status instanceof Object) {
      //   this.$message.error(status.msg)
      //   return
      // }
      if (status !== 0) {
        console.log('hi')
        this.$message.error('开流失败！')
        // 开流失败释放窗口
        this.stopBack()
        return
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
          let preview = { ...this.previewData }
          para[i] = this.screenIndex[j]
          preview[i] = this.previewData[j]
          para[j] = this.screenIndex[i]
          preview[j] = this.previewData[i]
          this.screenIndex = { ...para }
          break
        }
      }
      this.$emit('changeScreen', this.videoStatusArr[i].result.resId, this.videoStatusArr[j].result.resId)
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
    // 更新li对象状态处理函数
    // updateStatus(index, obj, type) {
    //   // 跟新视频窗格上的功能条  回放不需要窗格下的小进度条
    //   // if (type === 'isButton') {
    //   //   this.videoStatusArr.forEach(element => {
    //   //     element.isButton = false
    //   //   })
    //   // }
    //   // 子组件更新状态数组
    //   for (const key in obj) {
    //     if (key === 'isButton') {
    //       continue
    //     }
    //     this.videoStatusArr[index][key] = JSON.parse(JSON.stringify(obj[key]))
    //   }
    // },
    // clickCheckedWmode(mode) {
    //   // 画面切换将选中项及是否单画面置为初始值
    //   let obj = document.querySelector('.single-video-plugin')
    //   this.checkedWmode = mode.value
    //   if (this.selectedObj.isPlay) {
    //     this.$refs.mychild.changeFn({
    //       screenNum: mode.value,
    //       index: 0,
    //       type: ''
    //     })
    //   }
    //   this.isMaximize = false
    //   this.checkedPane = 0
    // },
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
      // 同步回放维持播放状态 在定时器触发过程中， 若有当前窗格时间段就开始播放
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
    async clickEventP(index, clickType, paneMark) {
      this.$emit('clickEventP', 1, paneMark)
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
          if (this.videoStatusArr[this.checkedPane].isPlay) {
            // if (this.isMaximize) {
            //   this.$refs.mychild.changeFn({
            //     screenNum: 1,
            //     index: this.checkedPane,
            //     type: 'scaleD'
            //   })
            // } else {
            //   this.$refs.mychild.changeFn({
            //     screenNum: this.defaultPane,
            //     index: this.checkedPane,
            //     type: 'scaleX'
            //   })
            // }
          }
          // for (let index in this.previewData) {
          //   if (index === paneMark) {
          //     this.changeScreen(index)
          //     this.stopPreview(0, true)
          //     await this.openPreview(this.previewData[0], index)
          //     this.stopPreview(index, true)
          //     await this.openPreview(this.previewData[index], index)
          //   }
          // }
        }
      }
      this.singleClick = true
      if (this.videoStatusArr[paneMark].isPlay) {
        // this.$refs.mychild.setCurTime(this.playTime, paneMark)
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
      this.selectedObj.result.sTime = row.startTime
      this.selectedObj.result.eTime = row.endTime
    },
    isMain(index) {
      // 判断是不是主码流预览
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
  },
  beforeDestroy() {
    this.checkedPane = 0
    window.clearInterval(this.progressTimer)
  }
}
</script>
<style lang="less" scoped>
.video-plugin {
  // padding: 0px 0px 0px 10px;
  position: relative;
  // z-index: 999999;
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
        //top: 7px;
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
