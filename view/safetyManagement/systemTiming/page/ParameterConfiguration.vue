
<template>
<!-- ==================================================参数配置页面============================================= -->
  <div class="page-content">
    <!-- 面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
      <el-breadcrumb-item>系统校时</el-breadcrumb-item>
      <el-breadcrumb-item>校时项配置</el-breadcrumb-item>
      <el-breadcrumb-item>{{titleNa}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="isfalse" class="box-one" id="printContent">
      <div class="btn-group" :v-show="isTure">
        <el-button size="mini" @click="handleSwitch">编辑</el-button>
        <el-button size="mini" v-print="'#printContent'">打印</el-button>
      </div>
      <div class="content-inner">
        <div class="title-name">校时参数查看</div>
        <div class="data-inner">
          <div class="titleNum">
            <span class="title">设备校时并发量</span>
            <span class="num">{{ruleForm.concurrency}}</span>
          </div>
          <div class="titleNum">
            <span class="title">设备校时间隔(s)</span>
            <span class="num">{{ruleForm.inspectInterval}}</span>
          </div>
          <div class="titleNum">
            <span class="title">超时重试次数</span>
            <span class="num">{{ruleForm.retryCount}}</span>
          </div>
          <div class="titleNum">
            <span class="title">定时查询时间</span>
            <span class="num">{{ruleForm.queryTime}}</span>
          </div>
        </div>
      </div>
      <div class="note-tent">备注：仅针对视频子系统</div>
      <div class="people-infor">
        <div>
          <span class="title">录入时间</span>
          <span class="num">{{ruleForm.updatedAt}}</span>
        </div>
        <div>
          <span class="title">录入机构</span>
          <span class="num">{{ruleForm.updatedDept}}</span>
        </div>
        <div>
          <span class="title">录入人</span>
          <span class="num">{{ruleForm.updatedBy}}</span>
        </div>
      </div>
    </div>
    <!-- ==========================================编辑按钮=============================== -->
    <div v-if="isTure" class="box-two" id="printContent2">
      <div class="content-inner">
        <div class="title-name">校时参数编辑</div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" style="label-width='138px' label-height='35px' line-height: 35px;" class="demo-ruleForm" align="center">
          <el-form-item class="form-item-one" label="设备校时并发量" prop="concurrency">
            <el-input v-model="ruleForm.concurrency" class="inp_styles"></el-input>
          </el-form-item>
          <el-form-item class="form-item-one" label="设备校时间隔(s)" prop="inspectInterval">
            <el-input v-model="ruleForm.inspectInterval" class="inp_styles"></el-input>
          </el-form-item>
          <el-form-item label="超时重试次数 " class="form-item-one" prop="retryCount">
            <span>&nbsp;&nbsp;</span>
            <el-input v-model="ruleForm.retryCount"  style="width=''320px"></el-input>
          </el-form-item>
          <!-- <el-form-item label="定时查询时间 " class="form-item-one" prop="queryTime">
            <span>&nbsp;&nbsp;&nbsp;</span>
            <el-input v-model="ruleForm.queryTime"  style="width=''320px"></el-input>
          </el-form-item> -->
           <el-form-item label="定时查询时间" prop="queryTime" class="form-item-one">
                <span>&nbsp;&nbsp;&nbsp;</span>
                <el-time-picker value-format="HH:mm:ss" size="mini" v-model="ruleForm.queryTime" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择"  style="width=''320px">
                </el-time-picker>
            </el-form-item>
        </el-form>
      </div>
      <div class="note-tent">备注：仅针对视频子系统</div>
      <div class="people-infor">
        <div>
          <span class="title">录入时间</span>
          <!-- <span class="num">{{ruleForm.updatedAt}}</span> -->
          <input type="text" :disabled='disabled' style="cursor: not-allowed">
        </div>
        <div>
          <span class="title">录入机构</span>
          <!-- <span class="num">{{ruleForm.updatedDept}}</span> -->
          <input type="text" :disabled='disabled' style="cursor: not-allowed">
        </div>
        <div>
          <span class="title">录入人</span>
          <!-- <span class="num">{{ruleForm.updatedBy}}</span> -->
          <input type="text" :disabled='disabled' style="cursor: not-allowed">
        </div>
      </div>
      <div class="form-footer">
        <!-- <el-button size="mini" @click="handleSave">保存</el-button> -->
        <el-button size="mini" @click="submitForm('ruleForm')">保存</el-button>
        <el-button size="mini" @click="handleReset('ruleForm')">重置</el-button>
        <el-button size="mini" v-print="'#printContent2'">打印</el-button>
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import './print.css';
import { getCorrection, putCorrection } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
export default {
  data() {
    //表单数据校验功能
    const concurrValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('设备校时并发量不能为空'))
      } else {
        if (isNaN(value)) {
          callback(new Error('请输入数字类型值'))
        } else if (value < 1 || value > 1000) {
          callback(new Error('取值范围：1 - 1000'))
        } else {
          callback()
        }
      }
    }
    const inspectIntervalValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('设备校时间隔不能为空'))
      } else {
        if (isNaN(value)) {
          callback(new Error('请输入数字类型'))
        } else if (value < 5 || value > 60) {
          callback(new Error('取值范围：5 - 60'))
        } else {
          callback()
        }
      }
    }
    const countValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      } else {
        if (isNaN(value)) {
          callback(new Error('请输入数字类型'))
        } else if (value < 1 || value > 5) {
          callback(new Error('取值范围：1 - 5'))
        } else {
          callback()
        }
      }
    }
    return {
      disabled : true,
      isTure: false,
      isfalse: true,
      titleNa: '查看',
      ruleForm: {
        // 表单数据数据
        id: '',
        queryTime: '',
        retryCount: '',
        inspectInterval: '',
        concurrency: '',
        updatedBy: '',
        updatedDept: '',
        updatedAt: ''
      },
      //表单数据的方法执行（新增）
      rules:{
        concurrency:[{ required: true, validator: concurrValidator, trigger: 'blur' }],
        inspectInterval:[{ required: true, validator: inspectIntervalValidator, trigger: 'blur' }],
        retryCount:[{ required: true, validator: countValidator, trigger: 'blur' }],
        queryTime:[{ required: true,  message: '请选择定时查询时间', trigger: 'blur' }]
      }

    }

  },
  watch: {},
  computed: {},
  created() {
    this.getCorrectionConfig()
  },
  mounted() { },
  methods: {
    //表单提交的方法
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.handleSave();
          } else {
            return false;
          }
        });
      },
    // 编辑
    handleSwitch() {
      this.isTure = !this.isTure
      this.isfalse = !this.isfalse
      this.titleNa = '编辑'
      this.timer()
    },
    // 保存
    handleSave() {
      this.isTure = !this.isTure
      this.isfalse = !this.isfalse
      this.titleNa = '查看'
      this.timer()
      this.submit()
    },
    // 上传表单
    submit() {
      let params = {
        concurrency: this.ruleForm.concurrency,
        inspectInterval: this.ruleForm.inspectInterval,
        queryTime: this.ruleForm.queryTime,
        retryCount: this.ruleForm.retryCount
      }
      putCorrection(params).then((res) => {
        let result = res.data
        console.log(result)
        if (result.message) {
          this.$messageSuccess('编辑校时参数成功')
        } else {
          this.$messageEeeor('编辑校时参数失败')
        }
      })
    },
    // 关闭
    handleClose() {
      this.isTure = !this.isTure
      this.isfalse = !this.isfalse
      this.titleNa = '查看'
      this.getCorrectionConfig()
    },
    // 重置
    handleReset(ruleForm) {
        this.$refs[ruleForm].resetFields();
        this.getCorrectionConfig()
    },
    // 获取表单信息
    getCorrectionConfig() {
      getCorrection()
        .then(res => {
          let result = res.data
          if (result.code === 0) {
            this.ruleForm = result.data
            this.$messageSuccess('获取设备参数成功')
          } else {
            this.$messageError('获取设备参数失败')
          }
        })
    },
    timer() {
      let newTime = new Date()
      // 以下代码依次是获取当前时间的年月日时分秒
      var year = newTime.getFullYear()
      var month = newTime.getMonth() + 1
      var strDate = newTime.getDate()
      var minute = newTime.getMinutes()
      var hour = newTime.getHours()
      var second = newTime.getSeconds() + 1
      // 固定时间格式
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (hour >= 0 && hour <= 9) {
        hour = '0' + hour
      }
      if (minute >= 0 && minute <= 9) {
        minute = '0' + minute
      }
      if (second >= 0 && second <= 9) {
        second = '0' + second
      }
      var timer = year + '-' + month + '-' + strDate + ' ' + hour + ':' + minute + ':' + second
      this.ruleForm.updatedAt = timer
    }
  }
}
</script>

