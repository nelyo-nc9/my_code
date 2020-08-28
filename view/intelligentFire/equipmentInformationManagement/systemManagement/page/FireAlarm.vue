<template>
  <div class="content">
    <div class="left-tree">
      <div class="tree-title">
        <span>机构</span>
        <i class="refresh icon iconfont-ccb ccbicon" @click="refresh" title="刷新"></i>
      </div>
      <treeBox
        ref="tree"
        :lazyTreeApi="getTreeApi"
        searchType="filter"
        :treeType="treeType"
        @onceClick="onceClick"
        treeLazyToggle
        iconToggle
        :customizeQuery="customizeQuery"
      ></treeBox>
    </div>
    <div class="right-content">
      <div class="top-box" v-show="!moveShow && isShowDetail !== 'transfer'">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>消防系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ sidebarActive }}</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box" v-if="isShowDetail === 'list'">
          <el-button size="mini" @click="skipTo('fireFightingSubsystemManagement')"
            ><i class="el-icon-plus"></i>新建</el-button
          >
          <el-button size="mini" :disabled="isSort" @click="clickEdit"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button size="mini" :disabled="isSelected" @click="delList()">
            <i class="el-icon-delete"></i>删除</el-button
          >
          <el-button size="mini" :disabled="isSelected" @click="clickMrgrate" t
            ><i class="icon iconfont-ccb ccbqianyi el-icon-"></i>迁移</el-button
          >
          <el-button size="mini" :disabled="isSort" @click="clickSort"><i class="el-icon-sort"></i>排序</el-button>
          <el-button size="mini" @click="exportExcel()"
            ><i class="icon iconfont-ccb ccbdaochu1 el-icon-"></i>导出</el-button
          >
          <el-button size="mini" @click="Toprint(sidebarActive)"><i class="el-icon-printer"></i>打印</el-button>
        </div>
      </div>
      <div class="table-box" v-show="!moveShow && isShowDetail !== 'transfer'">
        <div v-if="isShowDetail === 'list'" class="table-top flex-between mab20">
          <div>
            <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox>
            <el-button type="text" icon="el-icon-refresh" @click="getAlarmHostList(1)">刷新列表</el-button>
          </div>
          <div class="flex-between" style="margin-bottom:10px;text-align:right;">
            <el-select class="wth120 mar20" v-model="status" size="mini">
              <el-option label="全部" value=""></el-option>
              <el-option label="在线" value="1"></el-option>
              <el-option label="离线" value="2"></el-option>
            </el-select>
            <el-input
              style="width:200px;"
              size="mini"
              @keyup.enter.native="getTableList"
              v-model="name"
              placeholder="请输入设备名称"
            >
              <i slot="suffix" @click="getTableList" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
        <div v-if="isShowDetail === 'list'" style="flex:1;" ref="tableBox">
          <el-table
            ref="tabList"
            :data="tableData"
            border
            style="width:100%"
            :stripe="true"
            height="710"
            @row-dblclick="showDetail"
            @selection-change="handleSelectionChange"
            v-if="sidebarActiveId === 12"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" type="index" label="序号"></el-table-column>

            <el-table-column
              v-for="item in tableColumns"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              align="center"
              :width="item.width"
              sortable
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
                <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
                <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">异常</span>
                <span v-if="item.prop !== 'status'">{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            ref="tabList"
            :data="tableData"
            border
            style="width:100%"
            :stripe="true"
            height="710"
            @row-dblclick="showDetail"
            @selection-change="handleSelectionChange"
            v-if="sidebarActiveId !== 12"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" type="index" label="序号"></el-table-column>

            <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              align="center"
              :width="item.width"
              sortable
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row[item.prop] === 2 && item.prop === 'status'">在线</span>
                <span v-if="scope.row[item.prop] === 1 && item.prop === 'status'">离线</span>
                <span v-if="scope.row[item.prop] === 3 && item.prop === 'status'">异常</span>
                <span v-if="item.prop !== 'status'">{{ scope.row[item.prop] }}</span>
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
        <!-- 详情 -->
        <div v-if="isShowDetail === 'detail'" style="flex:1;width: 100%;text-align:center;">
          <div class="detail-footer">
            <el-button type="primary" size="mini" v-print="'print-detail'"
              ><i class="el-icon-printer"></i>打印</el-button
            >
            <el-button size="mini" @click="closeDetail">关闭</el-button>
          </div>
          <div id="print-detail">
            <div style="width: 70%;">
              <div style="margin-bottom:20px;color:#333;font-size:12px">{{ sidebarActive }}主机详情</div>
              <el-form
                :model="activeData"
                label-width="140px"
                style="width:995px;border:1px solid #e1e1e1;border-bottom:none;"
              >
                <div class="detail-item">
                  <span class="item-left">所属机构</span>
                  <span class="item-right">{{ activeData.orgName }}</span>
                  <span class="item-left">所属重点部位</span>
                  <span class="item-right">{{ activeData.orgName }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left" v-if="sidebarActiveId === 12">设备分类</span>
                  <span class="item-right" v-if="sidebarActiveId === 12">{{ activeData.inputDeviceType }}</span>
                  <span class="item-left">设备名称</span>
                  <span class="item-right">{{ activeData.name }}</span>
                  <span class="item-left" v-if="sidebarActiveId !== 12">设备品牌</span>
                  <span class="item-right" v-if="sidebarActiveId !== 12">{{ activeData.brand }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left" v-if="sidebarActiveId === 12">设备品牌</span>
                  <span class="item-right" v-if="sidebarActiveId === 12">{{ activeData.brand }}</span>
                  <span class="item-left">设备型号</span>
                  <span class="item-right">{{ activeData.modelNum }}</span>
                  <span class="item-left" v-if="sidebarActiveId !== 12">设备标签</span>
                  <span class="item-right" v-if="sidebarActiveId !== 12">{{ activeData.label }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId === 12">
                  <span class="item-left">通讯类型</span>
                  <span class="item-right">{{ activeData.inputCommunicationType }}</span>
                  <span class="item-left">设备IMEI/ID</span>
                  <span class="item-right">{{ activeData.inputDeviceImei }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left">标签编码</span>
                  <span class="item-right">{{ activeData.labelCode }}</span>
                  <span class="item-left">设备有效期</span>
                  <span class="item-right">{{ activeData.validity }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left">设备位置</span>
                  <span class="item-right">{{ activeData.address }}</span>
                  <span class="item-left">资产编码</span>
                  <span class="item-right">{{ activeData.assetCode }}</span>
                </div>
                <div class="detail-item">
                  <span class="item-left">生产日期</span>
                  <span class="item-right">{{ activeData.production }}</span>
                  <span class="item-left" v-if="sidebarActiveId !== 12">传输设备分类</span>
                  <span class="item-right" v-if="sidebarActiveId !== 12">{{ activeData.inputDeviceType }}</span>
                  <span class="item-left" v-if="sidebarActiveId === 12">所属服务</span>
                  <span class="item-right" v-if="sidebarActiveId === 12">{{ activeData.service }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId === 12">
                  <span class="item-left">设备标签</span>
                  <span class="item-right">{{ activeData.label }}</span>
                  <span class="item-left"></span>
                  <span class="item-right"></span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备名称</span>
                  <span class="item-right">{{ activeData.inputDeviceName }}</span>
                  <span class="item-left">传输设备品牌</span>
                  <span class="item-right">{{ activeData.inputDeviceBrand }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备型号</span>
                  <span class="item-right">{{ activeData.inputDeviceModel }}</span>
                  <span class="item-left">传输设备通讯类型</span>
                  <span class="item-right">{{ activeData.inputCommunicationType }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备IMEI/ID</span>
                  <span class="item-right">{{ activeData.inputDeviceImei }}</span>
                  <span class="item-left">传输设备IP地址</span>
                  <span class="item-right">{{ activeData.inputDeviceIp }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备网络端口</span>
                  <span class="item-right">{{ activeData.inputDevicePort }}</span>
                  <span class="item-left">所属服务</span>
                  <span class="item-right">{{ activeData.service }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备标签</span>
                  <span class="item-right">{{ activeData.inputDeviceLabel }}</span>
                  <span class="item-left">传输设备标签编码</span>
                  <span class="item-right">{{ activeData.inputDeviceCode }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备生产日期</span>
                  <span class="item-right">{{ activeData.inputDeviceProduction }}</span>
                  <span class="item-left">传输设备有效期</span>
                  <span class="item-right">{{ activeData.inputDeviceValidity }}</span>
                </div>
                <div class="detail-item" v-if="sidebarActiveId !== 12">
                  <span class="item-left">传输设备位置</span>
                  <span class="item-right">{{ activeData.inputDeviceAddress }}</span>
                  <span class="item-left">传输设备资产编码</span>
                  <span class="item-right">{{ activeData.inputDeviceAssetsCode }}</span>
                </div>
              </el-form>
              <div class="detail-bottom">
                <el-form label-width="100px" style="width:100%">
                  <div class="detail-item">
                    <span class="item-left" style="width:142px;">录入时间</span>
                    <span class="item-right" style="width:190px;">录入时间</span>
                    <span class="item-left" style="width:142px;">录入机构</span>
                    <span class="item-right" style="width:190px;">录入机构</span>
                    <span class="item-left" style="width:142px;">录入人</span>
                    <span class="item-right" style="width:190px;">录入人</span>
                  </div>
                </el-form>
              </div>
            </div>
            <!-- 系统部件 -->
            <div class="list-box" v-if="isShowDetail === 'detail' && isShowId">
              <relevance-list
                :showVideo="isShowDetail === 'detail'"
                :videoTableData="videoTableData"
                :formFire="formFire"
                :title="title"
              ></relevance-list>
            </div>
          </div>
        </div>
      </div>
      <transfer @goBack="isShow" :sortData="sortData" v-if="isShowDetail === 'transfer'"></transfer>
      <exportList @goBack="isShow" v-if="isShowDetail === 'exportList'"></exportList>
      <!-- 迁移组件 -->
      <Move
        v-show="moveShow"
        @clickMoveShow="clickMoveShow"
        :moveShow.sync="moveShow"
        :migrantData="migrantData"
      ></Move>
    </div>
  </div>
</template>

<script>
import { fireInterface } from '@src/http/intelligentFire/equipmentManagement.js'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import RelevanceList from './relevanceList'
// import mobileDevices from './mobileDevices'
import Move from './move'
import transfer from './transfer'
import exportList from './exportList'
import { handleExport } from '@src/common/excel'
import { download } from '@src/common/download.js'
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  name: 'fireFightingList',
  components: {
    treeBox,
    RelevanceList,
    Move,
    transfer,
    exportList
  },
  data() {
    return {
      isSelected: true, // 顶部按钮
      isSort: true, // 排序按钮
      title: '详情', // 部件页面类型
      treeType: 2, // 树
      customizeQuery: {
        // 树
        params: {
          subSystem: '1',
          isRecursion: '0'
        }
      },
      name: '', // 搜索input
      status: '', // 状态下拉
      formFire: {}, // 部件详情数据
      isShowSubOrg: false, // 是否显示子机构
      tableHeight: 400, // 表格高度
      total: 1, // 数据总条数
      pageSize: 25, // 每页数据条数
      pageCurrent: 1, // 当前页数
      pageCount: 0, // 总页数
      moveShow: false, // 迁移
      migrantData: [], // 迁移弹窗的源数据
      sortData: [], // 排序数据
      tableColumn: [
        // 表格标题行内容
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
          prop: 'name',
          label: '设备名称',
          width: '180'
        },
        {
          prop: 'brand',
          label: '设备品牌',
          width: '180'
        },
        {
          prop: 'modelNum',
          label: '设备型号',
          width: '180'
        },
        {
          prop: 'label',
          label: '设备标签',
          width: '100'
        },
        {
          prop: 'labelCode',
          label: '标签编码',
          width: '130'
        },
        {
          prop: 'validity',
          label: '设备有效期',
          width: '120'
        },
        {
          prop: 'address',
          label: '设备位置',
          width: '100'
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: '100'
        },
        {
          prop: 'production',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'status',
          label: '状态',
          width: '100'
        },
        {
          prop: 'inputDeviceType',
          label: '传输设备分类',
          width: '180'
        },
        {
          prop: 'inputDeviceName',
          label: '传输设备名称',
          width: '180'
        },
        {
          prop: 'inputDeviceBrand',
          label: '传输设备品牌',
          width: '180'
        },
        {
          prop: 'inputDeviceModel',
          label: '传输设备型号',
          width: '180'
        },
        {
          prop: 'inputCommunicationType',
          label: '传输通讯类型',
          width: '130'
        },
        {
          prop: 'inputDeviceImei',
          label: '传输设备IMEI',
          width: '130'
        },
        {
          prop: 'inputDeviceIp',
          label: '传输设备IP地址',
          width: '130'
        },
        {
          prop: 'inputDevicePort',
          label: '传输设备网络端口',
          width: '150'
        },
        {
          prop: 'service',
          label: '所属服务',
          width: '180'
        },
        {
          prop: 'inputDeviceLabel',
          label: '传输设备标签',
          width: '120'
        },
        {
          prop: 'inputDeviceCode',
          label: '传输设备标签编码',
          width: '180'
        },
        {
          prop: 'inputDeviceProduction',
          label: '传输设备生产日期',
          width: '180'
        },
        {
          prop: 'inputDeviceValidity',
          label: '传输设备有效期',
          width: '180'
        },
        {
          prop: 'inputDeviceAddress',
          label: '传输设备位置',
          width: '180'
        },
        {
          prop: 'inputDeviceAssetsCode',
          label: '传输设备资产编码',
          width: '180'
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
          width: '150'
        }
      ],
      tableData: [],
      tableColumns: [
        // 表格标题行内容
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
          prop: 'name',
          label: '设备名称',
          width: '180'
        },
        {
          prop: 'brand',
          label: '设备品牌',
          width: '180'
        },
        {
          prop: 'modelNum',
          label: '设备型号',
          width: '180'
        },
        {
          prop: 'label',
          label: '设备标签',
          width: '100'
        },
        {
          prop: 'labelCode',
          label: '标签编码',
          width: '150'
        },
        {
          prop: 'validity',
          label: '设备有效期',
          width: '130'
        },
        {
          prop: 'address',
          label: '设备位置',
          width: '130'
        },
        {
          prop: 'assetCode',
          label: '资产编码',
          width: '150'
        },
        {
          prop: 'production',
          label: '生产日期',
          width: '100'
        },
        {
          prop: 'inputDeviceType',
          label: '设备分类',
          width: '150'
        },
        {
          prop: 'status',
          label: '状态',
          width: '100'
        },
        {
          prop: 'inputCommunicationType',
          label: '通讯类型',
          width: '100'
        },
        {
          prop: 'inputDeviceImei',
          label: '设备ID',
          width: '130'
        },

        {
          prop: 'service',
          label: '所属服务',
          width: '180'
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
      activeData: null,
      isShowDetail: 'list', // 详情
      isShowId: false,
      videoTableData: [], // 详情页系统部件数据
      fireSelection: [],
      defaultParams: {
        pageSize: 25, // 一页多少条数据
        page: 1, // 第几页
        isChildren: 2, // 是否显示子机构， 1-是 2-否
        type: [1], // 主机类型(页面类型--sidebarActiveId)
        isOrder: true // 是否根据序号进行排序 true-是 false-否
      }
    }
  },
  created() {
    this.closeDetail()
    // console.log(this.)
    // this.getAlarmHostList()
    this.pageCount = Math.ceil(this.total / this.pageSize)
    // 查询列表条件
    this.defaultParams.pageSize = this.pageSize
    this.defaultParams.page = this.pageCurrent
    this.defaultParams.type = [this.sidebarActiveId] // 主机类型
    this.defaultParams.isChildren = this.isShowSubOrg === true ? 1 : 2 // 是否显示子机构， 1-是 2-否
    this.getQueryData(this.defaultParams)
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  watch: {
    // 监听选中数据
    fireSelection: function() {
      if (this.fireSelection.length === 0) {
        this.isSelected = true
        this.isSort = true
      } else if (this.fireSelection.length >= 2) {
        this.isSort = true
      }
    },
    // 监听页面类型
    sidebarActive: function(newVale, oldValue) {
      if (newVale) {
        this.closeDetail()
      }
    },
    // 页面数据条数
    pageSize: function() {
      this.defaultParams.pageSize = this.pageSize
      this.getQueryData(this.defaultParams)
    },
    // 监听分页
    pageCurrent: function() {
      this.defaultParams.page = this.pageCurrents
      this.getQueryData(this.defaultParams)
    },
    // 监听是否显示子机构
    isShowSubOrg: function() {
      this.defaultParams.isChildren = this.isShowSubOrg === true ? 1 : 2 // 是否显示子机构， 1-是 2-否
      this.getQueryData(this.defaultParams)
    },
    status: function() {
      this.defaultParams.page = 1
      this.defaultParams.status = this.status
      this.getQueryData(this.defaultParams)
    },
    name: function() {
      this.defaultParams.name = this.name
    }
  },
  computed: {
    ...mapState('equipmentManagement', {
      sidebarActive: 'sidebarActive', // 页面title
      sidebarActiveId: 'sidebarActiveId' // 页面类型id
    }),
    pageCounts: function() {
      return Math.ceil(this.total / this.pageSize)
    },
    pageCurrents: function() {
      return this.pageCurrent
    }
  },
  methods: {
    ...mapMutations('equipmentManagement', {
      SET_IS_NEW_FILE: 'SET_IS_NEW_FILE'
    }),
    ...mapActions(['getAlarmHost']),
    // 获取列表数据
    getQueryData(params, id) {
      fireInterface.comBustibleQueryHost(params).then(res => {
        if (res.data.code === 0) {
          if (id === 1) {
            this.$notify.success({
              message: '刷新成功',
              title: '成功'
            })
          }
          this.tableData = res.data.data.alarmHostInfo
          this.total = res.data.data.page.totalNumber || 1
          this.pageSize = res.data.data.page.pageSize
          this.pageCurrent = res.data.data.page.page
        }
      })
    },
    // 新建
    skipTo(data) {
      this.SET_IS_NEW_FILE(data)
      this.$emit('modelChange', {}, 'creat')
    },
    // 树
    getTreeApi(params) {
      return getTreeApi(params)
    },
    // 列表数据条数改变
    resizeFun() {
      this.tableHeight = this.$refs.tableBox.offsetHeight - 32
    },
    // 左侧树
    onceClick(data, node) {
      // this.defaultParams.orgId = data.orgId
      // this.defaultParams.keyPartId = data.keyPartId
      if (data.tierType === 'org') {
        this.defaultParams.orgId = data.id
      } else {
        this.defaultParams.orgId = node.parent.data.id
        this.defaultParams.keyPartId = data.id
      }
      this.getQueryData(this.defaultParams)
    },
    // 刷新  机构树
    refresh() {
      this.$refs.tree.$refs.lazyTree.refresh()
    },
    // 刷新列表数据
    getAlarmHostList(val) {
      this.getQueryData(this.defaultParams, val)
    },
    // 表头input搜索
    getTableList() {
      this.defaultParams.page = 1
      this.defaultParams.name = this.name
      this.getQueryData(this.defaultParams)
    },
    // 双击详情
    showDetail(row) {
      this.formFire = {}
      this.activeData = row
      this.formFire.hostId = row.id
      // 根据页面类型判断是否显示系统部件
      let id = [7, 8, 9, 10, 12]
      this.isShowId = !id.includes(this.sidebarActiveId)
      this.isShowDetail = 'detail'
    },
    // 关闭详情页
    closeDetail() {
      this.isShowDetail = 'list'
    },
    // 选中列表数据
    handleSelectionChange(val) {
      this.fireSelection = val
      if (this.fireSelection && this.fireSelection.length === 1) {
        this.isSort = false
        this.isSelected = false
      } else if (this.fireSelection && this.fireSelection.length > 0) {
        this.isSelected = false
      } else if (this.fireSelection.length >= 2) {
        this.isSelected = true
        this.isSort = true
      }
    },
    // 排序
    clickSort() {
      if (this.fireSelection && this.fireSelection.length > 0) {
        this.isShowDetail = 'transfer'
        this.sortData = this.fireSelection
      } else {
        this.$notify.warning({
          message: '请选择数据',
          title: '警告'
        })
      }
    },
    // 改变pageSize
    pageSizeChange(val) {
      this.pageSize = val
    },
    // 改变当前页
    pageSizeCurrent(val) {
      this.pageCurrent = val
    },
    // 上一页
    pagePrev() {
      this.pageCurrent = 1
    },
    // 下一页
    pageNext() {
      this.pageCurrent = this.pageCounts
    },
    // 编辑
    clickEdit() {
      // console.log(this.fireSelection[0].id)
      // return
      if (this.fireSelection.length) {
        this.formFire = {}
        this.skipTo('fireFightingSubsystemManagement')
        // this.formFire.push(this.fireSelection[0].id)
        this.$emit('modelChange', this.fireSelection[0], 'upDate')
      } else {
        this.$notify.warning({
          message: '请选择要编辑的信息!',
          title: '警告'
        })
      }
    },
    // 删除列表
    delList(done) {
      if (this.fireSelection.length) {
        this.$confirm('确认删除信息？', {
          closeOnClickModal: false
        })
          .then(_ => {
            let params = []
            this.fireSelection.map(item => {
              params.push(item.id)
            })
            fireInterface
              .comBustibleDeleteHost(params)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify.success({
                    message: '删除成功!',
                    title: '成功'
                  })
                  this.getQueryData(this.defaultParams)
                }
              })
              .catch(_ => {
                this.$notify.error({
                  message: '删除失败!',
                  title: '失败'
                })
              })
          })
          .catch(_ => {})
        // this.tableData
      } else {
        this.$notify.warning({
          message: '请选择要删除信息!',
          title: '警告'
        })
      }
    },
    // 迁移
    clickMrgrate() {
      if (this.fireSelection.length > 0) {
        this.moveShow = true
        this.migrantData = this.fireSelection
      } else {
        this.$notify.warning({
          message: '请选择要迁移信息!',
          title: '警告'
        })
      }
    },
    clickMoveShow(val) {
      this.moveShow = val
      this.getAlarmHostList()
      this.fireSelection = []
      this.$refs.tabList.clearSelection()
    },
    isShow(data) {
      this.isShowDetail = data
    },
    formatList(list, clomn) {
      let data = []
      list.map((item, index) => {
        let obj = { index: `${++index}` }
        clomn.map((childItem, childIndex) => {
          if (childItem.prop === 'status') {
            switch (item[childItem.prop]) {
              case 1:
                item[childItem.prop] = '离线'
                break
              case 2:
                item[childItem.prop] = '在线'
                break
              case 3:
                item[childItem.prop] = '异常'
                break
              default:
                item[childItem.prop] = ' '
                break
            }
          }
          obj[childItem.prop] = item[childItem.prop] ? item[childItem.prop] : ' '
        })
        data.push(obj)
      })
      console.log(data)
      return data
    },
    // 导出excel
    exportExcel() {
      // 有数据走前端导出
      let tHeader = ['序号']
      let filterVal = ['index']
      let fireSelection = this.$lodash.cloneDeep(this.fireSelection)
      fireSelection.map((item, index) => {
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
      })
      if (this.sidebarActiveId !== 12) {
        this.tableColumn.map(n => {
          tHeader.push(n.label)
          filterVal.push(n.prop)
        })
      } else {
        this.tableColumns.map(n => {
          tHeader.push(n.label)
          filterVal.push(n.prop)
        })
      }
      let filename = this.sidebarActive
      if (this.fireSelection.length) {
        handleExport(
          tHeader,
          filterVal,
          `${filename}${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`,
          fireSelection
        )
      } else if (this.tableData.length > 0 && this.fireSelection.length === 0) {
        // handleExport(tHeader, filterVal, filename, this.tableData)
        fireInterface
          .createHostExcel(this.defaultParams)
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
        // 无数据走接口
      } else {
        this.$notify.warning({
          message: '列表暂无数据',
          title: '警告'
        })
      }
    },
    // 打印方法
    Toprint(title) {
      // 判断打印全部还是选中
      let list = []
      let listData = []
      if (this.fireSelection && this.fireSelection.length > 0) {
        list = this.$lodash.cloneDeep(this.fireSelection)
      } else {
        list = this.$lodash.cloneDeep(this.tableData)
      }
      let prints = {
        properties: [{ field: 'index', displayName: '序号' }]
      }
      if (this.sidebarActiveId !== 12) {
        this.tableColumn.map((n, index) => {
          prints.properties.push({ field: n.prop, displayName: n.label })
        })
        listData = this.formatList(list, this.tableColumn)
      } else {
        listData = this.formatList(list, this.tableColumns)
        this.tableColumns.map((n, index) => {
          prints.properties.push({ field: n.prop, displayName: n.label })
        })
      }

      printJS({
        // 表格数据的来源
        printable: listData,
        // field 表格内容  displayName：表头名
        properties: prints.properties,
        type: 'json',
        // 表题
        header: '<p class="custom">' + title + '列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000}',
        // 表头样式 如 表格内容过多  删除white-space:nowrap;
        gridHeaderStyle:
          ' border: 1px solid  lightgray;white-space:nowrap;font-size:14px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:12px; text-align:center;'
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
  .tree-title {
    display: inline-block;
    width: 100%;
    height: 38px;
    line-height: 38px;
    text-align: center;
    background: #f5f5f5;
    color: #333;
    font-size: 14px;
    // margin-bottom: 14px;
    font-weight: 400;
    position: relative;
  }
  .refresh {
    position: absolute;
    top: 0px;
    right: 7px;
    z-index: 2;
    cursor: pointer;
  }
  .left-tree {
    width: 240px;
    height: 100%;
    position: absolute;
    border-right: 1px solid #e1e1e1;
  }
  /deep/.right-content {
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
    /deep/.box-title {
      text-align: left;
    }
    /deep/.table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      /deep/ .list-box {
        /deep/ .relevance-box {
          /deep/.collapses {
            /deep/.collapse-item {
              /deep/.table-box {
                height: 300px;
              }
            }
          }
        }
      }
    }
  }
  .detail-box,
  .detail-bottom {
    color: #666;
    width: 995px;
    border: 1px solid #f2f2f2;
    display: flex;
    flex-wrap: wrap;
    margin: 30px 0;
  }
  .detail-footer {
    text-align: left;
    padding-left: 20px;
    margin-top: 24px;
  }
}
.el-form {
  background-color: #f5f5f5;
}
.detail-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // height: 40px;
  // line-height: 40px;
  .el-form-item {
    margin: 0;
  }
  .item-left {
    display: inline-block;
    width: 140px;
    height: 35px;
    padding: 0 10px;
    line-height: 35px;
    color: #606266;
    text-align: right;
    border: 1px solid #e1e1e1;
    // border-bottom: 1px solid #e1e1e1;
    background-color: #f5f5f5;
  }

  .item-right {
    display: inline-block;
    width: 356px;
    height: 35px;
    padding: 0 10px;
    line-height: 35px;
    color: #606266;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #fff;
    border: 1px solid #e1e1e1;
    // border-bottom: 1px solid #e1e1e1;
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
.detail-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // height: 40px;
  // line-height: 40px;
  .el-form-item {
    margin: 0;
  }
  .item-left {
    display: inline-block;
    width: 140px;
    height: 35px;
    padding: 0 10px;
    line-height: 35px;
    color: #606266;
    text-align: right;
    border: 1px solid #e1e1e1;
    // border-bottom: 1px solid #e1e1e1;
    background-color: #f5f5f5;
  }

  .item-right {
    display: inline-block;
    width: 356px;
    height: 35px;
    padding: 0 10px;
    line-height: 35px;
    color: #606266;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #fff;
    border: 1px solid #e1e1e1;
    // border-bottom: 1px solid #e1e1e1;
  }
}
.detail-bottom {
  color: #666;
  width: 995px;
  border: 1px solid #f2f2f2;
  display: flex;
  flex-wrap: wrap;
  margin: 30px 0;
}
</style>
