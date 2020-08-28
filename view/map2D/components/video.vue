<template>
  <div>
    <div class="playBackPlugin paly-back-palugin-item" v-drag v-if="videoPlayInfo.video1.isShowPlayBack">
      <div class="video_header">
        <span>视频回放--</span>
        <span>{{ videoPlayInfo.video1.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video1.isShowPlayBack = false"></i>
      </div>
      <videoPalyBack v-stopdrag ref="pluginP1" :showCheck="true" :videoInfo="singleStatus" :palyNum="1"></videoPalyBack>
    </div>

    <div class="playBackPlugin" v-drag v-if="videoPlayInfo.video1.isShowPreview">
      <div class="video_header">
        <span>视频预览--</span>
        <span>{{ videoPlayInfo.video1.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video1.isShowPreview = false"></i>
      </div>
      <preview-plugin
        :pluginIconShow="pluginIconShow"
        :defaultPane="defaultPane"
        :iconShow="previewIconShowParams"
        ref="preview1"
      >
        <i
          slot="a"
          class="icon iconfont-ccb ccbhuifang
"
          title="开启回放"
          @click="changePageType(1, false)"
        ></i>
      </preview-plugin>
    </div>

    <div class="playBackPlugin paly-back-palugin-item" v-drag v-if="videoPlayInfo.video2.isShowPlayBack">
      <div class="video_header">
        <span>视频回放--</span>
        <span>{{ videoPlayInfo.video2.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video2.isShowPlayBack = false"></i>
      </div>
      <videoPalyBack v-stopdrag ref="pluginP2" :showCheck="true" :videoInfo="singleStatus" :palyNum="2"></videoPalyBack>
    </div>

    <div class="playBackPlugin" v-drag v-if="videoPlayInfo.video2.isShowPreview">
      <div class="video_header">
        <span>视频预览--</span>
        <span>{{ videoPlayInfo.video2.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video2.isShowPreview = false"></i>
      </div>
      <preview-plugin
        :pluginIconShow="pluginIconShow"
        :defaultPane="defaultPane"
        :iconShow="previewIconShowParams"
        ref="preview2"
      >
        <i slot="a" class="icon iconfont-ccb ccbhuifang" title="开启回放" @click="changePageType(2, false)"></i>
      </preview-plugin>
    </div>

    <div class="playBackPlugin paly-back-palugin-item" v-drag v-if="videoPlayInfo.video3.isShowPlayBack">
      <div class="video_header">
        <span>视频回放--</span>
        <span>{{ videoPlayInfo.video3.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video3.isShowPlayBack = false"></i>
      </div>
      <videoPalyBack v-stopdrag ref="pluginP3" :showCheck="true" :videoInfo="singleStatus" :palyNum="3"></videoPalyBack>
    </div>

    <div class="playBackPlugin" v-drag v-if="videoPlayInfo.video3.isShowPreview">
      <div class="video_header">
        <span>视频预览--</span>
        <span>{{ videoPlayInfo.video3.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video3.isShowPreview = false"></i>
      </div>
      <preview-plugin
        :pluginIconShow="pluginIconShow"
        :defaultPane="defaultPane"
        :iconShow="previewIconShowParams"
        ref="preview3"
      >
        <i
          slot="a"
          class="icon iconfont-ccb ccbshebeiguijihuifang"
          title="开启回放"
          @click="changePageType(3, false)"
        ></i>
      </preview-plugin>
    </div>

    <div class="playBackPlugin paly-back-palugin-item" v-drag v-if="videoPlayInfo.video4.isShowPlayBack">
      <div class="video_header">
        <span>视频回放--</span>
        <span>{{ videoPlayInfo.video4.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video4.isShowPlayBack = false"></i>
      </div>
      <videoPalyBack v-stopdrag ref="pluginP4" :showCheck="true" :videoInfo="singleStatus" :palyNum="4"></videoPalyBack>
    </div>

    <div class="playBackPlugin" v-drag v-if="videoPlayInfo.video4.isShowPreview">
      <div class="video_header">
        <span>视频预览--</span>
        <span>{{ videoPlayInfo.video4.playInfo.name }}</span>
        <i class="iconfont icon-close1" @click="videoPlayInfo.video4.isShowPreview = false"></i>
      </div>
      <preview-plugin
        :pluginIconShow="pluginIconShow"
        v-show="videoPlayInfo.video4.isShowPreview"
        :defaultPane="defaultPane"
        :iconShow="previewIconShowParams"
        ref="preview4"
      >
        <i slot="a" class="icon iconfont-ccb ccbhuifang" title="开启回放" @click="changePageType(4, false)"></i>
      </preview-plugin>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import playBackPlugin from '../../videoManage/playback/playBackPlugin/playBackPlugin'
import previewPlugin from '../../videoManage/preview/school/previewPlugin'
import videoPalyBack from './videoPalyBack'
export default {
  name: 'video-map',
  components: { playBackPlugin, previewPlugin, videoPalyBack },
  computed: {
    ...mapGetters('map2d/mapIndex', ['videoPlayInfo'])
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      tags: [
        {
          id: 1
        },
        {
          id: 2
        }
      ],
      singleStatus: {
        playStatus: false, // 画面是否在使用
        isButton: false, // 是否显示插件悬浮条
        isPlay: false, // 是否播放
        img: '', // 图片遮盖的base64
        source: {
          devIp: '',
          devCport: '',
          channel: '',
          streamType: '',
          deviceType: '',
          sipCode: '',
          name: '',
          devCport: ''
        }
      },
      showCheckVideo: false,
      outMapNum: 1,
      isMount: false,
      // 视频回放组件配置
      configuration: {
        progressBar: {
          show: false, // 是否配置进度条
          type: '' // curtime代表显示当前播放时间 //totaltime：代表显示当时时间/总时间,""：代表只显示进度条不显示任何配置
        },
        timeline: {
          show: false, // 是否配置时间轴
          syncTypeFlag: false, // 是否配置同步异步功能
          periodFlag: false, // 是否配置周期切换功能
          SliceFlag: false, // 是否配置切片功能
          passageName: false // 是否配置通道名称功能
        },
        buttos: []
      },
      palyBackIconShowParams: [
        { type: 'left', index: 0, name: 'Play' }, // 播放
        { type: 'left', index: 1, name: 'Stop' }, // 停止播放
        { type: 'left', index: 2, slotName: 'a', width: '100px' }, // 开启预览
        { type: 'left', index: 3, name: 'Volume' }, // 音量控制
        { type: 'right', index: 0, name: 'FullScreen' } // 全屏控制
      ],
      configuration: {
        progressBar: {
          show: true,
          type: 'totaltime'
          // type: 'curtime'
          // type: ''
        },
        timeline: {
          show: false
        }
      },
      pluginIconShow: {
        showBottomIcon: false, // 图标按钮条
        hidemenuIcon: true // 隐藏
      },
      previewIconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Videotape' }, // 录像
        // { type: 'left', index: 3, name: 'YunTai' }, // 云台
        { type: 'left', index: 3, name: 'Attention' }, // 云台
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Speech' }, // 对讲
        // { type: 'left', index: 6, name: 'Mute' }, // 伴音
        { type: 'left', index: 6, slotName: 'a', width: '100px' }, // 开启回放
        { type: 'left', index: 7, name: 'Volume' }, // 声音

        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' } // 码流详情
        // { type: 'right', index: 3, name: 'Details' } // 检查记录
      ],
      //   previewIconShowParams1: [
      //     { type: 'left', index: 0, name: 'ScreenShot' }, // 截图
      //     { type: 'left', index: 1, name: 'Videotape' }, // 紧急录像
      //     { type: 'left', index: 2, name: 'Speech' }, // 对讲
      //     { type: 'left', name: 'NiaoKan', index: 3 }, // 开启鸟瞰
      //     { type: 'left', index: 4, name: 'Lunxun' }, // 开启轮巡
      //     { type: 'left', name: 'Attention', index: 5 }, // 事件记录
      //     { type: 'left', name: 'checkRecode', index: 6 }, // 检查记录
      //     { type: 'left', index: 7, name: 'Collect' }, // 组合收藏
      //     { type: 'left', index: 8, slotName: 'a', width: '100px' }, // 开启回放
      //     { type: 'left', name: 'Volume', index: 9 }, // 声音控制

      //     { type: 'right', name: 'FullScreen', index: 0 }, // 关闭预览
      //     // { type: 'right', name: 'MultiScreen', index: 1 }, //关闭全部预览
      //     { type: 'right', name: 'ViewPattern', index: 1 }, // 码流切换
      //     { type: 'right', name: 'Stream', index: 2 }, // 画面模式
      //     // { type: 'right', name: 'StopAll', index: 4 }, //画面切割
      //     { type: 'right', name: 'Stop', index: 3 } // 全屏
      //   ],
      defaultPane: 1, // 默认显示9窗格
      isCenter: false
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
  watch: {
    videoPlayInfo(newValue, oldValue) {
      console.log('videoPlayInfo', newValue, oldValue, this)
      let previewInfo, playBackInfo, num
      if (newValue.video1.isShowPreview && !oldValue.video1.isShowPreview) {
        // 预览1
        previewInfo = newValue.video1
        num = 1
      } else if (newValue.video1.isShowPlayBack && !oldValue.video1.isShowPlayBack) {
        // 回放1
        playBackInfo = newValue.video1
        num = 1
      } else if (newValue.video2.isShowPreview && !oldValue.video2.isShowPreview) {
        // 预览2
        previewInfo = newValue.video2
        num = 2
      } else if (newValue.video2.isShowPlayBack && !oldValue.video2.isShowPlayBack) {
        // 回放2
        playBackInfo = newValue.video2
        num = 2
      } else if (newValue.video3.isShowPreview && !oldValue.video3.isShowPreview) {
        previewInfo = newValue.video3
        num = 3
        // 预览3
      } else if (newValue.video3.isShowPlayBack && !oldValue.video3.isShowPlayBack) {
        // 回放3
        playBackInfo = newValue.video3
        num = 3
      } else if (newValue.video4.isShowPreview && !oldValue.video4.isShowPreview) {
        previewInfo = newValue.video4
        num = 4
        // 预览4
      } else if (newValue.video4.isShowPlayBack && !oldValue.video4.isShowPlayBack) {
        // 回放4
        playBackInfo = newValue.video4
        num = 4
      }
      // 判断是否是预览
      if (previewInfo || playBackInfo) {
        let pointId = previewInfo ? previewInfo.playInfo.id : playBackInfo.playInfo.id
        this.getCommonResourceById(pointId).then(suc => {
          let endInfo = this.getPreviewInfo(suc.data.resource)
          if (endInfo && previewInfo) {
            this.preview(endInfo, num, suc.data)
          } else if (endInfo && playBackInfo) {
            this.singleStatus.source = {
              devIp: suc.data.resource.hostIp,
              devCport: suc.data.resource.hostCport,
              channel: suc.data.resource.serise,
              streamType: suc.data.resource.subSystem,
              deviceType: suc.data.resource.deviceType,
              sipCode: suc.data.resource.deviceType,
              name: suc.data.resource.name
            }
            console.log(this.singleStatus)
            this.openPlayback(endInfo, num, suc.data)
          } else {
            this.$notify({ message: '没有获取预览信息', title: '失败', type: 'error' })
          }
        })
      }
    }
  },

  methods: {
    ...mapMutations('map2d/mapIndex', ['SET_VIDEO_PLAY_INFO']),
    ...mapActions('map2d/mapPoint', ['getCommonResourceById']),
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
    preview(val, num, pointInfo) {
      let data = {
        id: pointInfo.resource.id,
        channel: Number(val.channel),
        devIp: val.ip,
        devCport: val.cPort,
        devDport: val.dPort,
        streamType: val.streamType
      }
      this.$refs['preview' + num].openPreview(data)
    },
    getdata(evt) {
      console.log(evt.draggedContext.element.id)
    },
    datadragEnd(evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.tags)
    },
    openPlayback(val, num, pointInfo) {
      console.log(pointInfo)
      let data = {
        channel: Number(val.channel),
        devIp: val.ip,
        devPort: val.cPort,
        devDport: val.dPort,
        name: pointInfo.name,
        startTime: parseInt(new Date().setHours(0, 0, 0) / 1000),
        endTime: parseInt(Date.parse(new Date()) / 1000)
      }
      console.log('centerparam', data)
      this.$refs['pluginP' + num].startPalyback([data])
    },
    // 双击节点开流
    async doubleOpenplayBack(data, node) {
      console.log(data, '===双击数据==')
      this.currentSelectObj = data
      this.$refs.pluginP.setChannelName(this.currentSelectObj.name)
      if (data.tierType === 'res') {
        // var womod = this.checkedPane //如果需求改成需要在焦点窗口开流，就加这一条
        let parentData = node.parent.data
        let objOpen = {
          channel: Number(data.channel),
          devIp: parentData.ip,
          devPort: parentData.cPort,
          endTime: parseInt(Date.parse(new Date()) / 1000),
          startTime: parseInt(new Date().setHours(0, 0, 0) / 1000),
          streamConnPort: data.dPort,
          streamType: data.streamType || 'main'
        }
        let resOpen
        try {
          resOpen = await axios.post('/record/frontdevPlayBack', objOpen) // 回放录像查询
        } catch (error) {
          return {}
        }
        var getD = resOpen.data
        let obj = {
          TsIp: getD.TsIp,
          TsPort: getD.TsPort,
          streamId: getD.streamId
        }
        // 中心设备
        if (parentData.type !== 1) {
          // let obj = {
          //   TsIp: "192.168.110.107",
          //   TsPort: 6051,
          //   streamId: "1978081343043"
          // }
          let param = {
            recordType: 'all',
            devIp: parentData.ip, // VMR通道
            devPort: parentData.cPort, // 设备端口，
            channel: Number(data.channel), // 设备通道
            eventType: ['all'],
            startTime: parseInt(new Date().setHours(0, 0, 0) / 1000), // 开始时间是当前日期0点
            endTime: parseInt(Date.parse(new Date()) / 1000), // 结束时间
            streamType: data.streamType, // 码流类型（main,sub,）
            rows: this.currentPageObj.limit,
            page: this.currentPageObj.page,
            result: obj,
            isCenter: true,
            channelName: data.name
          }
          console.log(param, 'centerparam')
          this.$refs.pluginP.openPlayback([param])
        } else {
          // 前端设备
          console.log(obj, '==我的前端设备==')
          // let obj = {
          //   TsIp: "192.168.110.107",
          //   TsPort: 6051,
          //   streamId: "1978081343043"
          // }
          obj.result = { TsIp: obj.TsIp }
          let param = {
            channel: Number(data.channel),
            dPort: parentData.dPort,
            devIp: parentData.ip,
            devPort: parentData.cPort,
            eTime: parseInt(Date.parse(new Date()) / 1000),
            isCenter: false,
            recordType: ['all'],
            result: obj,
            sTime: parseInt(new Date().setHours(0, 0, 0) / 1000),
            streamType: data.streamType,
            channelName: data.name
          }
          console.log(param, 'qianduanparam')
          this.$refs.pluginP.openPlayback([param])
        }
      }
      // this.$refs.pluginP.getSyncStatus(this.isShowCheckBox)
    }
  },
  mounted() {}
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
  left: 420px;
  top: 100px;
  width: 680px;
  height: 470px;
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
}
.paly-back-palugin-item {
  width: 1061px;
}
</style>
