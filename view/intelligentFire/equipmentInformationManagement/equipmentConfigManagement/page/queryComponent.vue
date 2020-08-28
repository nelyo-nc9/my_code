<template>
  <div class="content">
    <div class="right-content" v-if="!isShowConfig && !isShowDetail">
      <div class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>设备配置管理</el-breadcrumb-item>
            <el-breadcrumb-item>消防系统关联配置 </el-breadcrumb-item>
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
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="设备名称">
                  <el-input placeholder="输入设备名称" v-model="formData.name" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="设备品牌">
                  <el-select v-model="formData.brand" class="w-input" @change="changeBrand">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devBrandList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备型号">
                  <el-select v-model="formData.modelNum" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devModelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="设备标签">
                  <el-select v-model="formData.label" class="w-input">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="(item, index) in devLabelList"
                      :key="index"
                      :label="item.data"
                      :value="item.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="标签编码">
                  <el-input v-model="formData.labelCode" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="设备有效期">
                  <!-- <el-input v-model="formData.code" class="w-input"></el-input> -->
                  <el-date-picker
                    v-model="formData.startValidity"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="起始时间"
                    style="width:172px;"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endValidity"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="结束时间"
                    style="width:172px;"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="设备位置">
                  <el-input v-model="formData.address" class="w-input"> </el-input>
                </el-form-item>
                <el-form-item label="资产编码">
                  <el-input v-model="formData.assetCode" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="生产日期">
                  <el-date-picker
                    v-model="formData.startProduction"
                    type="date"
                    placeholder="起始时间"
                    style="width:172px;"
                  >
                  </el-date-picker>
                  -
                  <el-date-picker
                    v-model="formData.endProduction"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="结束时间"
                    style="width:172px;"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div class="flex-div">
                <el-form-item label="录入机构">
                  <el-input v-model="formData.updatedDept" class="w-input"></el-input>
                </el-form-item>
                <el-form-item label="录入人">
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
                  ></el-date-picker>
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
                width="150"
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
                  <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">异常</span>
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
                <el-button type="text" :disabled="pageCurrent === 1" @click="pagePrev">首页</el-button>
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
                ><el-button type="text" :disabled="pageCurrent === pageCounts" @click="pageNext"
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
              <div class="info-item" v-if="configType != '视频主机关联配置'">
                <div class="info-label">所属设备</div>
                <div class="info-value">{{ selectData[0].hostName }}</div>
              </div>
              <div class="info-item" v-if="configType != '视频主机关联配置'">
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
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import { getSearchOrgApi } from '@src/http/video/recordConfig.api.js'
import { fireInterface, selectQuety, fireDeploy } from '@src/http/intelligentFire/equipmentManagement.js'
import equipmentInformationManagement from '@src/assets/rules/validation/fire/equipmentInformationManagement.js'
import Gplot from './components/gplot'
import detail from './components/detail'
import linkConfig from './components/linkConfig'
export default {
  name: 'fireFightingSubsystemManagement',
  components: {
    Gplot,
    detail,
    linkConfig
  },
  data() {
    return {
      tbColumn: ['关联摄像头', '关联对讲通道', '关联门禁通道', '关联输出通道'], // 判断列表操作列
      dialogVisible: false, // 已关联
      isShowConfig: false, // 控制 关联配置页 显隐 未关联
      configType: '消防系统关联配置',
      isShowDetail: false, // 控制详情页显隐
      gplotData: [], // 拓扑图
      treeType: 3, // 树
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      type: 'FireAlarm-1', // 系统类型
      formData: {
        // 表单数据
        orgId: '', // 所属机构ID
        orgName: '', // 所属机构name
        keyPartId: '', // 所属重点部位Id
        keyPartType: '', // 所属重点部位类型
        keyPartName: '', // 所属重点部位name
        name: '', // 设备名称
        brand: '', // 设备品牌
        modelNum: '', // 设备型号
        label: '', // 设备标签
        labelCode: '', // 标签编码
        code: '', // 设备编码
        startValidity: '', // 开始-设备有效期
        endValidity: '', // 结束-设备有效期
        address: '', // 设备位置
        assetCode: '', // 资产编码
        startProduction: '', // 开始-生产日期
        endProduction: '', // 结束-生产日期
        updatedDept: '', // 录入人机构名称数组，模糊匹配
        updatedBy: '', // 录入人名称,模糊匹配
        startCreateTime: '', // 开始-录入时间
        endCreateTime: '' // 结束-录入时间
      },
      positionList: [], // 重点部位下拉
      nameLable: '',
      devBrandList: [], // 设备品牌下拉选项
      devModelList: [], // 设备型号下拉选项
      devLabelList: [], // 设备标签
      dropdownStatus: {
        detector: true
      },
      detectorTableColumn: [
        {
          prop: 'orgName',
          label: '所属机构'
        },
        {
          prop: 'keyPartName',
          label: '所属部位'
        },
        {
          prop: 'name',
          label: '设备名称'
        },
        {
          prop: 'brand',
          label: '设备品牌'
        },
        {
          prop: 'modelNum',
          label: '设备型号'
        },
        {
          prop: 'label',
          label: '设备标签'
        },
        {
          prop: 'labelCode',
          label: '标签编码'
        },
        {
          prop: 'validity',
          label: '设备有效期'
        },
        {
          prop: 'address',
          label: '设备位置'
        },
        {
          prop: 'assetCode',
          label: '资产编码'
        },
        {
          prop: 'production',
          label: '生产日期'
        },
        {
          prop: 'isVideoLink',
          label: '关联摄像头'
        },
        {
          prop: 'isAudioLink',
          label: '关联对讲通道'
        },
        {
          prop: 'isGuardLink',
          label: '关联门禁通道'
        },
        {
          prop: 'isOutputLink',
          label: '关联输出通道'
        },
        {
          prop: 'status',
          label: '状态'
        },
        {
          prop: 'updatedBy',
          label: '录入人'
        },
        {
          prop: 'updatedDept',
          label: '录入机构'
        },
        {
          prop: 'createdAt',
          label: '录入时间'
        }
      ], // 表头
      detectorList: [
        // 列表数据
      ],
      selectData: '',
      defaultParams: {
        pageSize: 10, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2 // 默认不显示子机构
      },
      rules: equipmentInformationManagement.queryComponentRules
    }
  },
  created() {
    this.pageCount = Math.ceil(this.total / this.pageSize)

    // 存储当前系统类型字典数据
    this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])

    // 设备标签下拉
    this.getSelectData(this.dataDicChild.label).then(res => {
      this.devLabelList = res.data.data[0].attr
    })

    // 设备品牌下拉
    if (this.sidebarActiveId !== 12) {
      this.getSelectData(this.dataDicChild.brand).then(res => {
        this.devBrandList = res.data.data[0].attr
      })
    }
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
    // 已关联
    dealData(data) {
      if (!data) {
        return false
      }
      let gpData = []
      gpData.push({
        id: data.id,
        type:
          this.configType === '消防系统关联配置'
            ? 'videoHost'
            : this.configType === '系统部件关联配置'
            ? 'videoHost'
            : 'vidicon',
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
      console.log(this.gplotData)
    },
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
    // 选择系统类型
    changeType(val) {
      // console.log(val)
      this.formData.brand = '' // 清空设备品牌
      this.formData.modelNum = '' // 清空设备型号
      this.devModelList = [] // 清空设备类型数据
      // this.formData.type = Number(val.split('-')[1])
      this.SET_SIDEBAR_ACTIVE_FIELD(val.split('-')[0])
      this.SET_DATA_DIC_CHILD(this.dataDic[this.sidebarActiveField])

      // 设备品牌下拉
      if (this.sidebarActiveId !== 12) {
        this.getSelectData(this.dataDicChild.brand).then(res => {
          this.devBrandList = res.data.data[0].attr
        })
      }
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
    // 设备品牌选择
    changeBrand(val) {
      let params = {
        dictId: this.dataDicChild.modelNumber,
        homeClass: val
      }
      this.formData.modelNum = '' // 清空设备型号
      this.getDataDic(params).then(res => {
        this.devModelList = res.data.data[0].attr
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
      params.type = [Number(this.type.split('-')[1])]
      fireInterface
        .comBustibleQueryHost(params)
        .then(res => {
          if (res.data.code === 0) {
            this.$notify.success({
              message: '查询成功',
              title: '成功'
            })
            this.detectorList = res.data.data.alarmHostInfo
            this.total = res.data.data.page.totalNumber || 1
            // this.pageSize = res.data.data.page.pageSize
            // this.pageCurrent = res.data.data.page.page
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
    // 双击详情
    showDetail(row) {
      this.selectData = []
      this.selectData.push(row)
      this.isShowDetail = true
    },
    // 跳转页面
    changeComponent(value) {
      this.selectData = []
      this.isShowConfig = false
      this.isShowDetail = false
    },
    // 未关联
    handleEdit(index, row) {
      console.log(index, row)
      this.selectData = []
      this.isShowConfig = true
      this.selectData.push(row)
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
        ref: this.configType === '消防系统关联配置' ? 1 : 2
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
      let filename = '消防系统关联配置查询列表'
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
              item.status = '异常'
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
        params.type = [Number(this.type.split('-')[1])]
        for (var key in this.formData) {
          if (this.formData[key] && key !== 'pageSize' && key !== 'page') {
            params[key] = this.formData[key]
          }
        }
        fireInterface
          .createHostExcel(params)
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
    },
    // 打印
    printVisible() {
      printJS('show-div', 'html')
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
  .w-input {
    width: 356px;
    height: 35px;
    box-sizing: border-box;
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
