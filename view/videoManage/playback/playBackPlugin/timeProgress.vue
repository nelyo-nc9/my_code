<template>
  <div class="video-timeline" id="timeLine" :style="{height: simplenessMode ? '70px' :`calc(200px - ${configuration.calcHeight})`}">
    <object ref="object" type="application/x-webplayercontrol" class="obj"></object>
    <!-- <button @click="oT(1)">添加</button>
    <button @click="oT(5)">添加2</button>
    <button @click="JQ">剪切</button>-->
    <!--  <button @click="QH(4)">切换4</button>-->
    <div class="one-stage">
      <div class="timeline-stage-top" v-if="!simplenessMode">
        <div class="stage-top-left" v-if="configuration.syncTypeFlag && isShowSyncBtn">
          <span
            v-for="(item,i) in typeData"
            @click="clickType(item)"
            :class="defaultType == item.label ? 'active switch':'switch'"
            :key="i"
          >{{item.value}}</span>
        </div>
        <div class="stage-top-right" v-if="configuration.periodFlag">
          <div class="period">
            <i
              class="icon iconfont"
              :class="[ step >= steps.length - 1? 'disabled' : '']"
              @click="intervalChange(1)"
            >+</i>
            <span>{{intervalArr[step].label}}</span>
            <i
              class="icon iconfont"
              :class="[step === 0  ? 'disabled' : '']"
              @click="intervalChange(0)"
            >-</i>
          </div>
        </div>
        <div
          class="calendar"
          v-if="configuration.isNeedCenterTime"
          :style="{width:configuration.passageName ? 'calc(100% - 90px)':'100%'}"
        >
          <span class="play-time">{{now}}</span>
          <ul>
            <li v-for="(item,i) in eventType" :key="i">
              <span :style="{background:item.color}"></span>
              {{item.name}}
            </li>
          </ul>
        </div>
      </div>
      <div
        ref="timeline-stage-bottom"
        class="timeline-stage-bottom"
        :style="{height:simplenessMode ? '70px' : '', 'overflow': simplenessMode ? 'hidden' : ''}"
        @mousedown="timelineMouseDown"
        @mousemove="timelineMousemove"
        @mouseup="timelineMouseup"
        @mouseleave="timelineMouseup"
      >
        <span class="leftSpan mt16" v-if="configuration.passageName">通道名称</span>
        <!-- 刻度条以及时间轴 -->
        <div class="timeline-scale" style="width: 100%;">
          <div
            :style="{width:configuration.passageName ? 'calc(100% - 90px)':'100%','margin-left':configuration.passageName ? '90px':0 ,overflow: 'hidden'}"
            class="timeLine"
            ref="timeLine"
          >
            <div
              class="time-list"
              :style="{width: (timeWidth * 25 / 12) + 'px',marginLeft: offsetLeft+timeWidth/60 *1.4 + 'px'}"
            >
              <div
                class="item"
                style="display:inline-block"
                :key="i"
                :style="{width: timeWidth/12 + 'px'}"
                v-for="(item, i) in thumbTimeList"
              >{{item.time}}</div>
            </div>
            <div class="bg-line" :style="{left: offsetLeft + timeWidth/24 + 'px'}">
              <!-- 绘制刻度 -->
              <div class="scaleBox" style="width: 100%;height:10px;overflow: hidden;float: left;">
                <div
                  class="scaleInbox"
                  :style="{width: (timeWidth * 25 / 12) + 'px',marginLeft: offsetLeft - timeWidth/60*1.5 + 'px'}"
                >
                  <div
                    class="scale"
                    :class="{'center': i%5 === 0}"
                    :key="i"
                    :style="{width: timeWidth/60 + 'px'}"
                    v-for="i in 125"
                  ></div>
                </div>
              </div>

              <div
                class="pointer"
                :style="{left:configuration.passageName ? 'calc(50% + 44px)':'50%'}"
              >
                <div class="pointer-line" :style="{height:`calc(100px - ${configuration.calcHeight})`}"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 进度条可滑动区域 -->
        <bs-scroll class="segs" style=" height: calc(100% - 40px)">
          <div
            v-for="(option, i) in recordOptions"
            :key="i"
            @click="clickOption(option.index)"
            v-show="option.isShow"
            :class="full ? activeIndex === option.index ? 'active timeline-video-segments':'full timeline-video-segments':activeIndex === option.index ? 'active timeline-video-segments':'timeline-video-segments'"
            @mouseleave="leaveOption"
            @mouseup="upOption"
          >
            <span
              style="z-index:10"
              :title="option.channelName"
              class="leftSpan"
              v-if="configuration.passageName"
            >{{option.channelName}}</span>
            <div
              class="segments"
              :style="{width:configuration.passageName ? 'calc(100% - 90px)':'100%','margin-left':configuration.passageName ? '88px':0}"
            >
              <span
                v-if="shearDownload &&activeIndex === i "
                class="time"
                :style="{left: `calc(${shearSectionConfiguration.left}% - 8px)`}"
              >{{`剪切段:${shearSectionConfiguration.startTime} - ${shearSectionConfiguration.endTime}`}}</span>
              <div
                v-if="shearDownload  &&activeIndex === i"
                @mousedown="mousedownCentre($event)"
                @mouseup="mouseupCentre($event)"
                class="shear-section"
                :style="{left: `${shearSectionConfiguration.left}%`, width: `${shearSectionConfiguration.width}px`, zIndex: 10}"
              >
                <span
                  @mousedown="mousedownShearSection($event, 'left')"
                  @mouseup="mouseupShearSection($event, 'left')"
                  class="left"
                ></span>
                <span
                  @mousedown="mousedownShearSection($event, 'right')"
                  @mouseup="mouseupShearSection($event,'right')"
                  class="right"
                ></span>
              </div>
              <div
                @mousemove="lineHover($event, option,i)"
                @mouseleave="leaveLine"
                class="segments-son"
                v-for="(item, index) in option.eventOptions"
                segments="segments"
                :index="item.index"
                :key="index+item.eventPosition+10+1.22"
                :style="{width: item.eventWidth + 'px', left: item.eventPosition + 'px', backgroundColor: '#FF0000',}"
              ></div>
              <div
                @mousemove="lineHover($event, option,i)"
                @mouseleave="leaveLine"
                class="segments-son"
                v-for="(item, index) in option.timedOptions"
                segments="segments"
                :index="item.index"
                :key="index+item.timedPosition+20+1.33"
                :style="{width: item.timedWidth + 'px', left: item.timedPosition + 'px', backgroundColor: '#32E285',}"
              ></div>
              <div
                @mousemove="lineHover($event, option,i)"
                @mouseleave="leaveLine"
                class="segments-son"
                v-for="(item, index) in option.manualOptions"
                segments="segments"
                :index="item.index"
                :key="index+item.manualPosition+30+1.44"
                :style="{width: item.manualWidth + 'px', left: item.manualPosition + 'px', backgroundColor: '#FF6C00',}"
              ></div>
              <div
                @mousemove="lineHover($event, option,i)"
                @mouseleave="leaveLine"
                class="segments-son"
                v-for="(item, index) in option.intelOptions"
                segments="segments"
                :index="item.index "
                :key="index+item.intelPosition+40+1.55"
                :style="{width: item.intelWidth + 'px', left: item.intelPosition + 'px', backgroundColor: '#0088FF',}"
              ></div>
            </div>
          </div>
          <!--缩略图框-->
          <div
            :style="{width:configuration.passageName ? 'calc(100% - 90px)':'100%','margin-left':configuration.passageName ? '88px':0,overflow: 'hidden',position: 'absolute',top:'22px'}"
            v-if="defaultScreen == 1 && showP && isCenter"
            class="thumbTime"
          >
            <div
              class="time-list"
              :style="{width: (timeWidth * 25 / 12) + 'px',marginLeft:offsetLeft+'px','border-bottom':'1px solid #333'}"
            >
              <div
                class
                :key="iImg"
                :style="{width: timeWidth/12 + 'px',height:'65px',border:'1px solid #EBEBEB', background: '#EBEBEB',float:'left'}"
                v-for="(itemImg, iImg) in thumbTimeList"
                @click="thumbClick(itemImg)"
                @mousemove="thumbHover($event, itemImg, iImg)"
                @mouseleave="leaveThumb"
              >
                <img :src="itemImg.thumbUrl" alt style="width:100%;height:100%;" />
              </div>
            </div>
          </div>
        </bs-scroll>
        <!-- 鼠标移入时间轴快照 showSnap && showP-->
        <div class="snap" :style="{left: snapLeft + 'px',top:'-36px'}" v-if="showSnap && showP">
          <span style="line-height: 90px;color:#000;" v-if="!spinShow&&!snapUrl">加载失败</span>
          <img style="width:100%;height:100%;" :src="snapUrl" v-if="snapUrl" />
        </div>
        <!-- 鼠标移入切片快照 -->
        <div
          class="thumbSnap"
          :style="{left: thumbSnapLeft +'px'}"
          v-if="showThumbSnap&&thumbSnapUrl"
        >
          <img style="width:100%;height:100%;" :src="thumbSnapUrl" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import timelineCalc from './timelineCalc'
