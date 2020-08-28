<template>
  <div class="content">
    <div class="left-tree">
      <OrgTree></OrgTree>
    </div>
    <div class="right-content">
      <div class="top-box mab20">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
            <el-breadcrumb-item>新建</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box">
        <div class="box-title">新建{{ sidebarActive }}</div>
        <div class="form-content">
          <div class="left-form">
            <el-form ref="addForm" size="mini" :model="formData" label-position="right" label-width="120px">
              <el-form-item label="所属机构">
                <el-input disabled v-model="formData.orgName"></el-input>
              </el-form-item>
              <el-form-item label="设备分类">
                <el-input disabled v-model="formData.orgName"></el-input>
              </el-form-item>
              <el-form-item label="关联部件" required>
                <el-select v-model="formData.parts">
                  <el-option
                    v-for="item in partsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备ID">
                <el-input disabled v-model="formData.id"></el-input>
              </el-form-item>
              <el-form-item label="设备厂家" required>
                <el-select v-model="formData.manufactor">
                  <el-option
                    v-for="item in manufactorList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备有效期">
                <el-input disabled v-model="formData.subsystem"></el-input>
              </el-form-item>
              <el-form-item label="生产日期" required>
                <el-input v-model="formData.netModuleID"></el-input>
              </el-form-item>
              <el-form-item label="设备位置" required>
                <el-input v-model="formData.ip"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-form">
            <el-form size="mini" :model="formData" label-position="right" label-width="120px">
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
              <el-form-item label="关联系统">
                <el-select v-model="formData.netModuleBrand">
                  <el-option
                    v-for="item in netBrandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备名称" required>
                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
              </el-form-item>
              <el-form-item label="资产编码">
                <el-input v-model="formData.subsystemNo"></el-input>
              </el-form-item>
              <el-form-item label="设备型号" required>
                <el-select v-model="formData.deviceModel">
                  <el-option
                    v-for="item in devModelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通讯协议" required>
                <el-select v-model="formData.brand">
                  <el-option
                    v-for="item in devBrandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备标签">
                <el-select v-model="formData.netModuleModel">
                  <el-option
                    v-for="item in netTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签编码" required>
                <el-input v-model="formData.keyboardPassword"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="detail-bottom">
          <div class="detail-item">
            <div class="item-left">录入时间</div>
            <div class="item-right">{{ activeData.createdAt }}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入机构</div>
            <div class="item-right">{{ activeData.createdDept }}</div>
          </div>
          <div class="detail-item">
            <div class="item-left">录入人</div>
            <div class="item-right">{{ activeData.createdBy }}</div>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" size="mini" style="margin-right:24px;" @click="saveAlarmHost">保存</el-button>
          <el-button size="mini" @click="skipToList">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrgTree from '../../../OrgTree'
import { mapActions, mapMutations, mapState } from 'vuex'

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
        id: '',
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
      partsList: [
        {
          label: '手动报警按钮',
          value: '手动报警按钮'
        },
        {
          label: '感烟探测器',
          value: '感烟探测器'
        },
        {
          label: '感温探测器',
          value: '感温探测器'
        },
        {
          label: '总线隔离模板',
          value: '总线隔离模板'
        }
      ],
      manufactorList: [
        {
          label: '中电',
          value: '中电'
        },
        {
          label: '北大青鸟',
          value: '北大青鸟'
        },
        {
          label: '其他厂家',
          value: '其他厂家'
        }
      ],
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
        detector: false
      },
      activeData: {
        createdAt: '2020-02-20 15:00:00',
        createdDept: '********机构名称',
        createdBy: '张三'
      },
      isEditDetector: false, // 新增or修改
      isOpenDetectorModal: false, // 控制探测器添加弹框显隐
      isEditOutput: false, // 控制输出通道新增or编辑弹框显隐
      isEditSystem: false // 控制子系统新增or编辑弹框显隐
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive'
    })
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE',
      SET_SHOW_CONTENT: 'SET_SHOW_CONTENT'
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
    // 跳转到列表页
    skipToList() {
      this.SET_IS_NEW_FILE('fireFightingList')
    },
    // 添加报警主机
    saveAlarmHost() {
      this.skipToList()
      this.SET_SHOW_CONTENT('detail')
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
        width: 800px;
        padding: 10px;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        .left-form {
          width: 300px;
          margin-right: 24px;
        }
        .right-form {
          width: 300px;
        }
      }
      .form-footer {
        margin-top: 12px;
        width: 624px;
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
  .detail-bottom {
    color: #666;
    width: 800px;
    padding: 8px;
    border: 1px solid #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    .detail-item {
      display: flex;
      width: 50%;
      height: 32px;
      line-height: 32px;
      .item-left {
        width: 100px;
        background: #f8f8f8;
        border: 1px solid #fff;
        text-align: center;
      }
      .item-right {
        flex: 1;
        border: 1px solid #f8f8f8;
        border-left: none;
      }
    }
  }
  .detail-bottom {
    .detail-item {
      width: 33.33%;
    }
  }
  .detail-footer {
    margin-top: 24px;
  }
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
</style>
