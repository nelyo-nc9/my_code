<template>
  <div>
    <i
      class="realbtn iconfont icon-focus"
      :class="{'disable' :!selectedObj.isPlay}"
      @click="openFocusState"
      title="事件记录"
    ></i>
    <el-dialog title="事件记录" :visible.sync="openFocus" width="360px" :modal="false" center>
      <iframe style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: 0;"></iframe>
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="发起人">
          <el-input v-model="form.createName" width="230px" disabled></el-input>
        </el-form-item>
        <el-form-item label="资源信息">
          <el-input v-model="form.sourceInfo" disabled></el-input>
        </el-form-item>
        <el-form-item label="位置信息">
          <el-input v-model="form.addrInfo" disabled></el-input>
        </el-form-item>
        <el-form-item label="事件类型">
          <el-select v-model="form.eventTypeValue">
            <el-option
              v-for="(item,index) in form.eventType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <i class="el-icon-delete" @click="deleteEventType"></i>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.newEventValue" placeholder="新增事件类型"></el-input>
          <i class="el-icon-plus" @click="toAddEventType"></i>
        </el-form-item>
        <el-form-item label="事件描述">
          <el-input type="textarea" v-model="form.eventDesc" resize="none"></el-input>
        </el-form-item>
        <el-checkbox label="发送报警信息" v-model="form.sendWarn" name="type"></el-checkbox>
        <el-form-item>
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="cancelSub">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { SET_FOCUS } from '@src/http/video/videoPlayback.api.js'
export default {
  components: {},
  name: 'Attention',
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {},
  data() {
    return {
      openFocus: false,
      isVSelectFocus: false,
      form: {
        createName: '张三',
        sourceInfo: '蓝色星际',
        addrInfo: 'd://bstar/hu',
        eventType: [
          { label: '违规操作', value: '违规操作', noDelete: true },
          { label: '异常情况', value: '异常情况', noDelete: true },
          { label: '用户脱岗', value: '用户脱岗', noDelete: true },
          { label: '镜头异常', value: '镜头异常', noDelete: true },
          { label: '对讲异常', value: '对讲异常', noDelete: true }
        ],
        eventTypeValue: '',
        newEventValue: '',
        eventDesc: '',
        sendWarn: ''
      },
      addEType: []
    }
  },
  computed: {},

  methods: {
    openFocusState() {
      console.log(this.selectedObj, 'slelelelelel')
      if (this.selectedObj.isPlay) {
        this.openFocus = true
      }
    },
    cancelSub() {
      this.openFocus = false
      this.form = {
        createName: '张三',
        sourceInfo: '蓝色星际',
        addrInfo: 'd://bstar/hu',
        eventType: [
          { label: '违规操作', value: '违规操作', noDelete: true },
          { label: '异常情况', value: '异常情况', noDelete: true },
          { label: '用户脱岗', value: '用户脱岗', noDelete: true },
          { label: '镜头异常', value: '镜头异常', noDelete: true },
          { label: '对讲异常', value: '对讲异常', noDelete: true }
        ],
        eventTypeValue: '',
        newEventValue: '',
        eventDesc: '',
        sendWarn: ''
      }
    },
    toAddEventType() {
      if (this.form.newEventValue === '') {
        this.$message('新增类型不能为空')
        return
      }
      this.addEType.push({ label: this.form.newEventValue, value: this.form.newEventValue, noDelete: false })
      this.form.eventType.push({ label: this.form.newEventValue, value: this.form.newEventValue, noDelete: false })
      this.form.newEventValue = ''
    },
    deleteEventType() {
      this.form.eventType.forEach((v, i) => {
        if (v.label === this.form.eventTypeValue) {
          if (!v.noDelete) {
            this.form.eventType.splice(i, 1)
            this.form.eventTypeValue = ''
          } else {
            console.log('nodelete')
          }
        }
      })
    },
    submit() {
      console.log(this.form, '')
      const obj = {
        devIp: this.selectedObj.devIp,
        devPort: this.selectedObj.devPort,
        channel: this.selectedObj.channel,
        mType: 0,
        streamType: this.selectedObj.streamType,
        attentionType: this.form.eventTypeValue,
        userName: this.form.createName,
        level: 1, // 提醒等级暂时不需要
        ipcName: this.selectedObj.name,
        devLocal: this.form.addrInfo,
        attentionContent: this.form.eventDesc,
        sendMsg: this.form.sendWarn,
        recordTime: 60 // 录像时长暂时不需要
      }
      SET_FOCUS(obj)
        .then(item => {
          this.cancelSub()
          // this.$message('关注成功')
          this.$messageSuccess('关注成功')
        })
        .catch(() => {
          // this.$message('关注失败')
          this.$messageError('关注失败')
        })
    }
  }
}
</script>
<style lang='less' scoped>
.el-input,
.el-textarea,
.el-select {
  width: 200px;
}
</style>
