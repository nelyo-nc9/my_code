
<template>
    <div class="page">
        <div class="menuBox">
            <Menu :activeMenu='activeMenu' @addNew='addNew' :isMenuShow='true'></Menu>
        </div>
        <div class="treeBox">
            <Tree></Tree>
        </div>
        <div class="formBox">
            <div class="titleBox">
                <Step secondTitle="维保任务管理" :title="title"></Step>
            </div>
            <div class="detailForm">
                <p class="formTitle">{{title}}维保任务单</p>
                <div class="formNav">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="任务名称" prop="taskName">
                            <el-input v-model="ruleForm.taskName" :disabled="ruleForm.taskNameDisabled"></el-input>
                        </el-form-item>
                        <div class="needFlex">
                            <el-form-item label="所属机构" prop="belong" >
                                <el-select v-model="ruleForm.belong" placeholder="请选择所属机构" disabled style="width:360px">
                                    <el-option label="区域一" value="shanghai" style="width:360px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:360px"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属重点部位">
                                <el-select v-model="ruleForm.belongPart" placeholder="请选择所属重点部位" disabled style="width:360px">
                                    <el-option label="区域一" value="shanghai" style="width:360px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:360px"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="needFlex">
                            <el-form-item label="任务类别" prop="taskType" >
                                <el-select v-model="ruleForm.taskType" :disabled="ruleForm.taskTypeDisabled" placeholder="请选择任务类别" style="width:360px">
                                    <el-option label="区域一" value="shanghai" style="width:360px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:360px"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="维保单位" prop="company">
                                <el-select v-model="ruleForm.company" :disabled="ruleForm.companyDisabled" placeholder="请选择维保单位" style="width:360px">
                                    <el-option label="区域一" value="shanghai" style="width:360px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:360px"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="needFlex">
                            <el-form-item label="联系人" prop="name" >
                                <el-select v-model="ruleForm.name" :disabled="ruleForm.nameDisabled" placeholder="请选择联系人" style="width:360px">
                                    <el-option label="区域一" value="shanghai" style="width:360px"></el-option>
                                    <el-option label="区域二" value="beijing" style="width:360px"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="tel">
                                <el-input v-model="ruleForm.tel" :disabled="ruleForm.telDisabled" style="width:360px"></el-input>
                            </el-form-item>
                        </div>
                        <div class="needFlex">
                            <el-form-item label="开始时间" prop="startTime" >
                                <el-date-picker type="date" placeholder="选择日期" :disabled="ruleForm.startTimeDisabled" v-model="ruleForm.startTime" style="width:360px" ></el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束时间">
                                <el-date-picker type="date" placeholder="选择日期" :disabled="ruleForm.endTimeDisabled" v-model="ruleForm.endTime" style="width:360px"></el-date-picker>
                            </el-form-item>
                        </div>
                        <el-form-item label="维保合同编号">
                            <el-input v-model="ruleForm.number" :disabled="ruleForm.numberDisabled" style="width:360px"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="ruleForm.remark" :disabled="ruleForm.remarkDisabled" type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="formFooter">
                    <div class="item">
                        <div class="title">录入时间</div>
                        <el-input v-model="intoTime" disabled style="width:177px"></el-input>
                    </div>
                    <div class="item">
                        <div class="title">录入机构</div>
                        <el-input v-model="intoCompany" disabled style="width:177px"></el-input>
                    </div>
                    <div class="item">
                        <div class="title">录入人</div>
                        <el-input v-model="intoPerson" disabled style="width:177px"></el-input>
                    </div>
                </div>
                <div class="btnBox">
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                    <el-button type="primary" @click="goback">取消</el-button>
                    <el-button v-show="title !== '确认'"  @click="resetForm">重置</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from './components/menu.vue'
import Step from './components/step.vue'
import Tree from './components/tree.vue'

