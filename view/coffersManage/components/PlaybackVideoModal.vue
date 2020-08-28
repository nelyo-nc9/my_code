<!--
 * @Author: yanglei
 * @Date: 2020-06-06 17:12:53
 * @LastEditTime: 2020-08-21 19:29:24
 * @LastEditors: your name
 * @Description: 视频回放组件
 * @FilePath: \ccb-client\client\src\view\coffersManage\components\PlaybackVideoModal.vue
-->

<template>
  <div class="playback-container">
    <el-dialog
      title="查看录像"
      :visible.sync="showPlaybackVideo"
      :before-close="closeModal"
      :modal-append-to-body="needAppend"
      :close-on-click-modal="false"
      width="1200"
      z-index="999999">
      <div class="playback-plugin-div">
        <playBackPlugin ref="playback" :configuration="configuration" :defaultPane="defaultPane" :iconShow="iconShowParams">
          <!-- <span slot="relation" title="关联镜头" class="iconfont-ccb ccbguanlianjingtou relation-icon" @click="defaultPane = 4"></span> -->
          <span slot="relation" title="关联镜头" class="iconfont-ccb ccbguanlianjingtou relation-icon" @click="relationIconHandler"></span>
        </playBackPlugin>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import playBackPlugin from '../../videoManage/playback/playBackPlugin/playBackPlugin'

export default {
  components: {
    playBackPlugin
  },
  props: {
    showPlaybackVideo: {
      type: Boolean,
      default: false
    },
    playbackParams: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 视频回放组件配置
      defaultPane: 1,
      configuration: {
        progressBar: {
          show: true, // 是否配置进度条
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
      iconShowParams: [
        { type: 'left', index: 0, name: 'Play' },
        { type: 'left', index: 1, name: 'Stop' },
        { type: 'left', index: 2, name: 'Download' },
        { type: 'left', index: 3, name: 'FullScreen' },
        { type: 'left', index: 4, slotName: 'relation' },
        { type: 'left', index: 5, name: 'Volume' }
      ],
      needAppend: false
    }
  },
  mounted() {
    // let param = {
    //   channel: 2,
    //   // dPort: 8000,
    //   devIp: '10.2.2.20',
    //   devPort: 3721,
    //   endTime: 1596427260,
    //   startTime: 1596384000
    // }
    // let param = {
    //   channel: 2,
    //   // dPort: 8000,
    //   devIp: '192.168.60.10',
    //   devPort: 3721,
    //   endTime: 1596912138,
    //   startTime: 1596902400
    // }
    // this.$nextTick(() => {
    //   this.$refs.playback.openPlayback([param])
    // })
    this.$nextTick(() => {
      this.$refs.playback.openPlayback([this.playbackParams])
    })
  },
  methods: {
    relationIconHandler() {
      // {label: "单画面", value: 1}
      this.$refs.playback.clickCheckedWmode({label: '4画面', value: 4})
    },
    /**
     * @description: 通知父组件关闭查看回放对话框
     * @param {type} 无
     * @return: 无
     */
    closeModal() {
      this.$emit('closePlayback', 'video')
    }
  }
}
</script>

<style lang="less" scoped>
.playback-container {
  /deep/ .el-dialog__body {
    padding: 20px 5px 0 5px;
    .playback-plugin-div {
      height: 600px;

      /deep/ .master-control {
        width: 100%;
        display: flex;
        // flex-direction: row-reverse;

        .progress-bar-parent {
          flex: 8;
          margin-top: 16px;
          margin-left: 125px;
        }
        .video-bottom {
          flex: 2;
          border-bottom: 0px;

          .relation-icon {
            color: #878282;
            font-size: 24px;
            padding: 0 8px;
          }
        }
      }

      .video-timeline {
        display: none;
      }
    }
  }
}
</style>
