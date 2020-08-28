<template>
  <div id="editGroup" v-if='openEditGroup' @click.stop>
    <iframe v-if='openEditGroup' style="z-index:-1;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
    <div class="editGroupBox">
      <div class="editheader">
        <div class="title">轮巡策略</div>
        <div class="flag" @click='cancel'>
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="content">
        <div class="editName">
          <table>收藏夹组名称</table>
          <el-input type="text" class="ivu-input editInput" v-model="groupName" placeholder="请输入..." style="width: 200px;" @blur="validateStr64"></el-input>
          <span class="error-box" v-if="groupError">{{groupError}}</span>
          <!-- <Checkbox v-model="setOpen" style='margin-left: 28px'>&nbsp;将该组设定为轮巡组</Checkbox> -->
        </div>
        <div class="editName">
          <table>轮巡时间间隔</table>
          <el-input type="text" class="ivu-input editInput" v-model="turningTime" placeholder="请输入..." style="width: 200px;" @blur="validataTime">
          </el-input>
          <span style="padding:3px;">秒(10s~3600s)</span>
          <span class="error-box" v-if="timeError">{{timeError}}</span>
        </div>

        <div class="editSet">
          <Transfers :groupListData="groupList" @changeData="changeData"></Transfers>
        </div>

        <div class="editBtnBox">
          <el-button @click='cancel' type="small">取消</el-button>
          <el-button type="small" @click='save'>保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Transfers from './Transfers.vue'
export default {
  name: 'editGroup',
  components: { Transfers },
  props: {
    openEditGroup: {
      type: Boolean,
      default: false
    },
    groupData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      groupName: '',
      // setOpen: false,
      turningTime: 10,
      groupList: [],
      groupListData: [],
      options: {
        showInput: true
      },
      groupError: '',
      timeError: ''
    }
  },
  computed: {
  },
  watch: {
    openEditGroup(val) {
      console.log(val)
      if (!val) { return }
      this.groupName = this.groupData.name
      // this.setOpen = this.groupData.ispolling === 'true'
      this.turningTime = this.groupData.pollingtime
      this.groupList = this.deepCopy(this.groupData.children)
      this.groupListData = this.deepCopy(this.groupData.children)
    },
    turningTime(newval, oldval) {
      if (!/^[0-9]{0,21}$/.test(newval + '')) { this.turningTime = oldval }
    }
  },
  methods: {
    deepCopy(obj) {
      let newobj = (obj && obj.constructor === Array) ? [] : {}
      for (let i in obj) {
        if (typeof obj[i] === 'object') {
          newobj[i] = this.deepCopy(obj[i])
        } else {
          newobj[i] = obj[i]
        }
      }
      return newobj
    },
    changeData(data) {
      this.groupListData = data
    },
    cancel() {
      this.$emit('editCancel')
      this.groupName = ''
      this.groupList = []
      this.timeError = ''
      this.groupError = ''
    },
    save() {
      if (this.timeError || this.groupError) {
        this.$messageWarn('请检查输入，校验不合法')
        return
      }
      const obj = {}
      obj.id = this.groupData.id
      obj.name = this.groupName
      // obj.ispolling = this.setOpen
      obj.pollingtime = this.turningTime
      // obj.creator = this.groupData.creator
      // obj.owners = this.groupData.owners
      obj.rIds = []
      for (const i in this.groupListData) {
        obj.rIds.push(this.groupListData[i].id)
      }
      this.$emit('editSave', obj)
      this.cancel()
    },
    validateStr64(value) {
      value = value.target.value
      if (value.trim().length) {
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
        this.groupError = strlen > 128 ? '名称为0-128个字符或0-64中文' : ''
      } else {
        this.groupError = '不能为空'
      }
    },
    validataTime(value) {
      value = value.target.value
      if (value.trim().length) {
        if (/^[1-9][0-9]*$/.test(value)) {
          if (Number(value) < 10 || Number(value) > 3600) {
            this.timeError = '请输入10s-3600s范围的数值'
          } else {
            this.timeError = ''
          }
        } else {
          this.timeError = '输入不是有效数字'
        }
      } else {
        this.timeError = '不能为空'
      }
    }
  }
}
</script>

<style scoped>
#editGroup {
  width: 620px;
  height: 550px;
  position: absolute;
  background: #fff;
  top: 40vh;
  left: 50vw;
  margin-left: -310px;
  margin-top: -275px;
  z-index: 999999999;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  color: #333;
  border-radius: 8px;
}
iframe {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}
.editGroupBox {
  position: absolute;
  z-index: 99999999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.editheader {
  width: 100%;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #0f2343;
  padding: 0 10px;
  background: #fff;
  border-radius: 8px 8px 0 0;
}
.editheader .title {
  float: left;
}
.editheader .flag {
  float: right;
  cursor: pointer;
}
.content {
  width: 100%;
  height: 514px;
  padding: 15px 12px;
}
.editName {
  margin: 10px 0;
}
.editName table {
  line-height: 26px;
  width: 85px;
  display: inline-block;
}
.editName table.disabled {
  color: #999;
}
.editName .editInput {
  height: 26px;
  /* line-height: 26px; */
}
.editName .error-box {
  font-size: 12px;
  color: #f56c6c;
  padding-right: 10px;
}
.content {
  border-bottom: 1px solid #203863;
}
.editBtnBox {
  width: 135px;
  position: absolute;
  right: 60px;
  bottom: 20px;
  display: flex;
}
.editBtnBox * {
  margin: 0 4px;
}
</style>
