<template>
  <div class="single-most-outer" @click.stop="clickEvent(null,1)" @dblclick="clickEvent(null,2)">
    <div class="single-outer">
      <!-- 插件 -->
      <div
        class="plugin-video"
        :class="{'small-button': paneMark!==0 && defaultPane===5 && !isMaximize, 'top': appendTopButtons.toggle}"
        :style="singleStatus.isSyncPlay ? 'position: fixed;top: -9999px;': ''"
        v-if="singleStatus.isPlugin&&singleStatus.playStatus"
      >
        <object ref="object" type="application/x-webplayercontrol">
        </object>
        <iframe v-if="singleStatus.isPlay && (singleStatus.isButton && (pluginIconShow.showBottomIcon || singleStatus.fullScreen) || appendTopButtons.toggle)"  allowTransparency="true"></iframe>
        <div v-if="!singleStatus.isPlayback">
          <div class="plugin-button" v-if="(singleStatus.isButton && singleStatus.isPlay) || singleStatus.fullScreen" @dblclick.stop>
            <div class="plugin-button-box">
              <i class="icon iconfont icon-screenshot" :class="{'disable': !singleStatus.isPlay}" title="截图" @click="getCapture" v-if="pluginIconShow.screenshot || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.isCentreRecording? 'icon-recplayback' : 'icon-videotape-stop', !singleStatus.isPlay ? 'disable': '']" :title="centrePlayer" @click="singleStatus.isCentreRecording ? stopCentreRecord() : openCentreRecord()" v-if="pluginIconShow.centreRecordIcon || singleStatus.fullScreen"></i>
              <!-- <i class="icon iconfont" :class="[singleStatus.isSpeech? 'icon-shipinlei-duijiang': 'icon-shipinleiduijiangjinyong', !singleStatus.isPlay? 'disable': '']" :title="[singleStatus.isSpeech?'关闭对讲':'对讲']" @click="clickSpeech()"></i> -->
              <i class="icon iconfont" :class="[singleStatus.isBoost? 'icon-nk-close' : 'icon-niaokan']" :title="[singleStatus.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()" v-if="pluginIconShow.niaokanIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont-ccb ccbkuaisushangqiang" title="快速上墙" @click="toWallBtn()" v-if="pluginIconShow.tvwallIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont-ccb ccbkuaisuhuifang" title="快速回放" @click="quickRecode()" v-if="pluginIconShow.quickRecodeIcon || singleStatus.fullScreen"></i>
              <!-- <i class="icon iconfont-ccb ccbyuntaikongzhi" :class="{disable: !(singleStatus.source.subType === 3)}" title="云台" @click="PTZClick()" v-if="pluginIconShow.yuntaiIcon || singleStatus.fullScreen"></i> -->
              <!-- <i class="icon iconfont-ccb ccbguanliankongzhi" title="关联配置" @click="showRelevance = true"></i> -->
              <i class="icon iconfont-ccb ccbmaliuxinxi" title="码流信息" @click="setDetail" v-if="pluginIconShow.detailsIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.showVolume&&singleStatus.isPlay? 'icon-volume': 'icon-mute']" title="伴音" @click="changeSound()" v-if="pluginIconShow.muteIcon || singleStatus.fullScreen"></i>
              <div class="div-null"></div>
              <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()" v-if="pluginIconShow.previewStopIcon || singleStatus.fullScreen"></i>
              <i class="icon iconfont" :class="[singleStatus.fullScreen&&singleStatus.isPlay? 'icon-exit-full-screen': 'icon-quanpingfangda']" :title="[singleStatus.fullScreen?'退出全屏':'全屏']" @click="fullScreen" v-if="pluginIconShow.quanpingfangdaIcon || singleStatus.fullScreen"></i>
            </div>
          </div>
        </div>
        <!-- <div class="video-button"></div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
  },
  props: {
    flag: {
      type: Boolean,
      default: true
    },
    singleStatus: { 
      type: Object,
      default: () => {
        return {
          isPlugin: true, // 插件播放还是h5
          playStatus: true, // 画面是否在使用
          isButton: true, // 是否显示插件悬浮条
          isPlay: true, // 是否播放
          img: '' // 图片遮盖的base64
        }
      }
    },
    appendTopButtons: {
      // 视频窗口上方的按钮
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
      default: 25
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
          isRecordingIcon: true, // 录像类型
          streamChangeIcon: true, // 码流切换
          screenshot: true, // 截图
          muteIcon: true, // 开启伴音
          yuntaiIcon: true, // 云台
          speechIcon: true, // 对讲
          niaokanIcon: true, // 开启鸟瞰
          tvwallIcon: true, // 快速上墙
          quanpingfangdaIcon: true // 全屏
        }
      }
    }
  },
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
    },
    isShowPlayBack() {
      return this.$route.name == "alarmHost" ? true : false
    }
  },

  mounted() {
    console.log("++++++++++++",this.singleStatus)
    // let iframeEle = document.getElementsByTagName('iframe')
    // iframeEle[this.checkedPane].style.width = '10%';
    // iframeEle[this.checkedPane].style.minWidth = '20px';
    this.$nextTick(function() {
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
    // 返回参数 index：插件窗格号 clicktype：单机还是双击
    clickEvent(index, clickType) {
      console.log('clickEvent touch', index, clickType)
      if (clickType === 1) {
        if (index) {
          console.log('按钮的显示隐藏')
          console.log(this.singleStatus)
          console.log(this.flag)
          this.$emit('updateStatus', this.paneMark, { isButton: !this.singleStatus.isButton }, 'isButton')
        }
      }
      this.$emit('clickEvent', index, clickType, this.paneMark)
    },
    toolbarShow() {
      this.$emit('updateStatus', this.paneMark, { isButton: false })
    },
    changeScreen() {
      // 大小窗口切换
      this.$emit('changeScreen', this.paneMark)
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
      // if (!this.singleStatus.isPlay) {
      //   return
      // }
      // this.$parent.fullScreen()
      // 全屏
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$parent.$parent.fullScreen('children')
      this.$nextTick(() => {
        // console.log('组件内的变量', this.singleStatus.fullScreen)
        if (this.singleStatus.fullScreen) {
          // this.$parent.isFullScreen = false
          this.$emit('updateStatus', this.paneMark, { fullScreen: false })
        } else {
          // this.$parent.isFullScreen = true
          this.$parent.$parent.isMaximize = true
          this.$emit('updateStatus', this.paneMark, { fullScreen: true })
        }
      })
    },
    getCapture() {
      // 截图
      // this.getVideoConf() // 同步localStorage数据到本地配置
      // const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      // const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      // let cameraName = this.singleStatus.source ? this.singleStatus.source.cameraName : this.singleStatus.result.name // 回放预览公用 数据兼荣
      // let picName = cameraName + '_' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      // let path = this.parameters.screenshotPath + '\\' + picName.toString()
      // const state = this.$refs.object.GetPlayerPicture(path, picType)
      // if (state === 0) {
      //   this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      // } else {
      //   this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      // }
      this.$parent.$parent.getPic()
    },
    async getBase64Capture() { // Base64截图,上传服务器
      if (!this.singleStatus.isPlay) {
        return
      }
      let Base64Data = await this.getCoverPic()
      let param = {
        base64Img: Base64Data,
        channelId: this.singleStatus.result.id || this.singleStatus.queryInformation.id
      }
      screenShootApi(param).then(res => {
        console.log(res, '截图-res')
        if (res.data.code === 0) {
          this.$messageSuccess('截图上传成功！', '成功')
        } else {
          this.$messageError(`截图上传失败,失败原因${res.data.message}！`)
        }
      }).catch(err => {
        console.log(err, '截图-err')
        this.$messageError('截图上传失败，请稍后重试！', '错误')
      })
    },
    getCoverPic() {
      // 视频截图
      return new Promise(resolve => {
        let src = ''
        let i = 5
        while (i-- && !src) {
          src = this.$refs.object.GetRealPicturebyBase64(1, 50)
        }
        resolve(src)
      })
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
    // 关闭预览
    quickStop() {
      let obj = { isPlay: false, playStatus: false, isBoost: false, source: '' }
      if (this.singleStatus.isPlay) {
        this.clearTOpen()
        // this.stopCentreRecord()
        // this.stopSpeech()
        // this.closeSpeech()
        // this.closeRecord()
        this.$refs.object.CloseRealStream()
        this.showPTZ = false
      }
      let elementSource = JSON.parse(JSON.stringify(this.singleStatus.source))
      if (elementSource) {
        this.$parent.$emit('stopBack', elementSource)
      }
      this.$emit('updateStatus', this.paneMark, obj)
      // this.$parent.videoPageData[this.paneMark] = ''
    },
    // 码流信息
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
    // 云台
    PTZClick() { // 云台开关 todo 通道类型是球机的才有
      if (!(this.singleStatus.source.subType === 3)) {
        return
      }
      this.showPTZ = !this.showPTZ
    },
    checkVideo() {
      this.showCheckVideo = true
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
    toWallBtn() { // 上墙
    console.log(this.$parent)
      this.$parent.$parent.toWallBtn()
    },
    clickSpeech() { // 点击对讲
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$parent.clickSpeech()
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
    clearTOpen() {
      // 清除断线重新开流定时器
      clearInterval(this.tOpen)
      this.tOpen = null
    },
  },
  beforeDestroy() {
    this.clearTOpen()
  }
}
</script>
<style lang="less" scoped>
.single-most-outer {
  background-color: #404040;
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
.showPlayBack{
  z-index: 9999;
  position: relative;
  top: 100%;
}
.zIndex{
  z-index: 999;
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
      height: 32px;
      position: absolute;
      bottom: 0px;
      overflow-x: auto;
      z-index: 9999;
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
          line-height: 32px;
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
      // top: 0;
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
</style>
