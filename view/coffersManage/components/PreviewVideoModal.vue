<!--
 * @Author: yanglei
 * @Date: 2020-06-08 17:32:02
 * @LastEditTime: 2020-08-25 14:03:47
 * @LastEditors: your name
 * @Description: 视频预览组件
 * @FilePath: \ccb-client\client\src\view\coffersManage\components\PreviewVideoModal.vue
-->

<template>
  <div class="preview-container">
    <el-dialog
      :visible.sync="showPreviewVideo"
      :before-close="closeModal"
      :modal-append-to-body="needAppend"
      :close-on-click-modal="false"
      append-to-body
      width="900px">
      <span slot="title" class="dialog-title">
        <span>实时预览</span>
        <span class="channel-name">{{ previewTitle }}</span>
      </span>

      <div class="plugin-container">
        <preview-plugin :defaultPane="defaultPane" :iconShow="iconShowParams" :pluginIconShow="pluginIconShow" :moduleType="9" :isNeedModal="false" ref="preview"></preview-plugin>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import previewPlugin from '../../videoManage/preview/school/previewPlugin'

export default {
  name: 'PreviewVideoModal',
  components: {
    previewPlugin
  },
  props: {
    showPreviewVideo: {
      type: Boolean,
      default: false
    },
    previewParam: {
      type: Object,
      default: function() {
        return {}
      }
    },
    previewTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 视频下方icon配置
      iconShowParams: [
        { type: 'left', index: 0, name: 'Stop' }, // 关闭预览
        { type: 'left', index: 1, name: 'ScreenShot' }, // 截图
        { type: 'left', index: 2, name: 'Videotape' }, // 录像
        { type: 'left', index: 3, name: 'Speech' }, // 对讲
        { type: 'left', index: 4, name: 'NiaoKan' }, // 鸟瞰
        { type: 'left', index: 5, name: 'Volume' }, // 声音

        { type: 'right', index: 0, name: 'FullScreen' }, // 全屏
        { type: 'right', index: 1, name: 'ViewPattern' }, // 画面模式
        { type: 'right', index: 2, name: 'Stream' }, // 码流切换
        { type: 'right', index: 3, name: 'checkRecode' } // 检查记录
      ],
      defaultPane: 1, // 默认显示1窗格
      // pluginIconShow: {
      //   showBottomIcon: false, // 图标按钮条
      //   hidemenuIcon: true, // 隐藏
      //   speechIcon: false // 对讲
      // },
      pluginIconShow: {
        showBottomIcon: false, // 图标按钮条
        hidemenuIcon: false, // 隐藏
        previewStopIcon: false, // 关闭预览
        centreRecordIcon: false, // 紧急录像
        isRecordingIcon: false, // 录像类型
        streamChangeIcon: false, // 码流切换
        screenshot: false, // 截图
        muteIcon: false, // 开启伴音
        yuntaiIcon: false, // 云台
        speechIcon: false, // 对讲
        niaokanIcon: false, // 开启鸟瞰
        tvwallIcon: false, // 快速上墙
        quickRecodeIcon: false, // 快速回放
        videoCheckIcon: false, // 视频复核
        detailsIcon: false, // 详情
        quanpingfangdaIcon: false // 全屏
      },
      needAppend: false
    }
  },
  mounted() {
    // let data = {
    //   channel: val.channel,
    //   devIp: val.ip,
    //   devPort: val.cport,
    //   dport: val.dport,
    //   streamType: val.streamType === 1 ? 'main' : (val.streamType === 2 ? 'sub1' : 'sub2')
    // }
    this.$nextTick(() => {
      this.$refs.preview.openPreview(this.previewParam)
    })
  },
  methods: {
    /**
     * @description: 通知父组件关闭查看回放对话框
     * @param {type} 无
     * @return: 无
     */
    closeModal() {
      this.$emit('closePreview')
    }
  }
}
</script>

<style lang="less" scoped>
.preview-container {
  /deep/ .v-modal {
    z-index: 2 !important;
  }
}

/deep/ .el-dialog__header {
  .dialog-title {
    .channel-name {
      font-size: 14px;
      position: absolute;
      width: 100%;
      text-align: center;
      transform: translateX(-68px);
    }
  }
}
/deep/ .el-dialog__body {
  padding: 5px;
  .plugin-container {
    height: 600px;
    /deep/ .video-plugin {
      .plugin-video {
        iframe {
          z-index: -2;
        }
      }
    }
  }
}
</style>
