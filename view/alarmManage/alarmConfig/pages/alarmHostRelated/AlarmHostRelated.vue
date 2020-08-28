<template>
  <div class="content">
    <div class="left-tree">
      <treeBox :lazyTreeApi="getTreeApi"
        searchType="search"
        :treeType="treeType"
        @rootId = 'setRootId'
        @clickData = 'clickData'
        @onceClick="onceClick"
        treeLazyToggle iconToggle
        :lazyTreeSearchApi="getLazyTreeSearchApi"
        :customizeQuery="customizeQuery"></treeBox>
    </div>
    <div class="right-content">
      <div v-if="!isShowDetail && !isShowConfig  && !isShowTopo && !isShowSort && !isShowMove" class="top-box">
        <header>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <i class="el-icon-location-outline" style="float:left;margin-right:6px;"></i>
            <el-breadcrumb-item>报警管理</el-breadcrumb-item>
            <el-breadcrumb-item>报警主机关联配置</el-breadcrumb-item>
            <el-breadcrumb-item>列表</el-breadcrumb-item>
          </el-breadcrumb>
        </header>
        <div class="button-box">
          <el-button size="mini" :disabled="selectItem.length === 0" @click="isShowConfig = true">关联配置</el-button>
          <el-button size="mini" @click="getConfig(1)">获取关联</el-button>
          <el-button size="mini" :disabled="selectItem.length !== 1" @click="isShowTopo = true">查看关联拓扑</el-button>
          <!-- <el-button size="mini" @click="isShowDetail = true">详情</el-button> -->
          <!-- <el-button size="mini">删除</el-button>
          <el-button size="mini" @click="isShowSort = true">排序</el-button>
          <el-button size="mini" @click="isShowMove = true">迁移</el-button> -->
          <el-button size="mini" @click="exportFile">导出</el-button>
          <!-- <el-button size="mini">打印</el-button> -->
        </div>
      </div>
      <div class="table-box">
        <div class="table-top" v-if="!isShowConfig && !isShowTopo" style="margin-bottom: 6px;">
          <!-- <el-checkbox style="margin-right:12px;" v-model="isShowSubOrg">显示子机构</el-checkbox> -->
          <!-- <el-button type="text" icon="el-icon-refresh" v-if="!isShowDetail">刷新列表</el-button> -->
          <el-input suffix-icon="el-icon-search" placeholder="请输入设备名称或设备IP" v-if="!isShowDetail" v-model="fuzzyQuery" @change="getConfig(2)" style="float:right;width:200px;" size="mini"></el-input>
          <!-- <el-select style="float:right;width:85px;margin-right:12px;" v-model="status" size="mini">
            <el-option label="全部" value="全部"></el-option>
            <el-option label="已关联" value="已关联"></el-option>
            <el-option label="未关联" value="未关联"></el-option>
          </el-select> -->
        </div>
        <div v-if="!isShowDetail  && !isShowConfig && !isShowTopo && !isShowSort && !isShowMove" style="flex:1;" ref="tableBox">
          <el-table :data="tableData" border size="mini" stripe :height="tableHeight" @selection-change="handleSelectionChange" @cell-click="cellClick" @row-dblclick="showDetail">
            <el-table-column type="selection"></el-table-column>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :sortable="item.sortable"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
          <!-- <el-pagination
            background
            style="text-align:right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageNum"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination> -->
          <video-pagination ref="listAlarmPagination"
                  :total="total"
                  :pageSizes="[10, 25, 50, 100]"
                  :limitDefault="pageSize"
                  @paginationConfChange="eventChange"></video-pagination>
        </div>
      </div>
      <AlarmHostRelatedInfo v-if="isShowDetail" :isShowDetail.sync="isShowDetail" :activeData="activeData" relatedType='1' ></AlarmHostRelatedInfo>
      <RelatedConfigNew v-if="isShowConfig" :isShowConfig.sync="isShowConfig" :selectedData="selectItem" @clearSelect="clearSelect" relatedType='1' configType='报警主机关联配置'></RelatedConfigNew>
      <AssociationTopo v-if="isShowTopo" :isShowTopo.sync="isShowTopo" :hostInfo="selectItem[0]" relatedType='1'></AssociationTopo>
      <Sort v-if="isShowSort" :isShowSort.sync="isShowSort"></Sort>
      <Move v-if="isShowMove" :isShowMove.sync="isShowMove"></Move>
    </div>
    <VelevanceInfo v-if="showVelevanceInfo" :InfoData="InfoData" @cancle="cancle" navTitle="1" :flag="relevaceFlag"></VelevanceInfo>
  </div>
</template>

