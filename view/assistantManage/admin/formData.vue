<template>
  <div class="box">
    <div class="header">
      <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <i class="el-icon-location-outline"
             style="float:left;margin-right:6px;"></i>
          <el-breadcrumb-item>协查管理</el-breadcrumb-item>
          <el-breadcrumb-item>协查事件</el-breadcrumb-item>
          <el-breadcrumb-item>查询</el-breadcrumb-item>
          <el-breadcrumb-item>{{isEdit?'修改':'新增'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-button">
        <el-button v-if="!getFormStatus"
                   size="medium"
                   @click="handlerSave">保存</el-button>
        <el-button v-if="!getFormStatus"
                   size="medium"
                   @click="resetForm">重置</el-button>
        <el-button size="medium"
                   @click="handlerRefresh">打印</el-button>
        <el-button v-if="getFormStatus"
                   size="medium"
                   @click="handlerDownload">下载</el-button>
        <el-button size="medium"
                   @click="closeForm">关闭</el-button>
      </div>
    </div>
    <el-card class="form"
             shadow="hover">
      <el-row>
        <FormView ref="fromView"
                  :userId="getUserData.userId"></FormView>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import FormView from '../components/FormView.vue'
import { mapGetters } from 'vuex'
import { addTaskApi, editTaskApi } from '../../../http/assistantManage/admin.api'
export default {
  name: 'save',
  components: { FormView },
  data() {
    return {
      userId: null,
      isEdit: false,
    }
  },
  computed: {
    ...mapGetters('assistantManageMenu/admin', ['getUserData', 'getFormStatus']),
  },
  methods: {
    // 保存
    handlerSave() {
      this.$refs.fromView.ruleForm.userId = '578456456456456'
      this.$refs.fromView.ruleForm.type = Number(this.$refs.fromView.ruleForm.type)
      if (!this.isEdit) {
        this.$refs.fromView.ruleForm.startTime = Date.parse(this.$refs.fromView.ruleForm.startTime) / 1000
        this.$refs.fromView.ruleForm.endTime = Date.parse(this.$refs.fromView.ruleForm.endTime) / 1000
        addTaskApi(this.$refs.fromView.ruleForm).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              message: '新增成功',
              type: 'success',
            })
            this.closeForm()
          } else {
            this.$message.error('新增失败')
          }
        })
      } else {
        this.$refs.fromView.ruleForm.startTime = this.$refs.fromView.ruleForm.startTime / 1000
        this.$refs.fromView.ruleForm.endTime = this.$refs.fromView.ruleForm.endTime / 1000
        delete this.$refs.fromView.ruleForm['user']
        editTaskApi(this.$refs.fromView.ruleForm.id, this.$refs.fromView.ruleForm).then((res) => {
          addTaskApi(this.$refs.fromView.ruleForm).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.closeForm()
            } else {
              this.$message.error('修改失败')
            }
          })
        })
      }
    },
    // 重置
    resetForm() {
      const eventCode = this.$refs.fromView.ruleForm.eventCode
      this.$refs.fromView.ruleForm = {
        eventName: '',
        type: '1',
        origin: 1,
        remark: '',
        startTime: '',
        endTime: '',
        eventCode: eventCode,
      }
    },
    // 打印
    handlerRefresh() {},
    // 下载
    handlerDownload() {},
    // 关闭
    closeForm() {
      this.$router.push({ name: 'list' })
    },
  },
  mounted() {
    if (Object.keys(this.$route.params).length > 1) {
      this.isEdit = true
      this.$route.params.startTime = this.$route.params.startTime * 1000
      this.$route.params.endTime = this.$route.params.endTime * 1000
      this.$refs.fromView.ruleForm = this.$route.params
    }
    this.formStatus = this.getFormStatus
    // 判断用户角色，查看页面
    if (this.userId && this.formStatus) {
      let { tableData1, tableData2, upLoadList } = this.getFormData
      this.ruleForm = this.getFormData
      this.tableData1 = tableData1
      this.tableData2 = tableData2
      this.upLoadList = upLoadList
    }
  },
  created() {
    console.log(this.getUserData)
  },
}
</script>

<style lang="less" scoped>
.box {
  width: 90%;
  height: 100%;
  .header {
    .header-button {
      display: flex;
      padding: 20px 0px;
      /deep/ .el-button {
        width: 70px;
        height: 30px;
        font-size: 12px;
        color: #000000;
        text-align: center;
        background-color: rgba(255, 255, 255, 1);
        border-color: rgba(22, 155, 213, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.button-box {
  padding-left: 25px;
}
</style>
