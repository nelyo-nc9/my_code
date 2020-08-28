<!--
 * @Author: zhangteng
 * @Date: 2020-05-30 11:18:22
 * @LastEditors: zhangteng
 * @LastEditTime: 2020-05-30 11:58:58
 * @Description: file content
 * @FilePath: \建行CCB\ccb-client\client\src\view\videoManage\components\otherList.vue
-->
<template>
  <div class="other-list-box">
    <!-- 顶部操作栏 -->
    <div class="top">
      <!-- 面包屑 -->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>视频管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{navTitle}}</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 操作按钮 -->
      <div class="button-box">
        <el-button size="small" @click="relevanceConf">关联配置</el-button>
        <el-button size="small" @click="getTableList">获取关联</el-button>
        <el-button size="small">查看关联拓扑</el-button>
        <el-button size="small">导出</el-button>
      </div>
    </div>
    <div class="main">
      <!-- 表格过滤条件 -->
      <div class="opt-box">
        <el-checkbox style="margin-right:12px;" v-model="showSubOrg">显示子机构</el-checkbox>
        <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新列表</el-button>
        <el-input suffix-icon="el-icon-search" style="float:right;width:200px;" size="small"></el-input>
      </div>
      <!-- 表格 -->
      <div class="list-box-table">
        <el-table
          stripe
          border
          size="medium"
          :data="tableData"
          @select="select"
          height="100%"
          max-height="770"
          style="width: 100%">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="序号" type="index" width="80" align="center"> </el-table-column>
          <el-table-column
            v-for="(column, index) in columns" :key="index"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :sortable="column.sortable"
            show-overflow-tooltip
            align="center"
            :resizable="resizable">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <video-pagination ref="listPagination"
          :total="total"
          @paginationConfChange="paginationConfChange"
        ></video-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPagination from './VideoPagination'
export default {
  name: 'OtherList',
  components: {
    VideoPagination
  },
  props: {
    navTitle: {
      type: String,
      default: '视频主机关联配置'
    }
  },
  computed: {
    columns() {
      if (this.navTitle === '摄像机关联配置') {
        return [
          { prop: 'oid', sortable: true, label: '所属机构', width: '' },
          { prop: 'keyPart', sortable: true, label: '所属重点部位', width: '' },
          { prop: 'name', sortable: true, label: '设备名称', width: '' },
          { prop: 'brand', sortable: true, label: '品牌', width: '' },
          { prop: 'model', sortable: true, label: '型号', width: '' },
          { prop: 'model', sortable: true, label: '通道名称', width: '' },
          { prop: 'ip', sortable: true, label: 'IP', width: '' },
          { prop: 'assetCode', sortable: true, label: '资产编码', width: '' },
          { prop: 'status', label: '状态', width: '' },
          { prop: 'type', sortable: true, label: '关联对讲通道', width: '' },
          { prop: 'id', sortable: true, label: '关联门禁通道', width: '' },
          { prop: 'accessWay', sortable: true, label: '关联输出通道', width: '' },
          { prop: 'inputOrg', label: '录入机构', width: '' },
          { prop: 'inputPeople', label: '录入人', width: '' },
          { prop: 'createdAt', label: '录入时间', width: '' }
        ]
      } else {
        return [
          { prop: 'oid', sortable: true, label: '所属机构', width: '' },
          { prop: 'keyPart', sortable: true, label: '所属重点部位', width: '' },
          { prop: 'name', sortable: true, label: '设备名称', width: '' },
          { prop: 'brand', sortable: true, label: '品牌', width: '' },
          { prop: 'model', sortable: true, label: '型号', width: '' },
          { prop: 'model', sortable: true, label: '通道名称', width: '' },
          { prop: 'ip', sortable: true, label: 'IP', width: '' },
          { prop: 'assetCode', sortable: true, label: '资产编码', width: '' },
          { prop: 'status', label: '状态', width: '' },
          { prop: 'status', label: '关联镜头', width: '' },
          { prop: 'type', sortable: true, label: '关联对讲通道', width: '' },
          { prop: 'id', sortable: true, label: '关联门禁通道', width: '' },
          { prop: 'accessWay', sortable: true, label: '关联输出通道', width: '' },
          { prop: 'inputOrg', label: '录入机构', width: '' },
          { prop: 'inputPeople', label: '录入人', width: '' },
          { prop: 'createdAt', label: '录入时间', width: '' }
        ]
      }
    }
  },
  data() {
    return {
      resizable: false,
      columns1: [
        { prop: 'oid', sortable: true, label: '所属机构', width: '' },
        { prop: 'keyPart', sortable: true, label: '所属重点部位', width: '' },
        { prop: 'name', sortable: true, label: '设备名称', width: '' },
        { prop: 'brand', sortable: true, label: '品牌', width: '' },
        { prop: 'model', sortable: true, label: '型号', width: '' },
        { prop: 'model', sortable: true, label: '通道名称', width: '' },
        { prop: 'ip', sortable: true, label: 'IP', width: '' },
        { prop: 'assetCode', sortable: true, label: '资产编码', width: '' },
        { prop: 'status', label: '状态', width: '' },
        { prop: 'status', label: '关联镜头', width: '' }, //
        { prop: 'type', sortable: true, label: '关联对讲通道', width: '' },
        { prop: 'id', sortable: true, label: '关联门禁通道', width: '' },
        { prop: 'accessWay', sortable: true, label: '关联输出通道', width: '' },
        { prop: 'inputOrg', label: '录入机构', width: '' },
        { prop: 'inputPeople', label: '录入人', width: '' },
        { prop: 'createdAt', label: '录入时间', width: '' }
      ],
      tableData: [],
      total: 0,
      showSubOrg: false,
      paginationConfig: {},
      selectData: []
    }
  },
  methods: {
    getTableList() {},
    refresh() {},
    select(s, row) {
      this.selectData = s
    },
    paginationConfChange(obj) {
      this.paginationConfig = obj
      this.getTableList()
    },
    relevanceConf() {
      this.$emit('changeComponent', 'RelevanceConf')
    }
  }
}
</script>

<style lang="less" scoped>
.other-list-box {
  width: 100%;
  height:100%;
  .top {
    .header {
      margin-bottom: 10px;
    }
  }
  .main {
    width: 100%;
    height: calc(~'100% - 56px');
    .list-box-table {
      width: 100%;
      height: calc(~'100% - 85px');
    }
    .pagination-box {
      width: 100%;
      height: 45px;
    }
  }
}
</style>
