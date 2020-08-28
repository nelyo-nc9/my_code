
<template>
  <div class="main">
    <div class="form-box">
      <div class="form-top">布控车辆信息</div>
      <div class="form-content">
        <div class="left-form">
          <el-form ref="addForm"
                   size="mini"
                   :model="formData"
                   label-position="right"
                   label-width="120px">
            <el-form-item label="布控名称">
              <el-input
                        v-model="formData.type"></el-input>
            </el-form-item>
            <el-form-item label="车辆品牌">
              <el-select v-model="formData.carBrand">
                <el-option v-for="item in colorList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车辆类型">
              <el-select v-model="formData.carType">
                <el-option v-for="item in colorList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="right-form">
          <el-form size="mini"
                   :model="formData"
                   label-position="right"
                   label-width="120px">
            <el-form-item label="车牌号码">
              <el-input v-model="formData.licensePlate"></el-input>
            </el-form-item>
            <el-form-item label="车牌型号">
              <el-input v-model="formData.carModel"></el-input>
            </el-form-item>
            <el-form-item label="车身颜色">
              <el-select v-model="formData.carColor">
                <el-option v-for="item in colorList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom-form">
          <el-form size="mini"
                   :model="formData"
                   label-position="right"
                   label-width="120px">
            <el-form-item label="状态">
              <el-radio v-model="formData.status"
                        label="启用">启用</el-radio>
              <el-radio v-model="formData.status"
                        label="停用">停用</el-radio>
            </el-form-item>
            <el-form-item label="布控方式">
              <el-radio v-model="formData.deadline"
                        label="长期">长期</el-radio>
              <el-radio v-model="formData.deadline"
                        label="2">布控时间范围
                <div class="block">
                  <el-date-picker v-model="formData.deadline"
                                  type="daterange"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </div>
              </el-radio>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remark"></el-input>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <div class="form-footer">
        <el-button type="primary"
                   size="mini"
                   @click="savePlatform(formData)">保存</el-button>
        <el-button size="mini"
                   style="margin:0 24px"
                   @click="reset">重置</el-button>
        <el-button size="mini"
                   @click="close">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  components: {},
  data() {
    return {
      formData: {},
      colorList: [
        { label: '黑色', value: '黑色' },
        { label: '红色', value: '红色' }
      ]
    }
  },
  // created(){
  //   this.formData = this.activeData
  // },
  methods: {
    ...mapMutations(['CHANGE_EXA_SAVE']),
    // savePlatform(val) {
    //     this.CHANGE_EXA_SAVE(val)
    //   this.$emit('printShow')
    // },
    reset() {},
    skipToList() {},
    close() {
      this.$emit('colseCreate')
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  .content-btn {
    margin: 10px 0;
  }
  .form-box {
    padding-top: 20px;
    margin-left: 140px;
    .form-top {
      width: 846px;
      text-align: center;
      padding: 30px 0;
    }
     /deep/.el-form-item__content {
      position: static;
    }
    .form-content {
      // display: flex;
      width: 846px;
      height: 214px;
      padding: 10px;
      font-size: 12px;
      border: 1px solid #f7f2f1;
      /deep/.el-select > .el-input {
        width: 280px;
      }
      .left-form {
        float: left;
        width: 400px;
        margin-right: 24px;
      }
      .right-form {
        float: left;
        width: 400px;
      }
      .block {
        display: inline-block;
      }
    }
    .form-footer {
      margin-top: 30px;
      width: 846px;
      text-align: center;
    }
  }
}
</style>
<style lang="less">
.main {
  .form-box {
    .left-form,
    .right-form {
      .el-form-item--mini.el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .el-form-item__label {
    border: 1px solid #fff;
    background: #f7f2f1;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
  .el-form-item--mini .el-form-item__content,
  .el-form-item--mini .el-form-item__label {
    line-height: 36px;
  }
}
</style>
