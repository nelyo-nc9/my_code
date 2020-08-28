<template>
  <div class="alarm-video">
    <el-dialog title='操作日志' :visible.sync="logStatus" width="60%" @close="close">
        <div class="video-content">
          操作日志内容
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
    logControl: {
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
      logStatus: false
    }
  },
  watch: {},
  created() {
    this.logStatus = this.logControl
    console.log('~~查看日志报警数据~~', this.alarmData)
  },
  methods: {
    // 确认关联控制
    sureLinkClick() {
      this.logStatus = false
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
