<!--
 * @Author: dfk
 * @Date: 2020-08-14 20:21:23
 * @LastEditTime: 2020-08-16 11:33:59
 * @LastEditors: dfk
 * @Description: 回放报警预录像 前30s
-->
<template>
  <div class="dp-con playback-alarm">
    <i class="icon iconfont-ccb ccbhuifang" :class="[!selectedObj.isPlay? 'disable': '']" title="回放" @click="clickPlayBack()"></i>
    <el-dialog
      title="查看录像"
      :visible.sync="showPlaybackVideo"
      :before-close="closeModal"
      :modal-append-to-body="needAppend"
      width="1200px"
      z-index="999999">
      <div class="playback-plugin-div">
        <playBackPlugin ref="playback" :configuration="configuration" :defaultPane="defaultPane" :iconShow="iconShowParams">
        </playBackPlugin>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import playBackPlugin from '@src/view/videoManage/playback/playBackPlugin/playBackPlugin'
export default {
  name: 'playBack',
  inheritAttrs: false,
  data() {
    return {
      configuration: {
        progressBar: {
          show: true, // 是否配置进度条
          type: 'totaltime' // curtime代表显示当前播放时间 //totaltime：代表显示当时时间/总时间,""：代表只显示进度条不显示任何配置
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
      defaultPane: 1,
      iconShowParams: [
        { type: 'left', index: 0, name: 'Play' },
        { type: 'left', index: 1, name: 'Stop' },
        { type: 'left', index: 2, name: 'Download' },
        { type: 'left', index: 3, name: 'FullScreen' },
        { type: 'left', index: 5, name: 'Volume' }
      ],
      needAppend: false,
      showPlaybackVideo: false
    }
  },
  components: {
    playBackPlugin
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    clickPlayBack() {
      if (!this.selectedObj.isPlay) {
        return
      }
      this.showPlaybackVideo = true
      this.$nextTick(() => {
        console.log(this.selectedObj, 'selectedObj')
        this.$refs.playback.openPlayback([{
          channel: this.selectedObj.previewData.channel,
          devIp: this.selectedObj.previewData.devIp,
          devPort: this.selectedObj.previewData.devCport,
          endTime: this.selectedObj.previewData.alarmTime,
          startTime: this.selectedObj.previewData.alarmTime - 30
        }])
      })
      // this.$emit('iconClick', 'clickPlayBack')
    },
    closeModal() {
      this.$refs.playback.stop()
      this.showPlaybackVideo = false
    }
  }
}

</script>
<style lang='less' scoped>
.dp-con {
  // width: 36px;
  i {
    padding: 0 8px;
    cursor: pointer;
  }
}
.playback-alarm {
  /deep/ .el-dialog__header {
    padding: 0px 20px 0 20px;
  }
  /deep/ .el-dialog__title {
    font-size: 14px;
  }
  /deep/ .el-dialog__body {
    padding: 0px 20px;
    .playback-plugin-div {
      height: 600px;

    //   /deep/ .master-control {
    //     width: 100%;
    //     display: flex;
    //     // flex-direction: row-reverse;

    //     .progress-bar-parent {
    //       flex: 8;
    //       margin-top: 16px;
    //     }
    //     .video-bottom {
    //       flex: 2;
    //       border-bottom: 0px;

    //       .relation-icon {
    //         color: #878282;
    //         font-size: 24px;
    //         padding: 0 8px;
    //       }
    //     }
    //   }

    //   .video-timeline {
    //     display: none;
    //   }
    }
  }
  .disable {
    cursor: not-allowed;
    color: #ccc;
  }
}
</style>
