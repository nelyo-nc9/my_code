<!--
 * @Author: your name
 * @Date: 2020-06-11 15:25:10
 * @LastEditTime: 2020-06-17 11:40:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ccb-client\client\src\view\parkingManage\parkingConfig\pages\carConfig\Create.vue
-->
<template>
  <div class="main">
    <div class="form-box"
         v-if="iscreate">
      <div class="form-top">{{titleTopShow}}</div>
      <div class="form-content">
        <div class="left-form">
          <el-form size="mini"
                   :rules="rules"
                    ref="formData"
                   :model='formData'
                   label-position="right"
                   label-width="120px">
            <el-form-item label="车牌号码"
                          prop="licensePlate">
              <el-input v-model="formData.licensePlate"
                        auto-complete="true"></el-input>
            </el-form-item>
            <el-form-item label="车辆品牌">
              <el-select v-model="formData.carBrand">
                <el-option v-for="(item,index) in brandList"
                           :key="index"
                           :label="item.data"
                           :value="item.sortSerialNum"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车辆类型">
              <el-select v-model="formData.carType">
                <el-option v-for="(item,index) in typeList"
                           :key="index"
                           :label="item.data"
                           :value="item.sortSerialNum"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="right-form">
          <el-form size="mini"
          :rules="rules"
                    ref="formDatas"
                   :model='formData'
                   label-position="right"
                   label-width="120px">
            <el-form-item label="车牌型号" prop="carModel">
              <el-input v-model="formData.carModel"></el-input>
            </el-form-item>
            <el-form-item label="车身颜色">
              <el-select v-model="formData.carColor">
                <el-option v-for="item in colorList"
                           :key="item.value"
                           :label="item.data"
                           :value="item.sortSerialNum"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态"
            prop="status"
                          required>
              <el-radio v-model="formData.status"
                        label="1">启用</el-radio>
              <el-radio v-model="formData.status"
                        label="2">停用</el-radio>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom-form">
          <el-form size="mini"
          :rules="rules"
                    ref="formDatab"
                   :model='formData'
                   label-position="right"
                   label-width="120px">
            <el-form-item label="期限" prop="timeLimit">
              <el-radio-group v-model="formData.timeLimit"
                              @change="changeRadio">
                <el-radio label="长期">长期</el-radio>
                <el-radio :label="time">
                  关注期限
                  <div class="block">
                    <el-date-picker v-model="time"
                                    :disabled="pickerDisabled"
                                    @change="changeTime"
                                    type="daterange"
                                    value-format="yyyy-MM-dd hh:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"></el-date-picker>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
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
    <!-- <Print-List v-if="isprintlist"
                :platformInfo="this.formData"></Print-List>  -->
  </div>
</template>