export default {
  name: 'BStimeLine',
  mixins: [timelineCalc],
  props: {
    simplenessMode: {
      type: Boolean,
      default: false
    },
    channelName: {
      type: String,
      default: ''
    },
    configuration: {
      // 配置项
      type: Object,
      default: () => {
        return {
          syncTypeFlag: true, // 同步异步切换按钮
          isNeedCenterTime: true, // 中心时间
          periodFlag: true, // 切换时间周期
          passageName: true, // 是否配置通道名称功能
          step:7,//当前时间周期
          height:'100px'//时间轴高度
        }
      }
    },
    eventType:{
      type:Array,
      default:()=>{
        return [{
            name: '事件录像',
            color: '#FF0000'
          },
          {
            name: '定时录像',
            color: '#32E285'
          },
          {
            name: '手工录像',
            color: '#FF6C00'
          },
          {
            name: '智能录像',
            color: '#0088FF'
          }]
      }
    },
    deScreen: {
      type: Number,
      default: 1
    },
    isSyncT: {
      type: Boolean,
      default: false
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    checkedPaneP: {}
  },
  data() {
    return {
      preDrawTime:'',//用于缓存拖动前时间
      shearSectionConfiguration: {
        width: 200,
        left: 50,
        startTime: '00:00:00',
        endTime: '00:00:00',
        timestampStartTime: 0,
        timestampEndTime: 0
      }, // 剪切段div的显示信息
      shearStatusObj: {
        // 剪辑相关数据对象
        startEditing: false, // 鼠标是否按下
        clientX: 0, // 鼠标按下位置
        direction: '', // 操作的是左还是右
        shearSectionStartEditing: false // 点击录像段
      },
      shearDownload: false, // 是否点击剪切
      activeIndex: 0, // 当前选中项
      liData: [], // 存储已经开流的数据
      defaultType: this.isSyncT ? 0 : 1, // 默认为异步  1：异步，0：同步
      typeData: [
        {
          label: 1,
          value: '异步回放'
        },
        {
          label: 0,
          value: '同步回放'
        }
      ], // 异步同步类型数组
      defaultScreen: this.deScreen, // 默认分屏数
      snapLeft: -1000, // hover切片框偏移量
      spinShow: false, // 是否显示时间轴切片加载动画
      showSnap: false, // 是否显示鼠标移入时间轴快照
      thumbTimeList: [], // 切片缩略图框
      rangeTime: 0, // 间歇时间--两段时间之间
      steps: [5, 60, 150, 300, 900, 1800, 3600, 7200], // 步进数
      intervalArr: [
        { value: 60, label: '1min' },
        { value: 12 * 60, label: '12min' },
        { value: 30 * 60, label: '30min' },
        { value: 3600, label: '1h' },
        { value: 3 * 3600, label: '3h' },
        { value: 6 * 3600, label: '6h' },
        { value: 12 * 3600, label: '12h' },
        { value: 24 * 3600, label: '24h' }
      ], // 时间轴周期数组
      step: this.configuration.step, // 当前的时间周期
      initTime: 0, // 初始化时间
      timeWidth: 0, // 时间轴的长度
      startPosition: 0, // 开始位置
      offsetLeft: 0, // 画布等滑动时偏移量
      moveTimer: null, // 移动计时器
      thumbSnapLeft: -1000, // 切片hover框偏移量
      isMoved: false, // 标识是否移动过
      canMove: false, // 是否可滑动
      showThumbSnap: false, // 是否显示鼠标移入切片快照
      isGetThumbing: false, // 是否正在获取切片
      getThumbTimer: null,
      disTimer: null,
      showP: false, // 是否显示
      recordOptions: [], // 存储信息
      timeTimer: null, // 让时间轴跳动起来
      initData: [], // 记录初始
      initTimeObj: {
        startTime: new Date() / 1000,
        endTime: 0
      }, // 当前高亮的时间对象
      thumpQueue: [], // 切片请求队列
      thumbSnapUrl: '', // 切片hover图片地址
      snapUrl: '', // 时间进度条hover图片地址
      canUse: true, // 是否获取实时时间，防止在拖动画布的时候进度条抖动
      everyW: 0,
      // eventType: [
      //   {
      //     name: '事件录像',
      //     color: '#FF0000'
      //   },
      //   {
      //     name: '定时录像',
      //     color: '#32E285'
      //   },
      //   {
      //     name: '手工录像',
      //     color: '#FF6C00'
      //   },
      //   {
      //     name: '智能录像',
      //     color: '#0088FF'
      //   }
      // ],
      direction: '',
      full: false // 当前是否全屏
    }
  },
  created() {
    // this.initTime = this.time12
    this.initTime = new Date().setHours(12, 0, 0)
    this.rangeTime = this.imgValue - this.time12
    this.upThumb = this.$lodash.debounce(this._upThumb.bind(this), 2000)
  },
  mounted() {
    const box = this.$refs.timeLine
    setTimeout(() => {
      this.timeWidth = box.offsetWidth
      this.upLeft()
      this.initTimeList()
    }, 300)
    window.addEventListener('resize', this.resizefun)
  },
  computed: {
    isShowSyncBtn(){//用于判断是否为NVR与同步
      let obj = this.liData[this.activeIndex]
      return !this.liData.length || (!obj || !obj.isShowSyncBtn)?true:obj.isShowSyncBtn ===1?false:true
    },
    sumTime() {
      return this.bgEnd - this.bgStart
    },
    time12: {
      get() {
        const date = new Date(this.initTimeObj.startTime * 1000)
        return parseInt(date.getTime() / 1000) * 1000
      }
    },
    imgValue: {
      get() {
        const date = new Date(this.initTimeObj.startTime * 1000)
        return parseInt(date.getTime() / 1000) * 1000
      }
    },
    // 每像素的秒数
    scale() {
      return (this.steps[this.step] * 12 * 1000) / this.timeWidth
    },
    // 中心时间
    centerTime: {
      get() {
        const time = parseInt((this.initTime + this.rangeTime) / 1000) * 1000
        this.$emit('input', time)
        return time
      }
    },
    now: {
      get() {
        const date = new Date(this.centerTime)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const secondes = date.getSeconds()
        return `${this.addZero(year)}-${this.addZero(month)}-${this.addZero(day)} ${this.addZero(hours)}:${this.addZero(
          minutes
        )}:${this.addZero(secondes)}`
      }
    },
    // 时间轴的开始时间
    bgStart() {
      return this.centerTime - (this.steps[this.step] / 2) * 12 * 1000
    },
    // 时间轴的结束
    bgEnd() {
      return this.centerTime + (this.steps[this.step] / 2) * 12 * 1000
    }
  },
  watch: {
    imgValue(newValue) {
      this.rangeTime = newValue - this.time12
    },
    offsetLeft() {
      if (this.offsetLeft < (-this.timeWidth * 12.5) / 12) {
        this.offsetLeft += this.timeWidth / 2
        this.thumbTimeList.splice(0, 6)
        const b = this.thumbTimeList[this.thumbTimeList.length - 1].value
        this.thumbFn(this.thumbTimeList[this.thumbTimeList.length - 1]) // 解决拖拽时 中间会漏一张切片，原因未知
        for (let i = 1; i < 7; i++) {
          const a = b + this.steps[this.step] * i
          const obj = { time: this.toTime(a * 1000), value: a }
          this.thumbFn(obj)
          this.thumbTimeList.push(obj)
        }
      }
      if (this.offsetLeft > (-this.timeWidth * 0.5) / 12) {
        this.offsetLeft -= this.timeWidth / 2
        this.thumbTimeList.splice(18, 6)
        const d = this.thumbTimeList[0].value
        for (let j = 1; j < 7; j++) {
          const c = d - this.steps[this.step] * j
          const obj = { time: this.toTime(c * 1000), value: c }
          this.thumbFn(obj)
          this.thumbTimeList.unshift(obj)
        }
      }
    },
    isSyncT() {
      if (this.isSyncT) {
        this.defaultType = 0
      } else {
        this.defaultType = 1
      }
    },
    deScreen() {
      this.defaultScreen = this.deScreen
    },
    checkedPaneP() {
      this.activeIndex = this.checkedPaneP
    }
  },
  methods: {
    // 防止触发浏览器drag事件
    pauseEvent(e) {
      // 仅在360浏览器，不考虑兼容IE
      if (e.stopPropagation) { e.stopPropagation() }
      if (e.preventDefault) { e.preventDefault() }
      return false
    },
    leaveOption() {
      this.shearStatusObj.shearSectionStartEditing = false
      this.shearStatusObj.startEditing = false
    },
    upOption() {
      this.shearStatusObj.shearSectionStartEditing = false
      this.shearStatusObj.startEditing = false
    },
    QH(num) {
      var obj
      if (num === 1) {
        obj = { index: 0, screenNum: num, type: 'scaleD' }
      } else if (num === 4) {
        obj = { index: 1, screenNum: num, type: 'scaleX' }
      }
      this.changeFn(obj)
    },
    // 模拟打开剪切
    JQ() {
      this.shearDownload = true
      let domWidth = document.querySelector('.segments').offsetWidth
      let width = parseInt(domWidth / 8)
      let endTime = parseInt((this.scale / domWidth) * width) + this.initTime / 1000
      this.shearSectionConfiguration = {
        ...this.shearSectionConfiguration,
        width: width,
        startTime: this.$moment(this.centerTime).format('HH:mm:ss'),
        endTime: this.$moment(endTime * 1000).format('HH:mm:ss')
      }
      this.$emit('changeParentIndex', this.activeIndex)
    },
    // 关闭剪切段
    closeCut() {
      this.shearDownload = false
    },
    // 初始化剪切段
    initCut() {
      this.shearSectionConfiguration = {
        width: 200,
        left: 50,
        startTime: '00:00:00',
        endTime: '00:00:00',
        timestampStartTime: 0,
        timestampEndTime: 0
      } // 剪切段div的显示信息
      this.shearStatusObj = {
        // 剪辑相关数据对象
        startEditing: false, // 鼠标是否按下
        clientX: 0, // 鼠标按下位置
        direction: '', // 操作的是左还是右
        shearSectionStartEditing: false // 点击录像段
      }
    },
    // 查询回放视频
    queryBackVideo(result, index, activeIndex) {
      console.log(result, 'result 查询回放')
      this.activeIndex = activeIndex
      console.log(this.isCenter, 'is', index, result, activeIndex)
      if (this.isCenter) {//中心
        var obj = result
        obj.index = index
        let tempListobj = {
          dsIp: obj.dsIp,
          isShowSyncBtn:result.isShowSyncBtn,
          eventList: [],
          index: obj.index,
          channelName: obj.name,
          //新增开始结束时间8/23
          // startTime:obj.startTime,
          // endTime:obj.endTime,
          // channelName: this.channelName
        }
        if (!obj.eventList) { obj.eventList = result.result }
        let cpEt = JSON.parse(JSON.stringify(obj.eventList))
        tempListobj.eventList = cpEt
        // obj.eventList.forEach((v, i) => {
        //   tempListobj.eventList.push({
        //     endTime: v.endTime,
        //     startTime: v.startTime,
        //     strmInfo: v.strmInfo
        //   })
        // })
        this.openLine(tempListobj)
      } else {
        let tempListobj = {
          dsIp: result.result.TsIp,
          eventList: [],
          isShowSyncBtn:result.isShowSyncBtn,
          index: index,
          // channelName: result.fileName
          // channelName: this.channelName
          channelName: result.name
        }
        // tempListobj.eventList = [result]
        tempListobj.eventList = result.result
        console.log(tempListobj,'tempListobj')
        this.openLine(tempListobj)
      }
    },
    // 模拟开流
    oT(num) {
      var obj
      if (num === 1) {
        obj = {
          index: 0,
          channelName: '1',
          eventList: [
            {
              endTime: 1589798978 - 18000,
              startTime: 1589798978 - 30000
            },
            {
              endTime: 1589798978,
              startTime: 1589798978 - 6000
            }
          ]
        }
        this.openLine(obj)
      } else if (num === 2) {
        this.pauseT(this.activeIndex)
      } else if (num === 3) {
        this.stopT()
      } else if (num === 4) {
        this.startT(this.activeIndex)
      } else if (num === 5) {
        obj = {
          index: 2,
          channelName: '2',
          eventList: [
            {
              endTime: 1589798978 - 8000,
              startTime: 1589798978 - 10000
            }
          ]
        }
        this.openLine(obj)
      }
    },
    // 关闭流
    closeT(delIndex) {
      if (delIndex === undefined) {
        this.liData = []
        this.reRecordOptions()
        window.clearInterval(this.timeTimer)
      } else {
        this.liData.forEach((v, i) => {
          if (v.index === delIndex) {
            this.liData.splice(i, 1)
          }
          this.reRecordOptions()
        })
      }
      this.showP = false
    },
    // 暂停播放
    pauseT(index) {
      window.clearInterval(this.timeTimer)
    },
    // 开始播放
    startT(index) {
      this.upDataTimer()
    },
    // 更新时间轴
    upDataTimer() {
      if (this.timeTimer) {
        window.clearInterval(this.timeTimer)
      }
      if (this.defaultScreen === 1) {
        this.everyW = this.timeWidth / this.intervalArr[this.step].value
        this.timeTimer = setInterval(() => {
          this.offsetLeft -= this.everyW
          this.recordOptions.forEach((hV, hI) => {
            hV.eventOptions.forEach((v, i) => {
              v.eventPosition -= this.everyW
            })
            hV.manualOptions.forEach((v, i) => {
              v.manualPosition -= this.everyW
            })
            hV.timedOptions.forEach((v, i) => {
              v.timedPosition -= this.everyW
            })
            hV.intelOptions.forEach((v, i) => {
              v.intelPosition -= this.everyW
            })
          })
          this.cutTimeCalculate()
        }, 1000)
      } else {
        this.timeTimer = setInterval(() => {
          this.reRecordOptions()
          this.initTimeList()
          this.cutTimeCalculate()
        }, 500)
      }
    },
    // 获取此刻播放时间
    getCurTime(time) {
      if (this.canUse) {
        this.initTime = time * 1000
        this.rangeTime = this.imgValue - this.time12
        this.upLeft()
        this.reRecordOptions()
        this.initTimeList(true)// 目前存在重复刷时间轴   无法获取切片问题
      }
    },
    // 改变函数
    changeFn(obj) {
      this.clickOption(obj.index)
      this.activeIndex = obj.index
      this.defaultScreen = obj.screenNum
      if (obj.type === 'scaleD') {
        this.showP = true
        this.liData.forEach((v, i) => {
          if (obj.index === v.index) {
            v.isShow = true
          } else {
            v.isShow = false
          }
        })
      } else if (obj.type === 'scaleX') {
        this.showP = false
        this.liData.forEach((v, i) => {
          v.isShow = true
        })
      } else {
        this.liData.forEach((v, i) => {
          if (obj.screenNum > v.index) {
            v.isShow = true
          } else {
            v.isShow = false
          }
        })
        if (obj.screenNum === 1) {
          this.showP = true
        } else {
          this.showP = false
        }
        this.reRecordOptions()//如果窗口关闭,没有重置reRecordOption在此调用
      }

      // this.upDataTimer()
    },
    // 新建
    openLine(obj) {
        obj.isShow = true
      if (this.recordOptions.length >= this.defaultScreen) {
        this.liData[this.activeIndex] = obj
      } else {
        if (this.defaultScreen === 1) {
          this.showP = true
        } else {
          this.showP = false
        }
        this.liData.push(obj)
      }
      //重置属性暂时解决方案,用于同步转异步情况下增加对应属性
      this.liData.forEach((v,i)=>{
        let eventList =  v.eventList?v.eventList:JSON.parse(JSON.stringify(v.videoList))
        v.eventList = eventList
        var catchedTimelineInfo = this.catchCalcTimeline(v.eventList, this.centerTime, this.steps[this.step])
        v.eventVideo = catchedTimelineInfo.eventVideo
        v.manualVideo = catchedTimelineInfo.manualVideo
        v.timedVideo = catchedTimelineInfo.timedVideo
        v.intelVideo = catchedTimelineInfo.intelVideo
      })
      console.log(this.liData,'这是处理以后的this.listData')
      this.reRecordOptions()
      if (this.isCenter) {
        if (obj.eventList.length !== 0) {
          this.setCurTimeObj(obj)
        }
        if (this.defaultScreen === 1) {
          setTimeout(() => {
            this.resizefun()
          }, 1000)
        }
      } else {
        //设置当前时间段8/23
        this.setCurTimeObj(obj)
        console.log(obj,'obj')
        //8/23注释
        // this.initTimeObj.startTime = obj.eventList[0].startTime
        // this.initTimeObj.endTime = obj.eventList[0].endTime
      }
    },
    // 设置当前的时间段
    setCurTimeObj(obj) {
      this.initTimeObj.startTime = obj.eventList[0].startTime
      this.initTimeObj.endTime = obj.eventList[obj.eventList.length - 1].endTime
    },
    // 窗口改变调用函数
    resizefun() {
      const box = this.$refs.timeLine
      if (box) {
        setTimeout(() => {
          this.timeWidth = box.offsetWidth
          this.upLeft()
          this.initTimeList()
        }, 200)
      }
    },
    // 切换同步异步
    clickType(item) {
      if (this.isCenter) {
        this.defaultType = item.label
        if (item.label === 1) {
          // 异步 ---只改变当前高亮选中的时间轴，并重新开流
          console.log(item, '异步')
          this.$emit('changeSync', false)
        } else if (item.label === 0) {
          // 同步  ---改变所有已经开流的窗格时间，并重新开流
          console.log(item, '同步')
          this.$emit('changeSync', true)
        }
      } else {
        this.$message('前端回放不可切换')
      }
    },
    // 时间改变
    intervalChange(val) {
      if (val === 1) {
        if (this.step === this.steps.length - 1) {
          return
        }
        this.step++
      } else {
        if (this.step === 0) {
          return
        }
        this.step--
      }
      this.initTimeList()
      this.everyW = this.timeWidth / this.intervalArr[this.step].value
      if (this.shearDownload) {
        this.cutTimeCalculate()
      }
      this.reRecordOptions()
    },
    // 单击窗格时间轴
    setCurTime(curTime,index) {
      // 同步回放开发 以下代码报错 暂不知使用场景 先进行注释
      if (this.liData[index] && this.liData[index].eventList && this.liData[index].eventList.length !== 0) {
      this.activeIndex = index
      this.initTimeObj.startTime = this.liData[index].eventList[0].startTime
        //8/23修改应该是最后视频段的结束时间
      this.initTimeObj.endTime = this.liData[index].eventList[this.liData[index].eventList.length - 1].endTime
      // this.liData[index].eventList[this.liData[index].eventList.length - 1].endTime ||
      // this.liData[index].eventList[this.liData[index].eventList.length - 1].eTime
      // const box = this.$refs.timeLine
      // this.timeWidth = box.offsetWidth
      // this.initTime = this.time12
      // this.rangeTime = this.imgValue - this.time12
      }
    },
    // 点击进度条
    clickOption(i) {
      // 播放设置新的时间
      this.activeIndex = i
      this.$emit('changeParentIndex', i)
    },
    // 剪切段鼠标按下
    mousedownCentre(e) {
      this.shearStatusObj.shearSectionStartEditing = true
      this.shearStatusObj.clientX = e.clientX
      this.pauseEvent(e)
    },
    // 剪切段鼠标抬起
    mouseupCentre(e) {
      this.shearStatusObj.shearSectionStartEditing = false
    },
    // 剪切段拖拽鼠标按下剪切条
    mousedownShearSection(e, type) {
      this.shearStatusObj.startEditing = true
      this.shearStatusObj.clientX = e.clientX
      this.shearStatusObj.direction = type
      this.pauseEvent(e)
    },
    // 重新计算剪切段时间
    cutTimeCalculate() {
      if (this.shearDownload) {
        // 剪辑开始结束时间计算并显示
        let domWidth = document.querySelector('.segments').offsetWidth
        var ttt = (this.shearSectionConfiguration.left / 100) * (this.sumTime / 1000)
        let startTime = parseInt(this.bgStart / 1000 + ttt)
        let endTime = parseInt(((this.shearSectionConfiguration.width / domWidth) * this.sumTime) / 1000) + startTime
        this.shearSectionConfiguration = {
          ...this.shearSectionConfiguration,
          startTime: this.$moment(startTime * 1000).format('HH:mm:ss'),
          endTime: this.$moment(endTime * 1000).format('HH:mm:ss'),
          timestampStartTime: startTime,
          timestampEndTime: endTime
        }
      }
    },
    // 剪辑拖拽鼠标抬起剪切条
    mouseupShearSection(e) {
      this.shearStatusObj.startEditing = false
    },
    /**
     * @description: 新加创建录像轴函数
     * @param {number} type  1 全部更新，2 新增一个轴
     * @return:
     * @author: dfk
     */
    createdVideoShaft(videoShaftObj, type = 1) {
      // console.log(videoShaftObj, 'videoShaftObj')
      // {
      //   index 窗口对应索引
      //   isShow  录像条是否显示
      //   videoList 录像段数组
      //   channelName  摄像头名称
      // }
      // const recordTypeMap = {
      //   // 后期录像类型必须按次定义处理
      //   1: '定时录像',
      //   2: '事件录像',
      //   3: '智能录像',
      //   4: '手动录像'
      // }
      if (type === 1) {
        // console.log(this.liData, 'this.liData')
        videoShaftObj = videoShaftObj || this.liData
        this.liData = JSON.parse(JSON.stringify(videoShaftObj))
        let recordList = []
        let rTypeObj = {
          'timeRecord': 1,
          'eventRecord': 2,
          'manualRecord': 3,
          'intelligentRecord': 4
        }
        for (const element of videoShaftObj) {
          let eventOptions = []; let manualOptions = []; let timedOptions = []; let intelOptions = []
          let evlist = element.videoList || element.eventList || element.result
          for (const iterator of evlist) {
            let startTime = iterator.startTime * 1000
            let endTime = iterator.endTime * 1000
            const videoWidth = (endTime - startTime) / this.scale
            const eventPosition = (startTime - this.bgStart) / this.scale
            // const shaftObj = {
            //   eventWidth: (endTime - startTime) / this.scale,
            //   eventPosition: (startTime - this.bgStart) / this.scale
            // }
            let rcType
            if (iterator.eventType) {
              rcType = rTypeObj[iterator.eventType]
            } else {
              rcType = iterator.recordType
            }
            switch (rcType) {
              case 1:
                timedOptions.push({
                  timedWidth: videoWidth,
                  timedPosition: eventPosition
                })
                break
              case 2:
                eventOptions.push({
                  eventWidth: videoWidth,
                  eventPosition: eventPosition
                })
                break
              case 3:
                intelOptions.push({
                  intelWidth: videoWidth,
                  intelPosition: eventPosition
                })
                break
              default:
                manualOptions.push({
                  manualWidth: videoWidth,
                  manualPosition: eventPosition
                })
            }
          }
          recordList.push({
            channelName: element.channelName,
            index: element.index,
            isShow: element.isShow || true,
            eventOptions,
            manualOptions,
            timedOptions,
            intelOptions
          })
        }
        this.recordOptions = JSON.parse(JSON.stringify(recordList))
      }
    },
    // 重新赋值recordsOptions
    reRecordOptions() {
      // console.log(this.isSyncT, 'this.isSyncT')
      if (this.isSyncT) {
        // 同步回放调用新增方法
        this.createdVideoShaft()
        return
      }
      //重置属性暂时解决方案,用于同步转异步情况下增加对应属性
      let isRecord = this.liData.every((v,i)=>{
        return v.eventVideo || v.manualVideo || v.timedVideo || v.intelVideo
      })
      if(!isRecord){
        this.liData.forEach((v,i)=>{
          console.log(v,'zjesjojosfaf')
          let eventList =  v.eventList?v.eventList:JSON.parse(JSON.stringify(v.videoList))
          v.eventList = eventList
          var catchedTimelineInfo = this.catchCalcTimeline(v.eventList, this.centerTime, this.steps[this.step])
          v.eventVideo = catchedTimelineInfo.eventVideo
          v.manualVideo = catchedTimelineInfo.manualVideo
          v.timedVideo = catchedTimelineInfo.timedVideo
          v.intelVideo = catchedTimelineInfo.intelVideo
        })
      }
      this.liData = this.sortByKey(this.liData, 'index')//时间轴信息数据
      //判断现在所处的环境8/24
      // console.log(JSON.parse(JSON.stringify(this.liData)), 'jkjjj')
      var arr = this.liData.map((v, i) => {
        // console.log("--通道名称 v.channelName--")
        // console.log(v.channelName)
        return {
          eventOptions: v.eventVideo.map(({ start, end }) => ({
            eventWidth: (end - start) / this.scale,
            eventPosition: (start - this.bgStart) / this.scale
          })),
          manualOptions: v.manualVideo.map(({ start, end }) => ({
            manualWidth: (end - start) / this.scale,
            manualPosition: (start - this.bgStart) / this.scale
          })),
          timedOptions: v.timedVideo.map(({ start, end }) => ({
            timedWidth: (end - start) / this.scale,
            timedPosition: (start - this.bgStart) / this.scale
          })),
          intelOptions: v.intelVideo.map(({ start, end }) => ({
            intelWidth: (end - start) / this.scale,
            intelPosition: (start - this.bgStart) / this.scale
          })),
          channelName: v.channelName,
          index: v.index,
          isShow: v.isShow
        }
      })
      this.recordOptions = arr
      this.initData = this.liData
    },
    sortByKey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]
        var y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    // 滑动画布
    timelineMousemove(e) {
      if (this.canMove) {
        // window.clearInterval(this.timeTimer)
        const box = this.$refs.timeLine
        this.timeWidth = box.offsetWidth
        const endPosition = e.clientX - (e.clientX % (this.timeWidth / this.steps[this.step] / 12))
        const rangePosition = endPosition - this.startPosition
        this.isMoved = true
        this.startPosition = endPosition
        this.rangeTime -= rangePosition * this.scale
        this.offsetLeft += rangePosition
        this.cutTimeCalculate()
        this.reRecordOptions()
        this.$emit('onmove')
      }
      // 滑动时候更新剪切段时间
      if (this.shearStatusObj.shearSectionStartEditing) {
        // 录像段滑动
        let domWidth = document.querySelector('.segments').offsetWidth
        let leftWidth = domWidth * (this.shearSectionConfiguration.left / 100)
        this.shearSectionConfiguration.left = ((leftWidth + (e.clientX - this.shearStatusObj.clientX)) / domWidth) * 100
      }
      if (this.shearStatusObj.startEditing) {
        if (this.shearStatusObj.direction === 'left') {
          // 往左拖拽 需要改变盒子宽度和定位
          let domWidth = document.querySelector('.segments').offsetWidth
          let leftWidth = domWidth * (this.shearSectionConfiguration.left / 100)
          let width = Number(this.shearSectionConfiguration.width) - (e.clientX - this.shearStatusObj.clientX)
          if (width < 0) {
            return
          }
          this.shearSectionConfiguration.left =
            ((leftWidth + (e.clientX - this.shearStatusObj.clientX)) / domWidth) * 100
          this.shearSectionConfiguration.width = width
          // }
        } else {
          // 往右拖拽 只需要增加盒子宽度
          let width = Number(this.shearSectionConfiguration.width) + (e.clientX - this.shearStatusObj.clientX)
          if (width < 0) {
            return
          }
          this.shearSectionConfiguration.width = width
        }
      }
      this.shearStatusObj.clientX = e.clientX
      if (this.shearStatusObj.startEditing || this.shearStatusObj.shearSectionStartEditing) {
        this.cutTimeCalculate()
      }
      if (Math.ceil(this.shearSectionConfiguration.left) <= 0) {
        this.shearSectionConfiguration.left = 0
      } else if (Math.ceil(this.shearSectionConfiguration.left) >= 89) {
        this.shearSectionConfiguration.left = 88
      } else {
      }
    },
    // 滑动鼠标抬起
    timelineMouseup(e) {
      this.canMove = false;
      if (this.isMoved) {
        //先判断时间是否符合条件,符合条件按滑动时间,不符合条件则还原至当前进度条时间
        //当前滑动时间 this.centerTime
        //定义开始与结束时间
        let playTime
        console.log(this.isSyncT,'同步提品质',this.centerTime)
        //1：异步 0：同步
        if(!this.isSyncT){
          let startTime = this.initTimeObj.startTime
          let endTime = this.initTimeObj.endTime
          console.log(startTime,endTime,this.preDrawTime,'拖动的各个时间')
          //判断时间是否符合条件
          if(this.centerTime/1000 <= endTime && this.centerTime/1000 >= startTime){
            playTime = this.centerTime
          }else{
            playTime = this.preDrawTime
          }
        }else{
          playTime = this.centerTime
        }
        this.$emit('ondrag', playTime)
        this.canUse = true
        setTimeout(() => {
          this.isMoved = false
          this.getThumbQueue(this.thumpQueue.pop()) // 鼠标抬起，请求拖拽过程中未加载的切片
        }, 0)
      }
    },
    // 鼠标按下
    timelineMouseDown(e) {
      this.canUse = false
      // this.leaveLine() // 鼠标按下清除鼠标移入时间轴或切片显示
      // this.canMove = true
      // const box = this.$refs.timeLine
      // this.timeWidth = box.offsetWidth
      // this.startPosition = e.clientX - (e.clientX % (this.timeWidth / this.steps[this.step] / 12))
      // // this.$emit('mouseDown')
      this.preDrawTime = this.centerTime
      this.leaveLine() // 鼠标按下清除鼠标移入时间轴或切片显示
      this.leaveThumb()
      this.startPosition = e.clientX - (e.clientX % (this.timeWidth / this.steps[this.step] / 12))
      this.canMove = true
      this.$emit('mouseDown')
    },
    // 点击切片
    thumbClick(item) {
      // if (this.isCut) {
      //   return;
      // }
      // if (item.thumbUrl) {
      //   this.$emit("thumbClick", item);
      // } else {
      //   this.$emit("thumbClick", false);
      // }
    },
    //* * 鼠标移入切片
    thumbHover(e, item, i) {
      if (this.shearDownload) {
        return
      }
      if (!item.thumbUrl) {
        return
      }
      this.showThumbSnap = true
      this.thumbSnapLeft = (this.timeWidth / 12) * (i + 1) + this.offsetLeft - 100
      this.thumbSnapUrl = item.thumbUrl
      clearTimeout(this.disTimer)
      this.disTimer = setTimeout(() => {
        this.leaveThumb()
      }, 3000)
    },
    // 鼠标移出切片
    leaveThumb() {
      this.showThumbSnap = false
      this.thumbSnapLeft = -1000
    },
    // 鼠标移入line
    lineHover(e, option, index) {
      if (this.canMove) {
        return
      }
      if (this.shearDownload) {
        return
      }
      let domWidth = document.getElementsByClassName('timeLine')[0].offsetWidth - 90
      let left = 0
      var sl = document.getElementById('timeLine').offsetWidth // 时间轴的宽度
      var s5 = document.body.clientWidth // 屏幕的宽度
      left = Math.abs(s5 - sl - e.clientX) + 200 // 鼠标的偏移量 -80减去hover框自身宽度的一半
      let num = 0
      if (this.moveTimer) {
        return
      }
      this.moveTimer = setTimeout(() => {
        this.spinShow = true
        this.snapLeft = left
        // 鼠标放进度条的此刻时间
        var hoverTime = parseInt((this.initTime + this.rangeTime + (left - this.timeWidth / 2) * this.scale) / 1000)
        if (this.isGetTumb(hoverTime * 1000, index)) {
          this.showSnap = true
          const callback = (state, url) => {
            this.snapUrl = url
            this.spinShow = false
            if (!url && num < 2) {
              this.getThumb(hoverTime - 10, hoverTime + 10, callback, index, true)
              num++
            }
          }
          this.getThumb(hoverTime - 10, hoverTime + 10, callback, index, true)
        }
        this.moveTimer = null
        clearTimeout(this.disTimer)
        this.disTimer = setTimeout(() => {
          this.showSnap = false
        }, 5000)
      }, 300)
    },
    // 鼠标移出line
    leaveLine() {
      // console.log('lllllllllllllllllllllll')
      this.showSnap = false
      this.spinShow = false
      this.snapLeft = -1000
      this.snapUrl = ''

      clearTimeout(this.moveTimer)
      this.moveTimer = null
    },
    // 初始化时间轴
    initTimeList(flag) {
      this.thumbTimeList = []
      let nowtime = this.centerTime / 1000 - ((this.centerTime / 1000) % this.steps[this.step])
      // let time = (new Date(nowtime* 1000).setHours(12,0,0) / 1000).valueOf()
      // console.log('--time--')
      // console.log(time)
      for (let i = 12; i > 0; i--) {
        const a = nowtime - this.steps[this.step] * i
        this.thumbTimeList.push({ time: this.toTime(a * 1000), value: a })
      }
      for (let i = 0; i < 12; i++) {
        const a = nowtime + this.steps[this.step] * i
        this.thumbTimeList.push({ time: this.toTime(a * 1000), value: a })
      }

      this.upLeft()
      //  this.offsetLeft = -(
      //   (this.timeWidth * 6.5) / 12 +
      //   ((this.time / 1000) % this.steps[this.step]) * (this.timeWidth / this.steps[this.step] / 12)
      // )
      if (flag) {
        this.upDataTimer()
      }
      if (this.isCenter) {
        this.upThumb()
      }
    },
    // 偏移
    upLeft() {
      this.offsetLeft = -(
        (this.timeWidth * 6.5) / 12 +
        ((this.centerTime / 1000) % this.steps[this.step]) * (this.timeWidth / this.steps[this.step] / 12)
      )
    },
    // 转换时间格式
    toTime(time) {
      const date = new Date(time)
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const secondes = date.getSeconds()
      return `${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(secondes)}`
    },
    // 添加0
    addZero(n) {
      return n.toString().length < 2 ? '0' + n : '' + n
    },
    // 切片获取过滤函数
    thumbFn(item) {
      console.log(item, '重新请求')
      if (this.isCenter) {
        if (this.isGetTumb(item.value * 1000)) {
          let num = 0
          const callback = (state, url) => {
            item.thumbUrl = url
            if (!url && num < 2) {
              this.getThumb(item.value, item.value + this.steps[this.step], callback)
              num++
            }
          }
          this.getThumb(item.value, item.value + this.steps[this.step], callback)
        }
      }
    },
    /**
     * 切片请求
     * startTime 开始时间
     * endTime 结束时间
     * callback 插件请求回调
     * index 时间轴索引，默认为0
     * 每次请求先放入队列中
     */
    getThumb(startTime, endTime, callback, index, bool) {
      const item = this.liData[this.activeIndex || 0]
      const res = item || {}
      const obj = {}
      obj.eventList = {}
      obj.eventList.timeInfo = {}
      obj.eventList.strmInfo = {}
      obj.eventList.timeInfo.startTime = startTime + ''
      obj.eventList.timeInfo.endTime = endTime + ''
      obj.eventList.strmInfo = res.eventList.length !== 0 ? res.eventList[0].strmInfo : {}
      const param = {
        ip: item.dsIp,
        port: 9000 + '',
        beginTime: startTime + '',
        endTime: endTime + '',
        cmdStr: JSON.stringify({
          params: {
            jsonrpc: '2.0',
            id: '1',
            method: 'brest',
            call: 'AV.Record.playopen',
            args: obj
          }
        })
      }
      if (bool) {
        this.thumpQueue.unshift({ param, callback })
      } else {
        this.thumpQueue.push({ param, callback })
      }
      if (!this.isGetThumbing) {
        this.isCenter && !this.canMove && this.getThumbQueue(this.thumpQueue.shift())
      }
    },
    _upThumb() {
      if (this.recordOptions.length > 0) {
        this.thumbTimeList.forEach((item, i) => {
          this.thumbFn(item)
        })
      }
    },
    /**
     * 切片请求队列
     * 多张切片依次请求，在上一张切片请求回调中请求下一张，或500毫秒没有收到上一张切片返回请求下一张
     */
    getThumbQueue(param) {
      if (this.canMove) {
        return
      } // 拖拽过程中不在请求切片
      if (!param) {
        this.isGetThumbing = false
        return
      }
      this.isGetThumbing = true
      clearTimeout(this.getThumbTimer)
      // 切片请求插件由页面播放插件改为全局插件
      console.log(param.param, 'paramparamparamparam')
      document.getElementById('global-plugin').GetRecordSlice(JSON.stringify(param.param), (state, url) => {
        console.log(state, 'hahhhahahhah')
        param.callback(state, url)
        this.isCenter && !this.canMove && this.getThumbQueue(this.thumpQueue.shift())
        clearTimeout(this.getThumbTimer)
      })
      this.getThumbTimer = setTimeout(() => {
        this.isCenter && !this.canMove && this.getThumbQueue(this.thumpQueue.shift())
      }, 500)
    },
    /**
     * 清除切片请求队列
     */
    clearThumbQueue() {
      clearTimeout(this.getThumbTimer)
      this.thumpQueue = []
    },
    /**
     * 是否需要请求切片
     * time 请求切片的时间点
     * index 时间轴索引，默认值0
     */
    isGetTumb(time, index) {
      const data = this.liData[index || 0]
      if (!data) {
        return
      }
      const step = (this.steps[this.step] * 1000) / 2
      function compare(d) {
        for (let i = 0; i < d.length; i++) {
          if (time / 1000 > d[i].startTime || (d[i].startTime - step && time / 1000 < d[i].endTime) || d[i].endTime + step) {
            return true
          }
        }
        return false
      }
      return compare(data.eventList)
    },
    setDisplay() {
      this.full = !this.full
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timeTimer)
    this.liData = []
  }
}
</script>
<style lang='less' scoped>
.video-timeline {
  background-color: #fff;
  user-select: none;
  width: 100%;
  .obj {
    position: absolute;
    top: -10000px;
    left: -10000px;
  }
  .one-stage {
    padding: 19px;
    width: 100%;
    height: 100%;
    .timeline-stage-top {
      padding-left: 15px;
      margin-bottom: 5px;
      width: 100%;
      height: 32px;
      background: #fff;
      line-height: 32px;
      position: relative;
      .calendar {
        height: 100%;
        margin-left: 90px;
        text-align: center;
        .play-time {
          display: inline-block;
          font-size: 14px;
        }
        ul {
          position: absolute;
          right: 90px;
          top: 0;
          li {
            display: inline-block;
            margin-right: 20px;
            font-size: 12px;
            height: 32px;
            line-height: 32px;
            span {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin-right: 5px;
            }
          }
        }
      }
      .stage-top-left {
        float: left;
        box-sizing: border-box;
        .switch {
          color: #333333;
          border: 1px solid #e1e1e1;
          text-align: center;
          display: inline-block;
          width: 88px;
          height: 35px;
          line-height: 35px;
          &.active {
            background: #2d72d3;
            border-color: #2d72d3;
            color: white;
          }
        }
      }
      .stage-top-right {
        float: right;
        width: 90px;
        height: 31px;
        border: 1px solid rgba(233, 233, 233, 1);
        border-radius: 15px;
        line-height: 31px;
        .period {
          text-align: center;
          i {
            cursor: pointer;
            color: #0067b9;
          }
          span {
            width: 44px;
            display: inline-block;
            text-align: center;
            margin: 0 4px;
            color: #666666;
          }
        }
      }
    }
    .timeline-stage-bottom {
      width: 100%;
      height: ~'calc(100% - 30px)';
      background-color: #fff;
      box-sizing: border-box;
      position: relative;
      .snap {
        position: absolute;
        width: 160px;
        height: 90px;
        /* top: -20px; */
        z-index: 9999999;
        background: rgba(255, 255, 255, 0.9);
        text-align: center;
      }
      .thumbSnap {
        position: absolute;
        width: 256px;
        height: 144px;
        top: -45px;
        z-index: 9999999;
      }
      cursor: pointer;
      .segs {
        height: ~'calc(100% - 40px)';
      }
      .timeline-scale {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 39px;
        .scaleBox {
          background-color: #dedede;
        }
        .time-scale {
          position: absolute;
        }
        .pointer {
          position: absolute;
          width: 9px;
          height: 11px;
          top: 26px;
          transform: translate(-50%, -50%);
          background-color: #f78930;
          border-bottom-left-radius: 30px;
          border-bottom-right-radius: 30px;
          z-index: 99;
          .pointer-line {
            width: 1px;
            height: 100px;
            background-color: #f78930;
            margin: 9px auto 0;
          }
        }
      }
      .timeline-video-segments {
        border: 1px solid #fff;
        &.active {
          border-color: #00a5e3;
        }
        &.full{
          visibility: hidden;
        }
        width: 100%;
        height: 25px;
        position: relative;
        overflow: hidden;
        .segments {
          width: ~'calc(100% - 90px)';
          height: 9px;
          background-color: #ebebeb;
          margin: auto 0;
          position: absolute;
          top: 50%;
          transform: translate(0, -50%);
          .segments-son {
            position: absolute;
            height: 100%;
          }
          .shear-section {
            position: absolute;
            height: 100%;
            background-color: rgba(255, 255, 0, 0.911);
            .left,
            .right {
              width: 8px;
              height: 100%;
              position: absolute;
            }
            .left:hover,
            .right:hover {
              cursor: e-resize;
            }
            .left {
              left: -4px;
            }
            .right {
              right: -4px;
            }
          }
        }
        .time {
          width: 180px;
          position: absolute;
          bottom: 6px;
        }
      }
    }
  }
}
.ml {
  margin-left: 90px !important;
}
.leftSpan {
  position: absolute;
  left: 0;
  height: 25px;
  line-height: 25px;
  text-align: center;
  width: 90px;
  overflow: hidden;
  background-color: #fff;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.time-list {
  font-size: 12px;
  margin-top: 5px;
  position: relative;
}
.bg-line {
  width: 100%;
  height: 10px;
  background-repeat: repeat-x;
  background-size: 100% 100%;
  background: rgba(255, 255, 255, 0.24);
  .scale {
    height: 5px;
    float: left;
    border-left: 1px solid #000;
    margin-top: 5px;
  }
  .scale.center {
    height: 8px;
    margin-top: 2px;
  }
}
.iconfont.disabled {
  color: #ccc !important;
}
</style>