<script>
import AlarmHostRelatedInfo from './AlarmHostRelatedInfo'
import VelevanceInfo from './relevanceInfo'
import RelatedConfigNew from './RelatedConfigNew'
import AssociationTopo from './AssociationTopo'
import VideoPagination from '@src/view/videoManage/components/VideoPagination'
import { download } from '@src/common/download.js'
import Sort from './Sort'
import Move from './Move'
import { alarmGetTreeApi, getHostOrResourceApi, alarmSearchTree } from '@src/http/alarm/alarmHostConfig.api.js' // alarmHostGetTreeApi
import treeBox from '@src/components/tree/treeBox'
import { mapActions } from 'vuex'
export default {
  components: {
    AlarmHostRelatedInfo,
    RelatedConfigNew,
    AssociationTopo,
    Sort,
    Move,
    treeBox,
    VelevanceInfo,
    VideoPagination
  },
  data() {
    return {
      fuzzyQuery: '',
      relevaceFlag: false,
      InfoData: [],
      showVelevanceInfo: false,
      status: '全部',
      isShowSubOrg: true, // 显示子机构
      isShowDetail: false, // 控制详情页显隐
      isShowConfig: false, // 控制 关联配置页 显隐
      isShowTopo: false, // 控制 查看关联拓扑 显隐
      isShowSort: false, // 控制 排序页
      isShowMove: false, // 控制 移动页
      tableHeight: 688,
      tableColumn: [
        // 表格标题行内容
        // { prop: 'subsystem', label: '所属子系统', width: '110', sortable: true },
        { prop: 'orgName', label: '所属机构', width: '120', sortable: true },
        { prop: 'locName', label: '所属重点部位', width: '120', sortable: true },
        { prop: 'deviceType', label: '设备类型', width: '120', sortable: true },
        { prop: 'name', label: '设备名称', width: '120', sortable: true },
        { prop: 'code', label: '资产编码', width: '100', sortable: true },
        { prop: 'brand', label: '设备品牌', width: '100', sortable: true },
        { prop: 'deviceModel', label: '设备型号', width: '100', sortable: true },
        { prop: 'netModuleBrand', label: '网络模块品牌', width: '120', sortable: true },
        { prop: 'netModuleModel', label: '网络模块型号', width: '120', sortable: true },
        { prop: 'netModuleID', label: '网络模块ID', width: '110', sortable: true },
        { prop: 'ip', label: 'IP地址', width: '100', sortable: true },
        { prop: 'port', label: '网络端口', width: '100', sortable: true },
        { prop: 'cameraAssociated', label: '关联摄像头', width: '130', sortable: true },
        { prop: 'talkAssociated', label: '关联对讲通道', width: '130', sortable: true },
        { prop: 'doorAssociated', label: '关联门禁通道', width: '130', sortable: true },
        { prop: 'outputAssociated', label: '关联输出通道', width: '130', sortable: true },
        { prop: 'createdBy', label: '录入人', width: '100', sortable: true },
        { prop: 'createdDept', label: '录入机构', width: '100', sortable: true },
        { prop: 'updatedAt', label: '录入时间', width: '120', sortable: true }
      ],
      tableData: [
        // 列表数据
      ],
      treeType: 1,
      rootId: '',
      customizeQuery: {
        params: {
          subSystem: '2',
          isRecursion: '0' // 显示子机构  选中传1 不选中传0
        }
      },
      selectItem: [],
      pageSize: 25,
      page: 1,
      total: 0,
      currentOrgId: '',
      currentEquId: '',
      currentKeyPartId: '',
      activeData: {}
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
  },
  created() {
    this.getAlarmHostList()
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun)
    this.$nextTick(() => {
      this.resizeFun()
    })
  },
  watch: {
    rootId() {
      // this.getTableList()
    }
  },
  methods: {
    ...mapActions(['getAlarmHost']),
    getConfig(num) {
      this.getAlarmHostList()
      if (num === 1) {
        this.$notify.success({
          title: '成功',
          message: '成功'
        })
      }
    },
    // 机构数 后台搜索
    getLazyTreeSearchApi(params) {
      params = {
        subSystem: 2,
        key: params.search
      }
      return alarmSearchTree(params)
    },
    showDetail(row) {
      this.activeData = row
      this.isShowDetail = true
      // this.getDetectorList(row.id)
      // this.getOutputChanList(row.id)
      // this.getSubsystemList(row.id)
    },
    cancle() {
      this.showVelevanceInfo = false
      this.relevaceFlag = false
    },
    cellClick(row, column) {
      if ((column.label === '关联摄像头' && row.cameraAssociated === '未关联')
      || (column.label === '关联对讲通道' && row.talkAssociated === '未关联')
      || (column.label === '关联门禁通道' && row.doorAssociated === '未关联')
      || (column.label === '关联输出通道' && row.outputAssociated === '未关联')) {
        this.isShowConfig = true
        this.selectItem = []
        this.selectItem.push(row)
      } else if ((column.label === '关联摄像头' && row.cameraAssociated === '已关联')
      || (column.label === '关联对讲通道' && row.talkAssociated === '已关联')
      || (column.label === '关联门禁通道' && row.doorAssociated === '已关联')
      || (column.label === '关联输出通道' && row.outputAssociated === '已关联')) {
        let params = {
          ref: 1
        }
        getHostOrResourceApi(row.id, params).then(res => {
          this.InfoData = res.data.data
          this.showVelevanceInfo = true
          this.relevaceFlag = true
        }).catch(err => {
          console.log(err)
        })
      }
    },
    eventChange(data) {
      this.pageSize = data.limit
      this.page = data.page
      this.getAlarmHostList()
    },
    // 分页码
    handleCurrentPageNum(val) {
      console.log(val, 'val=======2')
      this.page = val
      this.getAlarmHostList()
    },
    // X条/页
    handleSizeChange(val) {
      console.log(val, 'val=====1')
      this.pageSize = val
      this.handleCurrentPageNum(1)
    },
    handleSelectionChange(selection) {
      this.selectItem = selection
    },
    exportFile() {
      if (this.selectItem && this.selectItem.length > 0) {
        const { export_json_to_excel } = require('../../../../../common/vendor/Export2Excel')
        // 表头
        const tHeader = []
        // 字段名
        const filterVal = []
        for (let i = 0; i < this.tableColumn.length; i++) {
          tHeader.push(this.tableColumn[i].label)
          filterVal.push(this.tableColumn[i].prop)
        }
        let list = []
        // 导出全部或导出选中
        if (this.selectItem && this.selectItem.length > 0) {
          list = this.selectItem
        } else {
          list = this.tableData
        }
        // 筛选过滤
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, 'fileName')
      } else {
        let params = {
          pattern: 'list',
          pageSize: this.pageSize,
          pageNum: this.page,
          key: this.fuzzyQuery,
          orgId: this.currentOrgId
        }
        if (this.currentKeyPartId) {
          params['locationId'] = this.currentKeyPartId
        }
        // zp去掉url中间的/host
        let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/alarm-manage/v1/alarm-host/hostlink-export`
        let name = `报警主机关联配置导出${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
        download(
          url,
          name,
          () => {},
          () => {
            this.$message({ type: 'info', message: '导出文件下载失败！' })
          },
          () => {},
          'post',
          params
        )
      }
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getTreeApi(params) {
      return alarmGetTreeApi(params)
    },
    setRootId(id) {
      this.rootId = id
    },
    clickData(data) {
      if (data.isRoot) {
        this.currentOrgId = data.id
        this.currentKeyPartId = ''
        this.getAlarmHostList()
      }
    },
    onceClick(data, node) {
      if (data.tierType === 'org') {
        this.currentOrgId = data.id
        this.currentKeyPartId = ''
      } else {
        this.currentOrgId = ''
        this.currentKeyPartId = data.id
      }
      this.getAlarmHostList()
    },
    resizeFun() {
      this.$refs.tableBox && (this.tableHeight = this.$refs.tableBox.offsetHeight - 58)
    },
    getAlarmHostList() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.page,
        key: this.fuzzyQuery,
        orgId: this.currentOrgId
      }
      if (this.currentKeyPartId) {
        params['locationId'] = this.currentKeyPartId
      }
      this.getAlarmHost(params).then(res => {
        this.tableData = []
        const result = res.results
        this.total = res.page.length
        Array.isArray(result) && result.forEach(item => {
          // if (item.updatedAt !== undefined) {
          //   item.updatedAt = this.$moment(item.updatedAt).format('YYYY-MM-DD hh:mm:ss')
          // }
          if (item.cameraAssociated !== undefined) {
            item.cameraAssociated = item.cameraAssociated === 'T' ? '已关联' : ''
          }
          if (item.talkAssociated !== undefined) {
            item.talkAssociated = item.talkAssociated === 'T' ? '已关联' : ''
          }
          if (item.doorAssociated !== undefined) {
            item.doorAssociated = item.doorAssociated === 'T' ? '已关联' : ''
          }
          if (item.outputAssociated !== undefined) {
            item.outputAssociated = item.outputAssociated === 'T' ? '已关联' : ''
          }
        })
        this.tableData = result
      }).catch(err => {
        console.log(err)
      })
    },
    clearSelect() {
      this.selectItem = []
      this.getAlarmHostList()
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
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
    .button-box {
      margin: 12px 0;
    }
    .table-box {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}
.el-button--text {
  color: #606266;
  &:hover {
    color: #66b1ff;
  }
}
</style>
