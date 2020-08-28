<template>
  <div class="org-manage-create-modify-box">
    <!-- 机构管理--新建/编辑弹窗 -->
    <div class="header">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>基础信息</el-breadcrumb-item>
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{topTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="main">
        <div class="main-box">
          <div class="box-title">{{topTitle}}</div>
          <!-- <div class="main-box-center"> -->
            <div class="form-content up-style" style="display: flex;width: 952px;padding: 14px 10px 10px 10px;font-size: 12px;background: #f5f5f5;">
              <div class="left-form" style="width: 442px;margin-right: 24px;">
                <el-form :rules="rules" ref="addForm1" size="mini" :model="formData" label-position="right" label-width="124px">
                  <el-form-item label="机构编号" required prop="serial">
                    <el-input v-model="formData.serial"></el-input>
                  </el-form-item>
                  <el-form-item label="机构类别" required prop="orgLevel">
                    <el-select v-model="formData.orgLevel" @change="changeOrgLevel" placeholder="请选择" style="width: 318px;">
                      <el-option
                        v-for="item in orgLevelList1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="移动电话" prop="mobile">
                    <el-input v-model="formData.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="机构地址" prop="address">
                    <el-input v-model="formData.address"></el-input>
                  </el-form-item>
                  <el-form-item label="机构状态" prop="status">
                    <el-select v-model="formData.status" @change="changeStatus" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in statusList1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开业日期">
                    <el-date-picker
                      v-model="formData.startBusiness"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="机构负责人名称" prop="functionary">
                    <el-input v-model="formData.functionary"></el-input>
                  </el-form-item>
                  <el-form-item  label="上级机构编码" required prop="parentSerial">
                    <el-input disabled v-model="formData.parentSerial"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right-form" style="width: 442px;">
                <el-form :rules="rules" ref="addForm2" size="mini" :model="formData" label-position="right" label-width="110px">
                  <el-form-item label="机构中文简称" required prop="name">
                    <el-input v-model="formData.name"></el-input>
                  </el-form-item>
                  <el-form-item label="固定电话" prop="telephone">
                    <el-input v-model="formData.telephone"></el-input>
                  </el-form-item>
                  <el-form-item label="电子邮件" prop="email">
                    <el-input v-model="formData.email" type='email'></el-input>
                  </el-form-item>
                  <el-form-item label="开始营业时间" prop="businessHours">
                    <el-date-picker
                      v-model="formData.businessHours"
                      @change='changeBusinessHours'
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="关闭日期">
                    <el-date-picker
                      v-model="formData.closeBusiness"
                      @change='changeCloseBusiness'
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="上级机构名称" required>
                    <el-input disabled v-model.number="formData.parentName"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">
                  <span>机构编号</span>
                  <span style="color: red">  *</span>
                </td>
                <td class="box-cell-input"><el-input v-model="serial" :disabled="isDisabled" :class="{'input-red': ruleResObj['serial']}" @blur="changeInput('serial')"></el-input></td>
                <td class="box-cell-title">
                  <span>机构中文简称</span>
                  <span style="color: red">  *</span>
                </td>
                <td class="box-cell-input"><el-input v-model="name" :class="{'input-red': ruleResObj['name']}" @blur="changeInput('name')"></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">机构类别</td>
                <td class="box-cell-input">
                  <el-select v-model="orgLevel" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in orgLevelList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </td>
                <td class="box-cell-title">固定电话</td>
                <td class="box-cell-input"><el-input v-model="telephone" :class="{'input-red': ruleResObj['telephone']}" @blur="changeInput('telephone')"></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">移动电话</td>
                <td class="box-cell-input"><el-input v-model="mobile" :class="{'input-red': ruleResObj['mobile']}" @blur="changeInput('mobile')"></el-input></td>
                <td class="box-cell-title">电子邮件</td>
                <td class="box-cell-input"><el-input v-model="email" :class="{'input-red': ruleResObj['email']}" @blur="changeInput('email')"></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">机构地址</td>
                <td class="box-cell-input" colspan="3"><el-input v-model="address" :class="{'input-red': ruleResObj['address']}" @blur="changeInput('address')"></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>机构状态</span>
                  <span style="color: red">  *</span>
                </td>
                <td class="box-cell-input">
                  <el-select v-model="status" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </td>
                <td class="box-cell-title">开始营业时间</td>
                <td class="box-cell-input">
                  <el-date-picker
                    v-model="businessHours"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%">
                  </el-date-picker>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">开业日期</td>
                <td class="box-cell-input">
                  <el-date-picker
                    v-model="startBusiness"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%">
                  </el-date-picker>
                </td>
                <td class="box-cell-title">关闭日期</td>
                <td class="box-cell-input">
                  <el-date-picker
                    v-model="closeBusiness"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%">
                  </el-date-picker>
                </td>
              </tr>
              <tr>
                <td class="box-cell-title">机构负责人名称</td>
                <td class="box-cell-input"><el-input v-model="functionary" :class="{'input-red': ruleResObj['functionary']}" @blur="changeInput('functionary')"></el-input></td>
                <td class="box-cell-title">
                  <span>上级机构名称</span>
                  <span style="color: red">  *</span>
                </td>
                <td class="box-cell-input"><el-input v-model="parentName" disabled></el-input></td>
              </tr>
              <tr>
                <td class="box-cell-title">
                  <span>上级机构编码</span>
                  <span style="color: red">  *</span>
                </td>
                <td class="box-cell-input"><el-input v-model="parentSerial" disabled></el-input></td>
              </tr>
            </table> -->
          <!-- </div> -->
          <div class="main-box-footer">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td class="box-cell-title">录入时间</td>
                <td class="box-cell-input"><el-input v-model="updatedAt" disabled></el-input></td>
                <td class="box-cell-title">录入机构</td>
                <td class="box-cell-input"><el-input v-model="updatedDept" disabled></el-input></td>
                <td class="box-cell-title">录入人</td>
                <td class="box-cell-input"><el-input v-model="updatedBy" disabled></el-input></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <el-button size="small" @click="clickSave">保存</el-button>
        <el-button size="small" @click="reset">重置</el-button>
        <el-button size="small" @click="dialogVisible = true">取消</el-button>
      </div>
    </div>
    <div v-if="dialogVisible">
      <el-dialog
        title="关闭确认"
        :visible.sync="dialogVisible"
        width="30%">
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
import { read } from '@src/storage/index.js'
import { orgCreatApi, orgEditApi } from '@src/http/basicInfoManage/orgManage.api'
import { dataRule } from '../common/validateRule'

export default {
  name: 'OrgCreateModify',
  props: {
    componentTitle: {
      type: String,
      default: ''
    },
    editData: {
      type: Object,
      default: () => {}
    },
    nodeData: { // 所属机构信息
      type: Object,
      default: () => {}
    },
    statusArr:{
      type:Array,
      default:()=>{
         return []
      }
    },
    kindArr:{
      type:Array,
      default:()=>{
         return []
      }
    },
  },
  data() {
    return {
      topTitle: '新建机构',
      isDisabled: true,
      dialogVisible: false, // 取消弹窗
      status: 1,
      statusList1: [
        // {label: '正常营业', value: 1},
        // {label: '撤销', value: 2},
        // {label: '合并', value: 3},
        // {label: '临时停业', value: 4}
      ],
      orgLevel: 5,
      orgLevelList1: [
        // {label: '总行', value: 1},
        // {label: '一级分行', value: 2},
        // {label: '二级分行', value: 3},
        // {label: '直管行', value: 4},
        // {label: '县级行', value: 5},
        // {label: '园区', value: 6}
      ],
      formData: {
        serial: '',
        name: '',
        telephone: '',
        mobile: '',
        email: '',
        address: '',
        businessHours: '',
        startBusiness: '',
        closeBusiness: '',
        functionary: '',
        parentId: '',
        parentName: '',
        parentSerial: '',
        updatedAt: '',
        updatedDept: '',
        updatedBy: '',
        orgLevel: 5,
        status: 1
      },
      rules: {
        serial: [
          { required: true, message: '机构编号不能为空' }
        ],
        mobile: [
          {required: true, type: 'string', min: 0, max: 128, message: '0-128个字符' }
        ],
        address: [
          { type: 'string', min: 0, max: 64, message: '0-64个字符' }
        ],
        functionary: [
          { type: 'string', min: 0, max: 64, message: '0-64个字符' }
        ],
        name: [
          { required: true, message: '机构名称不能为空' },
          { type: 'string', min: 0, max: 64, message: '0-64个字符' }
        ],
        email: [
          { type: 'email', message: '邮箱格式有误' }
        ],
        parentName: [
          { required: true, message: '上级机构名称不能为空' }
        ],
        parentSerial: [
          { required: true, message: '上级机构编码不能为空' }
        ],
        telephone: [
          { type: 'string', min: 0, max: 128, message: '0-128个字符' }
        ]
      },
      serial: '',
      name: '',
      telephone: '',
      mobile: '',
      email: '',
      address: '',
      businessHours: '',
      startBusiness: '',
      closeBusiness: '',
      functionary: '',
      parentId: '',
      parentName: '',
      parentSerial: '',
      updatedAt: '',
      updatedDept: '',
      updatedBy: '',
      ruleResObj: { // 校验结果
        serial: false,
        name: false,
        telephone: false,
        mobile: false,
        email: false,
        address: false,
        functionary: false
      },
      dateFlag:true
    }
  },
  watch: {
    'nodeData.id': {
      handler() {
        if (this.componentTitle === '新建机构') {
          console.log(111)
          this.formData.parentId = this.nodeData.id
          this.formData.parentName = this.nodeData.name
          this.formData.parentSerial = this.nodeData.serial
        }
      },
      deep: true
    },
     statusArr:{
      handler(newV){
        this.statusList1=newV
      },
      deep:true
    },
    kindArr:{
      handler(newV){
        this.orgLevelList1=newV
      },
      deep:true
    }
  },
  created() {
    this.orgLevelList1=this.kindArr
    this.statusList1=this.statusArr
    this.topTitle = this.componentTitle
    this.reset()
    this.ruleWarning = this.$lodash.debounce(this._ruleWarning, 500)
  },
  methods: {
    changeOrgLevel(val){
      this.formData.orgLevel=val
    },
    changeStatus(val){
      this.formData.status=val
    },
    //开始时间变化
    changeBusinessHours(val){
      let businessHours = (new Date(val.replace(/\-/g, "/"))).getTime() 
      let currentTime = new Date().getTime() 

      if(businessHours<currentTime){
        this.$message.warning('开始时间不能小于当前时间');
        this.dateFlag=false
      }else{
            this.dateFlag=true
       }
      if(this.closeBusiness){ 
        let closeBusiness = (new Date(this.closeBusiness.replace(/\-/g, "/"))).getTime() 
        if(businessHours>=closeBusiness){
          this.$message.warning('开始时间不能大于结束时间');
          this.dateFlag=false
        }else{
             this.dateFlag=true
          }
      }

    },
    //结束时间变化
    changeCloseBusiness(val){
      let endTime = (new Date(val.replace(/\-/g, "/"))).getTime() 
      let  currentTime  =  new  Date().getTime() 
      if (endTime < currentTime) {      
          this.$message.warning('结束时间不能小于当前时间');
          this.dateFlag=false
      }else{
          this.dateFlag=true
      }

      if (this.businessHours) {
          let startTime = (new Date(this.businessHours.replace(/\-/g, "/"))).getTime()
          if (endTime <= startTime) {
              this.$message.warning('结束时间不能小于开始时间');
              this.dateFlag=false
          }else{
              this.dateFlag=true
          }
      }
    },
    changeInput(type) { // input值校验
      let res = dataRule(this[type], type, this.ruleWarning)
      if (!res) {
        this.ruleResObj[type] = true
      } else {
        this.ruleResObj[type] = false
      }
    },
    _ruleWarning(val) { // 校验失败提示信息
      this.$messageWarn(val)
    },
    clickSave() {
      if(!this.dateFlag){
        this.$message.warning('请输入正确的时间！')
        return;
      }
      this.$refs['addForm1'].validate((valid1) => {
        this.$refs['addForm2'].validate((valid2) => {
          if (valid2 && valid1) {
            let param = {
              name: this.formData.name,
              telephone: this.formData.telephone,
              mobile: this.formData.mobile,
              address: this.formData.address,
              status: this.formData.status,
              businessHours: this.formData.businessHours,
              email: this.formData.email,
              startBusiness: this.formData.startBusiness,
              closeBusiness: this.formData.closeBusiness,
              functionary: this.formData.functionary,
              serial: this.formData.serial,
              kind: this.formData.orgLevel,
              parentId: this.formData.parentSerial
            }
            // let keyNameObj = {
            //   serial: '机构编号',
            //   name: '机构中文简称',
            //   telephone: '固定电话',
            //   mobile: '移动电话',
            //   email: '电子邮件',
            //   address: '机构地址',
            //   functionary: '机构负责人名称'
            // }
            console.log(param,'param')
            if (this.componentTitle === '编辑机构') {
              let eParam = {
                id: this.editData.id,
                org: param
              }
              // for (let key in this.ruleResObj) {
              //   if (this.ruleResObj[key]) {
              //     this.ruleWarning(`${keyNameObj[key]}格式错误，请重新输入！`)
              //     return
              //   }
              // }
              orgEditApi(eParam).then(res => {
                if (res.data.code === 0) {
                  this.$emit('orgTreeRefresh')
                  this.$messageSuccess(`${this.componentTitle}成功！`, '成功')
                  this.dialogSave()
                } else {
                  console.log(res)
                  this.$messageError(`${this.componentTitle}失败，原因：${res.data.message}`, '错误')
                }
              }).catch(err => {
                console.log(err)
                this.$messageError(`${this.componentTitle}失败，请稍后重试！`, '错误')
              })
            } else {
              // if (!this.serial) {
              //   this.ruleWarning('机构编号不能为空！')
              //   return
              // }
              // if (!(/^\d+$/.test(this.serial))) {
              //   this.ruleWarning('机构编号只能输入数字，请重新输入！')
              //   return
              // }
              // if (!this.name) {
              //   this.ruleWarning('机构中文简称不能为空！')
              //   return
              // }
              // for (let key in this.ruleResObj) {
              //   if (this.ruleResObj[key]) {
              //     this.ruleWarning(`${keyNameObj[key]}错误，请重新输入！`)
              //     return
              //   }
              // }
              orgCreatApi(param).then(res => {
                if (res.data.code === 0) {
                  this.$emit('orgTreeRefresh')
                  this.$messageSuccess(`${this.componentTitle}成功！`, '成功')
                  this.dialogSave()
                } else {
                  console.log(res)
                  this.$messageError(`${this.componentTitle}失败，原因：${res.data.message}`, '错误')
                }
              }).catch(err => {
                console.log(err)
                this.$messageError(`${this.componentTitle}失败，请稍后重试！`, '错误')
              })
            }
          }
        })
      })
    },
    reset() {
      if (this.$refs.addForm1 && this.$refs.addForm2) {
        this.$refs.addForm1.resetFields()
        this.$refs.addForm2.resetFields()
      }
      if (this.componentTitle === '编辑机构') {
        this.isDisabled = true
        this.getTableItem(this.editData)
      } else {
        this.isDisabled = false
        this.getTableItem()
      }
    },
    dialogSave() {
      this.dialogVisible = false
      this.$emit('defaultComponent')
    },
    getTableItem(cpEditData) { // 获取table项
      this.formData.serial = cpEditData ? cpEditData.serial : ''
      this.formData.name = cpEditData ? cpEditData.name : ''
      console.log(cpEditData)
      this.formData.orgLevel = cpEditData ? (cpEditData.kind ? Number(cpEditData.kind) :'') : ''
      this.formData.telephone = cpEditData ? cpEditData.telephone : ''
      this.formData.mobile = cpEditData ? cpEditData.mobile : ''
      this.formData.email = cpEditData ? cpEditData.email : ''
      this.formData.address = cpEditData ? cpEditData.address : ''
      this.formData.status = cpEditData ? (cpEditData.status ? Number(cpEditData.status) :'') : ''
      this.formData.businessHours = cpEditData ? cpEditData.businessHours : ''
      this.formData.startBusiness = cpEditData ? cpEditData.startBusiness : ''
      this.formData.closeBusiness = cpEditData ? cpEditData.closeBusiness : ''
      this.formData.functionary = cpEditData ? cpEditData.functionary : ''
      this.formData.parentId = cpEditData ? cpEditData.parentId : ''
      this.formData.parentName = cpEditData ? cpEditData.pid.name : ''
      this.formData.parentSerial = cpEditData ? cpEditData.pid.serial : ''
      this.formData.updatedAt = cpEditData ? cpEditData.updatedAt : ''
      this.formData.updatedDept = cpEditData ? cpEditData.updatedDept : ''
      this.formData.updatedBy = cpEditData ? cpEditData.updatedBy : ''
      if (this.componentTitle === '新建机构') {
        this.formData.parentId = this.nodeData.id
        this.formData.parentName = this.nodeData.name
        this.formData.parentSerial = this.nodeData.serial
        let userInfo = JSON.parse(read('user')) || ''
        this.formData.updatedAt = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        this.formData.updatedDept = userInfo.name
        this.formData.updatedBy = userInfo.orgName
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .org-manage-create-modify-box {
    width: 100%;
    height: 100%;
    padding: 0 20px;
    .header {
      margin-bottom: 10px;
    }
    .content {
      padding: 0 10px;
      width: 1000px;
      .form-content {
        /deep/ .el-input--mini .el-input__inner {
          height: 35px;
        }
        /deep/ .el-form-item__label {
          height: 35px;
          line-height: 35px;
          border: 1px solid #fff;
          background: #f7f2f1;
        }
        /deep/ .el-form-item--mini.el-form-item {
          margin-bottom: 14px
        }
      }
      .el-button {
        width: 80px;
      }
      .main {
        margin: 10px 0;
        width: 100%;
        .main-box {
          padding: 20px;
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
                  width: 35%;
                  height: 36px;
                  /deep/ .el-input__inner {
                    height: 36px!important;
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
            margin-top: 10px;
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
                  /deep/ .el-input__inner {
                    height: 36px!important;
                  }
                }
              }
            }
          }
        }
      }
      .content-bottom {
        text-align: center;
      }
    }
  }
</style>
