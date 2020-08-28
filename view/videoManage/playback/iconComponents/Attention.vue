<template>
  <div class="back-event-record">
    <i
      class="realbtn iconfont icon-focus"
      :class="{'disable' :!selectedObj.isPlay}"
      @click="openFocusState"
      title="事件记录"
    ></i>
    <el-dialog title="事件记录" v-if="openFocus" :visible.sync="openFocus" width="360px" :modal="false" center :show-close="false">
      <iframe style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: 0;"></iframe>
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-form-item label="发起人">
          <el-input v-model="form.createName" width="230px" disabled></el-input>
        </el-form-item>
        <el-form-item label="资源信息">
          <el-input v-model="form.sourceInfo" disabled :title="form.sourceInfo"></el-input>
        </el-form-item>
        <el-form-item label="位置信息">
          <el-input v-model="form.addrInfo" disabled :title="form.addrInfo"></el-input>
        </el-form-item>
        <el-form-item label="事件分类">
          <el-select v-model="form.eventTypeValue">
            <el-option
              v-for="(item,index) in eventType"
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
          <textarea rows="3" style="resize:none;" id="input-desc"></textarea>
          <!-- <el-input type="textarea" v-model="form.eventDesc" resize="none"></el-input> -->
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
import { eventRecordApi } from '@src/http/video/videoPlayback.api.js'
import { getDictBasicInfo } from '@src/http/video/videoPreview.api.js'
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
  created() {
    const userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.form.createName = userInfo.userName || ''
    this.getEventTypes()
  },
  data() {
    return {
      openFocus: false,
      isVSelectFocus: false,
      eventType: [],
      form: {
        createName: '',
        sourceInfo: '',
        addrInfo: '',
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
    getEventTypes() {
      this.eventType = []
      getDictBasicInfo({
        queryList: [
          {
            moduleId: '1',
            childModuleId: '2',
            dictId: '27'
          }
        ]
      }).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          data[0] && data[0].attr.forEach(item => {
            this.eventType.push({
              label: item.data,
              value: item.data
            })
          })
          this.form.eventTypeValue = this.eventType[0] && this.eventType[0].value
        }
      })
    },
    openFocusState() {
      console.log(this.selectedObj, 'slelelelelel')
      if (this.selectedObj.isPlay) {
        this.openFocus = true
        this.getChannelInfo()
      }
    },
    getChannelInfo() {
      console.log(this.selectedObj, 'this.selectedObj++++++++++')
      this.form.sourceInfo = this.selectedObj.result.name || this.selectedObj.queryInformation.name
      if (this.selectedObj.queryInformation.id) {
        this.form.addrInfo = this.selectedObj.queryInformation.keyPartName + '-' + this.selectedObj.queryInformation.orgName
      } else {
        this.form.addrInfo = this.selectedObj.result.keyPartName + '-' + this.selectedObj.result.orgName
      }
    },
    cancelSub() {
      this.openFocus = false
      // this.form.createName = ''
      this.form.sourceInfo = ''
      this.form.addrInfo = ''
      let eDesc = document.getElementById('input-desc')
      eDesc.value = ''
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
      let eDesc = document.getElementById('input-desc')
      const obj = {
        attention: this.form.sendWarn,
        channelId: this.selectedObj.result.id || this.selectedObj.queryInformation.id,
        action: this.form.eventTypeValue,
        desc: eDesc.value
      }
      eventRecordApi(obj)
        .then(res => {
          if (res.data.code === 0) {
            this.cancelSub()
            this.$messageSuccess('事件记录成功')
          } else {
            this.$messageError(`事件记录失败,失败原因${res.data.message}！`)
          }
        })
        .catch(() => {
          this.$messageError('事件记录失败')
        })
    }
  }
}
</script>
<style lang='less' scoped>
.back-event-record {
  .el-input,
  .el-textarea,
  .el-select {
    width: 200px;
  }
  .el-dialog__wrapper {
    z-index: 100!important;
  }
  #input-desc {
    width: 200px;
    border: 1px solid #E1E1E1;
    border-radius: 5px;
    padding: 5px 10px;
    color: #606266;
    font-size: 12px;
    font-family: Arial;
  }
  .realbtn {
    padding: 0 8px;
    cursor: pointer;
    font-size: 20px;
    color: #333333;
  }
  .disable {
    cursor: not-allowed;
    color: #ccc;
  }
}
</style>
