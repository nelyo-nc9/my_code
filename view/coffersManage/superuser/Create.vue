<!--
 * @Author: @_@
 * @Date: 2020-06-30 09:43:38
 * @LastEditTime: 2020-08-24 11:55:43
 * @LastEditors: your name
 * @Description: 新建值班组
 * @FilePath: \ccb-client\client\src\view\coffersManage\superuser\Create.vue
-->

<template>
  <div class="create-container">
    <!-- 新建--展示新建值班组 -->
    <div class="create-box">
      <h3>{{ createTitleText }}</h3>
      <div class="content-box">
        <div class="inp-item">
          <span class="inp-label">值班组名称</span>
          <el-input v-model="groupNameInp" placeholder="请输入内容"></el-input>
        </div>
        <div class="inp-item">
          <span class="inp-label">有效期</span>
          <el-radio v-model="usefulLife" label="1">长期有效</el-radio>
          <el-radio v-model="usefulLife" label="2">按日期范围</el-radio>
        </div>
        <div class="inp-item">
          <span class="inp-label">选择日期</span>
          <el-date-picker
            v-model="chooseDateInp"
            type="daterange"
            :disabled="usefulLife === '1'"
            format="yyyy-MM-dd"
            value-format="yyyy/MM/dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="inp-item">
          <span class="inp-label">工作时间</span>
          <el-time-picker
            is-range
            v-model="workTimeInp"
            value-format="HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </div>
      </div>
      <div class="bottom-btn-box" v-if="createTitleText !== '值班组'">
        <el-button size="small" type="primary" @click="createGroupHandler">保存</el-button>
        <el-button size="small" @click="createGroupCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createGroup, moddutyGroupApi, getDutyGroupApi } from '../../../http/coffersManage/superuser.api.js'
import common from '../components/common'

export default {
  name: 'superuser',
  mixins: [common],
  props: {
    createTitleText: { // 新建值班组标题文字
      type: String,
      default: '新建值班组'
    },
    groupId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      groupNameInp: '', // 值班组姓名输入框
      usefulLife: '1', // 有效期单选框
      chooseDateInp: '', // 选择日期输入框
      workTimeInp: '', // 工作时间输入框

      currentDisposeGroup: {}
    }
  },
  async mounted() {
    if (this.groupId !== '') {
      let currentGroup = await getDutyGroupApi()
      currentGroup = currentGroup.data.data.getDutyGroup.find(item => item.id === this.groupId)
      this.currentDisposeGroup = {
        ID: currentGroup.id,
        GroupName: currentGroup.groupName,
        TermOfValidity: currentGroup.termOfValidity,
        DutyTime: currentGroup.dutyTime,
        dutyMember: currentGroup.dutyMember,
        verificationMethod: currentGroup.verificationMethod,
        state: currentGroup.state
      }
    }

    if (JSON.stringify(this.currentDisposeGroup) !== '{}') {
      this.groupNameInp = this.currentDisposeGroup.GroupName
      this.usefulLife = this.currentDisposeGroup.TermOfValidity === '长期' ? '1' : '2'
      this.chooseDateInp = this.currentDisposeGroup.TermOfValidity === '长期' ? '' : this.currentDisposeGroup.TermOfValidity.split('-')
      this.workTimeInp = this.currentDisposeGroup.DutyTime.split('-')
    }
    if (this.createTitleText === '新建值班组') {
      this.groupNameInp = ''
      this.usefulLife = '1'
      this.chooseDateInp = ''
      this.workTimeInp = ''
    }
  },
  methods: {
    /**
     * @description: 新建值班组按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    createBtnHandler() {
      this.createTitleText = '新建值班组'
      this.showButtonBox = false
      this.createGroupCancel(false)
    },
    /**
     * @description: 新建值班组保存按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    createGroupHandler() {
      if (this.groupNameInp.trim() === '') {
        this.$messageError('值班组名称不能为空', '错误')
        return
      }
      if ((this.usefulLife !== '1' && this.chooseDateInp === '') || this.chooseDateInp === null) {
        this.$messageError('日期不能为空', '错误')
        return
      }
      if (this.workTimeInp === '' || this.workTimeInp === null) {
        this.$messageError('工作时间不能为空', '错误')
        return
      }

      if (this.createTitleText === '修改值班组') {
        // 修改值班组接口
        let params = {
          modDutyGroup: {
            ID: this.currentDisposeGroup.ID,
            GroupName: this.groupNameInp,
            TermOfValidity: this.usefulLife === '1' ? '长期' : this.chooseDateInp.join('-'),
            DutyTime: this.workTimeInp.join('-'),
            dutyMember: this.currentDisposeGroup.dutyMember,
            verificationMethod: this.currentDisposeGroup.verificationMethod,
            state: this.currentDisposeGroup.state
          }
        }
        moddutyGroupApi(params)
          .then(res => {
            this.$messageSuccess('修改成功！', '成功')
            this.$emit('updataGroup', params.modDutyGroup)
            // 记录日志 - 值班组管理
            this.recordLogFun({OperationType: '值班组管理'})
            this.$parent.titleText = '值班组'
            this.$parent.showButtonBox = true
          })
          .catch(() => {})
      } else {
        // 新建值班组
        let params = {
          GroupName: this.groupNameInp,
          TermOfValidity: this.usefulLife === '1' ? '长期' : this.chooseDateInp.join('-'),
          DutyTime: this.workTimeInp.join('-')
        }

        createGroup(params)
          .then((res) => {
            this.$messageSuccess('新建成功！', '成功')
            // 记录日志 - 值班组管理
            this.$parent.titleText = '值班组'
            this.$parent.showButtonBox = true
            this.recordLogFun({
              OperationType: '值班组管理',
              action: '编辑',
              operObject: this.groupNameInp,
              description: this.groupNameInp + '新建成功'
            })

            this.currentDisposeGroup = {
              ID: res.data.message,
              GroupName: this.groupNameInp,
              TermOfValidity: this.usefulLife === '1' ? '长期' : this.chooseDateInp.join('-'),
              DutyTime: this.workTimeInp.join('-'),
              dutyMember: '',
              verificationMethod: '',
              state: ''
            }
            this.$emit('updataGroup', this.currentDisposeGroup)
          })
          .catch(() => {
            this.$messageError('保存失败, 请稍后重试！', '错误')
          })
      }
    },
    /**
     * @description: 新建值班组取消按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    createGroupCancel() {
      this.$emit('cancle')
    }
  },
  watch: {
    createTitleText: {
      handler: function(val) {
        if (val === '新建值班组') {
          this.groupNameInp = ''
          this.usefulLife = '1'
          this.chooseDateInp = ''
          this.workTimeInp = ''
        }
      },
      deep: true
    },
    usefulLife(val) {
      if (val === '1') {
        this.chooseDateInp = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.create-container {
  width: 100%;
  height: 100%;
  display: flex;

  // 展示新建值班组
  .create-box {
    width: 800px;
    height: 600px;
    padding: 20px;
    h3 {
      font-size: 14px;
      font-weight: 400;
      text-align: center;
    }
    .content-box {
      width: 100%;
      height: 400px;
      padding: 40px;
      margin: 20px 0;
      border: 1px solid #cccccc;

      .inp-item {
        display: flex;
        margin: 10px 0;
        .inp-label {
          font-size: 14px;
          width: 100px;
          line-height: 40px;
          display: inline-block;
        }
        .el-input {
          width: 350px;
        }
        .el-radio {
          line-height: 40px;
        }
      }
    }
    .bottom-btn-box {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
