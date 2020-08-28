<template>
  <div class="list-box">
    <treeBox
      class="leftTree"
      ref="treeBox"
      :lazyTreeApi="getTreeApi"
      :lazyTreeCheckApi="lazyTreeCheckApi"
      :customizeQuery="customizeQuery"
      searchType="filter"
      @onceClick="onceClick"
      @checkclick="checkclick"
      @clickData="clickData"
      treeLazyToggle
    ></treeBox>
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <breadcrumb :breadcrumbItem="['视频管理', '中心录像计划配置', '录像计划列表']"></breadcrumb>
        <!-- 操作按钮 列表 "-->
        <div class="button-box">
          <el-button size="small" icon="el-icon-plus"  @click="changComponent(1)">新建</el-button>
          <el-button icon="el-icon-edit-outline"
            size="small"
            @click="changComponent(0)"
            :disabled="tableSelect.length > 0 && tableSelect.length !== 1"
            >编辑</el-button
          >
          <el-button size="small" icon="el-icon-delete"  @click="deleteDevice(false)">删除</el-button>
          <el-button size="small" icon="el-icon-delete"  @click="deleteDevice(true)">强制删除</el-button>
          <el-button size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-"  @click="exportFun">导出</el-button>
          <el-button size="small" icon="el-icon-printer"  @click="printing">打印</el-button>
          <!-- 搜索 -->
          <span>
            <div class="div-inline">
              <el-form
                size="mini"
                label-position="right"
                label-width="0px"
                ref="searchCriteria"
                :model="searchCriteria"
                :rules="rulesCheck"
                @submit.native.prevent
              >
                <el-form-item label="" prop="keyword">
                  <el-input
                    v-model="searchCriteria.keyword"
                    style="float:right;width:220px;"
                    placeholder="请输入录像计划名称"
                    size="small"
                    @keyup.enter.native="search"
                  >
                    <i slot="suffix" @click="search" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="div-inline">
              <!-- 启用/停用 -->
              <el-select style="float:right;width:80px;" v-model="searchCriteria.status" size="small" @change="search">
                <el-option v-for="(e, i) of deviceTypeAllOption" :label="e.label" :value="e.value" :key="i"></el-option>
              </el-select>
            </div>
            <div class="div-inline">
              <!-- 查询类型 -->
              <el-select
                style="float:right;width:80px;"
                v-model="searchCriteria.configType"
                size="small"
                @change="search"
              >
                <el-option v-for="(e, i) of patternAllption" :label="e.label" :value="e.value" :key="i"></el-option>
              </el-select>
            </div>
          </span>
        </div>
      </div>
      <div class="main">
        <!-- 表格过滤条件 -->
        <div class="opt-box">
          <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
        </div>
        <!-- 表格和分页 -->
        <!-- <template style="min-height: 720px;overflow: auto;"></template> -->
        <div class="tableBox">
          <el-table
            stripe
            border
            size="small"
            :data="tableData"
            @select="select"
            @select-all="select"
            @row-dblclick="rowDbClick"
            height="100%"
            max-height="805"
            style="width: 100%"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            empty-text
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <!-- <el-table-column label="序号" prop="index" type="index" :index="indexMethod" width="60" align="center"></el-table-column> -->
            <el-table-column
              v-for="e of columns"
              :key="e.prop"
              :prop="e.prop"
              :label="e.label"
              :width="e.width"
              align="center"
              :sortable="e.sortable"
              show-overflow-tooltip
              :formatter="formatterTable"
            ></el-table-column>
          </el-table>
        </div>
        <video-pagination
          ref="listPagination"
          :total="pageInfo.total"
          @paginationConfChange="paginationConfChange"
        ></video-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '../common/breadcrumb.vue'
import treeBox from '@src/components/tree/treeBox'
import VideoPagination from '../../../components/VideoPagination'
import {
  getRecordPlanApi, // 获取录像计划列表（定时/事件）
  deleteRecordPlanApi // 删除录像计划（定时/事件）
} from '@src/http/video/recordConfig.api.js'
import { getTreeApi, getLazyTreeApi } from '@src/http/video/videoPreview.api.js'

