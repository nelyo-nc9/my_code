<template>
  <div class="form-view">
    <p class="header">协查事件信息表</p>
    <div class="form-table">
      <span class="title">事件信息</span>
      <el-form class="form-data"
               :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               label-width="100px">
        <el-col :span="11">
          <el-form-item label="事件名称">
            <el-input v-model="ruleForm.eventName"
                      :disabled="formStatus"
                      size="mini"
                      class="input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="事件编号">
            <el-input v-model="ruleForm.eventCode"
                      :disabled="true"
                      size="mini"
                      class="input"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="事件类型">
            <el-radio-group v-model="ruleForm.type"
                            :disabled="formStatus"
                            size="mini">
              <el-radio label=1>行内协查</el-radio>
              <el-radio label=2>行外协查</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="协查原因">
            <el-select v-model="ruleForm.origin"
                       :disabled="formStatus"
                       size="mini"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="查询事项">
            <el-input type="textarea"
                      v-model="ruleForm.remark"
                      :disabled="formStatus"
                      size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="协查开始时间">
            <el-date-picker v-model="ruleForm.startTime"
                            type="date"
                            placeholder="选择日期"
                            :disabled="formStatus"
                            size="mini"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="协查结束时间">
            <el-date-picker v-model="ruleForm.endTime"
                            size="mini"
                            type="date"
                            :disabled="formStatus"
                            placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="文件上传">
            <el-upload class="upload-demo"
                       action=""
                       :http-request="handleRequest"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :before-remove="beforeRemove"
                       :file-list="fileList"
                       :limit='2'>
              <el-button size="small"
                         type="primary">上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="list">
        <el-row>
          <el-col>
            <span class="title">人员列表</span>
            <el-button class="button"
                       v-if="!formStatus"
                       type="primary"
                       size="mini"
                       @click="getUserList">选择</el-button>
          </el-col>
          <el-col>
            <el-table :data="tableData1"
                      style="width: 100%">
              <el-table-column prop="name"
                               label="姓名"
                               align="center" />
              <el-table-column prop="account"
                               label="用户名"
                               align="center" />
              <el-table-column prop="organization"
                               label="所属机构"
                               align="center" />
              <el-table-column prop="section"
                               label="所属部门"
                               align="center" />
              <el-table-column prop="section"
                               label="用户类别"
                               align="center" />
              <el-table-column prop="section"
                               label="用户状态"
                               align="center" />
              <el-table-column prop="job"
                               label="职务"
                               align="center" />
              <el-table-column prop="section"
                               label="用户类型"
                               align="center" />
              <el-table-column prop="section"
                               label="角色"
                               align="center" />
              <el-table-column prop="phone"
                               label="移动电话"
                               align="center" />
              <el-table-column prop="phone"
                               label="办公电话"
                               align="center" />
            </el-table>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col>
            <span class="title">资源列表</span>
          </el-col>
          <el-col>
            <el-table :data="tableData2"
                      style="width: 100%"
                      @cell-click="selectCell">
              <el-table-column prop="name"
                               label="视频资源名称"
                               align="center" />
              <el-table-column prop="account"
                               label="所属重点部位"
                               align="center" />
              <el-table-column prop="organization"
                               label="所属机构"
                               align="center" />
              <el-table-column prop="validity1"
                               v-if="formStatus"
                               label="标记时间"
                               width="180"
                               align="center" />
              <el-table-column prop="job"
                               v-if="formStatus"
                               label="备注"
                               align="center" />
              <el-table-column prop="validity2"
                               v-if="formStatus"
                               label="截图时间"
                               width="180"
                               align="center" />
            </el-table>
          </el-col>
        </el-row>
      </div>
      <el-dialog title="查看录像"
                 :visible.sync="centerDialogVisible1"
                 :close-on-click-modal="false"
                 width="30%"
                 center>
        <span>需要注意的是内容是默认不居中的</span>
      </el-dialog>
      <el-dialog title="查看截图"
                 :visible.sync="centerDialogVisible2"
                 :close-on-click-modal="false"
                 width="30%"
                 center>
        <span>需要注意的是内容是默认不居中的</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { uploadApi } from '../../../http/assistantManage/admin.api'
