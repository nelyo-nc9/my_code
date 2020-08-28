<template>
    <div class="content">
        <div class="left-tree">
            <OrgTree></OrgTree>
        </div>
        <div class="right-content">
            <div class="top-box">
                <header>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                        <el-breadcrumb-item>消防运行管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动火申请管理</el-breadcrumb-item>
                        <el-breadcrumb-item>动火申请</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
            </div>
            <div class="bodyBox">
                <div class="form-box">
                    <div class="form-content" id="printDom">
                        <h3 class="box-title">动火申请单</h3>
                        <el-form ref="hotNewlyForm" :model="formData" :rules="rulesHotFrom" label-position="right" label-width="120px" size="mini">
                            <div class="form-row">
                                <div class="form-col col3">
                                    <el-form-item label="所属机构" prop="subsystem">
                                        <el-input  v-model="formData.subsystem" ></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="所属重点部位">
                                        <el-input  v-model="formData.subsystem" size="mini"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="申请编号">
                                        <el-input  v-model="formData.subsystem" size="mini"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col col3">
                                    <el-form-item label="申请单位">
                                        <el-input  v-model="formData.subsystem" ></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="申请人">
                                        <el-input  v-model="formData.subsystem" size="mini"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="申请日期">
                                        <el-input  v-model="formData.subsystem" size="mini"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col col3">
                                    <el-form-item label="动火单位">
                                        <el-input  v-model="formData.subsystem" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="施工负责人">
                                        <el-input  v-model="formData.subsystem" size="mini" placeholder="请输入"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="工程类型">
                                        <el-select v-model="formData.subsystem" class="hotNewlySelect">
                                            <el-option v-for="(item,index) in engineerTypeList" :key="index" :label="item.lable" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col col3">
                                    <el-form-item label="动火方式">
                                        <el-select v-model="formData.subsystem" class="hotNewlySelect">
                                            <el-option v-for="(item,index) in getAngryTypeList" :key="index" :label="item.lable" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="开始时间">
                                        <el-date-picker
                                        class="hotNewlyDatePicker"
                                        v-model="formData.subsystem"
                                        type="datetime"
                                        placeholder="开始时间">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="结束时间">
                                         <el-date-picker
                                         class="hotNewlyDatePicker"
                                        v-model="formData.subsystem"
                                        type="datetime"
                                        placeholder="结束时间">
                                        </el-date-picker>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col col3">
                                    <el-form-item label="施工时长">
                                        <el-input  v-model="formData.subsystem" placeholder="施工时间(最长不超过72小时)"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">
                                    <el-form-item label="监护人员">
                                        <el-input  v-model="formData.subsystem" placeholder="请输入(选题)"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col3">

                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col-textarea col1">
                                    <el-form-item label="防火措施">
                                        <el-input type="textarea" v-model="formData.subsystem" ></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col-textarea col1">
                                    <el-form-item label="动火部门">
                                        <el-input type="textarea" v-model="formData.subsystem" ></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col-textarea col1">
                                    <el-form-item label="动火原因">
                                        <el-input type="textarea" v-model="formData.subsystem" ></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col col1 uploaFile"> 
                                    <el-form-item label="附件">
                                        <el-input  v-model="formData.subsystem" ></el-input>
                                        <el-upload action="#"
                                            :on-preview="handlePreview"
                                            :on-exceed="handleExceed"
                                            :headers="uploadParam"
                                            :before-upload="beforeAvatarUpload"
                                            :on-success="handleAvatarSuccess"
                                            :limit="1"
                                            accept
                                            :show-file-list="false"
                                            >
                                            <el-button size="small"
                                                type="primary"
                                            >选择文件</el-button>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-col col3">
                                    <el-form-item label="动火人员">
                                        <el-button type="primary" size="mini" style="margin-right:24px;" @click="addHotWorkPersonnelFuc">新增</el-button>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="form-row addFrom" v-for=" (item,index) in formData.hotWorkPersonnel" :key="index">
                                <div class="form-col col2-5">
                                    <el-form-item label="姓名">
                                        <el-input  v-model="item.name" ></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col2-5">
                                    <el-form-item label="身份证">
                                        <el-input  v-model="item.id" size="mini"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col2-5">
                                    <el-form-item label="电话号">
                                        <el-input  v-model="item.phone" size="mini"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="form-col col2-5">
                                    <el-form-item class="uploadBox" label="作业证件照片">
                                         <div class="uploadUpImg">
                                              <upload></upload>
                                         </div>
                                         <p class="uploadUpImgTitle">点击上传</p>
                                         <i class="el-icon-delete deltetBtn" @click="deleteFromItem(index)"></i>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <div class="form-footer">
                        <el-button  size="mini"  @click="reset">重置</el-button>
                        <el-button size="mini"  v-print="'#printDom'">打印</el-button>
                        <el-button size="mini"  @click="goBlackLIst">返回</el-button>
                        <el-button type="primary" size="mini"  @click="saveAlarmHost">保存</el-button>
                        <el-button size="mini" type="primary" @click="submitToList">提交</el-button>
                    </div>
                </div>
                <div class="floatRight">
                    <div class="floatRightTitle"><span></span>动火须知</div>
                    <div class="floatRightContent">
                        <p>1.动火人员必须按操作规程动火。</p>
                        <p>2.配有灭火器材，动火前清除5米内易燃易爆物品。</p>
                        <p>3.遇有无法清除的易燃物，必须采取防火措施。</p>
                        <p>4.结束后必须对现场进行检查，确认无火灾隐患方可离开。</p>
                        <p>5.监护人员在作业前应察看现场，清除隐患；作业中，应跟班看护；作业后，督促做好清理工作。</p>
                        <p>6.此表须提前一天上报审批。</p>
                        <p>动火等级须知</p>
                        <p>（1）     遇节假日、重保期间或其他特殊情况，动火作业进行升级管理。</p>
                        <p>（2）     办公场所在办公期间严格控制动火施工，营业场所在营业期间禁止动火施工。</p>
                        <p>（3）     易燃易爆危险区域严禁动火，确需动火时须报单位主要负责人审批，落实相关措施，确认无火灾、爆炸危险后方可动火作业。</p>
                        <p>（4）     动火结束，应认真全面检查，确认未遗留火种、无火灾隐患后方可离开。</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import OrgTree from '../../OrgTree'
