<!--
 * @Author: shikai
 * @Date: 2020-07-15 00:21:55
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-15 00:37:33
--> 
<template>
  <div class="content">
      <div class="right-content">
          <div class="top-box">
              <header>
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                      <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
                      <el-breadcrumb-item>消防评估</el-breadcrumb-item>
                      <el-breadcrumb-item>手动生成评估报告</el-breadcrumb-item>
                  </el-breadcrumb>
              </header>
          </div>
          <div class="form-box">
              <div class="box-title" @click="toggleOpen('detector')">
                  查询条件
                  <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </div>
              <div class="form-content" v-if="dropdownStatus.detector">
                  <div class="left-form">
                      <el-form ref="addForm" size="mini" :model="formData" label-position="right" :inline="true" label-width="120px">
                          <el-form-item label="所属机构">
                              <el-select v-model="formData.keySite">
                                  <el-option
                                          v-for="item in positionList"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value"
                                  ></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item label="所属机构单位">
                            <el-select v-model="formData.keySite">
                                <el-option
                                        v-for="item in positionList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="评分类别">
                            <el-select v-model="formData.keySite">
                                <el-option
                                        v-for="item in positionList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="评分目录">
                            <el-select v-model="formData.keySite">
                                <el-option
                                        v-for="item in positionList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="评估开始时间" required>
                              <el-input v-model="formData.netModuleID"></el-input>
                          </el-form-item>
                          <el-form-item label="评估结束时间" required>
                              <el-input v-model="formData.ip"></el-input>
                          </el-form-item>
                      </el-form>
                  </div>
              </div>
              <div class="form-footer">
                  <el-button size="mini" @click="skipToList">生成报告</el-button>
                  <el-button size="mini" @click="skipToList">重置</el-button>
                  <el-button size="mini" @click="skipToList">导出</el-button>
              </div>
          </div>
          <div class="bottom-box">
              <div style="width:100%;">
                  <div class="box-title">
                      <span class="pointer">
                          查询结果
                      </span>
                  </div>
                  <div>
                      <el-table :data="detectorList" border style="width: 100%" height="201" size="mini" stripe>
                          <el-table-column type="selection"></el-table-column>
                          <el-table-column type="index" label="序号"></el-table-column>
                          <el-table-column
                                  v-for="item in detectorTableColumn"
                                  :key="item.label"
                                  :prop="item.prop"
                                  :label="item.label"
                                  show-overflow-tooltip
                          ></el-table-column>
                          <el-table-column label="操作">
                              <template slot-scope="scope">
                                <span class="mar20" @click="seeMore('assessmentReports')">查看报告</span>
                                  <span class="mar20" @click="seeMore('assessmentReport')">报告详细得分</span>
                                  <span class="mar20" type="primary" @click="downloadDialog = true">下载</span>
                              </template>
                          </el-table-column>
                      </el-table>
                  </div>
              </div>
          </div>
      </div>
      <!-- 添加部件弹窗 -->
      <el-dialog title="下载存储路劲" :visible.sync="downloadDialog" width="30%" center :before-close="handleClose">
          <downloadComponents></downloadComponents>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="preserveParts()">下载</el-button>
              <el-button @click="downloadDialog = false">取消</el-button>
          </span>
      </el-dialog>
  </div>
</template>

<script>
import downloadComponents from './downloadComponents'
import {
  mapActions,
  mapMutations
} from 'vuex'

