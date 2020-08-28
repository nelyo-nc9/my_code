<template>
  <div class="content">
    <div class="tree-content">
      <treeBox
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
      ></treeBox>
    </div>
    <div class="right-content" v-if="activeCreate">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>停车管理</el-breadcrumb-item>
            <el-breadcrumb-item>停车管理平台</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div>
        <div class="form-box">
          <div class="form-top">停车平台信息</div>
          <div class="form-content">
            <div class="left-form">
              <el-form
                ref="addForm"
                size="mini"
                :model="formData"
                label-position="right"
                label-width="120px"
                :rules="rules"
              >
                <el-form-item label="所属机构" prop="orgId">
                  <el-select v-model="formData.orgId" disabled size="mini">
                    <el-option :value="formData.orgId" :label="nameLable"> </el-option>
                  </el-select>
                  <!-- <el-input disabled v-model="orgObj.name"></el-input> -->
                </el-form-item>
                <el-form-item label="停车平台名称" prop="name">
                  <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="品牌" prop="brand" required>
                  <el-select v-model="formData.brand">
                    <el-option
                      v-for="item in brandList"
                      :key="item.value"
                      :label="item.data"
                      :value="item.serialNum"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="IP地址" prop="ip">
                  <el-input placeholder="" v-model="formData.ip"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input placeholder="" v-model="formData.username"></el-input>
                </el-form-item>
                <el-form-item label="资产编码" prop="assetCode">
                  <el-input placeholder="" v-model="formData.assetCode"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input placeholder="" v-model="formData.remark"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="right-form">
              <el-form size="mini" :model="formData" label-position="right" label-width="120px" ref="addForms" :rules="rules">
                <el-form-item label="所属重点部位" prop="keyPartId" required>
                  <el-select v-model="formData.keyPartId" disabled>
                    <el-option :value="formData.keyPartId" :label="locationLable"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="停车平台ID" prop="uniqueId">
                  <el-input v-model="formData.uniqueId"></el-input>
                </el-form-item>
                <el-form-item label="版本" prop="version">
                  <el-input v-model="formData.version"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                  <el-input v-model="formData.port"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="formData.password"></el-input>
                </el-form-item>
                <el-form-item label="接入服务器" prop="accessService">
                  <el-select v-model="formData.accessService">
                    <el-option v-for="(item, i) in serverList" :key="i" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="form-footer">
            <el-button type="primary" size="samll" @click="savePlatform">保存</el-button>
            <el-button size="samll" @click="reset">重置</el-button>
            <el-button size="samll" @click="skipToList">取消</el-button>
          </div>
          <div class="bottom-box" v-if="isEditShowBtn">
            <div style="width:70%;">
              <div class="box-title">
                <span class="pointer" @click="toggleOpen('detector')">
                  停车主机列表
                  <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                </span>
              </div>
              <div v-if="dropdownStatus.detector" style="width:100%;margin-left: 4%;">
                <div class="list-header">
                  <!-- <i class="iconfont lead"
                     @click="hostSave"
                     title="保存"
                     style="font-size:12px">&#xe60b;</i> -->
                  <i class="el-icon-download" title="导入" @click="hostExprot"></i>
                  <i class="el-icon-circle-plus-outline" title="新增" @click="openAddModal('create')"></i>
                  <i class="el-icon-edit" title="编辑" @click="openAddModal('edit')"></i>
                  <i class="el-icon-delete" title="删除" @click="deleteModal"></i>
                  <i class="el-icon-refresh-right" title="刷新" @click="refresh"></i>
                </div>
                <!-- 停车主机 新增or编辑 -->
                <el-dialog :title="modalTitle" :visible.sync="isEditDetector" width="400px">
                  <el-form size="mini" label-position="right" label-width="120px" ref="addForma" :model="detectorData" :rules="detector">
                    <el-form-item label="车场" prop="parking" required>
                      <el-input v-model="detectorData.parking"></el-input>
                    </el-form-item>
                    <el-form-item label="主机名称" prop="name" required>
                      <el-input v-model="detectorData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌">
                      <el-select v-model="detectorData.brand" style="width:100%">
                        <el-option
                          v-for="item in brandList"
                          :key="item.value"
                          :label="item.data"
                          :value="item.serialNum"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="型号" prop="modelNum" required>
                      <el-input v-model="detectorData.modelNum"> </el-input>
                    </el-form-item>
                    <el-form-item label="设备ID" prop="id" required>
                      <el-input v-model="detectorData.id"> </el-input>
                    </el-form-item>
                    <el-form-item label="IP地址" prop="ip" required>
                      <el-input v-model="detectorData.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="端口" prop="port">
                      <el-input v-model="detectorData.port"></el-input>
                    </el-form-item>
                    <el-form-item label="资产编码" prop="assetCode">
                      <el-input v-model="detectorData.assetCode"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="在线状态"
                                  required>
                      <el-select v-model="detectorData.state"
                                 style="width:240px;">
                        <el-option label="是"
                                   value="1"></el-option>
                        <el-option label="否"
                                   value="2"></el-option>
                      </el-select>
                    </el-form-item> -->
                  </el-form>

                  <el-row style="text-align:center">
                    <el-button @click="dialogSave" type="primary">保存</el-button>
                    <el-button @click="skipToListBtn">取消</el-button>
                  </el-row>
                </el-dialog>
                <el-table
                  :data="parkHostList"
                  border
                  style="width: 100%"
                  height="201"
                  size="mini"
                  stripe
                  @select="Checkbox"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    v-for="item in parkTableColumn"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label"
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="detail-bottom">
            <div class="detail-item">
              <div class="item-left">录入时间</div>
              <div class="item-right">{{ formData.updatedAt }}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">录入机构</div>
              <div class="item-right">{{ formData.updatedDept }}</div>
            </div>
            <div class="detail-item">
              <div class="item-left">录入人</div>
              <div class="item-right">{{ formData.updatedBy }}</div>
            </div>
          </div>
          <div class="btn" v-if="hostBtn" style="margin-left:360px">
            <el-button @click="hostSave" type="primary" size="samll">保存</el-button>
            <el-button @click="skip" size="samll">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <printPage
      v-if="activePrint"
      :platformInfo="this.formData"
      @closePrint="closePrint"
      @isEditShow="isEditShow"
      @isCreateShow="isCreateShow"
    ></printPage>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import printPage from './print'
