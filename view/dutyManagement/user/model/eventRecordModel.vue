<template>
  <div class="eventRecordModel">
    <el-dialog :visible.sync="eventVisibel" :before-close="handleClose" width="22%">
      <div slot="title" class="dialog-title" style="height:35px;line-height:35px;font-size:16px;">
        <div style="float:left">
            <span>事件记录</span>
        </div>
        <div style="float:right;margin-right:30px;font-size:16px;cursor: pointer;" v-print="'#contentinfo'">
            <span title="打印" class="el-icon-printer"></span>
        </div>
      </div>
      <div id="contentinfo">
        <el-form :model="eventRecordForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="发起人" disabled :label-width="formLabelWidth">
                <el-input v-model="eventRecordForm.username" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="资源信息" disabled :label-width="formLabelWidth">
                <el-input v-model="eventRecordForm.channelName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="位置信息" disabled :label-width="formLabelWidth">
                <el-input v-model="eventRecordForm.location" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="事件类型" disabled :label-width="formLabelWidth">
                <el-input v-model="eventRecordForm.event" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="事件描述" disabled :label-width="formLabelWidth">
                <el-input v-model="eventRecordForm.desc" type="textarea" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'eventRecordModel',
  props: {
    eventVisibel: {
      type: Boolean,
      default: false
    },
    eventRecordForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 表单label宽度
      formLabelWidth: '80px'
    }
  },
  computed: {
  },
  methods: {
    // 事件记录弹窗左上角关闭按钮
    handleClose() {
      this.$emit('closeEventVisibel')
    },
    // 事件类型修改
    changeEventType(value) {
      console.log(value)
    }
  }
}
</script>

<style scoped lang="less">
/deep/.el-form-item {
  margin-bottom: 13px;
}
/deep/.el-dialog__header {
  padding: 5px 15px 5px;
  background-color: rgba(45, 114, 211, 1);
}
/deep/.el-dialog__headerbtn {
  top: 12px;
  color: #fff;
  font-size: 16px;
}
/deep/.el-textarea {
  width: 302px;
}
</style>