import upload from '../../components/upload'
import {
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'hotNewlyBuild',
  components: {
    OrgTree,
    upload
  },
  data() {
    return {
      fileList: [],
      updateImg: true,
      uploadParam: {},
      formData: {
        // 表单数据
        subsystem: '',
        netModuleID: '',
        ip: '',
        userName: '',
        service: '',
        detectorNo: '',
        subsystemNo: '',
        orgName: '保定分行',
        deviceType: '',
        code: '',
        deviceModel: '',
        netModuleModel: '',
        keyboardPassword: '',
        port: '',
        password: '',
        domain: '',
        outputNo: '',
        hotWorkPersonnel: [{
          name: '',
          id: '',
          phone: '',
          picUrl: ''
        }]
      },
      rulesHotFrom:[],
      engineerTypeList:[{//工程类型
          vlaue:"1",
          lable:"新建工程"
      },{
          vlaue:"2",
          lable:"改建、扩建、维修工程"
      },{
          vlaue:"3",
          lable:"装饰、装修工程"
      },{
          vlaue:"4",
          lable:"其他"
      }],
      getAngryTypeList:[{//动火方式
          vlaue:"1",
          lable:"电气焊作业"
      },{
          vlaue:"2",
          lable:"现场明火作业"
      },{
          vlaue:"3",
          lable:"切割机作业"
      },{
          vlaue:"4",
          lable:"其他"
      }],
      isOpenDetectorModal: false // 控制探测器添加弹框显隐
    }
  },
  created() {
    this.uploadParam.Authorization = JSON.parse(sessionStorage.getItem('user')).token
  },
  methods: {
    ...mapMutations('fireOperationManagement',
      {
        SET_COMPONENT_ID: 'SET_COMPONENT_ID'}),
    ...mapActions(['addAlarmHost']),
    handlePreview() {
      this.updateImg = false
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = false
          }
        })
      }
    },
    handleEdit(index, row) {
      this.isOpenDetectorModal = true
    },
    // 打印
    skipToList() {
        let template = this.$refs.printDom.innerHTML
        this.do_print(`<div id="printDom-alarm-first">${template}</div>`)
    },
    do_print(
      template // id-str 打印区域的id
    ) {
      //   var el = document.getElementById(id_str)
      var iframe = document.createElement('iframe')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;left: -1000px;top: -1000px;background:#fff')
      let link = document.createElement('LINK')
      link.setAttribute('rel', 'stylesheet')
      link.setAttribute('type', 'text/css')
      link.setAttribute('href', '../../../../../../static/printCss/hotWorkApproval/hotNewlyBuild.less')

      iframe.onload = function() {
        console.log(this.readyState)
      }
      document.body.appendChild(iframe)

      doc = iframe.contentWindow.document
      doc.head.appendChild(link)
      doc.body.innerHTML = template
      doc.close()
      iframe.contentWindow.focus()
      setTimeout(() => {
        iframe.contentWindow.print()
        document.body.removeChild(iframe)
      }, 600)
    },
    // 添加报警主机
    saveAlarmHost() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          console.log(11111111)
        }
      })
      this.addAlarmHost(this.formData).then(res => {
        console.log(res, '添加报警主机:addAlarmHost')
        this.$emit("closeAddOrEditBox");
        this.$notify.success({
          title: '成功',
          message: '添加成功'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    //提交操作
    submitToList(){
         this.$emit("closeAddOrEditBox");
    },
    //添加动火人员form表单
    addHotWorkPersonnelFuc() {
      let hotObj = {
        name: '',
        id: '',
        phone: '',
        picUrl: ''
      }
      this.formData.hotWorkPersonnel.push(hotObj)
    },
    //删除动火人员form表单
    deleteFromItem(index){
        this.formData.hotWorkPersonnel.splice(index,1);
    },
    //返回列表
    goBlackLIst(){
        // this.SET_COMPONENT_ID('hotWorkList')
        this.$emit("closeAddOrEditBox");
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {},
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {},
    // 格式限制
    beforeAvatarUpload(file) {
        var AllImgExt=".jpg|.jpeg|.txt|.pdf|.png|.zip|"; 
        var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）         
        if(AllImgExt.indexOf(extName+"|")==-1)         
        { 
            this.$message.error('该文件类型不允许上传。请上传'+ AllImgExt+" 类型的文件，当前文件类型为"+extName)
            return false; 
        } 
    },
     // 上传成功
    handleAvatarSuccess(res, file, fileList) {
      if (!res) {
        return
      }
    },
    // 重置
    reset() {
      this.$refs['hotNewlyForm'].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
    .content {
        width: 100%;
        height: 100%;
        display: flex;
        .left-tree {
            width: 240px;
            border-right: 1px solid #e1e1e1;
        }
        .right-content {
            font-size: 14px;
            padding: 0 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            .top-box {
                .button-box {
                    margin: 18px 0;
                }
            }
            .bodyBox {
                width: 100%;
                height: 100%;
                display: flex;
                font-size: 12px;
                .form-box {
                    // border: 1px solid #f2f2f2;
                    flex: 1;
                    overflow-y: auto;
                    .form-content {
                        width: 100%;
                        padding: 10px;
                        font-size: 12px;
                        .form-row {
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            .form-col {
                                line-height: 40px;
                                height: 40px;
                            }
                            .form-col-textarea {
                                height: 60px;
                            }
                            .col3 {
                                width: 30%;
                            }
                            .col2-5 {
                                width: 25%;
                            }
                            .col1 {
                                width: 100%;
                            }
                        }
                    }
                    .form-footer {
                        margin-top: 12px;
                        width: 100%;
                        text-align: center;
                    }
                    .box-title {
                        position: relative;
                        height: 42px;
                        line-height: 42px;
                        color: #606266;
                        text-align: center;
                        i {
                            position: absolute;
                            top: 50%;
                            left: 100px;
                            transform: translateY(-50%);
                        }
                        &::after {
                            /*display: block;*/
                            /*content: '';*/
                            /*border-top: 1px solid #e1e1e1;*/
                            /*width: calc(~'100% - 120px');*/
                            /*margin-left: 120px;*/
                            /*margin-top: -12px;*/
                        }
                    }
                }
                .floatRight {
                    width: 200px;
                    // height: 100%;
                    margin: 10% 20px;
                    padding: 10px;
                    background: #eee;
                }
                .floatRightContent{
                    background: #fff;
                    border: 1px #ccc solid;
                    padding: 5px;
                    border-radius: 10px;
                }
                .floatRightTitle{
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                }
                .floatRightTitle span{
                    display: inline-block;
                    width: 3px;
                    height: 15px;
                    margin-right: 8px;
                    background: rgba(81, 81, 81, 1);
                }
            }
            .pointer {
                cursor: pointer;
                display: inline-block;
                width: 120px;
            }
        }
        .list-header {
            text-align: right;
            i {
                cursor: pointer;
                margin-right: 6px;
            }
        }
        .uploadBox{
            position: relative;
        }
        .uploadUpImg{
            position: absolute;
            top: 0;
            left: 0;
            z-index: 33;
            width: 50px;
            opacity: 0;
        }
        .uploadUpImgTitle{
            position: absolute;
            top: 0;
            color: rgb(152, 142, 227);
            left: 0;
            z-index: 22;
            border-bottom: 1px rgb(152, 142, 227) solid;
        }
        .uploadUpImg:hover{
            cursor: pointer;
        }
        .deltetBtn{
            position: absolute;
            top: 8px;
            left: 70px;
            z-index: 22;
            font-size: 20px;
        }
        .deltetBtn:hover{
            cursor: pointer;
        }
    }
     @media print {
        .bodyBox {
            width: 100%;
            height: 100%;
            display: flex;
            font-size: 12px;
        }
        .form-box {
            // border: 1px solid #f2f2f2;
            flex: 1;
            overflow-y: auto; 
        }
        .form-content {
            width: 100%;
            padding: 10px;
            font-size: 12px;
        }
        .form-footer {
            margin-top: 12px;
            width: 100%;
            text-align: center;
        }
        .form-row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .form-row .form-col {
            line-height: 40px;
            height: 40px;
        }
        .form-row .form-col-textarea {
            height: 60px;
        }
        .form-row .col3 {
            width: 30%;
        }
        .form-row .col3 div,.form-row .col1 div,.form-row .col2-5 div{
            display: flex;
            align-items: center;
            justify-content: start !important;
        }
        .form-row .col3 div div,.form-row .col3 div button,.form-row .col1 div div,.form-row .col2-5 div div{
            margin-left: -80px !important;
        }
        .form-row .col3 div label,.form-row .col1 div label,.form-row .col2-5 div label{
            // text-align: right;
            width: 50px !important;
        }
        .addFrom{
            display: flex;
            justify-content: start !important;
            margin-left: 40px !important;
        }
        .form-row .col2-5 {
            width: 25vw;
        }
        .form-row .col1 {
            width: 100%;
        }
        .form-row .col3 div div .el-input,.form-row .col3 div div {
            width: 300px !important;
        }
        .el-select,.form-row .col2-5 div div .el-input{
            width: 200px !important;
        }
        // .form-row .col1 div div{
        //     width: 80vw !important;
        // }
        .form-row .col1 div div .el-textarea{
            width: 87vw !important;
        }
        .textarea{
            width: 100%;
        }
        .box-title {
            position: relative;
            height: 42px;
            line-height: 42px;
            color: #606266;
            text-align: center;
        }
        .box-title i {
            position: absolute;
            top: 50%;
            left: 100px;
            transform: translateY(-50%);
        }
        .floatRight {
            width: 200px;
            // height: 100%;
            margin: 10% 20px;
            padding: 10px;
            background: #eee;
        }
        .floatRightContent{
            background: #fff;
            border: 1px #ccc solid;
            padding: 5px;
            border-radius: 10px;
        }
        .floatRightTitle{
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        .floatRightTitle span{
            display: inline-block;
            width: 3px;
            height: 15px;
            margin-right: 8px;
            background: rgba(81, 81, 81, 1);
        }
        .list-header {
            text-align: right;
            i {
                cursor: pointer;
                margin-right: 6px;
            }
        }
        .uploadBox{
            position: relative;
        }
        .uploadUpImg{
            position: absolute;
            top: -15px;
            left: -90px;
            z-index: 33;
            width: 50px;
            opacity: 0;
        }
        .uploadUpImgTitle{
            position: absolute;
            top: -15px;
            color: rgb(152, 142, 227);
            left: -90px;
            z-index: 22;
            width: 50px;
            border-bottom: 1px rgb(152, 142, 227) solid;
        }
        .uploadUpImg:hover{
            cursor: pointer;
        }
        .deltetBtn{
            position: absolute;
            top: -8px;
            left: 0px;
            z-index: 22;
            font-size: 20px;
        }
        .deltetBtn:hover{
            cursor: pointer;
        }
     }
</style>
<style lang="less">
    .content {
        .right-content {
            .form-box {
                .left-form,
                .right-form {
                    .el-form-item--mini.el-form-item {
                        margin-bottom: 0;
                    }
                    .el-form-item__label {
                        border: 1px solid #fff;
                        background: #f2f2f2;
                    }
                }
            }
        }
    }
</style>
<style>
    .hotNewlySelect,.hotNewlyDatePicker{
        width: 100% !important;
    }
    .uploadUpImg input{
        width: 50px;
    }
    .uploaFile .el-form-item__content{
        display: flex;
        align-items: center;
        justify-content: start;
    }
    .uploaFile .el-form-item__content .el-input{
        width: 30%;
    }
</style>