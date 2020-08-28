<!--
 * @Author: shikai
 * @Date: 2020-07-03 14:06:09
 * @LastEditors: shikai
 * @LastEditTime: 2020-07-15 00:41:51
-->
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
            <el-breadcrumb-item>评估管理</el-breadcrumb-item>
            <el-breadcrumb-item>评估报告</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini" @click="seeMore('assessmentReport')">评估报告得分</el-button>
          <el-button size="mini" @click="goTo('/printing/assessmentReport')">打印</el-button>
          <el-button size="mini" @click="downloadDialog = true">下载</el-button>
        </div>
      </div>
      <div class="report-box">
        <div class="echart-box">
          <div id="echarts" :style="{ width: '500px', height: '350px' }"></div>
          <div class="describe-box">
            <span>机构所属单位：融汇支行营业网点</span>
            <span>综合得分：510分</span>
            <span>安全评级：优秀</span>
          </div>
        </div>
      </div>
      <div class="report-footer">
        <div class="report-content">
          <div class="report-header">
            <span></span>
            <span></span>
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
import OrgTree from '../../../../OrgTree'
import downloadComponents from './downloadComponents'
import { mapActions, mapMutations } from 'vuex'

export default {
  components: {
    OrgTree,
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
        },
        {
          label: '自助银行',
          value: '自助银行'
        }
      ],
      devBrandList: [
        // 设备品牌下拉选项
        {
          label: '霍尼韦尔',
          value: '霍尼韦尔'
        },
        {
          label: '博世',
          value: '博世'
        },
        {
          label: '枫叶',
          value: '枫叶'
        },
        {
          label: '海康威视',
          value: '海康威视'
        },
        {
          label: '英安特',
          value: '英安特'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      netBrandList: [
        // 网络模块品牌下拉选项
        {
          label: '霍尼韦尔',
          value: '霍尼韦尔'
        },
        {
          label: '海康威视',
          value: '海康威视'
        },
        {
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
        },
        {
          label: '网络报警主机',
          value: '网络报警主机'
        },
        {
          label: '电子围栏总线报警主机',
          value: '电子围栏总线报警主机'
        },
        {
          label: '振动光纤报警主机',
          value: '振动光纤报警主机'
        }
      ],
      devModelList: [
        // 设备型号下拉选项
        {
          label: 'CK-238P',
          value: 'CK-238P'
        },
        {
          label: 'CK-2316P',
          value: 'CK-2316P'
        }
      ],
      netTypeList: [
        // 网络模块类型下拉选项
        {
          label: '厂家1',
          value: '厂家1'
        },
        {
          label: '厂家2',
          value: '厂家2'
        }
      ],
      dropdownStatus: {
        detector: false,
        output: false,
        subsystem: false
      },
      detectorTableColumn: [
        // 探测器列表项
        {
          prop: 'name',
          label: '探测器名称',
          width: ''
        },
        {
          prop: 'orderNum',
          label: '防区序号',
          width: ''
        },
        {
          prop: 'devType',
          label: '设备类型',
          width: ''
        },
        {
          prop: 'number',
          label: '数量',
          width: ''
        },
        {
          prop: 'brand',
          label: '品牌',
          width: ''
        },
        {
          prop: 'model',
          label: '型号',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: ''
        },
        {
          prop: 'isRelated',
          label: '是否关联',
          width: ''
        }
      ],
      detectorList: [
        // 探测器列表数据
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        },
        {
          name: 'Z1壁挂双鉴-会议室',
          orderNum: '1',
          devType: '壁挂双鉴探测器',
          number: '1',
          brand: '霍尼韦尔',
          model: 'XXX',
          assetCode: 'XXX',
          isRelated: '是'
        }
      ],
      outputTableColumn: [
        // 输出通道表格项
        {
          prop: 'name',
          label: '输出通道名称',
          width: ''
        },
        {
          prop: 'orderNum',
          label: '通道序号',
          width: ''
        },
        {
          prop: 'devType',
          label: '设备类型',
          width: ''
        },
        {
          prop: 'brand',
          label: '品牌',
          width: ''
        },
        {
          prop: 'model',
          label: '型号',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: ''
        },
        {
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
        },
        {
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
        },
        {
          prop: 'orderNum',
          label: '子系统序号',
          width: ''
        },
        {
          prop: 'hasDetector',
          label: '包含探测器',
          width: ''
        },
        {
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
      this.$refs.addForm.validate(valid => {
        if (valid) {
          console.log(11111111)
        }
      })
      this.addAlarmHost(this.formData)
        .then(res => {
          console.log(res, '添加报警主机:addAlarmHost')
          this.$notify.success({
            title: '成功',
            message: '添加成功'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 跳转打印页
    goTo(path) {
      this.$router.push({ path })
    },
    seeMore(url) {
      this.SET_COMPONENT_ID(url)
    }
  },
  mounted() {
    var dom = document.getElementById('echarts')
    var myChart = this.echarts.init(dom)
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      radar: {
        center: ['50%', '50%'],
        radius: 120,
        // shape: 'circle',
        indicator: [
          {
            name: '消防档案',
            max: 100
          },
          {
            name: '人员管理',
            max: 100
          },
          {
            name: '维保维护',
            max: 100
          },
          {
            name: '应急管理',
            max: 100
          },
          {
            name: '设施设备',
            max: 100
          }
        ]
      },
      series: [
        {
          name: '评估报告',
          type: 'radar',
          // areaStyle: {normal: {}},
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: [
            {
              value: [85, 98, 60, 95, 50],
              name: '评估报告',
              itemStyle: {
                normal: {
                  color: '#67abff',
                  lineStyle: {
                    color: '#67abff'
                  }
                }
              }
            }
          ]
        }
      ]
    })
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
    .report-box {
      padding: 0 80px;
      .echart-box {
        height: 400px;
        display: flex;
        align-items: center;
        .describe-box {
          height: 350px;
          width: 500px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          flex-direction: column;
          padding-top: 100px;
          box-sizing: border-box;
          span {
            margin-bottom: 10px;
            color: #333333;
          }
        }
      }
    }
    .report-footer {
      flex: 1;
      display: flex;
      padding: 0 20px;
      .report-content {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        .report-header {
          border-bottom: 1px solid #ccc;
          height: 50px;
          width: 100%;
        }
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
