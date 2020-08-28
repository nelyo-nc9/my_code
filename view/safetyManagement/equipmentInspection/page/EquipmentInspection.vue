<!-- 设备巡检配置 -->
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
      <div class="btn-group">
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
            <span class="num">{{ruleForm.inspectInterval}}</span>
          </div>
          <div class="titleNum">
            <span class="title">单设备ping次数</span>
            <span class="num">{{ruleForm.pingCount}}</span>
          </div>
          <div class="titleNum">
            <span class="title">超时重试次数</span>
            <span class="num">{{ruleForm.retryCount}}</span>
          </div>
        </div>
      </div>
      <div class="note-tent">备注：单设备ping次数仅针对不支持在线检测的设备</div>
      <div class="people-infor">
        <div>
          <span class="title">录入时间</span>
          <span class="num">{{updateAt}}</span>
        </div>
        <div>
          <span class="title">录入机构</span>
          <span class="num">{{updateDept}}</span>
        </div>
        <div>
          <span class="title">录入人</span>
          <span class="num">{{updateBy}}</span>
        </div>
      </div>
    </div>

    <!--編輯 -->
    <div v-if="isTure" class="box-two" id="printContent2">
      <div class="content-inner">
        <div class="title-name">巡检参数编辑</div>
        <!-- label-width="128px" -->
        <el-form
          size="mini"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
          align="center"
        >
          <el-form-item class="form-item-one" label="设备巡检并发量" prop="concurrency">
            <el-input v-model="ruleForm.concurrency"></el-input>
          </el-form-item>
          <el-form-item class="form-item-one" label="设备巡检间隔(s)" prop="inspectInterval">
            <el-input v-model="ruleForm.inspectInterval"></el-input>
          </el-form-item>
          <el-form-item label="单设备ping次数" prop="pingCount">
            <el-input v-model="ruleForm.pingCount"></el-input>
          </el-form-item>
          <el-form-item label="超时重试次数" prop="retryCount">
            <el-input v-model="ruleForm.retryCount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="note-tent">备注：单设备ping次数仅针对不支持在线检测的设备</div>
      <div class="people-infor">
        <div>
          <span class="title">录入时间</span>
          <span class="num">{{updateAt}}</span>
        </div>
        <div>
          <span class="title">录入机构</span>
          <span class="num">{{updateDept}}</span>
        </div>
        <div>
          <span class="title">录入人</span>
          <span class="num">{{updateBy}}</span>
        </div>
      </div>
      <div class="form-footer">
        <el-button size="mini" @click="handleSave">保存</el-button>
        <el-button size="mini" @click="resetForm">重置</el-button>
        <el-button size="mini" v-print="'#printContent2'">打印</el-button>
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceConfig, putDeviceeConfig } from '@src/http/securityEquipmentControl/securityEquipmentControl.api.js'
// import './print.css';

export default {
  data() {
    const concurrValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('设备巡检并发量不能为空'))
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
        return callback(new Error('设备巡检间隔不能为空'))
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
      titleNa: '查看',
      isTure: false, // 編輯
      isfalse: true, // 查看
      updateAt: '',
      updateDept: '',
      updateBy: '',
      ruleForm: {
        // 表单数据数据
        concurrency: '',
        inspectInterval: '',
        pingCount: '',
        retryCount: ''
      },
      rules: {
        concurrency: [{ required: true, validator: concurrValidator, trigger: 'blur' }],
        inspectInterval: [{ required: true, validator: inspectIntervalValidator, trigger: 'blur' }],
        pingCount: [{ required: true, validator: countValidator, trigger: 'blur' }],
        retryCount: [{ required: true, validator: countValidator, trigger: 'blur' }]
      }
    }
  },
  watch: {},
  computed: {},
  // 进入页面
  created() {
    this.deviceConfig()
  },
  mounted() {
  },
  methods: {
    // 获取表单信息
    deviceConfig() {
      getDeviceConfig()
        .then((res) => {
          if (res.data && res.data.code !== 0) {
            return
          }
          let result = res.data.data
          this.ruleForm.concurrency = result.concurrency
          this.ruleForm.inspectInterval = result.inspectInterval
          this.ruleForm.pingCount = result.pingCount
          this.ruleForm.retryCount = result.retryCount
          this.updateAt = result.updatedAt
          this.updateDept = result.updatedDept
          this.updateBy = result.updatedBy
        })
    },
    // 编辑
    handleSwitch() {
      this.isTure = !this.isTure
      this.isfalse = !this.isfalse
      this.titleNa = '巡检参数编辑'
    },
    // 保存
    handleSave() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          putDeviceeConfig(this.ruleForm)
            .then(res => {
              res.data && res.data.code === 0 ? this.$messageSuccess('保存成功！') : this.$messageError('保存失败！')

              this.isTure = !this.isTure
              this.isfalse = !this.isfalse
              this.titleNa = '查看'
            })
            .catch()
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 关闭
    handleClose() {
      this.$refs['ruleForm'].resetFields()
      this.isTure = !this.isTure
      this.isfalse = !this.isfalse
      this.titleNa = '查看'
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
        text-align: center;
        margin: 20px auto;
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
        margin:0 auto;
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
      width: 908px;
      margin: 30px auto;
      // margin: 30px 0 0 180px;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0 auto;
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
        text-align: center;
        margin: 20px auto;
        font-size: 14px;
      }
      .el-form {
        width: 873px;
        height: 120px;
        margin: 0 auto ;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #ccc;
        .el-form-item {
          width: 50%;
          /deep/ .el-form-item__label {
            width: 130px;
          }
          .el-input {
            width: 285px;
          }
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
      width: 908px;
      margin: 30px auto;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0 auto;
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
      // margin: 150px 0 0 470px;
      width: 300px;
      display: flex;
      justify-content: space-around;
      margin: 80px auto;
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
    // height: 700px;
    .btn-group {
      display: none;
    }
    .content-inner {
      .title-name {
        text-align: center;
        margin: 20px auto;
        font-size: 14px;
      }
      // .el-form {
      //   width: 900px;
      //   height: 68px;
      //   margin: 50px 0 10px 150px;
      //   font-size: 14px;
      //   border: 1px solid #ccc;
      //   .el-form-item {
      //     float: left;
      //     width: 49%;
      //     height: 48%;
      //     // margin: 5px 0 0 0;
      //   }
      //   .form-item-one {
      //     margin: 2px 0 0 0;
      //   }
      // }
      .data-inner {
        box-sizing: border-box;
        width: 908px;
        height: 70px;
        // margin: 50px 0 10px 150px;
        margin: 0 auto;
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
      width: 908px;
      margin: 30px auto;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0 auto;
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
    // margin-top: 115px;
    // .btn-group {
    //   margin: 20px 0 20px 60px;
    // }
    .content-inner {
      .title-name {
        text-align: center;
        margin: 20px auto;
        font-size: 14px;
      }
      .el-form {
        width: 873px;
        height: 68px;
        // margin: 50px 0 10px 150px;
        margin: 0 auto;
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
      width: 908px;
      margin: 30px auto;
    }
    .people-infor {
      width: 800px;
      height: 30px;
      margin: 0 auto;
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
</style>