import { mapGetters, mapMutations } from 'vuex'
import common from '../common'
import create from '@src/assets/rules/validation/security/video/video_search.js'
const NOTIFY = {
  TITLE: {
    SUCCESS: '成功',
    FAIL: '失败',
    ERROR: '错误',
    WARNING: '警告'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning'
  }
}
export default {
  name: 'recordList',
  mixins: [common],
  components: {
    treeBox,
    VideoPagination,
    breadcrumb
  },
  created() {
    this.pageInfo.limit = this.$PageInfo.limit
    this.search = this.$lodash.debounce(this._search, 800)
  },
  mounted() {
    this.setPageInfo()
    // this.getTableList(this.pageInfo.page)
  },
  data() {
    return {
      rulesCheck: create.searchCheck_recordPlanList, // 表单校验
      //
      searchCriteria: {
        // 搜索条件
        keyword: '', // 名称
        configType: '', // 1-按资源 2-按组织
        status: '' // 1-启用 2-停用
      },
      columns: [
        // 表格项
        { prop: 'index', label: '序号' },
        { prop: 'name', sortable: true, label: '录像计划名称', width: '220' },
        { prop: 'configType', sortable: true, label: '配置类型', width: '220' },
        { prop: 'storageServerId', sortable: true, label: '存储位置', width: '220' },
        { prop: 'planTemplateId', sortable: true, label: '录像计划', width: '220' },
        { prop: 'streamType', sortable: true, label: '录像码流', width: '120' },
        { prop: 'status', sortable: true, label: '录像状态', width: '100' },
        { prop: 'updatedDept', sortable: true, label: '录入机构', width: '220' },
        { prop: 'updatedBy', sortable: true, label: '录入人', width: '100' },
        { prop: 'updatedAt', sortable: true, label: '录入时间', width: '150' }
      ],
      tableData: [], // 表格data
      pageInfo: {
        // 页码组件返回参数
        limit: 25,
        page: 1,
        total: 0 // 总页码
      },
      tableSelect: [], // 表格选中项
      treeSelect: [], // tree选中项
      customizeQuery: {
        // 机构树传参
        params: {
          subSystem: 1,
          channelType: 1
        }
      },
      selectTreeid: {} // 点击机构树获取的id
    }
  },
  computed: {
    ...mapGetters('videoManage', {
      deviceTypeAllOption: 'deviceTypeAllOption', // 启用停用 全部
      patternAllption: 'patternAllption' // 查看类型备选项 All
    })
  },
  methods: {
    ...mapMutations('videoManage', ['SET_PATTERN']),
    // 请求表格data
    getTableList(page) {
      let params = {
        page,
        limit: this.pageInfo.limit,
        status: this.searchCriteria.status,
        configType: this.searchCriteria.configType,
        keyword: this.searchCriteria.keyword,
        ...this.selectTreeid
      }
      // if (this.searchCriteria.keyword) { // 录像计划名称
      //   // params[''] = this.searchCriteria.keyword
      // }
      // if (this.searchCriteria.configType) { // 1-按资源 2-按组织
      //   params.pattern = this.searchCriteria.configType
      // }
      // if (this.searchCriteria.status) { // 1启用，2停用
      //   params.status = this.searchCriteria.status
      // }
      this.tableData = []
      console.log(params)
      getRecordPlanApi(params)
        .then(res => {
          if (!res.data.code) {
            if (!res.data.data || !res.data.data.plans) {
              this.pageInfo.total = 0
            } else {
              let param = []
              res.data.data.plans.forEach(e => {
                let resList = e.channelList
                let storageServerIds = Array.from(new Set(resList ? resList.map(vm => vm.storageServerId) : []))
                param.push({
                  id: e.id, // string 录像计划id
                  // oId: e.oId, // string 所属机构id
                  // orgName: e.orgName, // string 所属机构名称
                  // kpId: e.keyPart, // string 所属重点部位id
                  // keyPartName: e.keyPartName, // string 所属重点部位名称
                  // resId: e.rId, // string 资源id
                  // resName: e.resName, // string 资源名称
                  configType: e.configType, // 配置类型
                  status: e.status, // integer 录像状态  1启用，2停用
                  streamType: e.streamType, // integer 录像码流类型 1主码流，2子码流，3.第三码流
                  planTemplateId: e.planTemplateId, // integer 录像计划模板id
                  name: e.name, // string 录像计划模板名称
                  storageServerId: storageServerIds, // string 存储设备名称Id
                  // ip: e.ip, // string ip地址
                  // storagePath: e.storagePath, // integer 存储路径
                  // planTaskType: e.planTaskType, // integer 录像类型 1定时，2事件
                  updatedBy: e.updatedBy, // string 录入人
                  updatedDept: e.updatedDept, // string 录入机构
                  updatedAt: e.updatedAt // string 编辑时
                })
              })
              let paginationConfig = {}
              paginationConfig['limit'] = param.length
              paginationConfig['page'] = (this.pageInfo.page) - 1
              param.forEach((item, index) => {
                item['index'] = (index + 1) + paginationConfig.page * paginationConfig.limit
              })
              this.tableData = param
              this.pageInfo.total = res.data.data.total
            }
          } else {
            this.$notify({
              title: NOTIFY.TITLE.ERROR,
              message: '获取中心录像计划配置列表失败，请稍后重试',
              type: NOTIFY.TYPE.ERROR
            })
          }
        })
        .catch(err => {})
    },
    rowDbClick(row) {
      this.skipModal('recordPlaneShow', 'recordPlaneList', row.id)
    },
    // 刷新表格
    refresh() {
      this.pageInfo.limit = this.$PageInfo.limit
      this.setPageInfo()
      this.getTableList(this.pageInfo.page)
    },
    // 开启编辑模式
    changComponent(val) {
      // 1-新建 0-编辑 跳到录像计划配置页面
      if (val) {
        this.skipModal('recordPlaneInfo', 'recordPlaneList')
        this.$emit('modelChange')
      } else {
        if (this.tableSelect.length != 1) {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '请勾选编辑项',
            type: NOTIFY.TYPE.WARNING
          })
          return false
        }
        this.SET_PATTERN(this.tableSelect[0].configType)
        this.skipModal('recordPlaneInfo', 'recordPlaneList', this.tableSelect[0].id)
      }
    },
    // 选择列表
    select(s, row) {
      this.tableSelect = s
    },
    // 页码控件返回参数
    paginationConfChange(obj) {
      this.pageInfo.page = obj.page
      this.pageInfo.limit = obj.limit
      this.getTableList(this.pageInfo.page)
    },
    // 删除
    deleteDevice(isForceDel) {
      if (!this.tableSelect.length) {
        this.$notify({
          title: NOTIFY.TITLE.WARNING,
          message: '请勾选删除项',
          type: NOTIFY.TYPE.WARNING
        })
        return false
      }

      this.$confirm('此操作将永久删除该计划, 是否继续?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = this.getIds(this.tableSelect)
          deleteRecordPlanApi({ ids, isForceDel })
            .then(res => {
              if (!res.data.code) {
                this.setPageInfo(
                  this.pageInfo.page > 1
                    ? this.pageInfo * (this.pageInfo.limit - 1) > this.pageInfo.total - this.tableSelect.length
                      ? --this.pageInfo.page
                      : this.pageInfo.page
                    : 1
                )
                this.getTableList(this.pageInfo.page)

                this.$notify({
                  title: NOTIFY.TITLE.SUCCESS,
                  message: '删除成功',
                  type: NOTIFY.TYPE.SUCCESS
                })
              } else {
                throw res.data
              }
            })
            .catch(err => {
              if (err.code === 1008) {
                this.$notify({
                  title: NOTIFY.TITLE.WARNING,
                  message: err.message,
                  type: NOTIFY.TYPE.WARNING
                })
              } else {
                this.$notify({
                  title: NOTIFY.TITLE.ERROR,
                  message: '删除失败，请稍后重试',
                  type: NOTIFY.TYPE.ERROR
                })
              }
            })

          this.$notify({
            title: NOTIFY.TITLE.SUCCESS,
            message: '删除成功',
            type: NOTIFY.TYPE.SUCCESS
          })
        })
        .catch(() => {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '已取消删除',
            type: NOTIFY.TYPE.WARNING
          })
        })
    },
    // 导出
    exportFun() {
      let key = [
        'index',
        'name',
        'configType',
        'storageServerId',
        'planTemplateId',
        'streamType',
        'status',
        'updatedDept',
        'updatedBy',
        'updatedAt'
      ]
      let title = [
        '序号',
        '录像计划名称',
        '配置类型',
        '存储位置',
        '录像计划',
        '录像码流',
        '录像状态',
        '录入机构',
        '录入人',
        '录入时间'
      ]
      this.exportExcel(
        title,
        key,
        this.tableSelect,
        this.tableData,
        `录像计划列表导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`,
        { ...this.searchCriteria, ...this.selectTreeid },
        'list'
      )
    },
    // 打印
    printing() {
      let key = [
        { field: 'index', displayName: '序号' },
        { field: 'name', displayName: '录像计划名称' },
        { field: 'configType', displayName: '配置类型' },
        { field: 'storageServerId', displayName: '存储位置' },
        { field: 'planTemplateId', displayName: '录像计划' },
        { field: 'streamType', displayName: '录像码流' },
        { field: 'status', displayName: '录像状态' },
        { field: 'updatedDept', displayName: '录入机构' },
        { field: 'updatedBy', displayName: '录入人' },
        { field: 'updatedAt', displayName: '录入时间' }
      ]
      let params = this.tableSelect.length ? this.tableSelect : this.tableData
      params = params.map(e => {
        return {
          index: e.index,
          name: e.name || '',
          configType: this.filterData('configType', e.configType || '') || '',
          storageServerId: this.filterData('storageServerId', e.storageServerId || ''),
          planTemplateId: this.filterData('planTemplateId', e.planTemplateId || ''),
          streamType: this.filterData('streamType', e.streamType),
          status: this.filterData('status', e.status),
          updatedDept: e.updatedDept || '',
          updatedBy: e.updatedBy || '',
          updatedAt: e.updatedAt || ''
        }
      })
      this.printFun(`录像计划列表`, key, params)
    },
    // 搜索按钮
    _search() {
      this.$refs['searchCriteria'].validate(valid => {
        if (valid) {
          //
          this.setPageInfo()
          this.getTableList(this.pageInfo.page)
        } else {

        }
      })
    },
    // 设置页码
    setPageInfo(page = 1) {
      this.pageInfo.page = page
      this.$refs.listPagination.setPaginationConfig({ page: this.pageInfo.page, limit: this.pageInfo.limit })
    },
    // 机构树API
    getTreeApi(params) {
      return getLazyTreeApi(params)
    },
    // 懒加载递归机构树接口
    lazyTreeCheckApi(params) {
      return getTreeApi(params)
    },
    // 单击机构树
    /**
     * 单击机构树 获取当前节点下的所有资源数据
     */
    onceClick(data, node) {
      this.setPageInfo()
      console.log(data)
      switch (data.tierType) {
        case 'res':
          this.selectTreeid = { channelId: data.id + '' }
          break
        case 'equ':
          this.selectTreeid = { deviceId: data.id + '' }
          break
        case 'loc':
          this.selectTreeid = { keyPartId: data.id + '' }
          break
        case 'org':
          this.selectTreeid = { orgId: data.id + '' }
          break
      }
      this.getTableList(this.pageInfo.page)
    },
    clickData(data) {
      if (data && data.nodeKey) {
        console.log(data)
        this.$refs.treeBox.setCurrentKey(data.nodeKey) // 高亮根节点this.setPageInfo();
        this.keyword = ''
        switch (data.tierType) {
          case 'res':
            this.selectTreeid = { channelId: data.id + '' }
            break
          case 'equ':
            this.selectTreeid = { deviceId: data.id + '' }
            break
          case 'loc':
            this.selectTreeid = { keyPartId: data.id + '' }
            break
          case 'org':
            this.selectTreeid = { orgId: data.id + '' }
            break
        }
        this.getTableList(this.pageInfo.page)
      }
    },
    // 勾选机构树
    checkclick(data, node, status) {
      this.treeSelect = status.checkedNodes.map(e => e.tierType === 'res' && e).filter(e => e)
    },
    deleteOpen() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            title: NOTIFY.TITLE.SUCCESS,
            message: '删除成功',
            type: NOTIFY.TYPE.SUCCESS
          })
        })
        .catch(() => {
          this.$notify({
            title: NOTIFY.TITLE.WARNING,
            message: '已取消删除',
            type: NOTIFY.TYPE.WARNING
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.list-box {
  width: 100%;
  height: calc(~'100% - 10px');
  margin-top: 10px;
  display: flex;
  .leftTree {
    width: 280px;
    height: 100%;
  }
  .content {
    width: calc(~'100% - 290px');
    max-width: 1700px;
    height: 100%;
    padding-left: 10px;
    .top {
      .button-box {
        // 操作按钮
        user-select: none;
        & > div {
          margin-right: 12px;
          width: 100px;
        }
        & > span {
          margin-right: 5px;
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 61px');
      .opt-box {
        height: 40px;
      }
      .tableBox {
        width: 100%;
        max-width: 1848px;
        height: calc(~'100% - 90px');
        .showValue {
          display: inline-block;
          width: calc(100% - 20px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
        /deep/ table tr th.is-sortable > .cell {
          top: 2px;
        }
      }
    }
  }
}
.div-inline {
  float: right;
  margin: 0 0 0 20px;
}
</style>
