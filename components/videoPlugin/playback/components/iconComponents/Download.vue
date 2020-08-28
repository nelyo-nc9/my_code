<template>
  <div class="down">
    <i
      class="icon iconfont icon-xiazai"
      :class="{'disabled': selectedObj.dumpHandle != '' || !selectedObj.isPlay}"
      title="下载"
      @click="openDownload"
    ></i>
    <el-dialog title="下载" :visible.sync="dialogVisible" width="30%" :modal="false" center>
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
    </el-dialog>
  </div>
</template>

<script>
import BStimePicker from '../BStimePicker'
export default {
  name: 'Download',
  components: {
    BStimePicker
  },
  data() {
    return {
      dialogVisible: false,
      startTime: '00:00:00',
      endTime: '00:00:00'
    }
  },
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    openDownload() {
      if (this.selectedObj.isPlay) {
        this.dialogVisible = true
      }
    },
    saveCutDown() {
      this.dialogVisible = false
      this.$emit('iconClick', 'openDownload')
    },
    sTimeChange(val) {
      this.startTime = this.$moment(val, 'HH:mm:ss').toDate()
    },
    eTimeChange(val) {
      this.endTime = this.$moment(val, 'HH:mm:ss').toDate()
    }
  }
}
</script>
<style lang='less'>
.down .el-dialog__body {
  padding-top: 0px;
}
</style>
