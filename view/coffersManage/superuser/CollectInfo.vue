
<template>
  <div class="collect-container">
    <!-- 授权--信息采集面板 -->
    <div class="info-collect-box">
      <h3>信息采集</h3>
      <div class="content-box">
        <div class="inp-item">
          <span class="inp-label">值班组</span>
          <el-select v-model="collectGroupSelected" placeholder="请选择">
            <el-option
              v-for="item in collectGroupSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="inp-item">
          <span class="inp-label">验证方式</span>
          <el-radio v-model="collectVerifyMode" label="1">{{ collectVerifyModeText }}</el-radio>
        </div>
        <div class="inp-item">
          <div class="inp-label">值班组员</div>
          <el-select v-model="collectGroupMemberSelected" placeholder="请选择">
            <el-option
              v-for="item in collectGroupMemberSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="start-collect-btn">
          <el-button type="primary" @click="collectBtnHandler">开始采集</el-button>
          <span>{{ promptMessageText }}</span>
        </div>
        <div class="inp-item">
          <span class="inp-label"></span>
          <el-input v-model="collectResultInp" v-if="showCollectResultInp" :disabled="true"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDutyGroupApi, getFingerParam } from '../../../http/coffersManage/superuser.api.js'
import common from '../components/common'

export default {
  name: 'superuser',
  mixins: [common],
  props: {
    groupId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      collectGroupSelect: [], // 信息采集-值班组下拉框数据
      collectGroupSelected: '', // 信息采集-值班组下拉框选中项
      collectVerifyMode: '1', // 验证方式单选框
      collectVerifyModeText: '',
      collectGroupMemberSelect: [], // 信息采集-值班组员下拉框数据
      collectGroupMemberSelected: '', // 信息采集-值班组员下拉框选中项
      promptMessageText: '请按验证方式录入您的身份信息',
      collectResultInp: 'MGSAGDSAGDSHGAGDFDSFASF', // 显示采集结果输入框数据
      showCollectResultInp: false // 是否显示采集结果输入框
    }
  },
  created() {
    this.getDutyGroup()
  },
  methods: {
    /**
     * @description: 获取授权值班组下拉框数据
     * @param {type} 无
     * @return: 无
     */
    getDutyGroup() {
      getDutyGroupApi()
        .then((res) => {
          this.collectGroupSelect = []
          let resultData = res.data.data.getDutyGroup
          resultData.forEach(item => {
            this.collectGroupSelect.push({
              value: item.id,
              label: item.groupName,
              dutyTime: item.dutyTime,
              state: item.state,
              groupMember: item.dutyMember === undefined || item.dutyMember === 'isEmpty' ? [] : JSON.parse(item.dutyMember),
              termOfValidity: item.termOfValidity,
              verificationMethod: item.verificationMethod === undefined ? '指纹识别' : item.verificationMethod
            })
          })

          this.collectGroupSelected = this.groupId === '' ? this.collectGroupSelect[0].value : this.groupId
        })
        .catch(() => {})
    },

    /**
     * @description: 开始采集按钮点击事件
     * @param {type} 无
     * @return: 无
     */
    async collectBtnHandler() {
      if (this.collectGroupMemberSelected === '') {
        this.$messageError('请选择组员', '错误')
        return
      }
      if (this.collectVerifyModeText !== '指纹识别') {
        this.$messageError('目前只支持指纹识别方式', '错误')
      }

      let params = {
        MechanismId: '',
        UserId: this.collectGroupMemberSelected,
        UserName: this.collectGroupMemberSelect.find(item => item.value === this.collectGroupMemberSelected).label,
        PasOrId: ''
      }
      let fingerParam = ''
      try {
        fingerParam = await getFingerParam(params)
        fingerParam = fingerParam.data.data.result
      } catch (error) {
        this.$messageError('网络故障，请稍后重试！')
        return
      }

      this.promptMessageText = '正在采集中，请稍等......'
      this.showCollectResultInp = false
      this.collectResultInp = ''
      let oAjax = new XMLHttpRequest()
      oAjax.open('POST', 'http://127.0.0.1:49784/api/finger/create', true)
      oAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      oAjax.onreadystatechange = () => {
        if (oAjax.readyState === 4) {
          if (oAjax.status === 200) {
            JSON.parse(oAjax.response).result === 'OK' ? this.$messageSuccess('指纹录入成功！') : this.$messageError('指纹录入失败，请重试！', '错误')
            this.promptMessageText = '已完成采集'
            this.collectResultInp = JSON.parse(oAjax.response).result === 'OK' ? 'OK' : 'ERROR'
            this.showCollectResultInp = true
          } else {
            this.promptMessageText = '请按验证方式录入您的身份信息'
          }
        }
      }
      oAjax.send(JSON.stringify({id: Number(fingerParam)}))

      this.recordLogFun({OperationType: '信息采集'})
    }
  },
  watch: {
    collectGroupSelected(value) {
      this.collectGroupMemberSelected = ''
      let findGroup = this.collectGroupSelect.find(item => item.value === value)
      this.collectGroupMemberSelect = findGroup.groupMember.map(item => ({value: item.id, label: item.name}))
      this.collectVerifyModeText = findGroup.verificationMethod
    }
  }
}
</script>

<style lang="less" scoped>
.collect-container {
  width: 100%;
  height: 100%;

  // 展示信息采集面板
  .info-collect-box {
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
        .el-select {
          width: 350px;
        }
        .el-input {
          width: 350px;
        }
        .el-radio {
          line-height: 40px;
        }
      }
      .start-collect-btn {
        margin: 30px 0 0 100px;
        span {
          font-size: 14px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
