<template>
  <div class="creat-box">
    <div class="tree-content">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="filter"
               :treeType="treeType"
               @onceClick="onceClick"
               treeLazyToggle
               iconToggle
               :customizeQuery="customizeQuery"
               ref="tree"></treeBox>
    </div>
    <div class="content">
      <div class="content-box">
        <div class="header"
             v-if="moveShow  && !isShowSort">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>防护舱管理</el-breadcrumb-item>
            <el-breadcrumb-item>防护舱主机配置</el-breadcrumb-item>
            <el-breadcrumb-item class="active">{{title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="button-box"
             v-if="createPreview && moveShow  && !isShowSort">
          <div v-if="showToprint">
            <el-button size="small"
                       @click="createDevice"
                       icon="el-icon-plus">新建</el-button>
            <el-button size="small"
                       @click="updateDevice"
                       icon="el-icon-edit">编辑</el-button>
            <el-button size="small"
                       @click="deleteDevice"
                       icon="el-icon-delete">删除</el-button>
            <el-button size="small"
                       @click="getNum"
                       icon="el-icon-circle-check">获取</el-button>
            <el-button size="small"
                       @click="copyDevice"
                       icon="el-icon-document">复制</el-button>
            <el-button size="small"
                       @click="move"
                       icon="el-icon-rank">迁移</el-button>
            <el-button size="mini"
                       @click="sort"
                       icon="el-icon-sort">排序</el-button>
            <el-button size="small"
                       @click="showToprint=false;showOptIcon=false"
                       icon="el-icon-printer">打印</el-button>
          </div>
          <div v-else>
            <el-button size="small"
                       v-print="'#contentinfo'">打印</el-button>
            <el-button size="small"
                       @click="showToprint=true">取消</el-button>
          </div>
        </div>
        <div class="main"
             v-if="moveShow && !isShowSort">
          <div v-if="!createPreview">
            <div class="title-box">{{
              jumpType === 'AddEquipment' ? '新增防护舱主机设备' : (jumpType === 'Update'||jumpType === 'Updates' ? '编辑防护舱主机设备' : '防护舱主机查看')}}</div>
            <div class="form-save">
              <el-form size="mini"
                       ref="deviceModel"
                       :model="deviceModel"
                       :rules="rules">
                <el-form-item label="防护舱主机名称"
                              prop="name">
                  <el-input v-model="deviceModel.name"></el-input>
                </el-form-item>
                <el-form-item label="资产编码"
                              prop="assetCode">
                  <el-input v-model="deviceModel.assetCode"></el-input>
                </el-form-item>
                <el-form-item label="所属机构">
                  <el-input placeholder="所属机构"
                            v-model="orgObj.name"
                            disabled></el-input>
                </el-form-item>
                <el-form-item label="所属重点部位"
                              prop="keyPartId">
                  <el-select v-model="deviceModel.keyPartId"
                             disabled>
                    <el-option v-for="item in keyParts"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="IP地址"
                              prop="ip">
                  <el-input placeholder="IP地址"
                            v-model="deviceModel.ip"></el-input>
                </el-form-item>
                <el-form-item label="设备序列号"
                              prop="deviceSerise">
                  <el-input v-model="deviceModel.deviceSerise"></el-input>
                </el-form-item>
                <el-form-item label="接入服务器"
                              prop="accessService"
                              required
                              :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                  <el-select v-model="deviceModel.accessService"
                             :popper-append-to-body="false">
                    <el-option v-for="item in serverSelectData"
                               :key="item.label"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="端口"
                              prop="port">
                  <el-input v-model.number="deviceModel.port"></el-input>
                </el-form-item>
                <el-form-item label="设备品牌"
                              prop="brand"
                              required
                              :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                  <el-select v-model="deviceModel.brand"
                             @change='updateList'>
                    <el-option v-for="(item,i) in brands"
                               :key="i"
                               :label="item.data"
                               :value="item.data || item.label">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="型号"
                              required
                              prop="modelNum"
                              :rules="[{ required: true, message: '必填', trigger: 'change' }]">
                  <el-select v-model="deviceModel.modelNum">
                    <el-option v-for="(item,i) in modelNumList"
                               :key="i"
                               :label="item.data"
                               :value="item.data"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="用户名"
                              prop="username">
                  <el-input v-model="deviceModel.username"></el-input>
                </el-form-item>
                <el-form-item label="密码"
                              prop="password">
                  <el-input v-model="deviceModel.password"
                            type="password"></el-input>
                </el-form-item>
                <el-form-item label="防护舱通道数量"
                              prop="cabinNumber">
                  <el-input v-model.number="deviceModel.cabinNumber"></el-input>
                </el-form-item>
                <el-form-item label="报警输入数量"
                              prop="inputNumber">
                  <el-input v-model.number="deviceModel.inputNumber"></el-input>
                </el-form-item>
                <el-form-item label="报警输出数量"
                              prop="outputNumber">
                  <el-input v-model.number="deviceModel.outputNumber"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="creat-message">
              <span>录入时间</span>
              <span>{{deviceModel.updatedAt}}</span>
              <span>录入机构</span>
              <span>{{deviceModel.updatedDept}}</span>
              <span>录入人</span>
              <span>{{deviceModel.updatedBy}}</span>
            </div>
            <div class="form-footer">
              <el-button type="primary"
                         size="small"
                         style="margin-right:10px;"
                         @click="saveDevice()"
                         :loading="loadingSave">{{loadingSave?'保存中':'保存'}}</el-button>
              <el-button size="small"
                         style="margin-right:10px;"
                         @click="goBack">取消</el-button>
              <el-button size="small"
                         @click="clearObj">重置</el-button>
            </div>
          </div>
          <div id='contentinfo'>
            <!-- 新建预览表单 -->
            <div class="form-box"
                 style="margin-bottom:10px;"
                 v-if="createPreview && moveShow && !isShowSort">
              <div class="title">
                <span>防护舱主机设备</span>
              </div>
              <div class="message-box">
                <div class="info-detail">
                  <span>防护舱主机名称</span>
                  <span>{{deviceModel.name}}</span>
                  <span>资产编码</span>
                  <span>{{deviceModel.assetCode}}</span>
                </div>
                <div class="info-detail">
                  <span>所属机构</span>
                  <span>{{orgObj.name}}</span>
                  <span>所属重点部位</span>
                  <span>{{deviceModel.keyPartName}}</span>
                </div>
                <div class="info-detail">
                  <span>设备序列号</span>
                  <span>{{deviceModel.deviceSerise}}</span>
                  <span>接入服务器</span>
                  <span>{{deviceModel.accessService}}</span>
                </div>
                <div class="info-detail">
                  <span>IP地址</span>
                  <span>{{deviceModel.ip}}</span>
                  <span>端口</span>
                  <span>{{deviceModel.port}}</span>
                </div>
                <div class="info-detail">
                  <span>品牌</span>
                  <span>{{deviceModel.brand}}</span>
                  <span>型号</span>
                  <span>{{deviceModel.modelNum}}</span>
                </div>
                <div class="info-detail">
                  <span>用户名</span>
                  <span>{{deviceModel.username}}</span>
                  <span>密码</span>
                  <span>{{deviceModel.password}}</span>
                </div>
                <div class="info-detail">
                  <span>防护舱通道数量</span>
                  <span>{{deviceModel.cabinNumber}}</span>
                  <span>报警输入数量</span>
                  <span>{{deviceModel.inputNumber}}</span>
                </div>
                <div class="info-detail">
                  <span>报警输出数量</span>
                  <span>{{deviceModel.inputNumber}}</span>
                  <span>&nbsp;</span>
                  <span>&nbsp;</span>
                </div>
              </div>
              <div class="creat-messages">
                <span>录入时间</span>
                <span>{{deviceModel.updatedAt}}</span>
                <span>录入机构</span>
                <span>{{deviceModel.updatedDept}}</span>
                <span>录入人</span>
                <span>{{deviceModel.updatedBy}}</span>
              </div>
            </div>
            <!-- 底部Tab -->
            <create-result :id="deviceId"
                           :devInfo="devInfo"
                           :reloadChanelInfo="reloadChanelInfo"
                           :deviceName="deviceName"
                           :showOptIcon='showOptIcon'
                           v-if="jumpType !== 'AddEquipment'"></create-result>
          </div>
        </div>
        <move v-if="!moveShow"
              :migrantData="[deviceData]"
              type='2'></move>
        <SortEquipment v-if="isShowSort"
                       :isShowSort.sync="isShowSort"
                       :aisleTableData='sortArr'></SortEquipment>
      </div>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import CreateResult from './CreateResult'
import { brandOrModelNum } from '@src/http/access/getId'
import SortEquipment from './SortEquipment'
import {
  addDeviceApi,
  putDeviceApi,
  deleteDeviceApi,
  getServersApi,
  getDeviceInfoApi,
  getNvrChannelInfoApi,
} from '@src/http/video/videoConfig.api.js'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import {
  BRANDS,
  MODELS,
  PROTOCOL,
  TRANSPORTPROTOCOLS,
  DEVICETYPE,
  CHANNLECOUNT,
} from '@src/view/videoManage/components/selectConf'
import {
  addHostApi,
  listInfoApi,
  deleteHostApi,
  information,
  updateHostApi,
  getBasicInfo,
  getChannes,
  getHostApi,
} from '../../../../http/protectiveCabin/channe.api'
import move from '../../components/Move'
export default {
  components: {
    treeBox,
    CreateResult,
    move,
    SortEquipment,
  },
  props: {
    deviceData: {
      type: Object,
      require: true,
    },
    optType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loadingSave: false,
      showOptIcon: true,
      reloadChanelInfo: true,
      treeType: 2,
      brands: [],
      customizeQuery: {
        params: {
          subSystem: '1',
          isRecursion: '0',
          channelType: '1',
        },
      },
      moveShow: true,
      orgObj: {
        id: this.deviceData.orgId || '',
        name: this.deviceData.orgName || '',
      },
      sortArr: [],
      isShowSort: false,
      devInfo: {},
      keyParts: [],
      modelNumList: [],
      jumpType: this.optType,
      deviceModel: this.deviceData,
      serverSelectData: [], // 服务器下拉列表
      createPreview: false,
      showToprint: true,
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '必填', trigger: 'change' },
          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' },
        ],
        ip: [
          { required: true, message: '必填', trigger: 'change' },
          {
            pattern: /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: '请输入合法的IP',
          },
        ],
        assetCode: [{ min: 0, max: 64, message: '长度小于64个字符', trigger: 'blur' }],
        deviceSerise: [{ min: 0, max: 64, message: '长度小于64个字符', trigger: 'blur' }],
        keyPartId: [{ required: true, message: '必填', trigger: 'change' }],
        port: [
          { required: true, message: '必填', trigger: 'change' },
          { type: 'number', message: '端口号必须为整数', trigger: 'blur' },
          { type: 'number', max: 65535, message: '端口号不能大于65535', trigger: 'blur' },
        ],
        cabinNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
        ],
        inputNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
        ],
        outputNumber: [
          { type: 'number', message: '数量必须为整数', trigger: 'blur' },
          { type: 'number', max: 64, message: '数量不能大于64', trigger: 'blur' },
        ],
      },
    }
  },
  // watch: {
  //   'deviceModel.inputNumber': {
  //     handler: function (val) {
  //       if (val == '') {
  //         this.deviceModel.inputNumber = 0
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  created() {
    this.getServerData() // 后期接口需要变动
    let brands = [{ moduleId: '1', childModuleId: '6', dictId: '1' }]
    getBasicInfo({ queryList: brands }).then((res) => {
      this.brands = res.data.data[0].attr
    })
    // // let modelNums =
    // brandOrModelNum({ queryList }).then((res) => {
    //   this.brands = res.data.data[0].attr
    // })
    if (!this.orgObj.id) {
      return
    }
    if (this.jumpType === 'Update' || this.jumpType === 'Updates') {
      this.keyParts = [
        {
          label: this.deviceModel.keyPartName,
          value: this.deviceModel.keyPartId,
        },
      ]
    } else {
      this.getKeyPartSelect(this.orgObj.id)
    }
    information({ ids: [this.orgObj.id], type: 2 }).then((res) => {
      console.log(res)
    })
  },
  computed: {
    // models () {
    //   let curType = this.brands.find(i => i.value === this.deviceModel.brand)
    //   let type = curType && curType.label
    //   return MODELS[type] || []
    // },
    title() {
      if (this.jumpType === 'AddEquipment') {
        return '新建'
      } else if (this.jumpType === 'Update' || this.jumpType === 'Updates') {
        return '编辑'
      } else {
        return '新建预览'
      }
    },
    deviceId: {
      // 记录当前的设备id
      get() {
        return this.deviceModel.id || ''
      },
      set(val) {},
    },
    deviceName() {
      // 记录当前的设备名称
      return this.deviceModel.name || ''
    },
  },
  methods: {
    getNum() {
      getChannes({ ids: [this.orgObj.id] }).then((res) => {
        this.$messageSuccess(res.data.data[0].message)
      })
    },
    clearObj() {
      if (this.jumpType === 'AddEquipment') {
        this.deviceModel = this.createModel()
      } else {
        this.deviceModel = this.updateModel()
      }
    },
    move() {
      this.moveShow = false
    },
    //排序
    sort() {
      getHostApi({ keyPartId: this.deviceModel.keyPartId }).then((res) => {
        this.sortArr = res.data.data.hosts
        this.isShowSort = true
      })
    },
    // 打印
    Toprint() {
      printJS('main', 'html')
    },
    copyDevice() {
      let oldModel = this.$lodash.cloneDeep(this.deviceModel)
      let newModel = this.createModel()
      Object.keys(oldModel).forEach((key) => {
        if (newModel.hasOwnProperty(key)) {
          newModel[key] = oldModel[key]
        }
      })
      this.deviceModel = this.$lodash.cloneDeep(newModel)
      this.createPreview = false
      this.jumpType = 'AddEquipment'
    },
    deleteDevice() {
      this.$confirm('请确定该设备是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteHostApi({
            ids: [this.deviceId],
          }).then((res) => {
            if (res.data.code === 0) {
              this.$messageSuccess('删除成功!')
              this.$parent.$parent.childrenComponent = 'EquipmentList'
            } else {
              this.$messageError(res.data.message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    createDevice() {
      this.deviceModel = this.createModel()
      this.createPreview = false
      this.jumpType = 'AddEquipment'
    },
    updateDevice() {
      let oldModel = this.$lodash.cloneDeep(this.deviceModel)
      this.deviceModel = {
        ...this.updateModel(),
        ...oldModel,
      }
      this.createPreview = false
      this.jumpType = 'Updates'
    },
    goBack() {
      // 返回列表
      this.$confirm('请确定放弃保存正在编辑的内容吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$parent.$parent.childrenComponent = 'EquipmentList'
        })
        .catch(() => {})
    },
    updateModel() {
      let oid = this.orgObj.id
      return {
        orgId: oid,
        keyPartId: '',
        keyPartType: '',
        subSystem: 1,
        assetCode: '',
        uniqueId: '',
        name: '',
        type: '',
        brand: '',
        modelNum: '',
        accessServer: '192.168.30.61',
        username: '',
        password: '',
        ip: '',
        accessProtocol: '',
        protocol: '',
        inputNumber: 0,
        outputNumber: 0,
        analogNumber: 0,
        digitalNumber: 0,
        audioNumber: 0,
      }
    },
    createModel() {
      return {
        name: '',
        accessService: '',
        ip: '',
        brand: '',
        username: '',
        assetCode: '',
        cabinNumber: '',
        outputNumber: '',
        inputNumber: '',
        port: '',
        password: '',
        modelNum: '',
        orgId: '',
        keyPartId: '',
        orgName: '',
        keyPartName: '',
        keyPartType: '',
        deviceSerise: '',
        sdk: '',
      }
    },
    onceClick(data, node) {
      // 点击机构返回重点部位的下拉，记录当前节点的信息
      if (this.jumpType !== 'Update' && this.jumpType !== 'Updates') {
        if (data.tierType === 'org') {
          this.orgObj = {
            id: data.id,
            name: data.name,
          }
          this.deviceModel.keyPartId = ''
          this.getKeyPartSelect(data.serial) // 请求机构的关系，现在需要换成serial字段，todo，不清楚修改后对配置的影响
        } else {
          let parentNode = node.parent
          if (!parentNode) {
            return
          }
          this.orgObj = {
            id: (parentNode.data && node.parent.data.id) || '',
            name: (parentNode.data && node.parent.data.name) || '',
          }
          this.deviceModel.keyPartType = data.keyPartType
          this.getKeyPartSelect(parentNode.data.serial, data.id)
        }
      }
    },
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getServerData() {
      // 获取服务器下拉列表
      getServersApi()
        .then((res) => {
          res.data &&
            res.data.forEach((item) => {
              this.serverSelectData.push({
                label: item,
                value: item,
              })
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //点击品牌获取类型
    updateList(item) {
      this.modelNumList = []
      this.deviceModel.sdk = ''
      this.deviceModel.modelNum = ''
      let modelNums = [{ moduleId: '1', childModuleId: '6', dictId: '2' }]
      getBasicInfo({ queryList: modelNums }).then((res) => {
        res.data.data[0].attr.forEach((i) => {
          if (i.homeClass === item) {
            this.modelNumList.push(i)
            if (i.sdkName) {
              this.deviceModel.sdk = i.sdkName
            }
          }
        })
      })
    },
    getKeyPartSelect(oId, kId) {
      // 获取机构下的重点部位
      this.keyParts = []
      let params = {
        type: 2,
        oId: oId,
        subSystem: '1',
        isRecursion: '0',
      }
      this.getTreeApi(params).then((res) => {
        if (res.data.code === 0) {
          if (kId) {
            this.deviceModel.keyPartId = kId
          }
          let data = res.data.data.nodes
          data.forEach((item) => {
            if (item.tierType === 'loc') {
              this.keyParts.push({
                label: item.name,
                value: item.id,
                type: item.keyPartType,
              })
            }
          })
        }
      })
    },
    saveDevice() {
      // zp 添加校验
      this.$refs['deviceModel'].validate((valid) => {
        if (valid) {
          this.deviceModel.orgId = this.orgObj.id
          if (this.jumpType === 'AddEquipment' || this.jumpType === 'Copy') {
            this.loadingSave = true
            addHostApi(this.deviceModel).then((res) => {
              this.loadingSave = false
              if (res.data.code === 0) {
                this.$messageSuccess('新增设备成功')
                this.deviceData.id = res.data.data.id
                this.deviceId = res.data.data.id
                // 获取单个设备详情
                listInfoApi(res.data.data.id).then((res) => {
                  this.deviceModel = res.data.data.host
                })
                this.createPreview = true
                this.jumpType = 'CreatePreview'
              } else {
                this.$messageError(res.data.message)
              }
            })
          } else if (this.jumpType === 'Update') {
            this.loadingSave = true
            updateHostApi({ id: this.deviceModel.id, message: this.deviceModel }).then((res) => {
              this.loadingSave = false
              if (res.data.code === 0) {
                this.$messageSuccess('修改设备成功')
                this.$parent.$parent.childrenComponent = 'EquipmentList'
              } else {
                this.$messageError(res.data.message)
              }
            })
          } else if (this.jumpType === 'Updates') {
            this.loadingSave = true
            updateHostApi({ id: this.deviceModel.id, message: this.deviceModel }).then((res) => {
              this.loadingSave = false
              if (res.data.code === 0) {
                this.$messageSuccess('修改设备成功')
                this.createPreview = true
                this.jumpType = 'CreatePreview'
              } else {
                this.$messageError(res.data.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    getMessage() {
      listInfoApi(this.deviceModel.id).then((res) => {
        this.deviceModel = res.data.data.host
      })
    },
  },
}
</script>

<style scoped lang='less'>
.creat-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-content {
    width: 290px;
    height: auto;
    background: #fff;
    padding: 17px 9px 0px 9px;
    box-sizing: border-box;
  }
  .content {
    width: calc(~'100% - 290px');
    height: 100%;
    background: #eaeef3;
    padding: 6px 7px 0px 8px;
    .content-box {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 0px 25px 0px 24px;
      box-sizing: border-box;
      .header {
        padding: 17px 0 21px;
        /deep/ .el-breadcrumb {
          font-size: 12px;
          .active {
            .el-breadcrumb__inner {
              color: #2d72d3;
            }
          }
        }
      }
      .main {
        margin-top: 14px;
        height: calc(~'100% - 103px');
        overflow: auto;
        .title-box {
          width: 975px;
          height: 13px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: center;
          line-height: 13px;
          margin-bottom: 12px;
        }
        .form-save {
          width: 975px;
          background: rgba(245, 245, 245, 1);
          padding: 12px 12px 0px 13px;
          box-sizing: border-box;
          margin-bottom: 30px;
          /deep/ .el-form {
            .el-form-item {
              display: inline-block;
              .el-form-item__label {
                line-height: 35px;
                padding-right: 10px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                min-width: 103px;
              }
              .el-form-item__content {
                display: inline-block;
                .el-input {
                  .el-input__inner {
                    width: 356px;
                    height: 35px;
                    border-radius: 0px;
                  }
                }
              }
            }
            .el-form-item:nth-child(odd) {
              margin-right: 26px;
            }
          }
        }
        .creat-message {
          width: 975px;
          height: 35px;
          border: 1px solid rgba(225, 225, 225, 1);
          display: flex;
          margin-bottom: 30px;
          span:nth-child(odd) {
            width: 155px;
            height: 100%;
            background: rgba(245, 245, 245, 1);
            text-align: center;
            line-height: 35px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(34, 34, 34, 1);
          }
          span:nth-child(even) {
            width: 170px;
            height: 100%;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(34, 34, 34, 1);
            line-height: 35px;
            text-align: center;
          }
        }
        .form-footer {
          width: 975px;
          text-align: center;
        }
        .form-box {
          width: 1000px;
          margin-bottom: 40px;
          .title {
            width: 100%;
            text-align: center;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
          .message-box {
            border: 1px solid #e1e1e1;
            border-bottom: none;
            margin-top: 12px;
            margin-bottom: 25px;
            .info-detail {
              width: 100%;
              display: flex;
              height: 35px;
              border-bottom: 1px solid #e1e1e1;
              span {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                display: inline-block;
                line-height: 34px;
              }
              span:nth-child(odd) {
                width: 152px;
                height: 100%;
                background: #f5f5f5;
                padding-left: 34px;
                box-sizing: border-box;
              }
              span:nth-child(even) {
                width: 329px;
                height: 100%;
                background: #fff;
                padding-left: 32px;
                box-sizing: border-box;
              }
            }
          }
          .creat-messages {
            width: 1000px;
            height: 35px;
            border: 1px solid rgba(225, 225, 225, 1);
            display: flex;
            margin-bottom: 30px;
            span:nth-child(odd) {
              width: 155px;
              height: 100%;
              background: rgba(245, 245, 245, 1);
              text-align: center;
              line-height: 35px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(34, 34, 34, 1);
            }
            span:nth-child(even) {
              width: 170px;
              height: 100%;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(34, 34, 34, 1);
              line-height: 35px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang='less'>
@media print {
  #contentinfo {
    .form-save {
      width: 975px;
      background: rgba(245, 245, 245, 1);
      padding: 12px 12px 0px 13px;
      box-sizing: border-box;
      margin-bottom: 30px;
      /deep/ .el-form {
        .el-form-item {
          display: inline-block;
          .el-form-item__label {
            line-height: 35px;
            padding-right: 10px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            min-width: 103px;
          }
          .el-form-item__content {
            display: inline-block;
            .el-input {
              .el-input__inner {
                width: 356px;
                height: 35px;
                border-radius: 0px;
              }
            }
          }
        }
        .el-form-item:nth-child(odd) {
          margin-right: 26px;
        }
      }
    }
    .creat-message {
      width: 975px;
      height: 35px;
      border: 1px solid rgba(225, 225, 225, 1);
      display: flex;
      margin-bottom: 30px;
      span:nth-child(odd) {
        width: 155px;
        height: 100%;
        background: rgba(245, 245, 245, 1);
        text-align: center;
        line-height: 35px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
      }
      span:nth-child(even) {
        width: 170px;
        height: 100%;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
        line-height: 35px;
        text-align: center;
      }
    }
    .form-footer {
      width: 975px;
      text-align: center;
    }
    .form-box {
      width: 1000px;
      margin-bottom: 40px;
      .title {
        width: 100%;
        text-align: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .message-box {
        border: 1px solid #e1e1e1;
        border-bottom: none;
        margin-top: 12px;
        margin-bottom: 25px;
        .info-detail {
          width: 100%;
          height: 35px;
          border-bottom: 1px solid #e1e1e1;
          display: flex;
          span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            display: inline-block;
            line-height: 34px;
          }
          span:nth-child(odd) {
            width: 152px;
            height: 100%;
            background: #f5f5f5;
            padding-left: 34px;
            box-sizing: border-box;
          }
          span:nth-child(even) {
            width: 329px;
            height: 100%;
            background: #fff;
            padding-left: 32px;
            box-sizing: border-box;
          }
        }
      }
      .creat-messages {
        width: 1000px;
        height: 35px;
        border: 1px solid rgba(225, 225, 225, 1);
        display: flex;
        margin-bottom: 30px;
        span:nth-child(odd) {
          width: 155px;
          height: 100%;
          background: rgba(245, 245, 245, 1);
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
        }
        span:nth-child(even) {
          width: 170px;
          height: 100%;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(34, 34, 34, 1);
          line-height: 35px;
          text-align: center;
        }
      }
    }
  }
}
</style>