<style lang="less" scoped>
.page-content {
  .el-breadcrumb {
    margin: 10px;
  }
  .box-one {
    .btn-group {
      margin: 20px 0 20px 60px;
    }
    .content-inner {
      .title-name {
        margin: 60px 0 20px 550px;
        font-size: 14px;
      }
      .el-form {
                width: 923px;
                height: 90px;
                margin: 50px 0 10px 150px;
                font-size: 14px;
                border: 1px solid #ccc;
                .el-form-item {
                  float: left;
                  width: 50%;
                  height: 50%;
              margin: 5px 0 0 0;
        }
        .form-item-one {
          margin: 2px 0 0 0;
        }
      }
      
      .data-inner {
        box-sizing: border-box;
        width: 940px;
        height: 90px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .titleNum {
          // float: left;
          width: 50%;
          height: 50%;
          display: flex;
          border: 1px solid #ccc;
          // margin-right: 10px;
          .title {
            flex: 3;
            background-color: #e1e1e1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ffffff;
          }
          .num {
            flex: 7;
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
          }
        }
      }
    }
    .note-tent {
      margin: 30px 0 0 180px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 100px 0 10px 220px;
      font-size: 12px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
  }
  .box-two {
    margin-top: 115px;
    .btn-group {
      margin: 20px 0 20px 60px;
    }
    .content-inner {
      .title-name {
        margin: 60px 0 20px 550px;
        font-size: 14px;
      }
      .el-form {
        width: 873px;
        height: 68px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        .el-form-item {
          float: left;
          width: 49%;
          height: 48%;
          // margin: 5px 0 0 0;
        }
        .form-item-one {
          margin: 2px 0 0 0;
        }
      }
      .data-inner {
        width: 900px;
        height: 70px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        div {
          float: left;
          width: 50%;
          height: 50%;
          display: flex;
          .title {
            flex: 3;
            background-color: #e1e1e1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ffffff;
          }
          .num {
            flex: 7;
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
          }
        }
      }
    }
    .note-tent {
      margin: 30px 0 0 180px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 100px 0 10px 220px;
      font-size: 12px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
    .form-footer {
      margin: 150px 0 0 470px;
      
    }
  }
}
/deep/ .el-form-item__label {
  background-color: #e1e1e1;
  height: 30px;
  color: #000;
  border-radius: 0;
}
/deep/ .el-input {
  width: 315px;
  .el-input__inner {
    height: 30px;
    border-radius: 0px;
  }
}
/deep/ #printContent2 {
  .content-inner {
    .demo-ruleForm {
      width: 923px;
      height:110px;
      background: #e1e1e1;
      .form-item-one {
        height: 50px;
        .inp_styles {
          width: 315px;
      } 
    }
    .form-item-one:nth-of-type(2){
      margin-left: 18px;
    }
    .form-item-one:nth-of-type(4){
      margin-left: 18px;
    }
  }
}
}
@media print {
  .box-one {
    height: 700px;
    .btn-group {
      display: none;
    }
    .content-inner {
      .title-name {
        margin: 60px 0 20px 550px;
        font-size: 14px;
      }
      .el-form {
        width: 900px;
        height: 68px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        .el-form-item {
          float: left;
          width: 49%;
          height: 48%;
          // margin: 5px 0 0 0;
        }
        .form-item-one {
          margin: 2px 0 0 0;
        }
      }
      .data-inner {
        box-sizing: border-box;
        width: 908px;
        height: 70px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .titleNum {
          // float: left;
          width: 50%;
          height: 50%;
          display: flex;
          border: 1px solid #ccc;
          .title {
            flex: 3;
            background-color: #e1e1e1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ffffff;
          }
          .num {
            flex: 7;
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
          }
        }
      }
    }
    .note-tent {
      margin: 30px 0 0 180px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 100px 0 10px 220px;
      font-size: 12px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
  }

  .box-two {
    margin-top: 115px;
    .btn-group {
      margin: 20px 0 20px 60px;
    }
    .content-inner {
      .title-name {
        margin: 60px 0 20px 550px;
        font-size: 14px;
      }
      .el-form {
        width: 873px;
        height: 68px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        .el-form-item {
          float: left;
          width: 49%;
          height: 48%;
          // margin: 5px 0 0 0;
        }
        .form-item-one {
          margin: 2px 0 0 0;
        }
      }
      .data-inner {
        width: 900px;
        height: 70px;
        margin: 50px 0 10px 150px;
        font-size: 14px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        div {
          float: left;
          width: 50%;
          height: 50%;
          display: flex;
          .title {
            flex: 3;
            background-color: #e1e1e1;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ffffff;
          }
          .num {
            flex: 7;
            display: flex;
            align-items: center;
            margin-left: 10px;
            font-size: 12px;
          }
        }
      }
    }
    .note-tent {
      margin: 30px 0 0 180px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 100px 0 10px 220px;
      font-size: 12px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      div {
        float: left;
        width: 33.33%;
        height: 100%;
        display: flex;
        .title {
          flex: 3;
          background-color: #e1e1e1;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ffffff;
        }
        .num {
          flex: 7;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
      }
    }
    .form-footer {
      display: none;
    }
  }
}
/deep/.el-form-item__error {
  z-index: 666;
}
</style>