export default {
  name: 'fireFightingSubsystemManagement',
  components: {
    downloadComponents
  },
  data() {
    return {
      downloadDialog: false,
      formData: {
        // 表单数据
        subsystem: '报警子系统',
        keySite: '',
        deviceName: '',
        brand: '',
        netModuleBrand: '',
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
        outputNo: ''
      },
      positionList: [
        // 重点部位下拉选项
        {
          label: '营业网点',
          value: '营业网点'
        }, {
          label: '自助银行',
          value: '自助银行'
        }
      ],
      devBrandList: [
        // 设备品牌下拉选项
        {
          label: '霍尼韦尔',
          value: '霍尼韦尔'
        }, {
          label: '博世',
          value: '博世'
        }, {
          label: '枫叶',
          value: '枫叶'
        }, {
          label: '海康威视',
          value: '海康威视'
        }, {
          label: '英安特',
          value: '英安特'
        }, {
          label: '其他',
          value: '其他'
        }
      ],
      netBrandList: [
        // 网络模块品牌下拉选项
        {
          label: '霍尼韦尔',
          value: '霍尼韦尔'
        }, {
          label: '海康威视',
          value: '海康威视'
        }, {
          label: '蓝色星际',
          value: '蓝色星际'
        }
      ],
      serverList: [
        // 所属服务下拉选项
        {
          label: '接入服务器',
          value: '接入服务器'
        }
      ],
      devTypeList: [
        // 设备类型下拉选项
        {
          label: '电话报警主机',
          value: '电话报警主机'
        }, {
          label: '网络报警主机',
          value: '网络报警主机'
        }, {
          label: '电子围栏总线报警主机',
          value: '电子围栏总线报警主机'
        }, {
          label: '振动光纤报警主机',
          value: '振动光纤报警主机'
        }
      ],
      devModelList: [
        // 设备型号下拉选项
        {
          label: 'CK-238P',
          value: 'CK-238P'
        }, {
          label: 'CK-2316P',
          value: 'CK-2316P'
        }
      ],
      netTypeList: [
        // 网络模块类型下拉选项
        {
          label: '厂家1',
          value: '厂家1'
        }, {
          label: '厂家2',
          value: '厂家2'
        }
      ],
      dropdownStatus: {
        detector: true
      },
      detectorTableColumn: [
        // 探测器列表项
        {
          prop: 'name',
          label: '序号',
          width: ''
        }, {
          prop: 'orderNum',
          label: '所属机构',
          width: ''
        }, {
          prop: 'devType',
          label: '所属机构单位',
          width: ''
        }, {
          prop: 'number',
          label: '评估开始时间',
          width: ''
        }, {
          prop: 'brand',
          label: '评估结束时间',
          width: ''
        }, {
          prop: 'model',
          label: '生成报告时间',
          width: ''
        }, {
          prop: 'assetCode',
          label: '本年度排名时间',
          width: ''
        }
      ],
      detectorList: [
        // 探测器列表数据
        {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        }, {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        }, {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        }, {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        }
      ],
      outputTableColumn: [
        // 输出通道表格项
        {
          prop: 'name',
          label: '输出通道名称',
          width: ''
        }, {
          prop: 'orderNum',
          label: '通道序号',
          width: ''
        }, {
          prop: 'devType',
          label: '设备类型',
          width: ''
        }, {
          prop: 'brand',
          label: '品牌',
          width: ''
        }, {
          prop: 'model',
          label: '型号',
          width: ''
        }, {
          prop: 'assetCode',
          label: '资产编码',
          width: ''
        }, {
          prop: 'remark',
          label: '备注',
          width: ''
        }
      ],
      outputList: [
        // 输出通道表格数据
        {
          name: 'O1声闪一体机-大厅',
          orderNum: '1',
          devType: '声闪一体机',
          brand: '国产',
          model: 'XXX',
          assetCode: 'XXX',
          remark: ''
        }, {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          brand: '国产',
          model: 'XXX',
          assetCode: 'XXX',
          remark: ''
        }
      ],
      subSystemColumn: [
        // 子系统表格项
        {
          prop: 'name',
          label: '子系统名称',
          width: ''
        }, {
          prop: 'orderNum',
          label: '子系统序号',
          width: ''
        }, {
          prop: 'hasDetector',
          label: '包含探测器',
          width: ''
        }, {
          prop: 'hasOutput',
          label: '包含输出通道',
          width: ''
        }
      ],
      subSystemList: [
        // 子系统列表数据
        {
          name: '子系统1',
          orderNum: '1',
          hasDetector: 'Z1壁挂双鉴-会议室',
          hasOutput: 'O1声闪一体机-大厅'
        }
      ],
      modalTitle: '新增探测器',
      isEditDetector: false, // 新增or修改
      isOpenDetectorModal: false, // 控制探测器添加弹框显隐
      isEditOutput: false, // 控制输出通道新增or编辑弹框显隐
      isEditSystem: false, // 控制子系统新增or编辑弹框显隐
      detectorData: {
        isLink: ''
      }
    }
  },
  methods: {
    ...mapMutations('assessment', {
      SET_COMPONENT_ID: 'SET_COMPONENT_ID'
    }),
    ...mapActions(['addAlarmHost']),
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
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENT_ID('AlarmList')
    },
    // 添加报警主机
    saveAlarmHost() {
      // this.$refs.addForm.validate(valid => {
      //   if (valid) {
      //     console.log(11111111)
      //   }
      // })
      // this.addAlarmHost(this.formData).then(res => {
      //   console.log(res, '添加报警主机:addAlarmHost')
      //   this.$notify.success({
      //     title: '成功',
      //     message: '添加成功'
      //   })
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    seeMore(url) {
      this.SET_COMPONENT_ID(url)
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
                    margin: 12px 0;
                }
            }
            .form-box {
                .form-content {
                    display: flex;
                    /* width: 644px; */
                    padding: 10px;
                    font-size: 12px;
                    border: 1px solid #f2f2f2;
                    .left-form {
                        /* width: 300px; */
                        /* margin-right: 24px; */
                    }
                    .right-form {
                        /* width: 300px; */
                    }
                }
                .form-footer {
                    margin-top: 12px;
                    width: 100%;
                    text-align: center;
                }
            }
            .bottom-box {
                flex: 1;
            }
            .box-title {
                position: relative;
                height: 24px;
                line-height: 24px;
                color: #606266;
                i {
                    position: absolute;
                    top: 50%;
                    left: 100px;
                    transform: translateY(-50%);
                }
                &::after {
                    display: block;
                    content: '';
                    border-top: 1px solid #e1e1e1;
                    width: calc(~'100% - 120px');
                    margin-left: 120px;
                    margin-top: -12px;
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
    }
    .el-input,
    .el-input--suffix .el-input__inner {
        padding-right: 15px!important;
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
    .form-box {
        margin-top: 20px;
    }
</style>