<script>
// import PrintList from './viewControl'
import { mapState, mapMutations, mapActions } from 'vuex'
import { addParkConfigApi, updateParkConfigApi } from '@src/http/parkingManage/parkingRecord.api.js'
import parkingManage from '@src/assets/rules/validation/security/parkingManage.js'
export default {
  components: {
    // PrintList
  },
  props: {
    titleTopShow: {
      type: String,
      default: ''
    },
    fourMuen: {
      type: String,
      default: ''
    },
    selectionIds: {
      type: Array,
      default: Array
    },
    selectInfo: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created() {
    this.getqueryDataDictBasicInfo()
  },
  data() {
    return {
      ids: '',
      time: '',
      iscreate: true,
      isprintlist: false,
      isCreateBtnShow: false,
      pickerDisabled: true,
      formData: {
        licensePlate: ''
        // carModel: '',
        // carColor: '1',
        // carBrand: '奔驰',
        // carType: '1',
        // status: '1',
        // timeLimit: '长期',
        // remark: ''
      },
      paginationConfig: {
        limit: 100,
        page: 1
      },
      colorList: [],
      brandList: [],
      typeList: [],
      rules: parkingManage.carConfigRules
    }
  },
  mounted() {
    // this.formData = this.selectInfo
  },
  computed: {
    ...mapState({
      //   handleSelectionChangeArr: ({ parkingManage }) => parkingManage.handleSelectionChangeArr,
      //   activeData: ({ parkingManage }) => parkingManage.activeData,
      // isCreateBtnShow: ({ parkingManage }) => parkingManage.isCreateBtnShow
    })
  },
  methods: {
    ...mapMutations(['CHANGE_EXA_SAVE', 'CHANGE_EXA_BTN', 'SELECTION_CHANGE_HTGHT']),
    ...mapActions(['addParkConfig', 'updateParkConfig', 'queryDataDictBasicInfo']),
    // resetForm(formData) {
    //   this.$refs[formData].resetFields();
    // },
    // 数据字典获取
    getqueryDataDictBasicInfo() {
      this.queryDataDictBasicInfo({
        queryList: [
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '2'
          },
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '4'
          },
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '1'
          }
        ]
      }).then((res) => {
        this.brandList = res.data.data[0].attr
        this.colorList = res.data.data[1].attr
        this.typeList = res.data.data[2].attr
      })
    },
    savePlatform(val) {
      this.$refs.formData.validate((valid) => {
        this.$refs.formDatas.validate((valid) => {
          this.$refs.formDatab.validate((valid) => {
            if (valid) {
              if (this.fourMuen === '重点关注新建') {
                val.type = 2
                val.status = Number(val.status)
                val.carType = Number(val.carType)
                val.carColor = Number(val.carColor)
                val.timeLimit = String(val.timeLimit)

                addParkConfigApi(val)
                  .then((res) => {
                    this.ids = res.data.data.id
                    this.$emit('viewInfo', val)
                    if (res.data.code === 0) {
                      this.$notify.success({
                        title: '成功',
                        message: '添加成功'
                      })
                    } else {
                      this.$notify.warning({
                        title: '警告',
                        message: '添加失败'
                      })
                    }
                  })
                  .catch((err) => {
                    console.log(err)
                  })
                // this.iscreate=false;
                // this.isprintlist=true;
              } else if (this.fourMuen === '重点关注编辑') {
                this.formData.id = Number(this.ids)
                console.log(this.formData, 'this.formData')
                updateParkConfigApi(this.formData)
                  .then((res) => {
                    console.log('修改信息', res.data)
                  })
                  .catch((err) => {
                    this.Error(err)
                  })
                this.close()
              }
              if (this.fourMuen === '黑名单新建') {
                val.type = 4
                val.status = Number(val.status)
                val.carType = Number(val.carType)
                val.carColor = Number(val.carColor)
                val.timeLimit = String(val.timeLimit)
                addParkConfigApi(val)
                  .then((res) => {
                    // let ids = res.data.data.id
                    // this.seta(ids)
                    // console.log('保存信息', res.data)
                  })
                  .catch((err) => {
                    this.Error(err)
                  })
                // this.iscreate=false;
                // this.isprintlist=true;
              } else if (this.fourMuen === '黑名单编辑') {
                updateParkConfigApi(this.formData)
                  .then((res) => {
                    console.log('修改信息', res.data)
                  })
                  .catch((err) => {
                    this.Error(err)
                  })
                this.$emit('colseCreate')
                this.$parent.getAlarmHostList()
              }
              if (this.fourMuen === '布控车辆新建') {
                val.type = 3
                val.status = Number(val.status)
                val.carType = Number(val.carType)
                val.carColor = Number(val.carColor)
                val.timeLimit = String(val.timeLimit)
                addParkConfigApi(val)
                  .then((res) => {
                    // let ids = res.data.data.id
                    // this.seta(ids)
                    // console.log('保存信息', res.data)
                  })
                  .catch((err) => {
                    this.Error(err)
                  })
                // this.iscreate=false;
                // this.isprintlist=true;
              } else if (this.fourMuen === '布控车辆编辑') {
                updateParkConfigApi(this.formData)
                  .then((res) => {
                    console.log('修改信息', res.data)
                  })
                  .catch((err) => {
                    this.Error(err)
                  })
                this.$emit('colseCreate')
                this.$parent.getAlarmHostList()
              }
              if (!this.formData.licensePlate && !this.formData.status) {
                this.$notify.warning({
                  title: '警告',
                  message: '添加失败'
                })
                this.reset()
              } else {
                this.$emit('printShow')
                // this.SELECTION_CHANGE_HTGHT(val)
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })
        })
      })
    },
    reSetForm() {
      this.$refs.formData.resetFields()
    },
    reset() {
      this.formData = {}
    },
    skipToList() {},
    close() {
      this.$emit('colseCreate')
    },
    changeTime() {
      this.formData.timeLimit = this.time
    },
    changeRadio(val) {
      console.log(val)
      if (!val) {
        this.pickerDisabled = false
      }
      if (val == '长期') {
        this.pickerDisabled = true
        this.time = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  // display: flex;
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
    line-height: 26px;
  }
}
</style>
