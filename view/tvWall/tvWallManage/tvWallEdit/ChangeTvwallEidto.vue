<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
               searchType="search"
               :lazyTreeSearchApi="getLazyTreeSearchApi"
               :treeType="treeType"
               @onceClick="onceClick"
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
            <el-breadcrumb-item>基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>电视墙配置</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
      </div>
      <div class="form-box">
        <div class="form-title">编辑电视墙信息</div>
        <div class="form-content">
          <div class="left-form">
            <el-form ref="addForm"
                     :rules="rules"
                     size="mini"
                     :model="formDataCopy"
                     label-position="right"
                     label-width="120px">
              <el-form-item label="电视墙名称"
                            required
                            class="maBottom"
                            prop="name">
                <el-input v-model="formDataCopy.name"
                          maxlength="128"></el-input>
              </el-form-item>
              <el-form-item label="所属机构"
                            required
                            class="maBottom"
                            prop="orgName">
                <el-input v-model="formDataCopy.orgName"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="电视墙地址"
                            class="maBottom">
                <el-input v-model="formDataCopy.position"
                          maxlength="128"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right-form">
            <el-form size="mini"
                     ref="addForm2"
                     :rules="rules"
                     :model="formDataCopy"
                     label-position="right"
                     label-width="130px">
              <el-form-item label="资产编码"
                            class="maBottom"
                            prop="assetCode">
                <el-input v-model="formDataCopy.assetCode"></el-input>
              </el-form-item>
              <el-form-item label="所属重点部位"
                            required
                            class="maBottom">
                <el-input v-model="formDataCopy.keyPartName"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="联动默认电视墙"
                            required
                            class="maBottom"
                            prop="linkWallName">
                <el-select v-model="formDataCopy.linkWallName"
                           @change="selectData">
                  <el-option v-for="item in devBrandList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
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
      </div>
      <div class="bottom-box">
        <div style="width:100%;">
          <div class="box-title">
            <span class="pointer"
                  @click="toggleOpen('detector')">
              解码设备列表
              <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
          </div>
          <div v-if="dropdownStatus.detector"
               style="width:830px;">
            <div class="list-header">
              <i class="el-icon-circle-plus-outline"
                 title="新增"
                 @click="openAddModal"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="isDelete(1)"></i>
              <i class="el-icon-refresh-right"
                 title="刷新"
                 @click="refreshMethod(2)"></i>
            </div>
            <el-table :data="detectorList"
                      @selection-change="handleSelectionChange"
                      border
                      style="width: 100%"
                      size="mini"
                      stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in detectorTableColumn"
                               :key="item.label"
                               :prop="item.prop"
                               :label="item.label"
                               :width="item.width"
                               show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="width:100%;">
          <div class="box-title">
            <span class="pointer"
                  @click="toggleOpen('output')">
              LED设备列表
              <i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
          </div>
          <div v-if="dropdownStatus.output"
               style="width:830px;">
            <div class="list-header">
              <i class="el-icon-circle-plus-outline"
                 title="新增"
                 @click="openAddOutputModal"></i>
              <i class="el-icon-delete"
                 title="删除"
                 @click="isDelete(2)"></i>
              <i class="el-icon-refresh-right"
                 title="刷新"
                 @click="refreshMethod(2)"></i>
            </div>
            <el-table :data="LEDList"
                      @selection-change="handleSelectionChange"
                      border
                      style="width: 100%"
                      size="mini"
                      stripe>
              <el-table-column type="selection"></el-table-column>
              <el-table-column type="index"
                               label="序号"></el-table-column>
              <el-table-column v-for="item in LEDTableColumn"
                               :key="item.label"
                               :prop="item.prop"
                               :label="item.label"
                               show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="footer">
          <ul>
            <li>
              <div class="title">
                <span>录入时间</span>
              </div>
              <div class="const">{{formDataCopy.updatedAt}}</div>
            </li>
            <li>
              <div class="title">
                <span>录入机构</span>
              </div>
              <div class="const">{{formDataCopy.orgName}}</div>
            </li>
            <li>
              <div class="title">
                <span>录入人</span>
              </div>
              <div class="const">{{formDataCopy.updatedBy}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 解码设备新增 -->
    <div class="decodingWrap">
      <el-dialog :title="modalTitle"
                 :visible.sync="isEditDetector"
                 width="400px">
        <div class="decoding-box">
          <treeBox :lazyTreeApi="getTreeApi"
                   searchType="filter"
                   :treeType="treeType1"
                   :customizeQuery="customizeQuery"
                   @onceClick="onceClick1"
                   treeLazyToggle
                   iconToggle>
          </treeBox>
        </div>
        <div style="text-align:center;">
          <el-button @click="saveEqu"
                     size="small"
                     type="primary">保存</el-button>
          <el-button size="small"
                     @click="isEditDetector = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- LED通道 新增 -->
    <div class="decodingWrap">
      <el-dialog :title="modalTitle"
                 :visible.sync="isEditOutput"
                 width="400px">
        <div class="decoding-box">
          <treeBox :lazyTreeApi="getTreeApi"
                   searchType="filter"
                   :treeType="treeType1"
                   @onceClick="onceClick1"
                   :customizeQuery="customizeQuery1"
                   treeLazyToggle
                   iconToggle>
          </treeBox>
        </div>
        <div style="text-align:center;">
          <el-button @click="saveEquLED"
                     size="small"
                     type="primary">保存</el-button>
          <el-button size="small"
                     @click="isEditOutput = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import treeBox from '@src/components/tree/treeBox'
import { getTreeApi, searchTreeApi2 } from '../../../../http/tvWall/tvWallmanage.api'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: {
    treeBox
  },
  computed: {
    ...mapState({
      formData: ({ tvWall }) => tvWall.tvWallData,
      formIndex: ({ tvWall }) => tvWall.whocomponentIndex
    })
  },
  data() {
    return {
      rules: { // 表单验证
        name: [
          { required: true, message: '电视墙名称不能为空' },
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        assetCode: [
          { pattern: /^[\u4e00-\u9fa5]{1,32}$|^.{1,64}$/, message: '长度在1到128个字符' }
        ],
        keyPartName: [
          { required: true, message: '重点部位不能为空' }
        ],
        orgName: [
          { required: true, message: '所属机构不能为空' }
        ],
        linkWallName: [
          { required: true, message: '联动默认电视墙不能为空' }
        ]
      },
      multipleSelection: [],
      equData: { // 添加设备时候，选中的设备
        name: '',
        id: '',
        wallId: '',
        type: 1
      },
      formDataCopy: {
        orgId: '',
        keyPartId: '',
        name: '',
        position: '',
        // server: '',
        linkWall: '',
        assetCode: null,
        type: '',
        updatedById: '',
        updatedDeptId: '',
        orgName: '', // 机构名称
        keyPartName: '', // 所属重点部位名称
        linkWallName: ''
      },
      treeType: 2, // 机构-重点部位树
      treeType1: 1, // 机构-重点部位-设备树
      // 请求树接口入参
      customizeQuery: {
        params: {
          subSystem: '7',
          isRecursion: '0',
          hostType: 1
        }
      },
      customizeQuery1: {
        params: {
          subSystem: '7',
          isRecursion: '0',
          hostType: 3
        }
      },
      devBrandList: [
        // 设备品牌下拉选项
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ],
      dropdownStatus: {
        detector: true,
        output: true
      },
      detectorTableColumn: [
        // 解码设备列表项
        { prop: 'name', label: '解码设备名称', width: '100' },
        { prop: 'typeName', label: '设备类型', width: '' },
        { prop: 'ip', label: 'IP地址', width: '' },
        { prop: 'port', label: '控制端口', width: '' },
        { prop: 'inputNumber', label: '解码窗口数量', width: '95' },
        { prop: 'inputNumber', label: '本地终端输入数量', width: '120' },
        { prop: 'outputNumber', label: '输出通道数量', width: '95' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      // 解码设备列表数据
      detectorList: [],
      LEDTableColumn: [
        // LED列表数据
        { prop: 'name', label: 'LED设备名称', width: '' },
        { prop: 'ip', label: 'IP地址', width: '' },
        { prop: 'port', label: '端口控制', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' }
      ],
      LEDList: [],
      modalTitle: '新增解码设备',
      isEditDetector: false, // 新增or修改
      isEditOutput: false, // 控制输出通道新增or编辑弹框显隐
      dialogVisible: false, // 是否删除确认提示框
      detectorData: {
        isLink: ''
      }
    }
  },
  methods: {
    ...mapMutations(['SET_COMPONENTID1', 'SET_TVWALL_MESSAGE', 'SET_COMPONENTID2']),
    ...mapActions(['chanegeTvWallApi', 'changeDecodingDevice', 'getDecodingDevice', 'deleteDecodingDevice', 'relievedeviceApi']),
    getTreeApi(params) {
      return getTreeApi(params)
    },
    getLazyTreeSearchApi(params) {
      params = {
        key: params.search
      }
      return searchTreeApi2(params)
    },
    // 获取解码器设备列表
    getDecodingDeviceList(val) {
      let params = {
        limit: 200,
        page: 1,
        orgId: '',
        keyPartId: '',
        wallId: this.formDataCopy.id,
        type: '1,2,4'
      }
      this.getDecodingDevice(params)
        .then(res => {
          if (val === 2) {
            this.succefullMethod('数据刷新成功')
          }
          this.detectorList = res.data.data.hosts || []
          this.detectorList.map(item => {
            item['typeName'] = item.type === 1 ? '解码器' : item.type === 2 ? '解码拼控一体机' : item.type === 4 ? '解码器+拼控' : ''
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取LED设备列表
    getLEDList(val) {
      let params = {
        limit: 200,
        page: 1,
        orgId: '',
        keyPartId: '',
        wallId: this.formDataCopy.id,
        type: 3
      }
      this.getDecodingDevice(params)
        .then(res => {
          if (val === 2) {
            this.succefullMethod('数据刷新成功')
          }
          this.LEDList = res.data.data.hosts || []
        })
        .catch(err => {
          console.log(err)
        })
    },
    // table选中
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    // 点击设备树的节点
    onceClick1(data, node) {
      console.log(data)
      // debugger
      if (data.tierType === 'equ') {
        this.equData.name = data.name
        this.equData.id = data.id
        this.equData.type = data.type
      }
    },
    // 点击保存按钮，保存要绑定的解码设备
    saveEqu() {
      if (this.formDataCopy.type === 2) { // b20电视墙
        this.equData.wallId = this.formDataCopy.id
        this.changeDecodingDevice(this.equData).then(res => {
          if (res.data.code === 0) {
            let params = {
              id: this.formDataCopy.id,
              type: this.equData.type
            }
            this.chanegeTvWallApi(params).then(res => {
              if (res.data.code === 0) {
                this.formDataCopy['type'] = this.equData.type
                this.succefullMethod('解码器绑定成功')
                this.getDecodingDeviceList()
                this.isEditDetector = false
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (this.formDataCopy.type === 1) { // m3电视墙
        if (this.detectorList.length !== 0) {
          let falg = true
          this.detectorList.map(item => {
            if (item.id === this.equData.id) {
              falg = false
              this.failureMethod('该电视墙已有此解码器')
            }
          })
          if (falg) {
            this.equData.wallId = this.formDataCopy.id
            this.changeDecodingDevice(this.equData).then(res => {
              if (res.data.code === 0) {
                let params = {
                  id: this.formDataCopy.id,
                  type: this.equData.type
                }
                this.chanegeTvWallApi(params).then(res => {
                  if (res.data.code === 0) {
                    this.formDataCopy['type'] = this.equData.type
                    this.succefullMethod('解码器绑定成功')
                    this.getDecodingDeviceList()
                    this.isEditDetector = false
                  }
                }).catch(err => {
                  console.log(err)
                })
              }
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          this.equData.wallId = this.formDataCopy.id
          this.changeDecodingDevice(this.equData).then(res => {
            if (res.data.code === 0) {
              let params = {
                id: this.formDataCopy.id,
                type: this.equData.type
              }
              this.chanegeTvWallApi(params).then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('解码器绑定成功')
                  this.formDataCopy['type'] = this.equData.type
                  this.getDecodingDeviceList()
                  this.isEditDetector = false
                }
              }).catch(err => {
                console.log(err)
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      } else { // 新建的电视墙没有type属性
        this.equData.wallId = this.formDataCopy.id
        this.changeDecodingDevice(this.equData).then(res => {
          if (res.data.code === 0) {
            let params = {
              id: this.formDataCopy.id,
              type: this.equData.type
            }
            this.chanegeTvWallApi(params).then(res => {
              if (res.data.code === 0) {
                this.formDataCopy['type'] = this.equData.type
                this.succefullMethod('解码器绑定成功')
                this.getDecodingDeviceList()
                this.isEditDetector = false
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    // 点击保存按钮，保存要绑定的LED设备
    saveEquLED() {
      this.equData.wallId = this.formDataCopy.id
      this.changeDecodingDevice(this.equData).then(res => {
        if (res.data.code === 0) {
          let params = {
            id: this.formDataCopy.id
          }
          this.chanegeTvWallApi(params).then(res => {
            if (res.data.code === 0) {
              this.succefullMethod('解码器绑定成功')
              this.getLEDList()
              this.isEditOutput = false
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toggleOpen(key) {
      this.dropdownStatus[key] = !this.dropdownStatus[key]
      if (this.dropdownStatus[key]) {
        Object.keys(this.dropdownStatus).forEach(item => {
          if (item !== key) {
            this.dropdownStatus[item] = true
          }
        })
      }
    },
    // 跳转到列表页
    skipToList() {
      this.SET_COMPONENTID1('ManageList')
    },
    // 修改电视墙信息成功，将修改的信息传出去(在详细信息页面接收)
    succfulMethod() {
      this.$refs['addForm'].validate(valid => {
        this.$refs['addForm2'].validate(valid2 => {
          if (valid && valid2) {
            let changeTvWallData = JSON.parse(JSON.stringify(this.formDataCopy))
            delete this.formDataCopy.orgName
            delete this.formDataCopy.keyPartName
            delete this.formDataCopy.linkWallName
            delete this.formDataCopy.id
            this.formDataCopy.id = changeTvWallData.id
            this.chanegeTvWallApi(this.formDataCopy).then((res) => {
              if (res.data.code === 0) {
                this.succefullMethod('电视墙修改成功')
                if (this.formIndex === 'list') {
                  this.SET_COMPONENTID1('ManageList') // 修改成功，从列表中来回列表
                } else {
                  this.SET_TVWALL_MESSAGE(changeTvWallData) // 将信息传递到详情页面
                  this.SET_COMPONENTID1('newWallmessage') // 修改成功，跳到详细信息页面
                  this.SET_COMPONENTID2('add') // 从列表进入查看
                }
              } else {
                this.failureMethod('电视墙修改失败')
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      })
    },
    openAddModal() {
      if (this.formDataCopy.type === 2 && this.detectorList.length !== 0) { // b20电视墙只能绑定一个b20解码器
        this.failureMethod('电视墙下已有解码设备')
      } else if (this.formDataCopy.type === undefined) { // 该电视墙是新建电视墙，没有任何属性,只能拉取解码器和拼控设备
        this.customizeQuery.params.hostType = '1,2,4'
        this.modalTitle = '新增解码设备'
        this.isEditDetector = true
      } else {
        this.customizeQuery.params.hostType = this.formDataCopy.type
        this.modalTitle = '新增解码设备'
        this.isEditDetector = true
      }
    },
    openAddOutputModal() {
      if (this.LEDList.length !== 0) {
        this.failureMethod('该电视墙下已有LED设备')
      } else {
        this.modalTitle = '新增LED设备'
        this.isEditOutput = true
      }
    },
    isDelete(num) {
      if (num === 1) {
        if (this.multipleSelection.length === 0) {
          this.failureMethod('请选择要删除的解码设备数据')
        } else {
          this.deviceModel('该解码设备', 1)
        }
      } else if (num === 2) {
        if (this.multipleSelection.length === 0) {
          this.failureMethod('请选择要删除的LED设备数据')
        } else {
          this.deviceModel('该LED设备', 2)
        }
      }
    },
    // 删除弹框
    deviceModel(val, index) {
      let title = '确定删除' + val + '吗?' + ',是否继续?'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (index === 1) { // 删除解码设备
            let obj = {}
            let deleteDataId = []
            this.multipleSelection.map(item => {
              let obj1 = { id: '', type: '' }
              obj1.id = item.id
              obj1.type = item.type
              deleteDataId.push(obj1)
            })
            obj.wallId = this.formDataCopy.id
            obj.deviceIds = deleteDataId
            this.relievedeviceApi(obj)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('设备解绑成功')
                  this.getDecodingDeviceList() // 刷新列表
                  this.multipleSelection = [] // 删除成功，清空数组
                } else {
                  this.failureMethod('设备解绑失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else if (index === 2) {
            let obj = {}
            let deleteDataId = []
            this.multipleSelection.map(item => {
              let obj1 = { id: '', type: '' }
              obj1.id = item.id
              obj1.type = item.type
              deleteDataId.push(obj1)
            })
            obj.wallId = this.formDataCopy.id
            obj.deviceIds = deleteDataId
            this.relievedeviceApi(obj)
              .then(res => {
                if (res.data.code === 0) {
                  this.succefullMethod('LED设备解绑成功')
                  this.getLEDList() // 刷新列表
                  this.multipleSelection = [] // 删除成功，清空数组
                } else {
                  this.failureMethod('LED设备解绑失败')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 刷新解码设备和LED设备列表
    refreshMethod(val) {
      if (val === 1) { // 刷新解码设备列表
        this.getDecodingDeviceList(2)
      } else if (val === 2) { // 刷新LED设备列表
        this.getLEDList(2)
      }
    },
    // 重置
    resetMethod() {
      this.formDataCopy = {}
    },
    // 联动电视墙
    selectData(val) {
      if (val === '是') {
        this.formDataCopy.linkWall = 1
      } else {
        this.formDataCopy.linkWall = 2
      }
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
    }
  },
  mounted() {
    this.formDataCopy = JSON.parse(JSON.stringify(this.formData)) // 克隆(避免直接修改vue里的数据)
    if (this.formDataCopy) {
      this.getDecodingDeviceList(1) // 获取解码器设备列表
      this.getLEDList(1) // 获取LED设备列表
    }
  }
}
</script>
<style lang="less" scoped>
.decodingWrap /deep/.el-dialog__header {
  border-bottom: 1px solid gainsboro;
  padding: 10px 20px 10px;
}
.decodingWrap /deep/.el-dialog__title {
  font-size: 16px;
}
.decodingWrap /deep/.el-dialog__headerbtn {
  top: 15px;
}
.decodingWrap /deep/ .el-dialog__body {
  padding: 16px 20px;
}
.decoding-box {
  width: 100%;
  max-height: 400px;
  overflow: auto;
  margin-bottom: 15px;
}
.decoding-box /deep/ .el-input--mini .el-input__inner {
  width: 240px;
}
.decoding-box /deep/ .el-input__suffix {
  right: 110px;
  top: 1px;
}
.form-content /deep/.el-input--mini {
  margin-left: 5px;
}
.right-form /deep/ .el-input--mini .el-input__inner {
  width: 250px;
}
.left-form /deep/ .el-input--mini .el-input__inner {
  width: 260px;
}
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
      .form-title {
        width: 830px;
        font-weight: 600;
        text-align: center;
        padding: 20px 0;
        color: #606266;
      }
      .form-content {
        display: flex;
        width: 830px;
        // width: 700px;
        padding: 15px;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        .left-form {
          width: 380px;
          margin-right: 24px;
        }
        .right-form {
          width: 380px;
        }
      }
      .form-footer {
        margin-top: 12px;
        width: 830px;
        text-align: center;
      }
    }
    .bottom-box {
      flex: 1;
      overflow: auto;
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
  .maBottom {
    margin-bottom: 14px !important;
  }
  .footer {
    margin-top: 30px;
    width: 830px;
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
