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
                        <el-breadcrumb-item>报警主机配置</el-breadcrumb-item>
                        <el-breadcrumb-item>新建</el-breadcrumb-item>
                    </el-breadcrumb>
                </header>
                <div class="button-box">
                    <el-button size="mini">新建</el-button>
                    <el-button size="mini">编辑</el-button>
                    <el-button size="mini">删除</el-button>
                    <el-button size="mini">复制</el-button>
                    <el-button size="mini">打印</el-button>
                </div>
            </div>
            <div class="form-box">
                <div class="box-title">新建报警主机设备</div>
                <div class="form-content">
                    <div class="left-form">
                        <el-form ref="addForm" size="mini" :model="formData" label-position="right" label-width="120px">
                            <el-form-item label="所属子系统">
                                <el-input disabled v-model="formData.subsystem"></el-input>
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
                            <el-form-item label="设备名称" required>
                                <el-input placeholder="输入设备名称" v-model="formData.deviceName"></el-input>
                            </el-form-item>
                            <el-form-item label="设备品牌" required>
                                <el-select v-model="formData.brand">
                                    <el-option
                                            v-for="item in devBrandList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="网络模块品牌">
                                <el-select v-model="formData.netModuleBrand">
                                    <el-option
                                            v-for="item in netBrandList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="网络模块ID" required>
                                <el-input v-model="formData.netModuleID"></el-input>
                            </el-form-item>
                            <el-form-item label="IP地址" required>
                                <el-input v-model="formData.ip"></el-input>
                            </el-form-item>
                            <el-form-item label="用户名" required>
                                <el-input v-model="formData.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="所属服务" required>
                                <el-select v-model="formData.service">
                                    <el-option
                                            v-for="item in serverList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="探测器数量" required>
                                <el-input v-model="formData.detectorNo"></el-input>
                            </el-form-item>
                            <el-form-item label="子系统数量">
                                <el-input v-model="formData.subsystemNo"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="right-form">
                        <el-form size="mini" :model="formData" label-position="right" label-width="120px">
                            <el-form-item label="所属机构">
                                <el-input disabled v-model="formData.orgName"></el-input>
                            </el-form-item>
                            <el-form-item label="设备类型" required>
                                <el-select v-model="formData.deviceType">
                                    <el-option
                                            v-for="item in devTypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="资产编号" required>
                                <el-input v-model="formData.code"></el-input>
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
                            <el-form-item label="网络模块类型">
                                <el-select v-model="formData.netModuleModel">
                                    <el-option
                                            v-for="item in netTypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="键盘密码" required>
                                <el-input v-model="formData.keyboardPassword"></el-input>
                            </el-form-item>
                            <el-form-item label="网络端口" required>
                                <el-input v-model="formData.port"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" required>
                                <el-input v-model="formData.password"></el-input>
                            </el-form-item>
                            <el-form-item label="网域" required>
                                <el-input v-model="formData.domain"></el-input>
                            </el-form-item>
                            <el-form-item label="输出通道数量">
                                <el-input v-model="formData.outputNo"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="form-footer">
                    <el-button type="primary" size="mini" style="margin-right:24px;" @click="saveAlarmHost">保存</el-button>
                    <el-button size="mini" @click="skipToList">取消</el-button>
                </div>
            </div>
            <div class="bottom-box">
                <div style="width:100%;">
                    <div class="box-title">
            <span class="pointer" @click="toggleOpen('detector')">
              探测器列表
              <i :class="dropdownStatus.detector ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </span>
                    </div>
                    <div v-if="dropdownStatus.detector" style="width:80%;">
                        <div class="list-header">
                            <i class="el-icon-download" title="导入"></i>
                            <i class="el-icon-circle-plus-outline" title="新增" @click="openAddModal"></i>
                            <i class="el-icon-edit" title="编辑" @click="openEditModal"></i>
                            <i class="el-icon-delete" title="删除"></i>
                            <i class="el-icon-refresh-right" title="刷新"></i>
                        </div>
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
                                    <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div style="width:100%;">
                    <div class="box-title">
						<span class="pointer" @click="toggleOpen('output')">
							输出通道列表
							<i :class="dropdownStatus.output ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
						</span>
                    </div>
                    <div v-if="dropdownStatus.output" style="width:80%;">
                        <div class="list-header">
                            <i class="el-icon-download" title="导入"></i>
                            <i class="el-icon-circle-plus-outline" title="新增" @click="openAddOutputModal"></i>
                            <i class="el-icon-edit" title="编辑" @click="openEditOutputModal"></i>
                            <i class="el-icon-delete" title="删除"></i>
                            <i class="el-icon-refresh-right" title="刷新"></i>
                        </div>
                        <el-table :data="outputList" border style="width: 100%" height="201" size="mini" stripe>
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column
                                    v-for="item in outputTableColumn"
                                    :key="item.label"
                                    :prop="item.prop"
                                    :label="item.label"
                                    show-overflow-tooltip
                            ></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div style="width:100%;">
                    <div class="box-title">
						<span class="pointer" @click="toggleOpen('subsystem')">
							子系统列表
							<i :class="dropdownStatus.subsystem ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
						</span>
                    </div>
                    <div v-if="dropdownStatus.subsystem" style="width:80%;">
                        <div class="list-header">
                            <i class="el-icon-download" title="导入"></i>
                            <i class="el-icon-circle-plus-outline" title="新增" @click="openAddSystemModal"></i>
                            <i class="el-icon-edit" title="编辑" @click="openEditSystemModal"></i>
                            <i class="el-icon-delete" title="删除"></i>
                            <i class="el-icon-refresh-right" title="刷新"></i>
                        </div>
                        <el-table :data="subSystemList" border style="width: 100%" height="201" size="mini" stripe>
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column
                                    v-for="item in subSystemColumn"
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
        <el-dialog title="探测器编辑" :visible.sync="isOpenDetectorModal">
            <div class="list-header">
                <i class="el-icon-circle-plus-outline" @click="openAddModal"></i>
                <i class="el-icon-edit" @click="openEditModal"></i>
                <i class="el-icon-delete"></i>
                <i class="el-icon-refresh-right"></i>
            </div>
            <el-table size="mini" border :height="205">
                <el-table-column type="selection"></el-table-column>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="name" label="探测器名称"></el-table-column>
                <el-table-column prop="orderNum" label="防区序号" width="80"></el-table-column>
                <el-table-column prop="devType" label="设备类型"></el-table-column>
                <el-table-column prop="brand" label="品牌"></el-table-column>
                <el-table-column prop="model" label="型号"></el-table-column>
                <el-table-column prop="assetCode" label="资产编码"></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 探测器 新增or编辑 -->
        <el-dialog :title="modalTitle" :visible.sync="isEditDetector" width="400px">
            <el-form v-model="detectorData" size="mini" label-position="right" label-width="120px">
                <el-form-item label="探测器名称" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="防区序号" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="设备类型" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="数量" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="型号">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="资产编码" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="是否关联" required>
                    <el-select v-model="detectorData.isLink" style="width:240px;">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align:center;">
                <el-button size="mini" type="primary">保存</el-button>
                <el-button size="mini">取消</el-button>
            </div>
        </el-dialog>
        <!-- 输出通道 新增or编辑 -->
        <el-dialog :title="modalTitle" :visible.sync="isEditOutput" width="400px">
            <el-form size="mini" label-position="right" label-width="120px">
                <el-form-item label="输出通道名称" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="通道序号" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="设备类型" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="型号">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="资产编码" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align:center;">
                <el-button size="mini" type="primary">保存</el-button>
                <el-button size="mini">取消</el-button>
            </div>
        </el-dialog>
        <!-- 子系统 新增or编辑 -->
        <el-dialog :title="modalTitle" :visible.sync="isEditSystem" width="400px">
            <el-form size="mini" label-position="right" label-width="120px">
                <el-form-item label="子系统名称" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="子系统序号" required>
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="包含探测器" required>
                    <div style="height:200px;border:1px solid #DCDFE6;"></div>
                </el-form-item>
                <el-form-item label="包含输出通道">
                    <div style="height:200px;border:1px solid #DCDFE6;"></div>
                </el-form-item>
            </el-form>
            <div style="text-align:center;">
                <el-button size="mini" type="primary">保存</el-button>
                <el-button size="mini">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import OrgTree from '../../../OrgTree'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'newlyBuild',
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
        { label: '营业网点', value: '营业网点' },
        { label: '自助银行', value: '自助银行' }
      ],
      devBrandList: [
        // 设备品牌下拉选项
        { label: '霍尼韦尔', value: '霍尼韦尔' },
        { label: '博世', value: '博世' },
        { label: '枫叶', value: '枫叶' },
        { label: '海康威视', value: '海康威视' },
        { label: '英安特', value: '英安特' },
        { label: '其他', value: '其他' }
      ],
      netBrandList: [
        // 网络模块品牌下拉选项
        { label: '霍尼韦尔', value: '霍尼韦尔' },
        { label: '海康威视', value: '海康威视' },
        { label: '蓝色星际', value: '蓝色星际' }
      ],
      serverList: [
        // 所属服务下拉选项
        { label: '接入服务器', value: '接入服务器' }
      ],
      devTypeList: [
        // 设备类型下拉选项
        { label: '电话报警主机', value: '电话报警主机' },
        { label: '网络报警主机', value: '网络报警主机' },
        { label: '电子围栏总线报警主机', value: '电子围栏总线报警主机' },
        { label: '振动光纤报警主机', value: '振动光纤报警主机' }
      ],
      devModelList: [
        // 设备型号下拉选项
        { label: 'CK-238P', value: 'CK-238P' },
        { label: 'CK-2316P', value: 'CK-2316P' }
      ],
      netTypeList: [
        // 网络模块类型下拉选项
        { label: '厂家1', value: '厂家1' },
        { label: '厂家2', value: '厂家2' }
      ],
      dropdownStatus: {
        detector: false,
        output: false,
        subsystem: false
      },
      detectorTableColumn: [
        // 探测器列表项
        { prop: 'name', label: '探测器名称', width: '' },
        { prop: 'orderNum', label: '防区序号', width: '' },
        { prop: 'devType', label: '设备类型', width: '' },
        { prop: 'number', label: '数量', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'isRelated', label: '是否关联', width: '' }
      ],
      detectorList: [
        // 探测器列表数据
        {name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
        {name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
        {name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'},
        {name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', number: '1', brand: '霍尼韦尔', model: 'XXX', assetCode: 'XXX', isRelated: '是'}
      ],
      outputTableColumn: [
        // 输出通道表格项
        { prop: 'name', label: '输出通道名称', width: '' },
        { prop: 'orderNum', label: '通道序号', width: '' },
        { prop: 'devType', label: '设备类型', width: '' },
        { prop: 'brand', label: '品牌', width: '' },
        { prop: 'model', label: '型号', width: '' },
        { prop: 'assetCode', label: '资产编码', width: '' },
        { prop: 'remark', label: '备注', width: '' }
      ],
      outputList: [
        // 输出通道表格数据
        {name: 'O1声闪一体机-大厅', orderNum: '1', devType: '声闪一体机', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''},
        {name: 'Z1壁挂双鉴-会议室', orderNum: '1', devType: '壁挂双鉴探测器', brand: '国产', model: 'XXX', assetCode: 'XXX', remark: ''}
      ],
      subSystemColumn: [
        // 子系统表格项
        { prop: 'name', label: '子系统名称', width: '' },
        { prop: 'orderNum', label: '子系统序号', width: '' },
        { prop: 'hasDetector', label: '包含探测器', width: '' },
        { prop: 'hasOutput', label: '包含输出通道', width: '' }
      ],
      subSystemList: [
        // 子系统列表数据
        {name: '子系统1', orderNum: '1', hasDetector: 'Z1壁挂双鉴-会议室', hasOutput: 'O1声闪一体机-大厅'}
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
    ...mapMutations(['SET_COMPONENTID']),
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
      this.SET_COMPONENTID('AlarmList')
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
    openAddModal() {
      this.modalTitle = '新增探测器'
      this.isEditDetector = true
    },
    openEditModal() {
      this.modalTitle = '修改探测器'
      this.isEditDetector = true
    },
    openAddOutputModal() {
      this.modalTitle = '新增输出通道'
      this.isEditOutput = true
    },
    openEditOutputModal() {
      this.modalTitle = '编辑输出通道'
      this.isEditOutput = true
    },
    openAddSystemModal() {
      this.modalTitle = '新增子系统'
      this.isEditSystem = true
    },
    openEditSystemModal() {
      this.modalTitle = '编辑子系统'
      this.isEditSystem = true
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
                    width: 644px;
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
