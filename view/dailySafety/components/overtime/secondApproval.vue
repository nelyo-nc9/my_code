<template>
  <div id="secondApproval">
    <div class="top">
      <!-- 面包屑 -->
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>加班管理</el-breadcrumb-item>
        <el-breadcrumb-item>施工加班管理</el-breadcrumb-item>
        <el-breadcrumb-item>待审批列表</el-breadcrumb-item>
        <el-breadcrumb-item>审批</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="btns">
      <el-button size="mini" v-print="'#contentinfo'">
        <i class="el-icon-printer"></i>
        打印
      </el-button>
      <el-button size="small" @click="isflow = true">查看流程</el-button>
    </div>
    <!--表格区域-->
    <div class="main" id="contentinfo">
      <div class="main-box">
        <div class="box-title">{{ listTitle }}</div>
        <div class="main-box-center">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">
                <span>所属机构</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="options.departmentId"></el-input>
              </td>
              <td class="box-cell-title">
                <span>所属重点部位</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-input">
                <el-input v-model="options.departmentChild"></el-input>
              </td>
              <td class="box-cell-title">
                <span>申请编号</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-input">
                <el-input
                  maxlength="50"
                  v-model="options.applyNumber"
                  :class="{ 'input-red': ruleResObj['serial'] }"
                  @blur="changeInput('serial')"
                ></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">施工单位</td>
              <td class="box-cell-input">
                <el-input
                  v-model="options.applyMent"
                  maxlength="20"
                  :class="{ 'input-red': ruleResObj['name'] }"
                  @blur="changeInput('name')"
                ></el-input>
              </td>
              <td class="box-cell-title">施工区域</td>
              <td class="box-cell-input">
                <el-input
                  v-model="options.applyPeople"
                  maxlength="10"
                  :class="{ 'input-red': ruleResObj['telephone'] }"
                  @blur="changeInput('telephone')"
                ></el-input>
              </td>
              <td class="box-cell-title">施工时间</td>
              <td class="box-cell-input">
                <el-input
                  v-model="options.phone"
                  maxlength="15"
                  :class="{ 'input-red': ruleResObj['mobile'] }"
                  @blur="changeInput('mobile')"
                ></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>施工事项</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-input" colspan="5">
                <el-input
                  v-model="options.applyMsg"
                  maxlength="200"
                  :class="{ 'input-red': ruleResObj['address'] }"
                  @blur="changeInput('address')"
                ></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title">
                <span>附件</span>
              </td>
              <td class="box-cell-input" align="center" colspan="5" style="border-top:1px solid #eee;">
                <el-upload
                  action="xxx://"
                  class="upload-demo"
                  v-show="isListStatus === '1'"
                  v-model="options.articlesFile"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                  <el-button v-if="isListStatus === '1'" size="samll" style="font-size:12px;" type="text">点击上传</el-button>
                  <el-button v-else size="samll" style="font-size:12px;" type="text">点击浏览</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title" :rowspan="peopleIndex">
                <span>施工人员</span>
                <i
                  class="el-icon-plus"
                  v-if="isListStatus === '1'"
                  @click="addPeople('people', options.peopleInfo)"
                ></i>
              </td>
              <td class="box-cell-title">
                <span>人员姓名</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-title">
                <span>身份证号</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-title">
                <span>联系电话</span>
                <span style="color: red">*</span>
              </td>
              <td class="box-cell-title" :colspan="isListStatus !== '1' ? 2 : 1">
                <span>人员照片</span>
              </td>
              <td class="box-cell-title" v-if="isListStatus === '1'">
                <span>操作</span>
              </td>
            </tr>
            <tr v-for="(item, index) in options.peopleInfo" :key="index">
              <td class="box-cell-input">
                <el-input v-model="item.name" :disabled="isListStatus !== '1'" maxlength="10"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="item.number" :disabled="isListStatus !== '1'" maxlength="20"></el-input>
              </td>
              <td class="box-cell-input">
                <el-input v-model="item.phone" :disabled="isListStatus !== '1'" maxlength="15"></el-input>
              </td>
              <td class="box-cell-input" align="center" :colspan="isListStatus !== '1' ? 2 : 1">
                <el-upload
                  action=""
                  class="avatar-uploader"
                  :show-file-list="true"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </td>
              <td class="box-cell-input" align="center" style="border-left:1px solid #eee;" v-if="isListStatus === '1'">
                <el-button style="font-size:12px;" type="text" @click="deleteRow('people', index, options.peopleInfo)"
                  >删除</el-button
                >
              </td>
            </tr>
          </table>
        </div>
        <div class="main-box-footer">
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">录入时间</td>
              <td class="box-cell-input">
                <el-input v-model="options.enterTime" disabled></el-input>
              </td>
              <td class="box-cell-title">录入机构</td>
              <td class="box-cell-input">
                <el-input v-model="options.enterMent" disabled></el-input>
              </td>
              <td class="box-cell-title">录入人</td>
              <td class="box-cell-input">
                <el-input v-model="options.enterPeople" disabled></el-input>
              </td>
            </tr>
          </table>
        </div>
        <div
          class="main-box-center"
        >
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">审批意见</td>
              <td class="box-cell-input" colspan="7">
                <el-input
                  v-model="options.approvalText"
                  maxlength="200"
                ></el-input>
              </td>
            </tr>
          </table>
        </div>
        <div
          class="main-box-bottom"
          style="margin-top:20px;"
          align="center"
        >
        <template v-if="isListStatus === '1' || isListStatus === '2'">
          <el-button size="small" type="primary" @click="approvalSubmit('同意')">同意</el-button>
          <el-button size="small" @click="dialogVisible = true">取消</el-button>
          <el-button size="small" @click="clickReject">驳回</el-button>
        </template>
          <template v-if="isListStatus === '1'">
            <el-button size="small" type="primary" @click="clickSubmit('保存')">保存</el-button>
            <el-button size="small" type="primary" @click="clickSubmit('提交')">提交</el-button>
          </template>
        </div>
        <div
          class="main-box-center"
          style="margin-top:20px;"
        >
          <table cellspacing="0" cellpadding="0">
            <tr>
              <td class="box-cell-title">审批人修订记录</td>
              <td class="box-cell-input" colspan="7">
                <el-input v-model="options.reviseInfo" disabled maxlength="200"></el-input>
              </td>
            </tr>
            <tr>
              <td class="box-cell-title" rowspan="2">审批记录</td>
              <td class="box-cell-title">所属机构</td>
              <td class="box-cell-title">所属部门</td>
              <td class="box-cell-title">姓名</td>
              <td class="box-cell-title">审批时间</td>
              <td class="box-cell-title">审批</td>
              <td class="box-cell-title">审批意见</td>
            </tr>
            <tr v-for="(item, index) in options.reviseList" :key="index">
              <td class="box-cell-input" align="center" maxlength="20">
                <el-input v-model="item.reviseMent" :disabled="isListStatus !== '1'" maxlength="200"></el-input>
              </td>
              <td class="box-cell-input" align="center" maxlength="20">
                <el-input v-model="options.reviseChild" :disabled="isListStatus !== '1'" maxlength="200"></el-input>
              </td>
              <td class="box-cell-input" align="center" maxlength="10">
                <el-input v-model="options.reviseName" :disabled="isListStatus !== '1'" maxlength="200"></el-input>
              </td>
              <td class="box-cell-input" align="center">
                <el-input v-model="options.reviseTime" :disabled="isListStatus !== '1'" maxlength="200"></el-input>
              </td>
              <td class="box-cell-input" align="center" maxlength="20">
                <el-input v-model="options.reviseStatus" :disabled="isListStatus !== '1'" maxlength="200"></el-input>
              </td>
              <td class="box-cell-input" align="center" show-overflow-tooltip maxlength="200">
                <el-input v-model="options.reviseMsg" :disabled="isListStatus !== '1'" maxlength="200"></el-input>
              </td>
            </tr>
          </table>
        </div>
        <div
          style="margin-top:20px;width:30%;"
        >
          <p style="margin-bottom:20px;">审批过程：</p>
          <el-steps :active="1" finish-status="success">
            <el-step title="yyy1"></el-step>
            <el-step title="yyy2"></el-step>
            <el-step title="yyy3"></el-step>
          </el-steps>
        </div>
      </div>
    </div>
    <!--查看流程-->
    <div v-if="isflow">
      <el-dialog title="流程视图" :visible.sync="isflow" width="50%">
        <el-table :data="flowData" style="width: 100%">
          <el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="date" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="address" label="操作内容" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="操作人" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="操作记录" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="date" label="发送时间" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div v-if="dialogVisible">
      <el-dialog title="关闭确认" :visible.sync="dialogVisible" width="30%">
        <span>请确认是否关闭？</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="dialogSave">确 定</el-button>
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { dataRule } from '@src//view/systemMaintenancet/basicInfoManage/common/validateRule.js'
export default {
  name: 'secondApproval',
  props: {
    isShowDetail: {
      type: Boolean,
      default: false
    },
    approvalObj: {
      type: Object,
      default: () => {}
    },
    listTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEdit: false,
      fileList: [],
      topTitle: '',
      formTitle: '',
      isDisabled: true,
      // isListStatus: false,
      isflow: false, // 查看流程
      dialogVisible: false, // 取消弹窗
      status: 1,
      radio: '1', // 默认否
      peopleIndex: 2,
      carIndex: 2,
      options: {
        // 表单数据
        departmentId: 'departmentId',
        departmentChild: 'departmentChild',
        applyNumber: 'applyNumber',
        applyMent: 'applyMent',
        applyPeople: 'applyPeople',
        phone: 'phone',
        applyMsg: 'applyMsg',
        peopleInfo: [
          {
            name: 'name',
            number: 'number',
            phone: '',
            imgUrl: 'imgUrl'
          }
        ],
        articlesDenger: '1', // 1 否  2 是
        articlesFile: 'articlesFile',
        carInfo: [
          {
            carId: 'carId',
            carNumber: 'carNumber',
            carDriver: 'carDriver',
            carPhone: 'carPhone'
          }
        ],
        enterTime: 'enterTime',
        enterMent: 'enterMent',
        enterPeople: 'enterPeople',
        approvalText: 'approvalText',
        reviseInfo: 'reviseInfo',
        reviseList: [
          {
            reviseMent: 'reviseMent',
            reviseChild: 'reviseChild',
            reviseName: 'reviseName',
            reviseTime: 'reviseTime',
            reviseStatus: 'reviseStatus',
            reviseMsg: 'reviseMsg'
          }
        ]
      },
      flowData: [
        {
          index: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          index: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      statusList: [
        { label: '正常营业', value: 1 },
        { label: '撤销', value: 2 },
        { label: '合并', value: 3 },
        { label: '临时停业', value: 4 }
      ],
      orgLevel: 5,
      orgLevelList: [
        { label: '总行', value: 1 },
        { label: '一级分行', value: 2 },
        { label: '二级分行', value: 3 },
        { label: '直管行', value: 4 },
        { label: '县级行', value: 5 },
        { label: '园区', value: 6 }
      ],
      ruleResObj: {
        // 校验结果
        serial: false,
        name: false,
        telephone: false,
        mobile: false,
        email: false,
        address: false,
        functionary: false
      }
    }
  },
  computed: {
    isListStatus() {
      if (this.listTitle === '施工加班申请单详情') {
        return '0'
      } else if (this.listTitle === '施工加班申请单编辑') {
        return '1'
      } else if (this.listTitle === '施工加班申请单审批') {
        return '2'
      } else {
        return '3'
      }
    }
  },
  created() {
    this.ruleWarning = this.$lodash.debounce(this._ruleWarning, 500)
  },
  methods: {
    changeInput(type) {
      // input值校验
      // let res = dataRule(this[type], type, this.ruleWarning)
      // if (!res) {
      //   this.ruleResObj[type] = true
      // } else {
      //   this.ruleResObj[type] = false
      // }
    },
    // 校验失败提示信息
    _ruleWarning(val) {
      this.$messageWarn(val)
    },
    // 提交或保存
    clickSubmit(title) {
      this.$message({
        message: `${title}成功！`,
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.dialogSave()
        }
      })
      // let param = {
      //   name: this.name,
      //   telephone: this.telephone,
      //   mobile: this.mobile,
      //   address: this.address,
      //   status: this.status,
      //   businessHours: this.businessHours,
      //   email: this.email,
      //   startBusiness: this.startBusiness,
      //   closeBusiness: this.closeBusiness,
      //   functionary: this.functionary,
      //   serial: this.serial,
      //   kind: this.orgLevel,
      //   parentId: this.parentSerial
      // }
      // let content = {
      //   'departmentId': '所属机构',
      //   'departmentChild': '所属重点部位',
      //   'applyNumber': '申请编号',
      //   'applyMsg': '施工事项'
      // }
      // let keyNameObj = {
      //   serial: '机构编号',
      //   name: '机构中文简称',
      //   telephone: '固定电话',
      //   mobile: '移动电话',
      //   email: '电子邮件',
      //   address: '机构地址',
      //   functionary: '机构负责人名称'
      // }
      // if (this.listTitle === '编辑') {
      //   let eParam = {
      //     id: this.editData.id,
      //     org: param
      //   }
      //   for (let key in this.ruleResObj) {
      //     if (this.ruleResObj[key]) {
      //       this.ruleWarning(`${keyNameObj[key]}格式错误，请重新输入！`)
      //       return
      //     }
      //   }
      //   // orgEditApi(eParam)
      //   //   .then(res => {
      //   //     if (res.data.code === 0) {
      //   //       this.$emit('orgTreeRefresh')
      //   //       this.$messageSuccess(`${this.componentTitle}成功！`, '成功')
      //   //       this.dialogSave()
      //   //     } else {
      //   //       console.log(res)
      //   //       this.$messageError(`${this.componentTitle}失败，原因：${res.data.message}`, '错误')
      //   //     }
      //   //   })
      //   //   .catch(err => {
      //   //     console.log(err)
      //   //     this.$messageError(`${this.componentTitle}失败，请稍后重试！`, '错误')
      //   //   })
      // } else {
      //   for (var k in content) {
      //     console.log(k, 'sad')
      //     if (!this.options[k]) {
      //       this.ruleWarning(`${content[k]}不能为空！`)
      //       return
      //     }
      //     if (!/^\d+$/.test(this.options[k])) {
      //       this.ruleWarning(`${content[k]}只能输入数字，请重新输入！`)
      //       return
      //     }
      //   }
      //   console.log(this.serial, '1234545')
      //   // if (!this.options.applyNumber) {
      //   //   this.ruleWarning('机构编号不能为空！')
      //   //   return
      //   // }
      //   // if (!/^\d+$/.test(this.serial)) {
      //   //   this.ruleWarning('机构编号只能输入数字，请重新输入！')
      //   //   return
      //   // }
      //   // if (!this.name) {
      //   //   this.ruleWarning('机构中文简称不能为空！')
      //   //   return
      //   // }
      //   for (let key in this.ruleResObj) {
      //     if (this.ruleResObj[key]) {
      //       this.ruleWarning(`${keyNameObj[key]}错误，请重新输入！`)
      //       return
      //     }
      //   }
      //   // orgCreatApi(param)
      //   //   .then(res => {
      //   //     if (res.data.code === 0) {
      //   //       this.$emit('orgTreeRefresh')
      //   //       this.$messageSuccess(`${this.listTitle}成功！`, '成功')
      //   //       this.dialogSave()
      //   //     } else {
      //   //       console.log(res)
      //   //       this.$messageError(`${this.listTitle}失败，原因：${res.data.message}`, '错误')
      //   //     }
      //   //   })
      //   //   .catch(err => {
      //   //     console.log(err)
      //   //     this.$messageError(`${this.listTitle}失败，请稍后重试！`, '错误')
      //   //   })
      // }
    },
    dialogSave() {
      this.dialogVisible = false
      this.$emit('update:isShowDetail', false)
    },
    cancle() {
      this.$emit('update:isShowDetail', false)
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      res.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传文件类型判断
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
    // 添加行
    addPeople(rowIndex, list) {
      console.log(rowIndex, list)
      if (rowIndex === 'people') {
        list.push({
          name: 'name',
          number: 'number',
          phone: 'phone',
          imgUrl: 'imgUrl'
        })
      } else {
        list.push({
          carId: 'carId',
          carNumber: 'carNumber',
          carDriver: 'carDriver',
          carPhone: 'carPhone'
        })
      }
      rowIndex === 'people' ? ++this.peopleIndex : ++this.carIndex
    },
    // 审批驳回
    clickReject() {
      this.$confirm('是否驳回申请?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // row.splice(index, 1)
          this.$message({
            type: 'success',
            message: '驳回成功!',
            duration: 1500,
            onClose: () => {
              this.dialogSave()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消驳回',
            duration: 1500
          })
        })
    },
    // 删除行
    deleteRow(rowIndex, index, rows) {
      console.log(index, rows)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          rows.splice(index, 1)
          rowIndex === 'people' ? --this.peopleIndex : --this.carIndex
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 审批提交
    approvalSubmit() {
      this.$message({
        message: '审批成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          this.dialogSave()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
#secondApproval {
  height: 100%;
  .btns {
    margin: 10px;
  }
  .main {
    margin: 10px 0;
    width: 100%;
    .main-box {
      padding: 20px;
      width: 80%;
      margin: 0 auto;
      .box-title {
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 18px;
      }
      .main-box-center {
        border: 1px solid #ddd;
        padding: 1px;
        width: 100%;
        table {
          width: 100%;
          height: 100%;
          tr {
            .box-cell-title {
              height: 36px;
              width: 15%;
              background: #eee;
              text-align: center;
              border: 0.5px solid #ddd;
            }
            .box-cell-input {
              // width: 35%;
              height: 36px;
              .el-radio__label {
                font-size: 12px;
              }
              .avatar-uploader {
                .el-upload {
                  border: 1px dashed #d9d9d9;
                  border-radius: 6px;
                  cursor: pointer;
                  position: relative;
                  overflow: hidden;
                  &:hover {
                    border-color: #409eff;
                  }
                }
                .avatar-uploader-icon {
                  font-size: 18px;
                  color: #8c939d;
                  width: 58px;
                  height: 58px;
                  line-height: 58px;
                  // text-align: center;
                }
                .avatar {
                  width: 58px;
                  height: 58px;
                  display: block;
                }
              }
              /deep/ .el-input__inner {
                height: 36px !important;
                text-align: center;
                font-size: 12px;
              }
              .input-red {
                /deep/ .el-input__inner {
                  border-color: red;
                }
              }
            }
          }
        }
      }
      .main-box-footer {
        padding: 1px;
        // margin-top: 10px;
        border: 1px solid #ddd;
        table {
          width: 100%;
          height: 100%;
          tr {
            .box-cell-title {
              height: 36px;
              width: 10%;
              background: #eee;
              text-align: center;
              border: 0.5px solid #ddd;
            }
            .box-cell-input {
              width: 23.3%;
              height: 36px;
              text-align: center;
              /deep/ .el-input__inner {
                height: 36px !important;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
