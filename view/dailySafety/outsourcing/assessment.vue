<template>
  <div class="list-box">
    <!-- 中间树 -->
    <div class="tree-container">
      <treeBox
       :lazyTreeApi="getTreeApi"
       searchType="filter"
       :treeType="treeType"
       @clickData='clickData'
       @onceClick="onceClick"
       treeLazyToggle
       iconToggle></treeBox>
    </div>
    <div class="content">
      <!-- 顶部操作栏 -->
      <div class="top">
        <!-- 面包屑 -->
        <div class="header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>外委公司管理 </el-breadcrumb-item>
            <el-breadcrumb-item>外委公司考核</el-breadcrumb-item>
            <el-breadcrumb-item class="active">列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="middle">
          <!-- 操作按钮 -->
          <div class="button-box">
            <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
            <el-button size="small">本季度</el-button>
            <el-button size="small">半年</el-button>
            <el-button size="small" @click="deleteDevice">本年度</el-button>
            <el-button size="small" @click="timeShow">详细筛选</el-button>
            <el-date-picker v-if="isTime" size="small" v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" >
            </el-date-picker>
          </div>
          <!-- 表格过滤条件 -->
          <div class="opt-box">
            <el-button size="small" icon="icon iconfont-ccb ccbdaochu1 el-icon-" @click="exportFile">导出</el-button>
            <el-button size="small" icon="el-icon-printer" @click="Toprint">打印</el-button>
          </div>
        </div>

      </div>
      <div class="main">
        <!-- 表格和分页 -->
        <el-table id="print-table" stripe border size="medium" :data="tableData" @select="select" @select-all="select" @row-dblclick="rowDbClick" height="745px" max-height="805" style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="序号" type="index" :index="indexMethod" width="80" align="center"> </el-table-column>
          <el-table-column  v-for="(column, index) in columns" :key="index" :prop="column.prop" :label="column.label" :width="column.width" :sortable="column.sortable" show-overflow-tooltip align="center" >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import { getDeviceListApi, deleteDeviceApi } from '@src/http/video/videoConfig.api.js'
import { getTreeApi } from '@src/http/video/videoPreview.api.js'
import treeBox from '@src/components/tree/treeBox'
import { download } from '@src/common/download.js'

