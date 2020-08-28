<template>
  <div class="tools-box">
    <iframe allowTransparency="true"></iframe>
    <div class="playback-button-box">
        <i class="icon iconfont" :class="selectedObj.isPlay? 'icon-pause' : 'icon-play'" :title="[selectedObj.isPlay? '暂停': '播放']" @click="playStop"></i>
        <i class="icon iconfont icon-stop" :class="{'disable': !selectedObj.isPlay}" title="停止" @click="stopPlayback"></i>
         <i class="icon iconfont" :class="[selectedObj.isBoost? 'icon-nk-close' : 'icon-niaokan', !selectedObj.isPlay? 'disable' : '']" :title="[selectedObj.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()"></i>
        <!-- 当前不做，后期做 -->
        <!-- <i class="icon iconfont icon-xiazai" title="下载" @click="openDownload"></i> -->
        <i class="icon iconfont icon-screenshot" title="抓图" @click="getCapture"></i>
        <div class="progress-bar-parent" >
          <div class="slide-mon-f">
            <slider class="slide-mon" :value="progress"  color="#4699f8" @change="sliderChange"></slider>
          </div>
           <span class="play-time">{{$moment(playTime * 1000).format('HH:mm:ss')}}</span>
        </div>
        <i class="icon iconfont-ccb ccbfanhui" title="返回现场" @click="goBack"></i>
        <!-- 下载弹窗 -->
        <!-- <el-dialog title="下载" :visible.sync="dialogVisible" width="30%" :modal="false" center>
          <iframe style="position:absolute;left:-10000px;top:0" v-if="dialogVisible"></iframe>
          <div style="height:150px;">
            选择下载时间段:
            <div style="height:30px;line-height:30px;">
              <span style="vertical-align:top;">开始时间</span>
              <BStimePicker
                style="display:inline-block"
                :datetime="startTime"
                @timeChange="sTimeChange"
                :width="160"
                :height="30"
              ></BStimePicker>
              <span style="vertical-align:top;margin-left:10px">结束时间</span>
              <BStimePicker
                style="display:inline-block"
                :datetime="endTime"
                @timeChange="eTimeChange"
                :width="160"
                :height="30"
              ></BStimePicker>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveCutDown">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog> -->
    </div>
  </div>
</template>

<script>
import Slider from '../yuntai/Slider'
export default {
  name: 'PlaybackButton',
  components: {
    Slider
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    playBackObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      startTime: '00:00:00',
      endTime: '00:00:00',
      progress: 0, // 进度
      playTime: 0, // 播放时间
      playbackTimer: null // 时间进度定时器
    }
  },
  computed: {},
  methods: {
    sTimeChange(val) {
      this.startTime = this.$moment(val, 'HH:mm:ss').toDate()
    },
    eTimeChange(val) {
      this.endTime = this.$moment(val, 'HH:mm:ss').toDate()
    },
    saveCutDown() {
      this.dialogVisible = false
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
    downloadVideo() {},
    sliderChange(val) {
      this.clearTimer()
      this.progress = val
      this.$emit('sliderChange', val)
    },
    getCapture() { // 回放抓图和预览主图一样
      this.$emit('getCapture')
    },
    boost() {
      this.$emit('boost')
    },
    openDownload() {},
    stopPlayback() {
      this.$emit('stopPlayback')
    },
    playStop() {
      this.$emit('playStop')
    },
    goBack() {
      this.$emit('goBack')
    },
    timer() {
      // console.log('定时器开启')
      this.playbackTimer = setInterval(() => {
        if (this.selectedObj.isPlayback) {
          let recordPlayerCurTime = JSON.parse(this.$parent.$refs.object.GetRecordPlayerCurTime())
          let recordTime = parseInt(recordPlayerCurTime.msCur / 1000)
          // console.log('插件返回值', recordPlayerCurTime)
          // console.log('当前播放时间', recordTime, '类型', typeof recordTime)
          this.playTime = recordPlayerCurTime.success ? recordTime || this.playTime : this.playBackObj.startTime || 0
          // console.log('playTime', this.playTime, 'startTime', this.playBackObj.startTime, 'endTime', this.playBackObj.endTime)
          this.progress = ((this.playTime - this.playBackObj.startTime) / (this.playBackObj.endTime - this.playBackObj.startTime)) * 100
        }
      }, 1000)
    },
    clearTimer() {
      if (this.playbackTimer) {
        // console.log('清除定时器')
        clearInterval(this.playbackTimer)
        this.playbackTimer = null
      } 
    }
  },
  beforeDestroy() {
    // console.log('出发了销毁方法')
    this.clearTimer()
  }
}
</script>

<style lang="less" scoped>
.tools-box {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  iframe {
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 0px;
    background: #333;
    border: 0px;
    left: 0px;
  }
  .playback-button-box {
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      font-size: 1.7em;
      margin: 0 8px;
      line-height: 30px;
      color: #fff;
      cursor: pointer;
    }
    .progress-bar-parent {
      flex: 1;
      height: 30px;
      line-height: 30px;
      display: flex;
      padding: 0 10px;
      .slide-mon-f {
        flex: 1;
      }
      .play-time {
        color: #fff;
        padding: 0 0 0 10px;
        width: 70px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>