<template>
  <div class="icon-box">
    <i
      class="realbtn iconfont-ccb ccbshijianjilu"
      :class="{'disable' :!selectedObj.isPlay}"
      @click="openFocusState"
      title="事件记录"
    ></i>
    <el-dialog :visible.sync="openFocus" width="360px"
      :destroy-on-close="true"
      :modal="isNeedModal"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :before-close="cancelSub"
      :show-close="false"
      center>
      <iframe v-if="openFocus" style="z-index:0;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
      <div slot="title">
        <span class="title-span">事件记录</span>
        <i class="el-icon-close close-icon" @click="cancelSub"></i>
      </div>
      <el-form ref="form" style="z-index: 10" :model="form" label-width="80px" size="mini" :rules="rules">
        <el-form-item label="发起人">
          <el-input v-model="form.userName" width="230px" readonly></el-input>
        </el-form-item>
        <el-form-item label="资源信息">
          <el-input v-model="form.channelName" readonly></el-input>
        </el-form-item>
        <el-form-item label="位置信息">
          <el-input v-model="form.location" readonly></el-input>
        </el-form-item>
        <el-form-item label="事件分类">
          <el-select v-model="form.eventType">
            <el-option
              v-for="(item,index) in eventType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <i class="el-icon-delete" @click="deleteEventType"></i> -->
        </el-form-item>
        <!-- <el-form-item>
          <el-input v-model="form.newEventValue" placeholder="新增事件类型"></el-input>
          <i class="el-icon-plus" @click="toAddEventType"></i>
        </el-form-item> -->
        <el-form-item label="事件描述" prop="desc">
          <el-input type="textarea" v-model="form.desc" resize="none"></el-input>
        </el-form-item>
        <el-checkbox label="发送报警消息" v-model="form.sendWarn" name="type"></el-checkbox>
      </el-form>
      <div slot="footer" style="position:relative">
        <el-button type="primary" size="mini" style="margin-right:24px;" @click="submit">保存</el-button>
        <el-button size="mini" @click="cancelSub">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { eventRecode, getDictBasicInfo } from '@src/http/video/videoPreview.api.js'
export default {
  components: {},
  inheritAttrs: false,
  name: 'Attention',
  props: {
    selectedObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isNeedModal: {
      type: Boolean,
      default: true
    }
  },
  created() {
    const userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.form.userName = userInfo.userName || ''
  },
  data() {
     var checkDesc = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 512) {
          return callback(new Error('名称为0-512个字符或0-256中文'))
        } else {
          return callback()
        }
      }
    }
    return {
      openFocus: false,
      isVSelectFocus: false,
      addEType: [],
      eventType: [],
      rules: {
        desc: [
          { validator: checkDesc, trigger: 'blur' }
        ]
      },
      form: {
        userName: '',
        channelName: '',
        location: this.selectedObj.source.keyPartName || '' + '-' + this.selectedObj.source.orgName || '',
        eventType: '',
        newEventValue: '',
        desc: '',
        sendWarn: false
      }
    }
  },
  methods: {
    getEventTypes() {
      this.eventType = []
      let params = {
        queryList: [
          {
            moduleId: '1',
            childModuleId: '2',
            dictId: '27'
          }
        ]
      }
      getDictBasicInfo(params).then(res => {
        let { code, data } = res.data
        if (code === 0) {
          data[0] && data[0].attr.forEach(item => {
            this.eventType.push({
              label: item.data,
              value: item.data
            })
          })
          this.form.eventType = this.eventType[0] && this.eventType[0].label
        }
      })
    },
    openFocusState() {
      if (this.selectedObj.isPlay) {
        this.openFocus = true
        this.form.channelName = this.selectedObj.source.name || ''
        this.form.location = this.selectedObj.source.keyPartName || '' + '-' + this.selectedObj.source.orgName || ''
        this.getEventTypes()
      }
    },
    cancelSub() {
      this.openFocus = false
      // this.form.userName = ''
      this.form.channelName = ''
      this.form.location = ''
    },
    toAddEventType() {
      this.addEType.push({ label: this.form.newEventValue, value: this.form.newEventValue, noDelete: false })
      this.eventType.push({ label: this.form.newEventValue, value: this.form.newEventValue, noDelete: false })
      this.form.newEventValue = ''
    },
    deleteEventType() {
      let _this = this
      this.eventType.forEach((v, i) => {
        if (v.label === _this.form.eventType) {
          if (!v.noDelete) {
            _this.eventType.splice(i, 1)
            _this.form.eventType = ''
          } else {
            console.log('nodelete')
          }
        }
      })
    },
    submit() {
      this.$refs.form.validate((flag) => {
        if (flag) {
          let params = {
            attention: this.form.sendWarn,
            desc: this.form.desc,
            action: this.form.eventType,
            channelId: this.selectedObj.source.id
          }
          eventRecode(params).then(res => {
            if (res.data.code === 0) {
              this.openFocus = false
              this.cancelSub()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.icon-box {
  position: relative;
  display: inline-block;
  i {
    padding: 0 8px;
    font-size: 20px;
  }
  .disable {
    color: #878282;
    cursor: not-allowed;
  }
}
.el-input,
.el-textarea,
.el-select {
  width: 200px;
}
/deep/.el-dialog__header { 
  .title-span {
    font-size: 18px;
  }
  .close-icon {
    float: right;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
