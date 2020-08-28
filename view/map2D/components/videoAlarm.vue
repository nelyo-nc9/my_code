<template>
  <div class="playBackPlugin" v-drag>
    <div class="video_header">
      <span>报警视频</span>
      <span></span>
      <i class="iconfont icon-close1" @click="closeAlarmVideo"></i>
    </div>
    <div class="video_left">
      <preview-plugin
        v-stopdrag
        ref="preview"
        v-if="!isBackVideo"
        :iconShow="iconShowParams"
        :isDbClickEmit="true"
        @openBack="openBack"
        @alarmData="alarmDataFuc"
        :isButton="true"
        :defaultPane="6"
      >
      </preview-plugin>
      <playBackPlugin
        v-stopdrag
        v-if="isBackVideo"
        ref="pluginP"
        :iconShow="iconShowParams1"
        :previewData="previewData"
        :defaultPane="6"
        :isCenterP="isDbClickEmit"
        :channelName="currentSelectObj.name"
      >
        <template v-slot:nextPage>
          <el-button type="primary">下一页</el-button>
        </template>
      </playBackPlugin>
    </div>
    <div class="video_right">
      <RealtionAlarm />
      <el-button type="primary" @click="clickDialogBtn(1)" v-if="fireDeviceDeal" style="position:absolute;bottom:100px;"
        >处理</el-button
      >
      <v-alarm-dialog v-if="panelShow" @toSon="clickPass"></v-alarm-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