export default {
  name: 'FormView',
  props: {
    userId: String
  },
  data() {
    return {
      ruleForm: {
        saveFile: [],
        eventName: '',
        type: '1',
        eventCode: '',
        origin: 1,
        remark: '',
        startTime: '',
        endTime: ''
      }, // 协查信息表数据
      rules: {},
      options: [
        {
          value: 1,
          label: '审计'
        },
        {
          value: 2,
          label: '风险'
        },
        {
          value: 3,
          label: '内控'
        },
        {
          value: 4,
          label: '其他'
        }
      ],
      tableData1: [], // 人员列表数据
      tableData2: [], // 资源列表数据
      fileList: [],
      formStatus: false, // 点击查看按钮，控制显示输入框内容，不能编辑
      centerDialogVisible1: false,
      centerDialogVisible2: false
    }
  },
  computed: {
    ...mapGetters('assistantManageMenu/admin', ['getFormStatus', 'getFormData'])
  },
  methods: {
    handleRequest(param) {
      let fileObj = param.file
      let obj = {
        fileType: fileObj.type.split('/')[1],
        fileName: fileObj.name,
        fileSize: fileObj.size
      }
      // let fileObj = param.file
      // let form = new FormData()
      // // 文件对象
      // form.append('fileType', 'jpg')
      // form.append('fileName', fileObj.name)
      // form.append('fileSize', fileObj.size)
      // let self = this
      uploadApi(obj).then(res => {
        if (res.data.code === 0) {
          obj.fileUrl = res.data.data.url
          this.ruleForm.saveFile.push(obj)
        }
      })
    },
    ...mapMutations('assistantManageMenu/admin', ['SET_FORM_STATUS']),
    // 获取用户信息
    getUserInfo() {},
    // 清除表单
    resetForm() {
      this.tableData1 = []
      this.tableData2 = []
      this.upLoadList = []
      this.ruleForm = {}
    },
    // 获取人员列表
    getUserList() {},
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 选择单元格
    selectCell(row, column) {
      if (column.property === 'validity1') {
        this.centerDialogVisible1 = true
      }
      if (column.property === 'validity2') {
        this.centerDialogVisible2 = true
      }
    }
  },
  mounted() {
    console.log(this.ruleForm)
    // this.formStatus = this.getFormStatus
    // // 判断用户角色，查看页面
    // // if (this.userId && this.formStatus) {
    // //   let { tableData1, tableData2, upLoadList } = this.getFormData
    // //   this.ruleForm = this.getFormData
    // //   this.tableData1 = tableData1
    // //   this.tableData2 = tableData2
    // //   this.upLoadList = upLoadList
    // // }
  },
  destroyed() {
    this.SET_FORM_STATUS(true)
  }
}
</script>

<style lang="less" scoped>
.header {
  text-align: center;
}
.form-view {
  height: 650px;
  .header {
    font-size: 16px;
    color: #000;
    margin-bottom: 20px;
  }
  .form-table {
    height: calc(~'100% - 41px');
    overflow-y: auto;
    .title {
      font-size: 14px;
      font-weight: 600;
      color: #000;
      display: block;
      margin-bottom: 15px;
    }
    /deep/ .el-form {
      display: block;
      zoom: 1;
      overflow: hidden;
      .el-col {
        .el-form-item {
          margin-bottom: 10px;
          .el-form-item__label {
            font-size: 12px;
            color: #000;
            display: inline-block;
          }
          .el-form-item__content {
            .el-input__inner,
            .el-textarea__inner {
              display: inline-block;
            }
          }
        }
      }
    }
    /deep/ .el-table {
      .el-table__header-wrapper {
        font-size: 12px;
      }
      .el-table__body-wrapper {
        font-size: 12px;
      }
    }
    .input {
      width: 200px;
    }
  }
}
.button {
  margin-bottom: 20px;
}
.up-load {
  display: flex;
}
</style>
<style scoped>
.up-load >>> .el-upload-list {
  margin-left: 30px;
  width: 60%;
  display: inline-block;
}
</style>
