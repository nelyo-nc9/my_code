<!--
 * @Author: yanglei
 * @Date: 2020-06-08 17:32:02
 * @LastEditTime: 2020-07-27 10:45:21
 * @LastEditors: Please set LastEditors
 * @Description: 视频预览组件
 * @FilePath: \CCB\client\src\view\coffersManage\components\PreviewVideoModal.vue
-->

<template>
  <div class="preview-container">
    <el-dialog :visible.sync="showPreviewVideo"
               :before-close="closeModal"
               :modal-append-to-body="false"
               width="900px">
      <span slot="title"
            class="dialog-title">
        <span>实时预览</span>
        <span class="channel-name">{{ previewTitle }}</span>
      </span>

      <div class="plugin-container">
        <preview-plugin :defaultPane="defaultPane"
                        :isNeedModal="false"
                        :moduleType="7"
                        :pluginIconShow="iconShowParams"
                        ref="preview"></preview-plugin>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import previewPlugin from '../../videoManage/preview/school/previewPlugin'
import { mapState } from 'vuex'

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
      default: function () {
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
      iconShowParams: {
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
        videoCheckIcon: false, // 视频复核
        detailsIcon: true, // 详情
        quanpingfangdaIcon: true // 全屏
      },
      defaultPane: 1, // 默认显示1窗格
      needAppend: false
    }
  },
  created() { },
  computed: {
    ...mapState({
      playParams: ({ tvWall }) => tvWall.playParams // 判断拖拽的什么东西上墙:资源还是轮巡等
    })
  },
  mounted() {
    let obj = JSON.stringify(this.playParams)
    if (obj !== '{}') {
      let data = {
        channel: Number(this.playParams.serise),
        devIp: this.playParams.ip,
        subType: Number(this.playParams.videoType),
        devCport: Number(this.playParams.cport),
        streamType: this.playParams.stream.toLowerCase(),
        dId: this.playParams.devID,
        id: this.playParams.resID,
        deviceType: this.playParams.deviceType

      }
      this.$nextTick(() => {
        this.$refs.preview.openPreview(data)
      })
    } else {
      this.failureMethod('播放信息获取失败')
    }
  },
  methods: {
    /**
     * @description: 通知父组件关闭查看回放对话框
     * @param {type} 无
     * @return: 无
     */
    closeModal() {
      this.$emit('closePreview')
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-container {
  /deep/ .v-modal {
    z-index: 90 !important;
  }
  /deep/ .el-dialog__wrapper {
    z-index: 100 !important;
  }
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
  }
}
</style>