// import Dragx from 'components/dragx/Dragx.vue'
import previewPlugin from '../../videoManage/preview/school/previewPlugin'
import playBackPlugin from '../../../components/alarmPlay/playBackPlugin/playBackPlugin'
import videoPlayBackTime from './videoPlayBackTime'
import RealtionAlarm from './RealtionAlarm'
import videoRelevant from './videoRelevant'
import vAlarmDialog from './alarmDialog'
export default {
  name: 'video-alarm',
  components: { playBackPlugin, previewPlugin, RealtionAlarm, videoPlayBackTime, vAlarmDialog },
  mixins: [videoRelevant],
  computed: {
    ...mapGetters('map2d/mapIndex', ['videoPlayInfo', 'showAlarmVideoInfo'])
  },
  data() {
    return {
      fireDeviceDeal: true,
      panelShow: false,
      msg: 'Welcome to Your Vue.js App',
      tags: [
        {
          id: 1
        },
        {
          id: 2
        }
      ],
      importantPart: null,
      tableDataMes: [],
      alarmPushDialogVisible: false, // 报警推送升级
      isDbClickEmit: false,
      currentSelectObj: {
        name: 'sfsfs'
      },
      previewData: [],
      outMapNum: 1,
      isMount: false,
      // 视频回放组件配置
      isBackVideo: false,
      iconShowParams: [
        {
          type: 'left',
          index: 0,
          name: 'ScreenShot'
        },
        {
          type: 'left',
          index: 1,
          name: 'Videotape'
        },
        {
          type: 'left',
          index: 2,
          name: 'Speech'
        },
        {
          type: 'left',
          name: 'NiaoKan',
          index: 3
        },
        {
          type: 'left',
          index: 4,
          name: 'Lunxun'
        },
        {
          type: 'left',
          name: 'Attention',
          index: 5
        },
        {
          type: 'left',
          name: 'checkRecode',
          index: 6
        },
        {
          type: 'left',
          index: 7,
          name: 'Collect'
        },
        {
          type: 'left',
          name: 'Volume',
          index: 8
        },
        {
          type: 'right',
          // name: 'FullScreen',
          slotName: 'backBtn',
          index: 0
        },
        {
          type: 'right',
          name: 'ViewPattern',
          index: 2
        },
        {
          type: 'right',
          name: 'Stream',
          index: 3
        },
        {
          type: 'right',
          name: 'StopAll',
          index: 4
        },
        {
          type: 'right',
          name: 'Stop',
          index: 5
        }
      ],
      configuration: {
        progressBar: {
          show: false,
          type: 'totaltime'
        },
        timeline: {
          show: true
        }
      },
      iconShowParams1: [
        {
          type: 'left',
          index: 0,
          name: 'Videotape' // 录像
        },
        // {
        //   type: 'left',
        //   name: 'speechIcon', // 对讲
        //   index: 1
        // },
        {
          type: 'left',
          name: 'ScreenShot', // 截图
          index: 2
        },
        {
          type: 'left',
          name: 'TVWall', // 快速上墙
          index: 3
        },
        {
          type: 'left',
          name: 'Volume', // 声音
          index: 4
        },
        {
          type: 'left',
          name: 'NiaoKan', // 鸟瞰
          index: 5
        },
        {
          type: 'left',
          name: 'Stream', // 码流切换
          index: 6
        },
        {
          type: 'left',
          name: 'ScreenMode', // 画面模式
          index: 7
        },
        // {
        //   type: 'left',
        //   slotName: 'nextPage', // 下一页
        //   width: '50',
        //   index: 8
        // },
        {
          type: 'left',
          name: 'StopAll', // 关闭预览
          index: 9
        },
        {
          type: 'left',
          name: 'MultiScreen', // 画面切换
          index: 10
        },
        {
          type: 'left',
          name: 'FullScreen', // 全屏
          index: 11
        },
        {
          type: 'right',
          // name: 'FullScreen',
          slotName: 'backBtn',
          index: 0
        }
      ],
      defaultPane: 1, // 默认显示9窗格
      isCenter: false
    }
  },
  mounted() {
    console.log('showAlarmVideoInfo', this.showAlarmVideoInfo)

    this.getBackPlayInfo()

    this.findLocationDetail({ locationId: this.showAlarmVideoInfo.nowShowAlarmDetailInfo.locationId }).then(res => {
      if (res) {
        console.log('获取负责人信息', res)
        if (res.data && res.data.orgData) {
          res.data.orgName = res.data.orgData.name
          this.tableDataMes = [
            { type: '负责人一', principal: res.data.principal1, phone: res.data.principalPhone1, order: 1 },
            { type: '负责人二', principal: res.data.principal2, phone: res.data.principalPhone2, order: 2 },
            { type: '负责人三', principal: res.data.principal3, phone: res.data.principalPhone3, order: 3 },
            { type: '负责人四', principal: res.data.principal4, phone: res.data.principalPhone4, order: 4 },
            { type: '负责人五', principal: res.data.principal5, phone: res.data.principalPhone5, order: 5 }
          ]
        }
        this.importantPart = res.data
      }
    })
    //

    // 消防的会展示按钮 -shenzhe 20200818
    if (sessionStorage.getItem('sessionStorage_fromPage') == 'fireDevice') {
      this.fireDeviceDeal = true
    } else {
      this.fireDeviceDeal = false
    }
  },
  directives: {
    drag: function(el) {
      let dragBox = el // 获取当前元素
      dragBox.onmousedown = e => {
        // 算出鼠标相对元素的位置
        let disX = e.clientX - dragBox.offsetLeft
        let disY = e.clientY - dragBox.offsetTop
        document.onmousemove = e => {
          // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX
          let top = e.clientY - disY
          // 移动当前元素
          dragBox.style.left = left + 'px'
          dragBox.style.top = top + 'px'
        }
        document.onmouseup = e => {
          // 鼠标弹起来的时候不再移动
          document.onmousemove = null
          // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
          document.onmouseup = null
        }
      }
    },
    /* 阻止拖拽 */
    stopdrag: {
      inserted: function(el, binding, vnode) {
        let element = el
        element.onmousedown = function(e) {
          e.stopPropagation()
        }
      }
    }
  },
  methods: {
    ...mapMutations('map2d/mapIndex', ['SET_VIDEO_PLAY_INFO']),
    ...mapActions('map2d/mapPoint', ['getCommonResourceById']),
    ...mapActions('map2d/mapIndex', ['updateShowAlarmVideoInfo']),
    ...mapActions('alarmEmergencyResponse', {
      findLocationDetail: 'findLocationDetail' // 获取重点部位
    }),
    closeAlarmVideo() {
      this.updateShowAlarmVideoInfo({ isShowAlarmVideo: false })
    },
    getBackPlayInfo() {
      this.isBackVideo = true
      let palyArr = []
      let alarmTime = this.showAlarmVideoInfo.nowShowAlarmDetailInfo.startTime
      alarmTime = typeof alarmTime === 'number' ? alarmTime : new Date(alarmTime).getTime() / 1000
      this.showAlarmVideoInfo.showAlarmVideoRelationArr.forEach(item => {
        if (!(item.serise && item.deviceIp && item.devicePort && item.subSystem && item.linkageChnTyp === 1)) {
          return
        }
        palyArr.push({
          channel: Number(item.serise),
          devIp: item.deviceIp,
          devCport: item.devicePort,
          streamType: item.subSystem,
          alarmTime,
          name: this.showAlarmVideoInfo.nowShowAlarmDetailInfo.alarmName,
          detail: {}
        })
      })
      console.log(palyArr)
      this.previewData = palyArr
      this.$nextTick(() => {
        console.log(this)
        this.$refs.pluginP.openPreviewData()
      })
    },
    // 报警升级确认框
    alarmPushHandleFuc() {
      let ids = _.map(this.selectionTableData, 'id')
      let param = {
        alarmId: JSON.stringify(ids), // 报警信息的唯一标识
        userName: 'requestwebsocket' // 上级的名字  ，先写死，后期权限做完在加此功能
      }
      this.superiorPush(param).then(value => {
        if (value) {
          this.alarmPushDialogVisible = false
        }
      })
    },
    changePageType(num, previewIsShow) {
      let nowVideoPlayInfo = JSON.parse(JSON.stringify(this.videoPlayInfo))
      nowVideoPlayInfo['video' + num].isShowPreview = previewIsShow
      nowVideoPlayInfo['video' + num].isShowPlayBack = !previewIsShow
      this.SET_VIDEO_PLAY_INFO(nowVideoPlayInfo) // 设置当前视频播放信息
    },
    getPreviewInfo(obj) {
      if (!obj || !obj.serise || !obj.hostIp || !obj.hostCport || !obj.hostDport || !obj.subSystem) {
        return null
      } else {
        return {
          channel: obj.serise,
          ip: obj.hostIp,
          cPort: obj.hostCport,
          dPort: obj.hostDport,
          streamType: obj.subSystem
        }
      }
    },

    getdata(evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.tags)
    },
    clickDialogBtn(boolNum) {
      this.panelShow = boolNum
    },
    clickPass(boolNum) {
      this.clickDialogBtn(boolNum)
    }
  }
}
</script>

<style lang="less" scoped>
.ccbshebeiguijihuifang {
  font-size: 16px;
  margin-left: 7px;
}
.playBackPlugin {
  z-index: 990;
  position: absolute;
  background-color: white;
  left: 420px;
  top: 20px;
  width: 987px;
  height: 700px;
  .video_header {
    padding-left: 20px;
    color: #fff;
    line-height: 40px;
    height: 40px;
    background: #999;
    padding-bottom: 5px;
    .icon-close1 {
      width: 30px;
      float: right;
      margin-right: 10px;
      display: inline-block;
      cursor: pointer;
    }
    .icon-play {
      cursor: pointer;
      // background: url('./../../../../static/map2d/videoPlay/changePlay.png');
    }
  }
  .video_left {
    position: absolute;
    width: 758px;
    height: 660px;
    left: 0px;
    top: 40px;
  }
  .video_right {
    position: absolute;
    width: 230px;
    background: #fff;
    height: 660px;
    right: 0px;
    top: 40px;
    // overflow: scroll;
  }
}
</style>