export default {
  name: 'assessment',
  components: {
    treeBox
  },
  props: {
    currentComponent: {
      type: String
    }
  },
  data() {
    return {
      isTime: false,
      value1: '',
      keyword: '',
      treeType: 2,
      status: '全部',
      columns: [
        { sortable: true, prop: 'orgName', label: '公司名称', width: 'auto', sortable: true },
        { sortable: true, prop: 'keyPartName', label: '工单数量', width: 'auto', sortable: true },
        { sortable: true, prop: 'type', label: '综合得分', width: 'auto', sortable: true },
        { sortable: true, prop: 'name', label: '处理及时性', width: 'auto', sortable: true },
        { sortable: true, prop: 'ip', label: '任务完成度', width: 'auto', sortable: true },
        { sortable: true, prop: 'status', label: '服务态度', width: 'auto', sortable: true }
      ],
      tableData: [],
      total: 0,
      currentOrgId: '',
      currentserial: '',
      currentKeyPartId: '',
      showSubOrg: false,
      paginationConfig: {
        limit: 100,
        page: 1
      },
      selectData: [],
      personInfo: {}
    }
  },
  created() {
    let userInfo = window.localStorage.getItem('user')
    userInfo = JSON.parse(userInfo)
    this.personInfo = this.$lodash.cloneDeep(userInfo)
    // getDeviceSelectConf() // 获取下拉填充
  },
  watch: {
    showSubOrg() {
      this.getTableList()
    },
    status() {
      this.getTableList()
    }
  },
  methods: {
    getTreeApi(params) {
      return getTreeApi(params)
    },
    clickData(data) {
      if (data.isRoot) {
        this.currentOrgId = data.id
        this.currentserial = data.serial
        this.currentKeyPartId = ''
        this.getTableList()
      }
    },
    onceClick(data, node) {
      if (!data.isRoot) {
        if (data.tierType === 'org') {
          this.currentOrgId = data.id
          this.currentserial = data.serial
          // zp
          this.currentKeyPartId = ''
          // zp
        } else {
          // this.currentOrgId = node.parent.data.id   //zp 注掉
          // zp新增
          this.currentOrgId = ''
          this.currentKeyPartId = data.id
        }
        this.getTableList()
      }
    },
    getTableList() { // 请求表格数据方法
      let params = {
        limit: this.paginationConfig.limit,
        page: this.paginationConfig.page,
        rescusive: this.showSubOrg,
        orgId: this.showSubOrg ? this.currentserial : this.currentOrgId
      }
      if (this.status !== '全部') {
        params.status = this.status
      }
      if (this.currentKeyPartId) {
        params['keyPartId'] = this.currentKeyPartId
      }
      if (this.keyword) {
        params['key'] = this.keyword
      }
      this.tableData = []
      getDeviceListApi(params).then((res) => {
        let result = res.data
        if (result.code === 0) {
          this.$messageSuccess('获取设备列表成功')
          this.total = result.data.count && (result.data.count.total || 0)
          this.tableData = result.data.hosts || []
        }
      })
    },
    // 刷新表格
    refresh() {
      this.paginationConfig.page = 1
      this.paginationConfig.limit = 100
      this.$refs.listPagination.setPaginationConfig(this.paginationConfig)
      this.getTableList()
    },
    select(s, row) {
      this.selectData = s
    },
    rowDbClick(row) {
      this.$emit('modelChange', row)
      this.$parent.$parent.childrenComponent = 'Info'
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    indexMethod(index) {
      return (this.paginationConfig.page - 1) * this.paginationConfig.limit + index + 1
    },
    // 显示隐藏筛选详情
    timeShow() {
      this.isTime = !this.isTime
    },
    deleteDevice() {
    },
    // 导出方法
    exportFile(title) {
      const { export_json_to_excel } = require('@src/common/vendor/Export2Excel')
      const tHeader = ['公司名称', '工单数量', '综合得分', '处理及时性', '任务完成度', '服务态度']
      const filterVal = ['orgName', 'keyPartName', 'type', 'name', 'ip', 'status']
      let list = []
      // 导出全部或导出选中
      if (this.selectData.length > 0) {
        list = this.selectData
      }
      // 筛选过滤
      const data = this.formatJson(filterVal, list)
      export_json_to_excel(tHeader, data, '考核列表')
    },
    // 筛选方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    Toprint() { // 打印
      // 判断打印全部还是选中
      let list = []
      if (this.selectData && this.selectData.length > 0) {
        list = this.selectData
      } else {
        list = this.tableData
      }
      printJS({
        // 表格数据的来源
        printable: list,
        // field 表格内容  displayName：表头名
        properties: [
          { field: 'orgName', displayName: '公司名称' },
          { field: 'keyPartName', displayName: '工单数量' },
          { field: 'type', displayName: '综合得分' },
          { field: 'name', displayName: '处理及时性' },
          { field: 'ip', displayName: '任务完成度' },
          { field: 'status', displayName: '服务态度' }
        ],
        type: 'json',
        // 表题
        header: '<p class="custom">考核列表</p>',
        // 表题样式
        style: '.custom { color: red; text-align:center ; font-weight:600; color:#000} ',
        // 表头样式
        gridHeaderStyle: 'border: 1px solid  lightgray;white-space:nowrap;font-size:10px; text-align:center;color:#333 ',
        // 内容样式
        gridStyle: 'border: 1px solid lightgray;white-space:nowrap; font-size:8px; text-align:center;'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list-box {
  width: 100%;
  height: 100%;
  display: flex;
  .tree-container {
    width: 280px;
    height: 100%;
    overflow: auto;
  }
  .content {
    width: calc(~'100% - 280px');
    padding: 15px;
    box-shadow: 0 0 10px #ccc inset;
    .top {
      .header {
        color: #333333;
        margin-bottom: 10px;
        /deep/ .el-breadcrumb {
          .active {
            .el-breadcrumb__inner {
              color: #2d72d3;
            }
          }
        }
      }
      .middle {
        width: 100%;
        height: 35px;
        margin: 0 0 10px;
        display: flex;
        justify-content: space-between;
        .button-box {
          width: 900px;
        }
        .opt-box {
          // margin-right: 61px;
        }
      }
    }
    .main {
      width: 100%;
      height: calc(~'100% - 133px');
    }
  }
}
/deep/.el-date-picker {
  // display: inline-block;
}
</style>