export default {
  name: '',
  components: {
    Menu,
    Tree,
    Step
  },
  data() {
    return {
      activeMenu: '1-1',
      title: '新建',
      ruleForm: {
        taskName: '',
        belong: '',
        belongPart: '',
        taskType: '',
        name: '',
        tel: '',
        company: '',
        startTime: '',
        endTime: '',
        number: '',
        remark: '',
        taskNameDisabled: false,
        taskTypeDisabled: false,
        companyDisabled: false,
        nameDisabled: false,
        telDisabled: false,
        startTimeDisabled: false,
        endTimeDisabled: false,
        numberDisabled: false,
        remarkDisabled: false
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        belong: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        taskType: [
          { required: true, message: '请选择任务类别', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请选择维保单位', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请选择联系人', trigger: 'change' }
        ],
        tel: [
          { required: true, message: '请选择联系电话', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        ]
      },
      intoTime: '2020-02-20  15:00:00',
      intoCompany: 'xxxxxxxx机构名称',
      intoPerson: '张三'
    }
  },
  methods: {
    addNew(val) {
      if (val === 'addNew') {
        this.activeMenu = '1-1'
        this.title = '新建'
        this.resetForm()
        this.ruleForm.taskNameDisabled = false
        this.ruleForm.taskTypeDisabled = false
        this.ruleForm.companyDisabled = false
        this.ruleForm.nameDisabled = false
        this.ruleForm.telDisabled = false
        this.ruleForm.startTimeDisabled = false
        this.ruleForm.endTimeDisabled = false
        this.ruleForm.numberDisabled = false
        this.ruleForm.remarkDisabled = false
      }
    },
    goback() {
      this.$router.push({name: 'taskManagement'})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.ruleForm.taskName = ''
      this.ruleForm.taskName = ''
      this.ruleForm.belong = ''
      this.ruleForm.belongPart = ''
      this.ruleForm.taskType = ''
      this.ruleForm.name = ''
      this.ruleForm.tel = ''
      this.ruleForm.company = ''
      this.ruleForm.startTime = ''
      this.ruleForm.endTime = ''
      this.ruleForm.number = ''
      this.ruleForm.remark = ''
    }
  },
  created() {
    let query = this.$route.query
    if (query.flag === 'check') {
      this.title = '确认'
      this.activeMenu = ''
      this.ruleForm.taskNameDisabled = true
      this.ruleForm.taskTypeDisabled = true
      this.ruleForm.companyDisabled = true
      this.ruleForm.nameDisabled = true
      this.ruleForm.telDisabled = true
      this.ruleForm.startTimeDisabled = true
      this.ruleForm.endTimeDisabled = true
      this.ruleForm.numberDisabled = true
      this.ruleForm.remarkDisabled = true
    } else if (query.flag === 'reWrite') {
      this.title = '编辑'
      this.activeMenu = ''
    }
  }

}
</script>

<style lang="less" scoped>
    .page {
        width: 100%;
        height: 100%;
        display: flex;
        .treeBox{
        height: 100%;
        background: #fff;
        }
        .formBox{
            margin:7px 0 0 7px;
            padding:17px 24px;
            background: #fff;
            width:100%;
            height:100%;
        }
    }
    .detailForm{
        margin-top:30px;
        width:950px;
        .formTitle{
            width:100%;
            text-align: center;
        }
        .formNav{
            margin-top:15px;
            width:100%;
            background:rgba(245,245,245,1);
            padding:25px 14px;
            .needFlex{
                display: flex;
            }
            .el-form-item{
                margin-bottom: 11px !important;
            }
        }
        .formFooter{
            box-sizing: border-box;
            padding-right:20px;
            margin-top:29px;
            width:950px;
            height:40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(245,245,245,1);
            .item{
                width:310px;
                display: flex;
                align-items: center;
                .title{
                    width:140px;
                    height:33px;
                    text-align: center;
                    line-height: 33px;
                }
            }
        }
        .btnBox{
            margin:30px 0 180px 0;
            width:100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 300px;
        }
    }
</style>