import {
  getTreeApi,
  addParkPlatformApi,
  updateParkHostApi,
  addParkHostApi
} from '@src/http/parkingManage/parkingRecord.api.js'
import { mapMutations, mapActions } from 'vuex'
import parkingManage from '@src/assets/rules/validation/security/parkingManage.js'
export default {
  name: 'Create',
  components: {
    treeBox,
    printPage
  },
  data() {
    return {
      treeType: 2,
      formData: {},
      serverList: [], // -接入服务器列表
      activeCreate: true,
      activePrint: false,
      isEditShowBtn: false,
      modalTitle: '新增停车主机',
      isEditDetector: false, // 新增or修改
      // 弹窗新数据收集
      detectorData: {
        orgId: '',
        keyPartId: '',
        platformId: ''
      },
      // 所属重点部位
      positionList: [],
      orgObj: {
        id: '',
        name: ''
      },
      paginationConfig: {
        limit: 100,
        page: 1
      },
      brandList: [
        // 品牌
      ],
      orgPart: [{ label: 'xxx分行', value: 'xxx分行' }],
      dropdownStatus: {
        detector: true
      },
      parkTableColumn: [
        // 停车主机列表项
        { prop: 'parking', label: '车场', width: '' },
        { prop: 'name', label: '停车主机名称', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'modelNum', label: '型号', width: '' },
        { prop: 'id', label: '设备ID', width: '' },
        { prop: 'ip', label: 'IP地址', width: '' },
        { prop: 'port', label: '端口', width: '' },
        { prop: 'status', label: '在线状态', width: '' }
      ],
      // 停车主机列表
      parkHostList: [],

      // 将要修改的弹窗数据
      editData: {},
      nameLable: '',
      locationLable: '',
      flag: false,
      hostBtn: false,
      rules: parkingManage.parkingManageRules,
      detector: parkingManage.detectorRules
    }
  },
  created() {
    this.getqueryDataDictBasicInfo()
    this.getServiceData()
  },
  watch: {
    flag: {
      handler(newValue) {
        console.log(newValue, '===')
        if (newValue) {
          this.hostBtn = true
        }
      }
    }
  },
  methods: {
    ...mapMutations(['CHANGE_TAB', 'CHANGE_EXA_BTN', 'CHANGE_EXA_SAVE']),
    ...mapActions([
      'addParkPlatform',
      'queryDataDictBasicInfo',
      'getServiceList',
      'batchSaveParkHost',
      'updateParkPlatform',
      'getPlatformHostList'
    ]),

    // 取消跳转到列表页
    skipToList() {
      // this.CHANGE_TAB('platformConfig-Create')
      this.CHANGE_TAB('platformConfig-List')
      this.$emit('skipToList')
    },
    // 弹窗取消
    skipToListBtn() {
      this.isEditDetector = false
    },
    // 主机导入
    hostExprot() {
      this.flag = true
      // obj为获取平台下主机的参数
      let obj = {
        devIp: this.formData.ip,
        devPort: this.formData.port
      }
      //   devIp: '10.1.1.98',
      //   devPort: '8090'
      this.getPlatformHostList(obj).then(res => {
        console.log(res, '111')
        //  res.data&&res.data.data
        if (res.data.code === 0 && res.data.data && res.data.data.length > 0 && this.parkHostList.length > 0) {
          if (this.parkHostList && this.parkHostList.length) {
            this.parkHostList = this.parkHostList.concat(res.data.data)
            this.$notify.success({
              title: '成功',
              message: '导入成功'
            })
          } else {
            if (this.parkHostList.length > 0) {
              this.parkHostList = []
              this.parkHostList = res.data.data
              this.$notify.success({
                title: '成功',
                message: '导入成功'
              })
            } else {
              this.$notify.success({
                title: '成功',
                message: '暂无数据'
              })
            }
          }
        }
      })
    },
    isCreateShow(val) {
      this.CHANGE_TAB('platformConfig-Create')
      this.formData = {}
      this.activeCreate = true
      this.activePrint = false
    },
    isEditShow(data, val) {
      this.formData = data
      // this.parkHostList = val
      this.isEditShowBtn = true
      this.activeCreate = true
      this.activePrint = false
    },
    // 主机批量保存
    hostSave() {
      this.parkHostList.map(item => {
        item.orgId = this.formData.orgId
        item.keyPartId = this.formData.keyPartId
        item.platformId = this.formData.uniqueId
      })
      console.log(this.parkHostList, 'this.parkHostList')
      this.batchSaveParkHost({ hosts: this.parkHostList }).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.hostBtn = false
          this.flag = false
          this.$notify.success({
            title: '成功',
            message: '保存成功'
          })
        }
      })
    },
    // 重置
    reset() {
      console.log(1)
      this.formData = {}
    },
    closePrint() {
      this.activePrint = false
      this.activeCreate = true
    },
    skip() {
      this.hostBtn = false
      this.flag = false
    },
    refresh() {},
    // 停车主机新增/编辑按钮
    openAddModal(val) {
      if (val === 'create') {
        this.modalTitle = '新增停车主机'
        this.isEditDetector = true
      } else {
        if (this.editData.length !== 1) {
          this.$notify.warning({
            title: '警告',
            message: '请选择一条'
          })
          return
        }
        this.modalTitle = '修改停车主机'
        this.isEditDetector = true
        this.detectorData = this.editData[0]
      }
    },
    // 新增/编辑主机(弹窗)的保存按钮
    dialogSave(val) {
      this.$refs.addForma.validate((valid) => {
        if (valid) {
          if (this.detectorData.port !== undefined) {
            this.detectorData.port = Number(this.detectorData.port)
          }
          if (this.modalTitle === '新增停车主机') {
            switch (this.detectorData.brand) {
              case '1':
                this.detectorData.brand = '海康'
                break
              case '2':
                this.detectorData.brand = '大华'
                break
              case '3':
                this.detectorData.brand = '达实'
                break
              case '4':
                this.detectorData.brand = '广日车库'
                break
              case '5':
                this.detectorData.brand = '百胜'
                break
              case '6':
                this.detectorData.brand = '科拓'
                break
              case '7':
                this.detectorData.brand = '披克'
                break
              case '8':
                this.detectorData.brand = '富士智能'
                break
              case '9':
                this.detectorData.brand = '东升安防'
                break
              case '10':
                this.detectorData.brand = '丽泽'
                break
              case '11':
                this.detectorData.brand = '西沃'
                break
              case '12':
                this.detectorData.brand = '建安顺'
                break
              case '13':
                this.detectorData.brand = '天翔'
                break
              case '14':
                this.detectorData.brand = '南泽'
                break
              case '15':
                this.detectorData.brand = '安道'
                break
              case '16':
                this.detectorData.brand = '浙江正元'
                break
              case '17':
                this.detectorData.brand = '大手'
                break
              case '18':
                this.detectorData.brand = '蓝卡'
                break
              case '19':
                this.detectorData.brand = '捷顺'
                break
            }
            this.parkHostList.push(this.detectorData)
            this.flag = true
            this.$notify.success({
              title: '成功',
              message: '添加成功'
            })
          } else {
            this.flag = true
            this.editData[0] = this.detectorData
          }
          this.isEditDetector = false
          this.detectorData = {}
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 停车主机选中
    hostSelectionChange(val) {
      console.log(val)
      this.editData = val
    },
    // 停车主机功能按钮
    Checkbox(ind) {
      this.editData = ind
    },
    deleteModal() {
      if (this.editData.length < 1) {
        this.$notify.warning({
          title: '警告',
          message: '请选择要删除的主机'
        })
      } else {
        this.flag = true
        var temp
        this.parkHostList.map(item => {
          if (this.editData.length) {
            this.editData.map(val => {
              if (val === item) {
                temp = this.parkHostList.indexOf(item)
                console.log(this.parkHostList.indexOf(item))
              }
            })
          }
          this.parkHostList.splice(this.parkHostList.indexOf(temp), 1)
        })
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
      }
    },
    // 停车平台保存
    savePlatform(data) {
      this.$refs.addForm.validate((valid) => {
        this.$refs.addForms.validate((valid) => {
          if (valid) {
            this.formData.nameLable = this.nameLable
            this.formData.locationLable = this.locationLable
            if (this.formData.port !== undefined) {
              this.formData.port = Number(this.formData.port)
            }
            if (this.isEditShowBtn) {
              console.log('是编辑的报讯', this.formData)
              this.updateParkPlatform(this.formData).then(res => {
                console.log(res)
                if (res.code === 0) {
                  this.activeCreate = false
                  this.activePrint = true
                  this.CHANGE_EXA_BTN(true)
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
            } else {
              this.addParkPlatform(this.formData).then(res => {
                console.log(res)

                if (res.data.code === 0) {
                  this.formData.id = res.data.data.id
                  this.activeCreate = false
                  this.activePrint = true
                  this.CHANGE_EXA_BTN(true)
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
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
    },

    // 接入服务器列表
    getServiceData() {
      this.getServiceList().then(res => {
        this.serverList = res.data
      })
    },
    // 数据字典获取
    getqueryDataDictBasicInfo() {
      this.queryDataDictBasicInfo({
        queryList: [
          {
            type: '2',
            moduleId: '1',
            childModuleId: '10',
            dictId: '6'
          }
        ]
      }).then(res => {
        this.brandList = res.data.data[0].attr
      })
    },
    // 机构数
    getTreeApi(params) {
      return getTreeApi(params)
    },
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.nameLable = data.name
        this.formData.orgId = data.id
        // this.getKeyPartSelect(data.id)
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        ;(this.formData.orgId = (parentNode.data && node.parent.data.id) || ''),
        (this.nameLable = (parentNode.data && node.parent.data.name) || ''),
        this.getKeyPartSelect(data.id, data)
      }
    },
    getKeyPartSelect(id, dataN) {
      // 获取机构下的重点部位
      this.positionList = []
      let params = {
        type: 2,
        oId: id,
        subSystem: '6',
        isRecursion: '0'
      }
      this.getTreeApi(params).then(res => {
        if (res.data.code === 0) {
          if (dataN.id) {
            this.formData.keyPartId = dataN.id
            this.locationLable = dataN.name
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../assets/elementModify.less';
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 280px;
    border: 1px solid #e1e1e1;
    .treeBox {
      padding: 10px 10px;
    }
  }
  .right-content {
    font-size: 12px;
    padding-top: 10px;
    width: calc(~'100% - 280px');
    padding-left: 10px;
    box-shadow: 0 0 10px #ccc inset;
    .form-box {
      .form-top {
        width: 846px;
        text-align: center;
        padding: 30px 0;
      }
      .clear {
        clear: both;
      }
      .form-content {
        display: flex;
        width: 846px;
        min-height: 258;
        margin-left: 100px;
        padding: 10px;
        font-size: 12px;
        border: 1px solid #f7f2f1;
        /deep/.el-select > .el-input {
          width: 280px;
        }

        .left-form {
          flex: 1;
          width: 400px;
          margin-right: 24px;
        }
        .right-form {
          //float: left;
          width: 400px;
        }
      }
      .detail-bottom {
        color: #666;
        width: 60%;
        padding: 8px;
        border: 1px solid #f2f2f2;
        display: flex;
        flex-wrap: wrap;
        margin: 48px;
        margin-left: 94px;
        .detail-item {
          display: flex;
          width: 50%;
          height: 32px;
          line-height: 32px;
          .item-left {
            width: 80;
            text-align: center;
            padding: 0px 22px;
            background: #f8f8f8;
            border: 1px solid #fff;
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
      .form-footer {
        margin-top: 12px;
        width: 846px;
        text-align: center;
      }
    }
    .bottom-btn {
      margin-top: 12px;
      width: 846px;
      text-align: center;
    }
    .box-title {
      position: relative;
      height: 24px;
      line-height: 24px;
      margin-left: 49px;
      margin-top: 32px;
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
          background: #f7f2f1;
        }
      }
    }
  }
}
</style>
