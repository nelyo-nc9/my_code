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
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
            <el-breadcrumb-item>查询</el-breadcrumb-item>
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
            <el-form
              ref="addForm"
              size="mini"
              :model="formData"
              label-position="right"
              :inline="true"
              label-width="120px"
            >
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
              <el-form-item label="所属重点部位">
                <el-select v-model="formData.keySite">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备名称">
                <el-select v-model="formData.keySite">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="资产编码" required>
                <el-input placeholder="请输入资产编码" v-model="formData.deviceName"></el-input>
              </el-form-item>
              <el-form-item label="设备厂家" required>
                <el-input v-model="formData.netModuleID"></el-input>
              </el-form-item>
              <el-form-item label="设备型号">
                <el-select v-model="formData.keySite">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备协议">
                <el-select v-model="formData.keySite">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备标签">
                <el-select v-model="formData.keySite">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备有效期">
                <el-select v-model="formData.keySite">
                  <el-option
                    v-for="item in positionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签编码" required>
                <el-input v-model="formData.ip"></el-input>
              </el-form-item>
              <el-form-item label="生产日期" required>
                <el-input v-model="formData.userName"></el-input>
              </el-form-item>
              <el-form-item label="设备位置" required>
                <el-input v-model="formData.detectorNo"></el-input>
              </el-form-item>
              <el-form-item label="录入机构">
                <el-input v-model="formData.subsystemNo"></el-input>
              </el-form-item>
              <el-form-item label="录入人">
                <el-input disabled v-model="formData.orgName"></el-input>
              </el-form-item>
              <el-form-item label="录入时间" required>
                <el-input v-model="formData.code"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" size="mini" @click="">查询</el-button>
          <el-button size="mini" @click="">重置</el-button>
          <el-button size="mini" @click="">导出</el-button>
          <el-button size="mini" @click="skipToList">返回</el-button>
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
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import OrgTree from '../../../OrgTree'

export default {
  name: 'fireFightingSubsystemManagement',
  components: {
    OrgTree
  },
  data() {
    return {
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
        detector: true
      },
      detectorTableColumn: [
        // 探测器列表项
        {
          prop: 'name',
          label: '序号',
          width: ''
        },
        {
          prop: 'orderNum',
          label: '所属机构',
          width: ''
        },
        {
          prop: 'devType',
          label: '所属部门',
          width: ''
        },
        {
          prop: 'number',
          label: '设备名称',
          width: ''
        },
        {
          prop: 'brand',
          label: '设备位置',
          width: ''
        },
        {
          prop: 'model',
          label: '资产编码',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '设备厂家',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '设备型号',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '设备标签',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '设备有效期',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '标签编码',
          width: ''
        },
        {
          prop: 'assetCode',
          label: '生产日期',
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
        },
        {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        },
        {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        },
        {
          name: '保定分行',
          orderNum: '融汇支行',
          devType: '2020-01-01',
          number: '2020-01-01',
          brand: '2020-01-01',
          model: '1',
          assetCode: '2'
        }
      ],
      isOpenDetectorModal: false // 控制探测器添加弹框显隐
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive',
      isShowContent: 'isShowContent'
    })
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE'
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
      this.SET_IS_NEW_FILE('fireFightingList')
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
  padding-right: 15px !important;
}
</style>
<style lang="less" scoped>
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
