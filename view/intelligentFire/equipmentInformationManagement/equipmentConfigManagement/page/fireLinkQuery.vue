<template>
  <div class="content">
    <div class="right-content" v-if="!isShowConfig && !isShowDetail">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>设备配置管理</el-breadcrumb-item>
            <el-breadcrumb-item>系统部件关联配置 </el-breadcrumb-item>
            <el-breadcrumb-item class="active">查询</el-breadcrumb-item>
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
              :rules="rules"
            >
              <div class="flex-div">
                <el-form-item label="所属机构" prop="orgName">
                  <el-autocomplete
                    class="w-input"
                    v-model="formData.orgName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('org', val, callback)
                      }
                    "
                    placeholder="请输入机构"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('org', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属重点部位">
                  <el-autocomplete
                    class="w-input"
                    :disabled="!formData.orgId"
                    v-model="formData.keyPartName"
                    value-key="name"
                    :fetch-suggestions="
                      (val, callback) => {
                        querySearch('kp', val, callback)
                      }
                    "
                    placeholder="请输入重点部位"
                    :trigger-on-focus="false"
                    @select="
                      val => {
                        selectItem('kp', val)
                      }
                    "
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="所属系统">
                  <el-select v-model="type" class="w-input" @change="changeType">
                    <el-option
                      v-for="item in typeListCopy"
                      :key="item.id"
                      :label="item.label"
                      :value="item.index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="所属设备" prop="hostId">
                  <el-input placeholder="输入所属设备" v-model="formData.hostId" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="部件名称" prop="name">
                  <el-input v-model="formData.name" class="w-input"> </el-input>
                </el-form-item>
                <el-form-item label="部件类型">
                  <el-select v-model="formData.partsType" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in typePartsList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="部件品牌">
                  <el-select v-model="formData.brand" class="w-input" @change="changeBrand">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in brandList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="部件型号">
                  <el-select v-model="formData.partsModel" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in modelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="部件区号" prop="areaCode">
                  <el-input v-model="formData.areaCode" class="w-input"></el-input>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="部件回路" prop="loopCode">
                  <el-input v-model="formData.loopCode" class="w-input"> </el-input>
                </el-form-item>
                <el-form-item label="部件位号" prop="addressCode">
                  <el-input v-model="formData.addressCode" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="安装位置" prop="address">
                  <el-input v-model="formData.address" class="w-input"></el-input>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="部件状态">
                  <el-select v-model="formData.status" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="报警" value="2"></el-option>
                    <el-option label="故障" value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="状态描述" prop="description">
                  <el-input v-model="formData.description" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="资产编码" prop="assetsCode">
                  <el-input v-model="formData.assetsCode" class="w-input"></el-input>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="录入机构" prop="code">
                  <el-input v-model="formData.updatedDept" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="录入人" prop="deviceModel">
                  <el-input v-model="formData.updatedBy" class="w-input"> </el-input>
                </el-form-item>
                <el-form-item label="录入时间">
                  <el-date-picker
                    v-model="formData.startCreateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="起始时间"
                    style="width:172px;"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endCreateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="结束时间"
                    style="width:172px;"
                  >
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div class="form-footer">
          <el-button type="primary" size="small" @click="saveAlarmHost(1)">查询</el-button>
          <el-button size="small" @click="clickReset">重置</el-button>
          <el-button size="small" @click="exportExcel">导出</el-button>
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
            <el-table
              :data="detectorList"
              border
              style="width: 100%"
              height="560"
              size="mini"
              @row-dblclick="showDetail"
              @selection-change="handleSelectionChange"
              stripe
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column
                v-for="item in detectorTableColumn"
                :key="item.label"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
                sortable
                align="center"
              >
                <template slot-scope="scope">
                  <span
                    style="color:#409EFF;cursor: pointer;"
                    v-if="tbColumn.includes(item.label) === true && scope.row[item.prop] === 2"
                    @click="handleEdit1(scope.$index, scope.row)"
                    >已关联</span
                  >
                  <!-- <el-button
                    type="text"
                    v-if="tbColumn.includes(item.label) === true && scope.row[item.prop] === 2"
                    @click="handleEdit(scope.$index, scope.row)"
                    >未关联</el-button
                  > -->
                  <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
                  <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
                  <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">故障</span>
                  <span v-if="scope.row[item.prop] === 4 && item.prop === 'status'">报警</span>
                  <span v-if="tbColumn.includes(item.label) === false && item.prop !== 'status'">{{
                    scope.row[item.prop]
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div style="text-align:right;margin:30px 30px 30px 0;">
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :current-page="pageCurrents"
                layout="total, sizes,slot, prev"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
              >
                <el-button type="text" class="pageBtn" :disabled="pageCurrent === 1" @click="pagePrev">首页</el-button>
              </el-pagination>
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :page-count="1"
                :total="total"
                :current-page="pageCurrents"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
                layout="slot"
              >
                <span>{{ pageCurrents }}/{{ pageCounts }}</span>
              </el-pagination>
              <el-pagination
                style="text-align:right;display:inline-block;"
                :page-sizes="[10, 25, 50, 100, 200]"
                :page-size="pageSize"
                :current-page="pageCurrents"
                :total="total"
                @size-change="pageSizeChange"
                @current-change="pageSizeCurrent"
                layout="next,slot, jumper"
                ><el-button type="text" class="pageBtn" :disabled="pageCurrent === pageCounts" @click="pageNext"
                  >末页</el-button
                ></el-pagination
              >
            </div>
          </div>
        </div>
      </div>

      <!--  已关联 -->
      <el-dialog class="visible" title="关联拓扑图" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-button @click="printVisible">打印</el-button>
        <div class="show-div" id="show-div">
          <div class="top" v-if="selectData.length > 0">
            <div class="top-info">
              <div class="info-item">
                <div class="info-label">所属机构</div>
                <div class="info-value">{{ selectData[0].orgName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">所属重点部位</div>
                <div class="info-value">{{ selectData[0].keyPartName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">所属设备</div>
                <div class="info-value">{{ selectData[0].hostName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">通道名称</div>
                <div class="info-value">{{ selectData[0].name }}</div>
              </div>
            </div>
            <div class="gplot-top">
              <gplot :gplotData="gplotData" v-if="gplotData.length > 0"></gplot>
            </div>
          </div>
        </div>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="clickCancel">关 闭</el-button>
        </span> -->
      </el-dialog>
    </div>
    <!-- 未关联 -->
    <linkConfig
      v-if="isShowConfig"
      :isShowConfig.sync="isShowConfig"
      :selectedData="selectData"
      :configType="configType"
      @changeComponent="changeComponent"
    ></linkConfig>
    <!-- 详情 -->
    <detail
      v-if="isShowDetail"
      :isShowDetail.sync="isShowDetail"
      :selectedData="selectData"
      :configType="configType"
      @changeComponent="changeComponent"
    ></detail>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import Gplot from './components/gplot'
import detail from './components/detail'
import linkConfig from './components/linkConfig'
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import { fireInterface, selectQuety, fireDeploy } from '@src/http/intelligentFire/equipmentManagement.js'
import equipmentInformationManagement from '@src/assets/rules/validation/fire/equipmentInformationManagement.js'
export default {
  name: 'fireFightingSubsystemManagement',
  components: {
    Gplot,
    detail,
    linkConfig
  },
  data() {
    return {
      treeType: 3, // 树
      typeListCopy: [], // 主机类型
      tbColumn: ['关联摄像头', '关联对讲通道', '关联门禁通道', '关联输出通道'], // 判断列表操作列
      dialogVisible: false, // 已关联
      isShowConfig: false, // 控制 关联配置页 显隐 未关联\
      configType: '系统部件关联配置',
      isShowDetail: false, // 控制详情页显隐
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      type: 'FireAlarm-1', // 系统类型
      rules: equipmentInformationManagement.fireLinkQueryRules,
      formData: {
        // 表单数据
        orgId: '', // 机构id
        keyPartId: '', // 所属重点部位Id
        hostId: '', // 所属设备
        name: '', // 部件名称
        brand: '', // 部件品牌
        partsModel: '', // 部件型号
        partsType: '', // 部件类型
        areaCode: '', // 部件区号
        loopCode: '', // 部件回路号
        addressCode: '', // 部件位号
        address: '', // 安装位置
        status: '', // 部件状态, 1-正常 2-报警 3-故障
        description: '', // 状态描述
        assetsCode: '', // 部件资产编码
        updatedBy: '', // 录入人
        updatedDept: '', // 录入机构
        startCreateTime: '', // 录入开始时间
        endCreateTime: '' // 录入结束时间
      },
      positionList: [],
      nameLable: '',
      typePartsList: [], //  部件类型下拉选项
      brandList: [], // 部件品牌下拉选项
      modelList: [], // 部件型号下拉
      dropdownStatus: {
        detector: true
      },
      detectorTableColumn: [
        {
          prop: 'orgName',
          label: '所属机构',
          width: '180'
        },
        {
          prop: 'keyPartName',
          label: '所属部位',
          width: '180'
        },
        {
          prop: 'hostName',
          label: '所属设备',
          width: '180'
        },
        {
          prop: 'name',
          label: '部件名称',
          width: '180'
        },
        {
          prop: 'brand',
          label: '部件品牌',
          width: '180'
        },
        {
          prop: 'partsModel',
          label: '部件型号',
          width: '180'
        },
        {
          prop: 'partsType',
          label: '部件类型',
          width: '180'
        },
        {
          prop: 'areaCode',
          label: '部件区号',
          width: '120'
        },
        {
          prop: 'loopCode',
          label: '部件回路',
          width: '120'
        },
        {
          prop: 'addressCode',
          label: '部件位号',
          width: '120'
        },
        {
          prop: 'address',
          label: '安装位置',
          width: '150'
        },
        {
          prop: 'status',
          label: '部件状态',
          width: '100'
        },
        {
          prop: 'description',
          label: '状态描述',
          width: '180'
        },
        {
          prop: 'assetsCode',
          label: '资产编号',
          width: '150'
        },
        {
          prop: 'isVideoLink',
          label: '关联摄像头',
          width: '100'
        },
        {
          prop: 'isAudioLink',
          label: '关联对讲通道',
          width: '100'
        },
        {
          prop: 'isGuardLink',
          label: '关联门禁通道',
          width: '100'
        },
        {
          prop: 'isOutputLink',
          label: '关联输出通道',
          width: '100'
        },
        {
          prop: 'updatedBy',
          label: '录入人',
          width: '100'
        },
        {
          prop: 'updatedDept',
          label: '录入机构',
          width: '180'
        },
        {
          prop: 'createdAt',
          label: '录入时间',
          width: '180'
        }
      ],
      detectorList: [
        // 列表数据
      ],
      selectData: '',
      gplotData: [],
      defaultParams: {
        pageSize: 25, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2 // 默认不显示子机构
      }
    }
  },
  created() {
    let deleteList = [7, 8, 9, 10, 12]
    this.pageCount = Math.ceil(this.total / this.pageSize)
    this.typeList.map(item => {
      if (!deleteList.includes(item.id)) {
        this.typeListCopy.push(item)
      }
    })

    this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])
    // 初始化部件类型和部件品牌
    this.getDefault()
  },
  computed: {
    ...mapState('equipmentManagement', {
      dataDic: 'dataDic',
      dataDicChild: 'dataDicChild',
      sidebarActiveField: 'sidebarActiveField',
      typeList: 'typeList'
    }),
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      console.log(this.pageCurrent)
      return this.pageCurrent
    }
  },
  watch: {
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.saveAlarmHost()
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrents
      this.saveAlarmHost()
    }
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_DATA_DIC_CHILD: 'SET_DATA_DIC_CHILD',
      SET_SIDEBAR_ACTIVE_FIELD: 'SET_SIDEBAR_ACTIVE_FIELD'
    }),
    // 机构/重点部位 下拉选 过滤规则
    querySearch(type, value, callback) {
      const params = {
        type: type === 'org' ? 1 : 2,
        name: value,
        oId: type === 'kp' ? this.formData.orgId : undefined
      }
      getSearchOrgApi(params)
        .then(res => {
          if (!res.data.data.code) {
            callback(res.data.data.orgList || [])
          } else {
            throw res.data.data.message
          }
        })
        .catch(err => {
          console.log(err)
          callback([])
        })
    },
    // 选中 机构/重点部位 下拉选
    selectItem(type, val) {
      if (type === 'org') {
        this.formData.orgId = val.id
        this.orgName = val.name
      } else if (type === 'kp') {
        this.formData.keyPartId = val.id
        this.keyPartName = val.name
      }
    },
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
    getDefault() {
      // 部件品牌
      this.getSelectData(this.dataDicChild.childBrand).then(res => {
        this.brandList = res.data.data[0].attr
      })

      // 部件类型
      this.getSelectData(this.dataDicChild.childType).then(res => {
        this.typePartsList = res.data.data[0].attr
      })
    },
    // 选择系统类型
    changeType(val) {
      console.log(val)
      this.formData.partsType = '' // 清空部件类型
      this.typePartsList = [] // 清空部件类型数据
      this.formData.brand = '' // 清空部件品牌
      this.brandList = [] // 清空部件品牌数据
      this.formData.partsModel = '' // 清空部件型号
      this.modelList = [] // 清空部件型号数据
      // this.formData.type = Number(val.split('-')[1])
      this.SET_SIDEBAR_ACTIVE_FIELD(val.split('-')[0])
      this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])
      this.getDefault()
    },
    // 下拉请求
    getSelectData(val) {
      if (val) {
        let params = {
          dictId: val // 字典参数
        }
        return this.getDataDic(params)
      }
    },
    // 数据字典请求
    getDataDic(params, id) {
      return selectQuety.queryDataDictBasicInfo(params, id)
    },
    // 部件品牌选择
    changeBrand(val) {
      let params = {
        dictId: this.dataDicChild.childModel,
        homeClass: val
      }
      this.formData.partsModel = '' // 清空部件型号
      this.getDataDic(params).then(res => {
        this.modelList = res.data.data[0].attr
      })
    },
    // 刷新列表
    getAlarmHostList() {
      this.$message({
        message: '刷新成功',
        type: 'success',
        duration: 1500
      })
    },
    // 查询
    saveAlarmHost(val) {
      if (val) {
        this.defaultParams.page = 1
      }
      let params = this.$lodash.cloneDeep(this.defaultParams)
      for (var key in this.formData) {
        if (this.formData[key]) {
          params[key] = this.formData[key]
        }
      }
      if (params.updatedDept) {
        params.updatedDept = [`${params.updatedDept}`]
      }
      params.hostType = [Number(this.type.split('-')[1])]
      fireInterface
        .queryHostParts(params)
        .then(res => {
          if (res.data.code === 0) {
            if (val) {
              this.$notify.success({
                message: '查询成功',
                title: '成功'
              })
            }
            this.detectorList = res.data.data.partsInfo
            this.total = res.data.data.page.totalNumber || 1
            this.pageSize = res.data.data.page.pageSize
            this.pageCurrent = res.data.data.page.page
          } else {
            this.$notify.error({
              message: '查询失败',
              title: '失败'
            })
          }
        })
        .catch(_ => {
          this.$notify.error({
            message: '查询失败',
            title: '失败'
          })
        })
    },
    // 重置
    clickReset() {
      for (var key in this.formData) {
        this.formData[key] = ''
      }
    },
    // 选中数据
    handleSelectionChange(val) {
      this.selectData = val
    },
    // 跳转页面
    changeComponent(value) {
      this.selectData = []
      this.isShowConfig = false
      this.isShowDetail = false
    },
    // 双击详情
    showDetail(row) {
      this.selectData = []
      this.selectData.push(row)
      this.isShowDetail = true
    },
    // 未关联
    handleEdit(index, row) {
      console.log(index, row)
      this.selectData = []
      this.isShowConfig = true
      this.selectData.push(row)
    },
    // 已关联
    dealData(data) {
      if (!data) {
        return false
      }
      let gpData = []
      gpData.push({
        id: data.id,
        type: 'videoHost',
        center: true,
        name: data.name
      })
      data.video.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'vidicon'
        }
        gpData.push(obj)
      })
      data.audio.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'talkback'
        }
        gpData.push(obj)
      })
      data.guard.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'guard'
        }
        gpData.push(obj)
      })
      data.output.forEach(i => {
        let obj = {
          id: i.id,
          name: i.name,
          type: 'alarm'
        }
        gpData.push(obj)
      })
      this.gplotData = gpData
    },
    // 已关联
    handleEdit1(index, row) {
      console.log(row)
      this.selectData = []
      this.gplotData = []
      this.dialogVisible = true
      this.selectData.push(row)
      console.log(this.selectData)
      let id = row.id
      let param = {
        ref: 2
      }
      fireDeploy.getDeviceOrResourceApi(id, param).then(res => {
        if (res.data.code === 0) {
          this.dealData(res.data.data)
        }
      })
    },
    clickCancel() {
      this.dialogVisible = false
      this.selectData = []
    },
    // 打印
    printVisible() {
      console.log('yyyy')
      printJS('show-div', 'html')
    },
    // 改变pageSize
    pageSizeChange(val) {
      console.log(val)
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
      console.log(this.pageCurrent)
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    },
    // 导出excel
    exportExcel() {
      let tHeader = ['序号'] // 表头
      let filterVal = ['index'] // 数据
      let filename = '系统部件关联配置查询列表'
      this.detectorTableColumn.map(n => {
        tHeader.push(n.label)
        filterVal.push(n.prop)
      })
      if (this.selectData.length) {
        let selectData = this.$lodash.cloneDeep(this.selectData)
        selectData.map((item, index) => {
          item.index = index + 1
          switch (item.status) {
            case 1:
              item.status = '离线'
              break
            case 2:
              item.status = '在线'
              break
            case 3:
              item.status = '故障'
              break
            case 4:
              item.status = '报警'
              break
          }
          item.isVideoLink = item.isVideoLink === 2 ? '已关联' : ''
          item.isAudioLink = item.isAudioLink === 2 ? '已关联' : ''
          item.isGuardLink = item.isGuardLink === 2 ? '已关联' : '' // 门禁
          item.isOutputLink = item.isOutputLink === 2 ? '已关联' : ''
        })
        // 有数据走前端导出
        handleExport(
          tHeader,
          filterVal,
          `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`,
          selectData
        )
      } else if (this.detectorList.length > 0 && this.selectData.length === 0) {
        // 无数据走接口
        let params = this.$lodash.cloneDeep(this.defaultParams)
        params.hostType = [Number(this.type.split('-')[1])]
        for (var key in this.formData) {
          if (this.formData[key] && key !== 'pageSize' && key !== 'page') {
            params[key] = this.formData[key]
          }
        }
        fireInterface
          .createHostPartExcel(params)
          .then(res => {
            if (res.data.code === 0) {
              // zp去掉url中间的/host
              let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/fire/v1/system-manage/downFile?fileName=${res.data.data.fileName}`
              let name = `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
              download(
                url,
                name,
                () => {},
                () => {
                  this.$message({ type: 'info', message: '导出文件下载失败！' })
                },
                () => {},
                'get'
              )
            } else {
              this.$notify.error({
                message: '导出失败',
                title: '失败'
              })
            }
          })
          .catch(_ => {
            this.$notify.error({
              message: '导出接口错误',
              title: '错误'
            })
          })
      } else {
        this.$notify.warning({
          message: '列表暂无数据',
          title: '警告'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  .active {
    .el-breadcrumb__inner {
      color: #2d72d3;
    }
  }
  .right-content {
    font-size: 14px;
    padding: 0 10px 0 20px;
    // flex: 1;
    // display: flex;
    // flex-direction: column;
    .top-box {
      .button-box {
        margin: 12px 0;
      }
    }
    .form-box {
      .form-content {
        display: flex;
        width: 100%;
        padding: 10px;
        font-size: 12px;
        border: 1px solid #f2f2f2;
        justify-content: center;
      }
      .form-footer {
        margin-top: 12px;
        width: 100%;
        text-align: center;
      }
    }
    .bottom-box {
      width: 100%;
      overflow: auto;
      .el-table {
        width: 100px;
      }
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
}
.visible {
  .top {
    width: 100%;
    height: auto;
    padding: 10px 0 0 10px;
    display: flex;
    .top-info {
      min-width: 290px;
      height: 160px;
      .info-item {
        // width: calc(~'100% - 2px');
        height: 40px;
        line-height: 40px;
        border: 1px solid #e1e1e1;
        border-top: none;
        display: flex;
        .info-label {
          width: 104px;
          height: 100%;
          background: #f5f5f5;
          text-align: center;
        }
        .info-value {
          flex: 1;
          text-indent: 20px;
          padding-right: 10px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        &:nth-child(1) {
          border-top: 1px solid #e1e1e1;
        }
      }
    }
    .gplot-top {
      flex: 1;
    }
  }
}

.pageBtn {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}

.flex-div {
  display: flex;
  flex-direction: row;
  justify-content: left;
  width: 100%;
  margin-bottom: 14px;
  /deep/ .el-form-item__label {
    height: 35px;
    text-align: center;
  }
  .w-input {
    width: 356px;
    height: 35px;
  }
}
</style>
<style lang="less" scoped>
.content {
  .right-content {
    .form-box {
      .left-form {
        margin: 0 auto;
        background: #f5f5f5;
        padding: 34px 20px 20px 0;
      }
      .left-form,
      .right-form {
        .el-form-item--mini.el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          text-align: center;
        }
      }
    }
  }
}

.form-box {
  margin-top: 20px;
}
</style>
