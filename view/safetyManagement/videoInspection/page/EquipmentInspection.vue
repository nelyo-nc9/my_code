<template>
  <div class="page-content">
    <!-- 面包屑导航  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
      <el-breadcrumb-item>安防设备管控</el-breadcrumb-item>
      <el-breadcrumb-item>设备巡检</el-breadcrumb-item>
      <el-breadcrumb-item>巡检项配置</el-breadcrumb-item>
      <el-breadcrumb-item>{{titleNa}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="isfalse" class="box-one" id="printContent">
      <div class="btn-group" :v-show="isTure">
        <el-button size="mini" @click="handleSwitch">编辑</el-button>
        <el-button size="mini" v-print="'#printContent'">打印</el-button>
      </div>
      <div class="content-inner">
        <div class="title-name">巡检参数查看</div>
        <div class="data-inner">
          <div class="titleNum">
            <span class="title">设备巡检并发量</span>
            <span class="num">{{ruleForm.concurrency}}</span>
          </div>
          <div class="titleNum">
            <span class="title">设备巡检间隔(s)</span>
            <span class="num">{{ruleForm.interval}}</span>
          </div>
          <div class="titleNum">
            <span class="title">超时重试次数</span>
            <span class="num">{{ruleForm.retryCount}}</span>
          </div>
          <div class="titleNum">
            <span class="title">巡检核对方式</span>
            <span class="num">{{ruleForm.verifyMode}}</span>
          </div>
        </div>
      </div>
      <div class="note-tent">备注：仅针对视频子系统</div>
      <div class="people-infor">
        <div>
          <span class="title">录入时间</span>
          <span class="num">{{ruleForm.updateAt}}</span>
        </div>
        <div>
          <span class="title">录入机构</span>
          <span class="num">{{ruleForm.updateDept}}</span>
        </div>
        <div>
          <span class="title">录入人</span>
          <span class="num">{{ruleForm.updateBy}}</span>
        </div>
      </div>
    </div>
    <div v-if="isTure" class="box-two" id="printContent2">
      <div class="content-inner">
        <div class="title-name">巡检参数编辑</div>
        <el-form size="mini" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="128px" class="demo-ruleForm" align="center">
          <el-form-item class="form-item-one" label="设备巡检并发量" prop="deviceCon">
            <el-input v-model="ruleForm.concurrency"></el-input>
          </el-form-item>
          <el-form-item class="form-item-one" label="设备巡检间隔(s)" prop="intervalTime">
            <el-input v-model="ruleForm.interval"></el-input>
          </el-form-item>
          <el-form-item label="超时重试次数" prop="pingNum">
            <el-input v-model="ruleForm.retryCount"></el-input>
          </el-form-item>
          <el-form-item label="巡检核对方式" prop="RetryNum">
            <el-input v-model="ruleForm.verifyMode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="note-tent">备注：仅针对视频子系统</div>
      <div class="people-infor">
        <div>
          <span class="title">录入时间</span>
          <span class="num">{{ruleForm.updateAt}}</span>
        </div>
        <div>
          <span class="title">录入机构</span>
          <span class="num">{{ruleForm.updateDept}}</span>
        </div>
        <div>
          <span class="title">录入人</span>
          <span class="num">{{ruleForm.updateBy}}</span>
        </div>
      </div>
      <div class="form-footer">
        <el-button size="mini" @click="handleSave">保存</el-button>
        <el-button size="mini" @click="handleReset">重置</el-button>
        <el-button size="mini" v-print="'#printContent2'">打印</el-button>
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import './print.css';
import { getVideoDeviceConfig, putVideoDeviceeConfig } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
export default {
  data() {
    return {
      isTure: false,
      isfalse: true,
      titleNa: '查看',
      ruleForm: {
        // 表单数据数据
        id: "",
        verifyMode: "",
        retryCount: "",
        interval: "",
        concurrency: "",
        updateBy: "",
        updateDept: "",
        updateAt: ""
      },
      rules: {
        deviceCon: [
          { required: true, message: '设备巡检并发量不能为空', trigger: 'blur' },
          { type: 'number', message: '设备巡检并发量必须为数字值', trigger: 'blur' }

        ],
        pingNum: [
          { required: true, message: '年龄不能为空', trigger: 'blur' },
          // { type: 'number', message: '年龄必须为数字值', trigger: 'blur' },
          { pattern: /^(1|[1-9]\d?|1000)$/, message: '范围在1-1000', trigger: 'blur' }
        ],
        intervalTime: [
          { required: true, message: '设备巡检间隔不能为空' },
          { type: 'number', message: '设备巡检间隔必须为数字值' }
        ],
        RetryNum: [
          { required: true, message: '超时重试次数不能为空' },
          { type: 'number', message: '超时重试次数必须为数字值' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created() {
    this.getList()
    console.log(123);
  },
  mounted() { },
  methods: {
    // 编辑 
    handleSwitch() {
      this.isTure = !this.isTure;
      this.isfalse = !this.isfalse;
      this.titleNa = '编辑'
      this.timer()
    },
    //保存
    handleSave() {
      this.isTure = !this.isTure;
      this.isfalse = !this.isfalse;
      this.titleNa = '查看'
      this.timer()
      this.submit()
    },
    // 上传表单
    submit() {
      let params = this.ruleForm
      putVideoDeviceeConfig(params).then((res) => {
        let result = res.data
        console.log(result);
        if (result.message) {
          this.$messageSuccess('编辑巡检参数成功')
        } else {
          this.$messageEeeor('编辑巡检参数失败')
        }
      })
    },
    //关闭
    handleClose() {
      this.isTure = !this.isTure;
      this.isfalse = !this.isfalse;
      this.titleNa = '查看'
    },
    // 重置
    handleReset() {
      console.log(666);
      this.ruleForm = {
        // 表单数据数据
        // id: '',
        verifyMode: '',
        retryCount: '',
        interval: '',
        concurrency: '',
        // updateBy: '',
        // updateDept: '',
        // updateAt: '',
      }
    },
    // 获取表单信息 
    getList() {
      getVideoDeviceConfig()
        .then(res => {
          let result = res.data
          if (result.message) {
            this.ruleForm = result.data
            this.$messageSuccess('获取设备列表成功')
          } else {
            this.$messageError('获取设备列表失败')
          }
        })

    },
    // 上传表单
    // 验证表单相关 
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
      this.ruleForm.updateAt = timer
    },
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
