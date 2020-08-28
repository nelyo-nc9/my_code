<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTvWallTreeApi"
               @onceClick="onceClick"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               treeLazyToggle
               iconToggle>
      </treeBox>
    </div>
    <div class="right-content">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline"
               style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>电视墙管理</el-breadcrumb-item>
            <el-breadcrumb-item>LED设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="messageWrap">
          <div class="messagetitle">
            <span>编辑LED设备信息</span>
          </div>
          <div class="messageTable">
            <div class="form-content">
              <div class="left-form">
                <el-form ref="addForm"
                         size="mini"
                         :rules="rules"
                         :model="formDataCopy"
                         label-position="right"
                         label-width="110px">
                  <el-form-item label="设备名称"
                                required
                                prop="name"
                                class="maBottom">
                    <el-input v-model="formDataCopy.name"></el-input>
                  </el-form-item>
                  <el-form-item label="所属机构"
                                required
                                prop="orgName"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.orgName"></el-input>
                  </el-form-item>
                  <el-form-item label="所属重点部位"
                                required
                                prop="keyPartName"
                                class="maBottom">
                    <el-input disabled
                              v-model="formDataCopy.keyPartName"></el-input>
                  </el-form-item>
                  <el-form-item label="接入服务器"
                                required
                                class="maBottom"
                                prop="accessService">
                    <el-select v-model="formDataCopy.accessService">
                      <el-option v-for="item in devModelList4"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="IP地址"
                                required
                                prop="ip"
                                class="maBottom">
                    <el-input v-model="formDataCopy.ip"></el-input>
                  </el-form-item>
                  <el-form-item label="端口"
                                required
                                prop="port"
                                class="maBottom">
                    <el-input v-model.number="formDataCopy.port"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="right-form">
                <el-form size="mini"
                         ref="addForm2"
                         :rules="rules"
                         :model="formDataCopy"
                         label-position="right"
                         label-width="110px">
                  <el-form-item label="资源编码"
                                class="maBottom"
                                prop="assetCode">
                    <el-input v-model="formDataCopy.assetCode"></el-input>
                  </el-form-item>
                  <el-form-item label="所属电视墙"
                                class="maBottom">
                    <el-select v-model="formDataCopy.wallName"
                               @change="changeTv">
                      <el-option v-for="item in TvList"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="品牌"
                                class="maBottom"
                                required
                                prop="brand">
                    <el-select v-model="formDataCopy.brand"
                               @change="changeBrand">
                      <el-option v-for="item in devModelList"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="型号"
                                required
                                prop="modelNum"
                                class="maBottom">
                    <el-select v-model="formDataCopy.modelNum"
                               @change="selectData2">
                      <el-option v-for="item in devModelList1"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="用户名"
                                required
                                prop="username"
                                class="maBottom">
                    <el-input v-model="formDataCopy.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码"
                                required
                                prop="password"
                                class="maBottom">
                    <el-input v-model="formDataCopy.password"
                              show-password></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          <div class="form-footer">
            <el-button type="primary"
                       size="small"
                       @click="succfulMethod">保存</el-button>
            <el-button size="small"
                       @click="skipToList">取消</el-button>
            <el-button size="small"
                       @click="resetMethod">重置</el-button>
          </div>
          <div class="from-contend-last">
            <div class="last-title">
              <ul>
                <li :class="{ 'active-tab': changPage === index }"
                    v-for="(label, index) in btnArr"
                    :key="label"
                    @click="changeWho(label, index)">
                  {{ label }}
                </li>
              </ul>
            </div>
            <div class="tableWrap">
              <div class="decodingWrap"
                   v-if="pageFlag">
                <div class="box-title"
                     @click="toggleOpen(dropdownStatus)">
                  <span class="pointer">
                    LED分区列表
                    <i :class="dropdownStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                  </span>
                </div>
                <div class="list"
                     v-if="dropdownStatus">
                  <div class="list-header">
                    <i class="el-icon-circle-plus-outline"
                       title="新增"
                       @click="openAddLedModal"></i>
                    <i class="el-icon-edit"
                       title="编辑"
                       @click="openEditLedModal"></i>
                    <i class="el-icon-delete"
                       title="删除"
                       @click="delectMethod"></i>
                    <i class="el-icon-refresh-right"
                       title="刷新"
                       @click="refreshMethod"></i>
                  </div>
                  <el-table ref="multipleTable"
                            border
                            :data="tableData"
                            style="width: 100%;font-size:12px"
                            @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column type="index"
                                     label="序号"
                                     width="50"></el-table-column>
                    <el-table-column v-for="(item, index) in tableColumn"
                                     :key="index"
                                     :prop="item.mark"
                                     :label="item.label"
                                     :width="item.width"
                                     show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="channeWrap"
                   v-if="!pageFlag">
                <div class="channe-title">
                  <span>设备异常</span>
                </div>
                <div class="channe-contend">
                  <div class="channe-contend-title">
                    <span>异常类型</span>
                  </div>
                  <div class="channe-contend-const">
                    <el-select v-model="value">
                      <el-option v-for="item in devModelList2"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <div class="channe-contend-checked">
                    <el-checkbox v-model="checked">启用</el-checkbox>
                  </div>
                </div>
                <div class="channe-footer">
                  <el-button type="primary"
                             size="small"
                             @click="abnormalSave">保存</el-button>
                  <el-button size="small"
                             @click="abnormalDis">取消</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <ul>
              <li>
                <div class="title">
                  <span>录入时间</span>
                </div>
                <div class="const">{{ formDataCopy.updatedAt }}</div>
              </li>
              <li>
                <div class="title">
                  <span>录入机构</span>
                </div>
                <div class="const">{{ formDataCopy.updatedDept }}</div>
              </li>
              <li>
                <div class="title">
                  <span>录入人</span>
                </div>
                <div class="const">{{ formDataCopy.updatedBy }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹框(LED新增和修改) -->
    <el-dialog :title="modalTitle"
               :visible.sync="isEditLed"
               width="460px"
               class="model-wrap">
      <el-form v-if="isEditLed"
               ref="dialogForm"
               size="mini"
               :model="ledChanneData"
               label-position="right"
               label-width="80px"
               :rules="dialogRules">
        <el-form-item label="分区名称"
                      prop="name">
          <el-input v-model="ledChanneData.name"></el-input>
        </el-form-item>
        <el-form-item label="分区编号"
                      prop="serise">
          <el-input v-model="ledChanneData.serise"></el-input>
        </el-form-item>
        <el-form-item label="资源权限"
                      class="last-item"> </el-form-item>
        <el-form-item label=" ">
          <el-tabs v-model="tabs">
            <el-tab-pane label="机构"
                         name="first">用户管理</el-tab-pane>
          </el-tabs>
          <div>
            <treeBox ref="treeDiv"
                     :default-checked-keys="(ledChanneData.extend2 || '').split(',')"
                     :lazyTreeApi="getLedTreeApi"
                     checkboxToggle
                     treeLazyToggle
                     iconToggle
                     :lazyTreeSearchApi="getLazyTreeSearchorgApi"
                     searchType="search" />
          </div>

        </el-form-item>
      </el-form>

      <div style="text-align:center;"
           v-if="isEditLed">
        <el-button size="small"
                   type="primary"
                   v-if="changeOrCreatBtn"
                   @click="saveOutChannlData(1)">保存</el-button>
        <el-button size="small"
                   type="primary"
                   v-if="!changeOrCreatBtn"
                   @click="saveOutChannlData(2)">保存</el-button>
        <el-button size="small"
                   @click="isEditLed = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import treeBox from '@src/components/tree/treeBox'
import { getTvWallTreeApi, getLedTreeApi, searchTreeToWallApi, searchTreeApi2 } from '../../../../http/tvWall/tvWallmanage.api'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData: ({ tvWall }) => tvWall.tvWallData, // 接受详细信息页面传过来的数据
      formIndex: ({ tvWall }) => tvWall.whocomponentIndex
    })
  },
  data() {
    return {
      // 表单验证
      rules: {
        name: [
          { required: true, message: '解码设备名称不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [{ pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }],
        username: [
          { required: true, message: '用户名不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        accessService: [{ required: true, message: '接入服务器不能为空' }],
        password: [
          { required: true, message: '密码不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        port: [
          { required: true, message: '端口不能为空' },
          { type: 'number', min: 0, max: 65535, message: '请填写0~65535范围端口' }
        ],
        ip: [
          { required: true, message: 'ip不能为空' },
          {
            pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
            message: '请输入合法的IP'
          }
        ],
        keyPartName: [{ required: true, message: '重点部位不能为空' }],
        brand: [{ required: true, message: '品牌不能为空' }],
        modelNum: [{ required: true, message: '型号不能为空' }],
        orgName: [{ required: true, message: '所属机构不能为空' }]
      },
      formDataCopy: {},
      tableData: [],
      tableColumn: [
        {
          mark: 'name',
          label: '分区名称',
          width: ''
        },
        {
          mark: 'serise',
          label: '分区编号',
          width: ''
        },
        {
          mark: 'extend',
          label: '资源权限',
          width: ''
        }
      ],
      checked: false,
      btnArr: ['通道管理', '事件管理'],
      changPage: 0,
      pageFlag: true, // 页面切换开关
      value: '',
      dropdownStatus: true,
      /**
       * 字典数据:所属电视墙
       * */
      TvList: [],
      // 设备品牌下拉选项
      devModelList: [],
      // 设备型号下拉选项
      devModelList1: [],
      devModelList2: [
        // 异常下拉选项
        { label: '网络断开', value: '网络断开' },
        { label: '时间异常', value: '时间异常' }
      ],
      // 接入服务下拉选项
      devModelList4: [],
      // 分区列表选中数据
      multipleSelection: [],
      isEditLed: false,
      changeOrCreatBtn: true,
      modalTitle: '添加LED分区',
      ledChanneData: {},
      tabs: 'first',
      dialogRules: {
        name: [{ required: true, message: '分区名称不可为空', trigger: 'blur' }],
        serise: [{ required: true, message: '分区编号不可为空', trigger: 'blur' }]
      }
    }
  },
  created() { },
  mounted() {
    this.formDataCopy = JSON.parse(JSON.stringify(this.formData)) // 克隆(避免直接修改vue里的数据)
    this.initializationMethod() // 调用页面初始化函数
  },
  beforeDestroy() { },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2']),
    ...mapActions([
      'changeDecodingDevice',
      'getTvWallMenuList',
      'chanegeTvWallApi',
      'getservice',
      'getdictionariesdata',
      'getDecodingLocalCannalList',
      'deleteDecodingLocalCannal',
      'changeDecodingLocalCannal',
      'creatDecodingLocalCannal'
    ]),
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeToWallApi(params)
    },
    getLazyTreeSearchorgApi(params) {
      params = {
        key: params.search
      }
      return searchTreeApi2(params)
    },
    selectData2(val) {
      this.devModelList1.map(item => {
        if (item.value === val) {
          this.formDataCopy.sdk = item.sdk
        }
      })
    },
    // 保存创建的输出通道
    saveOutChannlData(val) {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          let arr = this.$refs.treeDiv.getCheckedNodes()
          this.ledChanneData.orgId = this.formDataCopy.orgId
          this.ledChanneData.keyPartId = this.formDataCopy.keyPartId
          this.ledChanneData.deviceId = this.formDataCopy.id
          this.ledChanneData.keyPartType = this.formDataCopy.keyPartName
          this.ledChanneData.type = 3
          this.ledChanneData.extend2 = ''
          arr.forEach(item => {
            if (this.ledChanneData.extend2) {
              this.ledChanneData.extend2 += `,${item.nodeKey}`
            } else {
              this.ledChanneData.extend2 += item.nodeKey
            }
          })
          this.ledChanneData = {
            ...this.formDataCopy,
            ...this.ledChanneData
          }
          let ApiName = val === 1 ? 'creatDecodingLocalCannal' : 'changeDecodingLocalCannal'
          // 新建保存
          this[ApiName](this.ledChanneData)
            .then(res => {
              if (res.data.code === 0) {
                this.getCannalList(1) // 刷新输出通道列表
                this.isEditLed = false
              } else {
                this.failureMethod('请求失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    // 刷新函数
    refreshMethod(index) {
      this.getCannalList(2)
    },
    // 根据设备id获取设备LED分区列表列表
    getCannalList(val) {
      let params = {
        page: 1,
        limit: 200,
        orgId: this.formDataCopy.orgId,
        keyPartId: this.formDataCopy.keyPartId,
        type: 3,
        deviceId: this.formDataCopy.id
      }

      this.getDecodingLocalCannalList(params)
        .then(res => {
          if (res.data.code === 0) {
            if (val === 2) {
              this.succefullMethod('刷新成功')
            }
            this.tableData = res.data.data.channels || []
            this.tableData.forEach((item, index) => {
              if (item.extend2) {
                item.extend = '已配置'
              }
            })
          } else {
            this.failureMethod('请求失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // LED列表数据选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 删除函数
    delectMethod() {
      if (this.multipleSelection.length === 0) {
        this.failureMethod('请选择要删除的分区列表')
      } else {
        this.deviceModel()
      }
    },
    // 确认删除弹框
    deviceModel() {
      let title = '确定删除该分区吗? ,是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {}
          let delectArr = []
          this.multipleSelection.map(item => {
            delectArr.push(item.id)
          })
          params.ids = delectArr.join()
          this.deleteDecodingLocalCannal(params)
            .then(res => {
              if (res.data.code === 0) {
                this.succefullMethod('分区删除成功')
                this.multipleSelection = [] // 清空数据
                this.getCannalList(1) // 刷新本地终端输入列表
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    openAddLedModal() {
      this.changeOrCreatBtn = true // 显示保存按钮
      this.modalTitle = '添加LED分区'
      this.isEditLed = true
      this.ledChanneData = {
        // 输出通道列表
        name: '',
        serise: '',
        ratio: '',
        brand: '',
        modelNum: '',
        assetCode: ''
      }
    },
    openEditLedModal() {
      if (this.multipleSelection.length === 1) {
        this.changeOrCreatBtn = false // 显示修改按钮
        this.ledChanneData = cloneDeep(this.multipleSelection[0])
        this.modalTitle = '编辑LED分区'
        this.isEditLed = true
      } else {
        this.failureMethod('请正确选择要修改的数据')
      }
    },
    // 页面初始化函数
    initializationMethod() {
      this.getCannalList(1)
      this.Tvdictionaries() // 初始化获取字典数据
      this.getservicelist() // 获取接入服务器数据
      let queryList = [
        { type: '1', moduleId: '1', childModuleId: '8', dictId: '1' } // dictId:品牌是1  型号是2
      ]
      this.getTypeMethod(queryList, 1)
    },
    changeBrand(val) {
      this.formData.modelNum = ''
      for (let i = 0; i < this.devModelList.length; i++) {
        if (this.devModelList[i].value === val) {
          let queryList = [
            { type: '1', moduleId: '1', childModuleId: '8', dictId: '2', homeClass: this.devModelList[i].label } // dictId:品牌是1  型号是2
          ]
          this.getTypeMethod(queryList, 2)
        }
      }
    },
    getTvWallTreeApi(params) {
      return getTvWallTreeApi(params)
    },
    getLedTreeApi(a) {
      return getLedTreeApi(a)
    },
    // 控制LED分区列表的打开和关闭
    toggleOpen(key) {
      if (key === false) {
        this.dropdownStatus = true
      } else {
        this.dropdownStatus = false
      }
    },
    // 点击机构树的节点
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.formDataCopy.orgName = data.name
        this.formDataCopy.orgId = data.id
      } else {
        let parentNode = node.parent
        if (!parentNode) {
          return
        }
        this.formDataCopy.orgId = (parentNode.data && node.parent.data.id) || ''
        this.formDataCopy.orgName = (parentNode.data && node.parent.data.name) || ''
        this.formDataCopy.keyPartId = data.id
        this.formDataCopy.keyPartName = data.name
      }
    },
    // 修改LED信息成功，将修改的信息传出去(在详细信息页面接收)
    succfulMethod() {
      this.$refs['addForm'].validate(valid => {
        this.$refs['addForm2'].validate(valid2 => {
          if (valid && valid2) {
            console.log(this.formDataCopy)
            this.changeDecodingDevice(this.formDataCopy)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('修改成功')
                  if (this.formIndex === 'list') {
                    this.SET_COMPONENTID1('LedEditList') // 从列表中来，回到列表
                  } else {
                    this.SET_COMPONENTID2('add') // 从列表进入查看
                    this.SET_TVWALL_MESSAGE(this.formDataCopy) // 将信息传递到详情页面
                    this.SET_COMPONENTID1('newLedMessage')
                  }
                  /**
                   * 如果修改解码设备中的所属电视墙时，必须触发修改电视墙接口
                   * */
                  if (this.changeTv_type) {
                    let params = {
                      id: this.formDataCopy.wallId
                      // type: this.formDataCopy.type
                    }
                    this.chanegeTvWallApi(params)
                      .then(res => {
                        if (res.data.code === 0) {
                          this.changeTv_type = false // 修改成功，关闭
                        }
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                } else {
                  this.failureMethod('修改LED设备失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      })
    },
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID1('LedEditList')
    },
    // btn切换
    changeWho(label, index) {
      this.changPage = index
      if (label === '通道管理') {
        this.pageFlag = true
      } else {
        this.pageFlag = false
      }
    },
    // 事件管理(取消)
    abnormalDis() {
      this.changPage = 0
      this.pageFlag = true
    },
    // 事件管理(保存)
    abnormalSave() {
      // 点击保存，发送请求
      this.changPage = 0
      this.pageFlag = true
    },
    // 重置
    resetMethod() {
      this.formDataCopy = {}
    },
    // 成功提示
    succefullMethod(val) {
      this.$notify({
        title: '成功',
        message: val,
        type: 'success',
        duration: 2500
      })
    },
    // 失败提示
    failureMethod(val) {
      this.$notify.error({
        title: '错误',
        message: val,
        duration: 2500
      })
    },
    /**
     * select框选中时触发
     * */
    changeTv(val) {
      this.changeTv_type = true // 激活修改电视墙
      this.formDataCopy.wallId = val
    },
    /*********************************************
     * 字典数据
     * 所有字典数据以dictionaries结尾
     */
    Tvdictionaries() {
      // 所属电视墙字典
      this.getTvWallMenuList()
        .then(res => {
          res.data.data.results.map(item => {
            let obj = { label: '', value: '' }
            obj.label = item.name
            obj.value = item.id
            this.TvList.push(obj)
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getservicelist() {
      // 接入服务器
      this.getservice()
        .then(res => {
          this.devModelList4 = []
          for (let i = 0; i < res.data.length; i++) {
            let tempData = {
              label: res.data[i],
              value: res.data[i]
            }
            this.devModelList4.push(tempData)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTypeMethod(args, num) {
      this.getdictionariesdata({ queryList: args })
        .then(res => {
          console.log(res, 'res============================')
          console.log(res.data.data[0].attr, '数据字典接口返回=========')
          if (num === 1) {
            this.devModelList = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data
              }
              this.devModelList.push(tempData)
            }
            console.log(this.devModelList, 'this.devModelList=====')
          }
          if (num === 2) {
            this.devModelList1 = []
            for (let i = 0; i < res.data.data[0].attr.length; i++) {
              let tempData = {
                label: res.data.data[0].attr[i].data,
                value: res.data.data[0].attr[i].data,
                sdk: res.data.data[0].attr[i].sdkName
              }
              this.devModelList1.push(tempData)
            }
            console.log(this.devModelList1, 'this.devModelList1=====')
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  // /deep/ .el-form-item--mini .el-form-item__content {
  //   margin-left: 20px !important;
  // }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  .right-content {
    height: 100%;
    width: calc(~'100% - 240px');
    position: absolute;
    left: 240px;
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  .last-item {
    margin-bottom: 0;
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
.messageWrap {
  width: 860px;
}
.messagetitle {
  margin: 10px 0;
  font-weight: 600;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 270px;
}
.left-form /deep/ .el-input--mini .el-input__inner {
  width: 270px;
}
.form-content {
  display: flex;
  width: 100%;
  padding: 15px 15px 0 15px;
  font-size: 12px;
  justify-content: center;
  border: 1px solid #f2f2f2;
  .left-form {
    width: 380px;
    margin-right: 24px;
  }
  .right-form {
    width: 380px;
  }
}
.tableWrap {
  margin-top: 15px;
}
.tableWrap .title {
  cursor: pointer;
  font-size: 12px;
  padding: 15px 5px;
  display: inline-block;
  width: 156px;
}
.tableWrap .title i {
  font-size: 14px;
  margin-left: 15px;
}
.footer {
  margin-top: 30px;
  width: 100%;
  border: 1px solid #f2f2f2;
  height: 40px;
}
.footer ul {
  font-size: 12px;
  display: flex;
}
.footer ul li {
  display: flex;
  justify-content: space-between;
}
.footer .title {
  text-align: center;
  width: 110px;
  height: 40px;
  background: #f5f5f5;
  line-height: 40px;
}
.footer .const {
  width: 166px;
  height: 100%;
  text-align: center;
  line-height: 40px;
}
.maBottom {
  margin-bottom: 14px !important;
}
.list-header {
  text-align: right;
  i {
    cursor: pointer;
    margin-right: 6px;
  }
}
.form-footer {
  margin-top: 12px;
  width: 830px;
  text-align: center;
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
    margin-left: 130px;
    margin-top: -12px;
  }
}
.pointer {
  cursor: pointer;
  display: inline-block;
  width: 130px;
  font-size: 12px;
}
// 新建底部样式
.last-title .active-tab {
  color: #fff;
  background: #2d72d3;
}
.last-title {
  margin-bottom: 10px;
}
.last-title ul {
  display: flex;
}
.last-title ul li {
  font-size: 12px;
  width: 80px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid gainsboro;
}
.channeWrap {
  width: 500px;
}
.channe-title {
  width: 80px;
  border-radius: 3px;
  margin-left: 15px;
  height: 35px;
  font-size: 12px;
  text-align: center;
  border: 1px solid gainsboro;
  line-height: 35px;
}
.channe-contend {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 12px;
  margin: 20px 0 20px 40px;
}
.channe-contend-title {
  margin-right: 10px;
}
.channe-contend-const {
  margin-right: 10px;
}
.channe-contend-const /deep/ .el-input--suffix .el-input__inner {
  height: 30px;
}
.channe-contend-const /deep/ .el-input__icon {
  line-height: 26px;
}
.channe-footer {
  text-align: right;
}
.model-wrap {
  /deep/ .treeBox {
    height: 500px;
    border: 1px solid #e1e1e1;
    .el-tree-node__content {
      &:hover {
        background-color: #e5f0ff;
        border: none;
      }
    }
  }
}
</style>
