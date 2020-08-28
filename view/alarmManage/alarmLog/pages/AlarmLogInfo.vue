<template>
  <div class="alarm-video">
    <el-dialog title='报警录像回放' :visible.sync="videoStatus" width="60%" @close="close" :close-on-click-modal="false">
        <div class="video-content">
          录像回放内容
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="sureLinkClick" size="small">关闭</el-button>
            <el-button @click="sureLinkClick" size="small">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    videoControl: {
      type: Boolean,
      default: false
    },
    alarmData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      videoStatus: false
    }
  },
  watch: {},
  created() {
    this.videoStatus = this.videoControl
    console.log('~~查看日志报警数据~~', this.alarmData)
  },
  methods: {
    // 确认关联控制
    sureLinkClick() {
      this.videoStatus = false
      this.$emit('sureClick', false)
    },
    close() {
      this.$emit('sureClick', false)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
